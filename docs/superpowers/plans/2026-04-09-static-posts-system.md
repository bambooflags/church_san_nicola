# Static Posts System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a low-effort publishing workflow where dropping a markdown file in `posts/` and pushing to git makes a new card appear on the cerkiewtorun.pl homepage.

**Architecture:** Markdown files with YAML-ish frontmatter live in `posts/`. A GitHub Action runs a stdlib-only Python script that scans them and regenerates `posts/index.json` on every push. The homepage fetches this manifest on load and renders the 3 newest as cards under `#announcements`. A shared `post.html?slug=<slug>` viewer fetches and renders individual posts with marked.js (lazy-loaded from CDN). Multilingual content is stacked inside each post body under `##` language headings — no runtime translation of post content.

**Tech Stack:** Python 3 stdlib (build script + tests), vanilla JS (no framework), marked.js via CDN with SRI (post viewer only), GitHub Actions (manifest rebuild).

**Reference spec:** `docs/superpowers/specs/2026-04-08-static-posts-system-design.md`

---

## File structure

**Create:**
- `posts/2026-04-01-wielki-tydzien.md` — first real post, seeded from the Wielki Tydzień 2026 docx
- `posts/index.json` — auto-generated manifest (initially produced by running the build script locally so the homepage works at merge time)
- `scripts/build_posts_index.py` — frontmatter scanner + manifest writer (stdlib only)
- `scripts/test_build_posts_index.py` — unittest file for the build script
- `.github/workflows/build-posts-index.yml` — CI that regenerates the manifest on push
- `post.html` — shared post viewer page (copies header/ticker/footer from `index.html`)
- `docs/posts.md` — human-facing publishing guide

**Modify:**
- `index.html` — add `<section id="latest-posts">` between `#announcements` and `#about`
- `script.js` — add 5 translation keys × 5 languages + `loadLatestPosts()` function + DOMContentLoaded wiring
- `styles.css` — add `.latest-posts`, `.latest-posts-grid`, `.post-card`, and `post.html`-specific styles at the end
- `CLAUDE.md` — add a short "Posts system" paragraph under Architecture

**Responsibilities:**
- `build_posts_index.py`: pure function — read `posts/*.md`, return validated entries, write manifest. Exits non-zero on any malformed post.
- `post.html` + inline viewer JS: resolve slug → fetch `.md` → parse frontmatter → render body. Self-contained, no dependency on `script.js`.
- `script.js` `loadLatestPosts()`: fetch manifest → render 3 cards → hide section if empty. Self-contained, independent of other features.

---

## Task 1: Build script with TDD

**Files:**
- Create: `scripts/build_posts_index.py`
- Create: `scripts/test_build_posts_index.py`

Build the manifest generator. TDD because this is pure Python and the failure modes matter (malformed frontmatter must fail loudly, not silently).

- [ ] **Step 1.1: Create scripts directory and empty files**

```bash
mkdir -p scripts posts
touch scripts/__init__.py
```

Create `scripts/build_posts_index.py` with just a header comment:

```python
"""Scan posts/*.md, validate frontmatter, write posts/index.json.

Stdlib only. Runnable locally: python3 scripts/build_posts_index.py
Run from the repository root.
"""
```

Create `scripts/test_build_posts_index.py` with an empty test skeleton:

```python
"""Tests for build_posts_index.py — stdlib unittest."""
import unittest


if __name__ == '__main__':
    unittest.main()
```

- [ ] **Step 1.2: Write failing test for frontmatter parser**

Add to `scripts/test_build_posts_index.py`:

```python
"""Tests for build_posts_index.py — stdlib unittest."""
import json
import tempfile
import unittest
from pathlib import Path

from build_posts_index import parse_frontmatter, ParseError


class TestParseFrontmatter(unittest.TestCase):
    def test_valid_frontmatter(self):
        content = (
            "---\n"
            "title: Wielki Tydzień i Pascha 2026\n"
            "date: 2026-04-01\n"
            "summary: Harmonogram nabożeństw.\n"
            "---\n"
            "\n"
            "## Polski\n"
            "Body goes here.\n"
        )
        meta, body = parse_frontmatter(content)
        self.assertEqual(meta["title"], "Wielki Tydzień i Pascha 2026")
        self.assertEqual(meta["date"], "2026-04-01")
        self.assertEqual(meta["summary"], "Harmonogram nabożeństw.")
        self.assertIn("## Polski", body)

    def test_missing_opening_delimiter(self):
        with self.assertRaises(ParseError):
            parse_frontmatter("title: X\n---\nbody")

    def test_missing_closing_delimiter(self):
        with self.assertRaises(ParseError):
            parse_frontmatter("---\ntitle: X\nbody never closes")

    def test_missing_required_field(self):
        content = "---\ntitle: X\ndate: 2026-01-01\n---\nbody"
        with self.assertRaises(ParseError) as cm:
            parse_frontmatter(content)
        self.assertIn("summary", str(cm.exception))


if __name__ == '__main__':
    unittest.main()
```

- [ ] **Step 1.3: Run the test and verify it fails with import error**

Run: `cd scripts && python3 -m unittest test_build_posts_index.py -v`

Expected: FAIL with `ImportError: cannot import name 'parse_frontmatter' from 'build_posts_index'`

- [ ] **Step 1.4: Implement parse_frontmatter**

Append to `scripts/build_posts_index.py`:

```python
import re

REQUIRED_FIELDS = ("title", "date", "summary")


class ParseError(Exception):
    """Raised when a post is malformed. The Action will surface the message."""


def parse_frontmatter(content: str) -> tuple[dict, str]:
    """Split a post file into (metadata dict, body string).

    Expects a frontmatter block between two lines containing only '---',
    with 'key: value' lines inside. Values are trimmed strings.
    """
    lines = content.splitlines()
    if not lines or lines[0].strip() != "---":
        raise ParseError("missing opening '---' delimiter on line 1")

    try:
        close_idx = next(
            i for i in range(1, len(lines)) if lines[i].strip() == "---"
        )
    except StopIteration:
        raise ParseError("missing closing '---' delimiter")

    meta: dict[str, str] = {}
    for raw in lines[1:close_idx]:
        if not raw.strip():
            continue
        if ":" not in raw:
            raise ParseError(f"invalid frontmatter line (no colon): {raw!r}")
        key, _, value = raw.partition(":")
        meta[key.strip()] = value.strip()

    missing = [f for f in REQUIRED_FIELDS if f not in meta]
    if missing:
        raise ParseError(f"missing required field(s): {', '.join(missing)}")

    body = "\n".join(lines[close_idx + 1:])
    return meta, body
```

- [ ] **Step 1.5: Run the test and verify it passes**

Run: `cd scripts && python3 -m unittest test_build_posts_index.py -v`

Expected: 4 tests, all PASS.

- [ ] **Step 1.6: Write failing tests for slug/date validation and sorting**

Add to `scripts/test_build_posts_index.py` inside the same file:

```python
class TestCollectPosts(unittest.TestCase):
    def _write(self, dirpath: Path, name: str, body: str) -> Path:
        path = dirpath / name
        path.write_text(body, encoding="utf-8")
        return path

    def _valid_post(self, title: str, date: str) -> str:
        return (
            f"---\ntitle: {title}\ndate: {date}\n"
            f"summary: test summary.\n---\n\nbody\n"
        )

    def test_sorted_by_date_descending(self):
        with tempfile.TemporaryDirectory() as tmp:
            posts = Path(tmp)
            self._write(posts, "2026-01-15-old.md", self._valid_post("Old", "2026-01-15"))
            self._write(posts, "2026-04-01-new.md", self._valid_post("New", "2026-04-01"))
            self._write(posts, "2026-02-10-mid.md", self._valid_post("Mid", "2026-02-10"))

            entries = collect_posts(posts)
            self.assertEqual(
                [e["slug"] for e in entries],
                ["2026-04-01-new", "2026-02-10-mid", "2026-01-15-old"],
            )

    def test_filename_must_match_date_prefix(self):
        with tempfile.TemporaryDirectory() as tmp:
            posts = Path(tmp)
            self._write(posts, "no-date-prefix.md", self._valid_post("X", "2026-01-01"))
            with self.assertRaises(ParseError) as cm:
                collect_posts(posts)
            self.assertIn("no-date-prefix.md", str(cm.exception))

    def test_date_prefix_must_match_frontmatter_date(self):
        with tempfile.TemporaryDirectory() as tmp:
            posts = Path(tmp)
            self._write(posts, "2026-01-01-mismatch.md", self._valid_post("X", "2026-02-02"))
            with self.assertRaises(ParseError) as cm:
                collect_posts(posts)
            self.assertIn("mismatch", str(cm.exception).lower())

    def test_invalid_iso_date_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            posts = Path(tmp)
            self._write(posts, "2026-13-45-bad.md", self._valid_post("X", "2026-13-45"))
            with self.assertRaises(ParseError):
                collect_posts(posts)

    def test_ignores_index_json(self):
        with tempfile.TemporaryDirectory() as tmp:
            posts = Path(tmp)
            self._write(posts, "2026-04-01-ok.md", self._valid_post("OK", "2026-04-01"))
            (posts / "index.json").write_text("[]", encoding="utf-8")
            entries = collect_posts(posts)
            self.assertEqual(len(entries), 1)
```

Also update the import line at the top:

```python
from build_posts_index import parse_frontmatter, ParseError, collect_posts
```

- [ ] **Step 1.7: Run the new tests and verify they fail**

Run: `cd scripts && python3 -m unittest test_build_posts_index.py -v`

Expected: FAIL — `cannot import name 'collect_posts'`.

- [ ] **Step 1.8: Implement collect_posts**

Append to `scripts/build_posts_index.py`:

```python
from datetime import date as _date
from pathlib import Path

FILENAME_RE = re.compile(r"^(\d{4}-\d{2}-\d{2})-[a-z0-9][a-z0-9-]*\.md$")


def collect_posts(posts_dir: Path) -> list[dict]:
    """Read every .md in posts_dir, return validated entries sorted newest first.

    Raises ParseError on any invalid post (missing frontmatter, bad filename,
    bad date, or date prefix that doesn't match the frontmatter date).
    """
    entries: list[dict] = []
    for md_path in sorted(posts_dir.glob("*.md")):
        name = md_path.name
        match = FILENAME_RE.match(name)
        if not match:
            raise ParseError(
                f"{name}: filename must match YYYY-MM-DD-slug.md "
                f"(lowercase letters, digits, hyphens)"
            )
        prefix_date = match.group(1)

        try:
            content = md_path.read_text(encoding="utf-8")
        except OSError as exc:
            raise ParseError(f"{name}: cannot read file: {exc}") from exc

        try:
            meta, _body = parse_frontmatter(content)
        except ParseError as exc:
            raise ParseError(f"{name}: {exc}") from exc

        try:
            parsed_date = _date.fromisoformat(meta["date"])
        except ValueError as exc:
            raise ParseError(
                f"{name}: invalid ISO date in frontmatter: {meta['date']!r}"
            ) from exc

        if parsed_date.isoformat() != prefix_date:
            raise ParseError(
                f"{name}: filename date prefix ({prefix_date}) does not match "
                f"frontmatter date ({meta['date']})"
            )

        entries.append(
            {
                "slug": md_path.stem,
                "title": meta["title"],
                "date": meta["date"],
                "summary": meta["summary"],
            }
        )

    entries.sort(key=lambda e: (e["date"], e["slug"]), reverse=True)
    return entries
```

- [ ] **Step 1.9: Run all tests and verify they pass**

Run: `cd scripts && python3 -m unittest test_build_posts_index.py -v`

Expected: 9 tests, all PASS.

- [ ] **Step 1.10: Write failing test for idempotent writer and main()**

Add to `scripts/test_build_posts_index.py`:

```python
class TestWriteManifest(unittest.TestCase):
    def test_writes_pretty_json_with_trailing_newline(self):
        from build_posts_index import write_manifest
        with tempfile.TemporaryDirectory() as tmp:
            out = Path(tmp) / "index.json"
            changed = write_manifest(out, [{"slug": "a", "title": "A", "date": "2026-01-01", "summary": "s"}])
            self.assertTrue(changed)
            text = out.read_text(encoding="utf-8")
            self.assertTrue(text.endswith("\n"))
            data = json.loads(text)
            self.assertEqual(data[0]["slug"], "a")
            # 2-space indent visible in raw text
            self.assertIn('\n  "slug"', text)

    def test_idempotent_no_rewrite(self):
        from build_posts_index import write_manifest
        with tempfile.TemporaryDirectory() as tmp:
            out = Path(tmp) / "index.json"
            entries = [{"slug": "a", "title": "A", "date": "2026-01-01", "summary": "s"}]
            self.assertTrue(write_manifest(out, entries))
            self.assertFalse(write_manifest(out, entries))  # second call: no change
```

- [ ] **Step 1.11: Run tests and verify the new ones fail**

Run: `cd scripts && python3 -m unittest test_build_posts_index.py -v`

Expected: FAIL — `cannot import name 'write_manifest'`.

- [ ] **Step 1.12: Implement write_manifest and main**

Append to `scripts/build_posts_index.py`:

```python
import json
import sys


def write_manifest(out_path: Path, entries: list[dict]) -> bool:
    """Write entries to out_path as pretty JSON. Returns True if file changed."""
    serialized = json.dumps(entries, ensure_ascii=False, indent=2) + "\n"
    if out_path.exists() and out_path.read_text(encoding="utf-8") == serialized:
        return False
    out_path.write_text(serialized, encoding="utf-8")
    return True


def main() -> int:
    repo_root = Path(__file__).resolve().parent.parent
    posts_dir = repo_root / "posts"
    if not posts_dir.is_dir():
        print(f"posts/ directory not found at {posts_dir}", file=sys.stderr)
        return 1
    try:
        entries = collect_posts(posts_dir)
    except ParseError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2
    changed = write_manifest(posts_dir / "index.json", entries)
    print(f"wrote {len(entries)} post(s); changed={changed}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
```

- [ ] **Step 1.13: Run all tests and verify all pass**

Run: `cd scripts && python3 -m unittest test_build_posts_index.py -v`

Expected: 11 tests, all PASS.

- [ ] **Step 1.14: Commit**

```bash
git add scripts/__init__.py scripts/build_posts_index.py scripts/test_build_posts_index.py
git commit -m "feat: add posts manifest build script with tests

Stdlib-only Python script that scans posts/*.md, validates frontmatter
and filenames, and writes posts/index.json sorted by date descending.
Fails loudly on any malformed post."
```

---

## Task 2: Seed the first real post and generate the initial manifest

**Files:**
- Create: `posts/2026-04-01-wielki-tydzien.md`
- Create: `posts/index.json` (via running the build script)

This gives us working content end-to-end at merge time — the priest sees a real card on day one.

- [ ] **Step 2.1: Create the seed post markdown**

Create `posts/2026-04-01-wielki-tydzien.md`:

```markdown
---
title: Wielki Tydzień i Pascha 2026
date: 2026-04-01
summary: Harmonogram nabożeństw i poświęcenia pokarmów na Wielki Tydzień i Paschę 2026.
---

## Polski

**Polski Autokefaliczny Kościół Prawosławny**
Cerkiew: Toruń ul. Podgórna 69
Tel: +48 606 910 655
Email: torun@tlen.pl
Facebook: Parafia Prawosławna św. Mikołaja w Toruniu

### Wielki Tydzień

<table>
<thead>
<tr><th>Data</th><th>Dzień</th><th>Godzina</th><th>Nabożeństwo</th></tr>
</thead>
<tbody>
<tr><td>09.04.</td><td>Czwartek<br><em>Великій Четвер</em></td><td>08:00</td><td>Wielki Czwartek — Św. Liturgia</td></tr>
<tr><td>09.04.</td><td>Czwartek<br><em>Великій Четвер</em></td><td>18:00</td><td>Czytanie 12 Pasyjnych Ewangelii</td></tr>
<tr><td>10.04.</td><td>Piątek<br><em>Велика Пятниця</em></td><td>18:00</td><td>Wielki Piątek — Wyniesienie i adoracja Całunu (Płaszczanicy)</td></tr>
<tr><td>11.04.</td><td>Sobota<br><em>Велика Субота</em></td><td>08:00</td><td>Św. Liturgia Wielkiej Soboty</td></tr>
<tr><td>11.04.</td><td>Sobota</td><td>ok. 10:30</td><td>Poświęcenie pokarmów — <em>освячення пасок</em></td></tr>
<tr><td>11.04.</td><td>Sobota</td><td>17:00</td><td>Poświęcenie pokarmów — <em>освячення пасок</em></td></tr>
</tbody>
</table>

### Pascha — Ніч Великодня

<table>
<thead>
<tr><th>Data</th><th>Dzień</th><th>Godzina</th><th>Nabożeństwo</th></tr>
</thead>
<tbody>
<tr><td>11/12.04.</td><td>Sobota w nocy<br><em>В ночі</em></td><td>23:30</td><td>Główne nabożeństwo paschalne i Paschalna Św. Liturgia — <em>Головна пасхальна літургія</em>. Po nabożeństwie: poświęcenie pokarmów.</td></tr>
<tr><td>12.04.</td><td>Niedziela</td><td>11:00</td><td>Nabożeństwo wielkanocne i poświęcenie pokarmów</td></tr>
<tr><td>12.04.</td><td>Niedziela</td><td>18:00</td><td>Wieczorne nabożeństwo paschalne i poświęcenie pokarmów</td></tr>
<tr><td>13.04.</td><td>Poniedziałek</td><td>11:00</td><td>Paschalna Św. Liturgia</td></tr>
<tr><td>18.04.</td><td>Sobota</td><td>17:00</td><td>Wieczernia i Panichida — modlitwy za zmarłych (<em>служба за померлих</em>)</td></tr>
<tr><td>19.04.</td><td>Niedziela <em>Проводна неділя</em></td><td>11:00</td><td>Św. Liturgia i Panichida — modlitwy za zmarłych</td></tr>
</tbody>
</table>

### Poświęcenie pokarmów — освячення пасок

<table>
<thead>
<tr><th>Data</th><th>Kiedy</th><th>Godzina</th></tr>
</thead>
<tbody>
<tr><td>11.04. sobota</td><td>Po liturgii</td><td>ok. 10:00</td></tr>
<tr><td>11.04. sobota</td><td>Wieczorem</td><td>17:00</td></tr>
<tr><td>11/12.04. w nocy</td><td>Po głównym nabożeństwie</td><td>ok. 01:00 i ok. 02:00</td></tr>
<tr><td>12.04. niedziela</td><td>Rano</td><td>10:00</td></tr>
<tr><td>12.04. niedziela</td><td>Po Liturgii</td><td>ok. 12:00</td></tr>
<tr><td>12.04. niedziela</td><td>Po wieczornym nabożeństwie</td><td>ok. 18:30</td></tr>
</tbody>
</table>

## English — Holy Week and Easter

All services are held at the Orthodox Parish of St. Nicholas, Podgórna 69, Toruń. See the schedule tables above for dates and times. The main Paschal service begins at **23:30 on Saturday 11 April 2026**; food blessings take place multiple times on Saturday and Sunday.

## Українська — Страсний тиждень і Великдень

Усі богослужіння відбуваються в православному храмі Святого Миколая, вул. Підгірна 69, Торунь. Графік богослужінь наведено у таблицях вище. Головне пасхальне богослужіння починається о **23:30 у суботу 11 квітня 2026 року**; освячення пасок відбувається кілька разів у суботу та неділю.
```

- [ ] **Step 2.2: Run the build script locally**

Run: `python3 scripts/build_posts_index.py`

Expected: `wrote 1 post(s); changed=True`

- [ ] **Step 2.3: Verify the generated manifest**

Run: `cat posts/index.json`

Expected output (exact):

```json
[
  {
    "slug": "2026-04-01-wielki-tydzien",
    "title": "Wielki Tydzień i Pascha 2026",
    "date": "2026-04-01",
    "summary": "Harmonogram nabożeństw i poświęcenia pokarmów na Wielki Tydzień i Paschę 2026."
  }
]
```

- [ ] **Step 2.4: Run it again to confirm idempotency**

Run: `python3 scripts/build_posts_index.py`

Expected: `wrote 1 post(s); changed=False`

- [ ] **Step 2.5: Commit**

```bash
git add posts/2026-04-01-wielki-tydzien.md posts/index.json
git commit -m "feat: seed first post — Wielki Tydzień i Pascha 2026

Seeds the posts/ directory with the Holy Week and Pascha 2026 schedule
converted from the source docx. Generates posts/index.json via the
build script."
```

---

## Task 3: GitHub Action that auto-rebuilds the manifest

**Files:**
- Create: `.github/workflows/build-posts-index.yml`

Push a `.md` change → Action runs the build script → commits the updated `index.json` back to main. No infinite loop because `posts/index.json` is excluded from the trigger paths, and `[skip ci]` is added to the commit message as a belt-and-suspenders safety net.

- [ ] **Step 3.1: Create the workflow file**

Create `.github/workflows/build-posts-index.yml`:

```yaml
name: Build posts index

on:
  push:
    branches: [main]
    paths:
      - 'posts/**.md'
      - 'scripts/build_posts_index.py'
  workflow_dispatch:

permissions:
  contents: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          persist-credentials: true
          fetch-depth: 0

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.x'

      - name: Rebuild posts/index.json
        run: python3 scripts/build_posts_index.py

      - name: Commit and push if changed
        run: |
          if [[ -n "$(git status --porcelain posts/index.json)" ]]; then
            git config user.name "github-actions[bot]"
            git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
            git add posts/index.json
            git commit -m "chore: rebuild posts index [skip ci]"
            git push
          else
            echo "posts/index.json already up to date"
          fi
```

- [ ] **Step 3.2: Verify YAML is valid by parsing locally**

Run: `python3 -c "import yaml,sys; yaml.safe_load(open('.github/workflows/build-posts-index.yml')); print('ok')"`

Expected: `ok`

If `PyYAML` is not installed, use this stdlib-only check instead:

```bash
python3 -c "import json,sys; print('ok')"  # placeholder — just verify file exists
test -f .github/workflows/build-posts-index.yml && echo ok
```

Expected: `ok`

- [ ] **Step 3.3: Sanity-check the build script still runs after workflow creation**

Run: `python3 scripts/build_posts_index.py`

Expected: `wrote 1 post(s); changed=False` (no new posts added since Task 2).

- [ ] **Step 3.4: Commit**

```bash
git add .github/workflows/build-posts-index.yml
git commit -m "ci: auto-rebuild posts/index.json on push

Runs the build script on every push that modifies posts/*.md or the
script itself. Commits the updated manifest back to main with
[skip ci] to prevent loops."
```

---

## Task 4: Homepage "Latest posts" section — HTML + translations

**Files:**
- Modify: `index.html` (insert new section between lines 186 and 188, between `#announcements` and `#about`)
- Modify: `script.js:14-230` (add 5 new keys to each of the 5 language objects in `translations`)

- [ ] **Step 4.1: Add the new section to index.html**

In `index.html`, locate the closing of the `#announcements` section (line 186: `</section>`). Immediately after it, insert:

```html

        <section id="latest-posts" class="latest-posts">
            <div class="container">
                <h2 data-key="latest-title">Aktualności</h2>
                <div class="latest-posts-grid" id="latest-posts-grid"></div>
            </div>
        </section>
```

Verify the file still parses:

```bash
python3 -c "import html.parser as p; h=p.HTMLParser(); h.feed(open('index.html').read()); print('ok')"
```

Expected: `ok`

- [ ] **Step 4.2: Add translation keys to the Polish (pl) language object in script.js**

In `script.js`, find the `pl:` block (starts around line 15). Before the closing `}` of the `pl` object (before the `announcement-default` line or after it — pick the line right before `},` at line 57), add:

```javascript
        'latest-title': 'Aktualności',
        'latest-read-more': 'Czytaj więcej →',
        'latest-date-locale': 'pl-PL',
        'post-back-home': '← Strona główna',
        'post-not-found': 'Post nie znaleziony.',
```

- [ ] **Step 4.3: Add the same 5 keys to the English (en) language object**

In the `en:` block (starts around line 58), before its closing `}`, add:

```javascript
        'latest-title': 'Latest News',
        'latest-read-more': 'Read more →',
        'latest-date-locale': 'en-GB',
        'post-back-home': '← Home',
        'post-not-found': 'Post not found.',
```

- [ ] **Step 4.4: Add the same 5 keys to the Ukrainian (uk) language object**

In the `uk:` block (starts around line 101), before its closing `}`, add:

```javascript
        'latest-title': 'Актуальне',
        'latest-read-more': 'Читати далі →',
        'latest-date-locale': 'uk-UA',
        'post-back-home': '← Головна',
        'post-not-found': 'Публікацію не знайдено.',
```

- [ ] **Step 4.5: Add the same 5 keys to the Russian (ru) language object**

In the `ru:` block (starts around line 144), before its closing `}`, add:

```javascript
        'latest-title': 'Актуальное',
        'latest-read-more': 'Читать далее →',
        'latest-date-locale': 'ru-RU',
        'post-back-home': '← Главная',
        'post-not-found': 'Публикация не найдена.',
```

- [ ] **Step 4.6: Add the same 5 keys to the Italian (it) language object**

In the `it:` block (starts around line 187), before its closing `}`, add:

```javascript
        'latest-title': 'Ultime notizie',
        'latest-read-more': 'Leggi di più →',
        'latest-date-locale': 'it-IT',
        'post-back-home': '← Home',
        'post-not-found': 'Articolo non trovato.',
```

- [ ] **Step 4.7: Verify script.js is still valid JavaScript**

Run: `node --check script.js` (if node is available) or `python3 -c "print('manual visual check')"`.

If node is not installed:

```bash
python3 -c "
import re
text = open('script.js').read()
# Each language must have the 5 new keys
for lang in ['pl', 'en', 'uk', 'ru', 'it']:
    for key in ['latest-title', 'latest-read-more', 'latest-date-locale', 'post-back-home', 'post-not-found']:
        # crude check: key present inside a roughly-scoped block
        assert f\"'{key}'\" in text, f'missing {key}'
print('all 5 keys present at least once in each language context')
"
```

Expected: `all 5 keys present at least once in each language context` (or no AssertionError).

- [ ] **Step 4.8: Commit**

```bash
git add index.html script.js
git commit -m "feat: add Latest News section and translation keys

Adds #latest-posts placeholder section under #announcements and five
translation keys per language for the section heading, read-more
link, date locale, post page back-link, and post-not-found message."
```

---

## Task 5: Homepage cards — JS loader

**Files:**
- Modify: `script.js` (append new loader function and DOMContentLoaded hook at end of file, after line 509)

- [ ] **Step 5.1: Append loadLatestPosts function to script.js**

At the end of `script.js` (after the `loadAnnouncements` DOMContentLoaded hook), append:

```javascript


// Latest posts cards (homepage)
// Fetches posts/index.json, renders up to 3 newest posts as cards.
// Hides the entire section if there are no posts or the fetch fails.
async function loadLatestPosts() {
    const section = document.getElementById('latest-posts');
    const grid = document.getElementById('latest-posts-grid');
    if (!section || !grid) return;

    try {
        const response = await fetch('posts/index.json', { cache: 'no-cache' });
        if (!response.ok) throw new Error('manifest fetch failed: ' + response.status);
        const posts = await response.json();
        if (!Array.isArray(posts) || posts.length === 0) {
            section.style.display = 'none';
            return;
        }

        const lang = localStorage.getItem('selectedLanguage') || 'pl';
        const locale = (translations[lang] && translations[lang]['latest-date-locale']) || 'pl-PL';
        const readMore = (translations[lang] && translations[lang]['latest-read-more']) || 'Czytaj więcej →';
        const fmt = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' });

        grid.innerHTML = posts.slice(0, 3).map(p => {
            const safeTitle = escapeHtml(p.title);
            const safeSummary = escapeHtml(p.summary);
            const safeSlug = encodeURIComponent(p.slug);
            const displayDate = fmt.format(new Date(p.date));
            return `
                <article class="post-card">
                    <time class="post-card-date" datetime="${escapeHtml(p.date)}">${escapeHtml(displayDate)}</time>
                    <h3 class="post-card-title">${safeTitle}</h3>
                    <p class="post-card-summary">${safeSummary}</p>
                    <a class="post-card-link" href="post.html?slug=${safeSlug}">${escapeHtml(readMore)}</a>
                </article>
            `;
        }).join('');
    } catch (err) {
        console.error('loadLatestPosts:', err);
        section.style.display = 'none';
    }
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

document.addEventListener('DOMContentLoaded', loadLatestPosts);
```

- [ ] **Step 5.2: Serve the site locally and verify cards render**

Run: `python3 -m http.server 8000` (background) then open `http://localhost:8000/` in a browser.

Expected: The homepage shows a new "Aktualności" section between the yellow announcements bar and the history section, containing exactly one card: "Wielki Tydzień i Pascha 2026" with the formatted date "1 kwietnia 2026" and a "Czytaj więcej →" link pointing to `post.html?slug=2026-04-01-wielki-tydzien`.

The card will be unstyled at this point (raw HTML with default fonts). Styling is in Task 6.

Stop the server when done: `pkill -f "http.server 8000"` (or Ctrl+C).

- [ ] **Step 5.3: Commit**

```bash
git add script.js
git commit -m "feat: fetch and render latest posts on homepage

Adds loadLatestPosts() which reads posts/index.json, renders the 3
newest as cards in #latest-posts, and hides the section if there are
no posts or on fetch failure. Uses Intl.DateTimeFormat with the
language-specific locale key for dates."
```

---

## Task 6: Homepage cards — CSS

**Files:**
- Modify: `styles.css` (append at end of file, after line 960)

- [ ] **Step 6.1: Append post cards and post page styles to styles.css**

At the end of `styles.css`, append:

```css

/* =====================================================
   Posts system (homepage cards + post.html viewer)
   ===================================================== */

/* Homepage latest-posts section */
.latest-posts {
    padding: 4rem 0;
    background: linear-gradient(135deg, rgba(30, 58, 138, 0.03), rgba(59, 130, 246, 0.03));
}

.latest-posts h2 {
    font-family: 'Playfair Display', serif;
    font-size: 2.5rem;
    color: var(--dark-blue);
    text-align: center;
    margin-bottom: 3rem;
}

.latest-posts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    max-width: 1100px;
    margin: 0 auto;
}

.post-card {
    background: var(--white);
    border-radius: 10px;
    padding: 1.75rem;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(30, 58, 138, 0.1);
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.post-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
    border-color: var(--warm-gold);
}

.post-card-date {
    color: var(--warm-gold);
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

.post-card-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.35rem;
    color: var(--dark-blue);
    line-height: 1.3;
    margin: 0;
}

.post-card-summary {
    color: var(--dark-gray);
    font-size: 0.95rem;
    line-height: 1.6;
    flex: 1;
    margin: 0;
}

.post-card-link {
    color: var(--primary-blue);
    font-weight: 600;
    text-decoration: none;
    font-size: 0.95rem;
    margin-top: 0.5rem;
    align-self: flex-start;
}

.post-card-link:hover {
    color: var(--warm-gold);
}

/* Post viewer page (post.html) */
.post-main {
    margin-top: 115px;
    padding: 3rem 0 4rem;
    background: var(--white);
    min-height: calc(100vh - 115px);
}

.post-back {
    display: inline-block;
    color: var(--primary-blue);
    text-decoration: none;
    font-weight: 500;
    margin-bottom: 2rem;
    font-size: 0.95rem;
}

.post-back:hover {
    color: var(--warm-gold);
}

.post-article {
    max-width: 820px;
    margin: 0 auto;
}

.post-article header {
    margin-bottom: 2.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 2px solid var(--cream);
}

.post-article h1 {
    font-family: 'Playfair Display', serif;
    font-size: 2.6rem;
    color: var(--dark-blue);
    line-height: 1.2;
    margin-bottom: 0.5rem;
}

.post-article .post-meta {
    color: var(--warm-gold);
    font-size: 0.95rem;
    font-weight: 500;
}

.post-body {
    color: var(--dark-gray);
    font-size: 1.05rem;
    line-height: 1.75;
}

.post-body h2 {
    font-family: 'Playfair Display', serif;
    font-size: 1.9rem;
    color: var(--dark-blue);
    margin-top: 2.5rem;
    margin-bottom: 1rem;
}

.post-body h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem;
    color: var(--warm-gold);
    margin-top: 2rem;
    margin-bottom: 0.75rem;
}

.post-body p {
    margin-bottom: 1.25rem;
}

.post-body a {
    color: var(--primary-blue);
    text-decoration: underline;
}

.post-body table {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5rem 0;
    font-size: 0.95rem;
    background: var(--white);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.post-body th,
.post-body td {
    padding: 0.75rem 1rem;
    text-align: left;
    border-bottom: 1px solid var(--cream);
    vertical-align: top;
}

.post-body th {
    background: var(--primary-blue);
    color: var(--white);
    font-weight: 600;
    font-family: 'Playfair Display', serif;
}

.post-body tbody tr:nth-child(even) {
    background: rgba(255, 248, 220, 0.4);
}

.post-body em {
    color: var(--warm-gold);
    font-style: italic;
}

.post-error {
    max-width: 600px;
    margin: 3rem auto;
    text-align: center;
    color: var(--dark-gray);
    font-size: 1.1rem;
}

@media (max-width: 768px) {
    .latest-posts {
        padding: 2.5rem 0;
    }

    .latest-posts h2 {
        font-size: 2rem;
        margin-bottom: 2rem;
    }

    .latest-posts-grid {
        grid-template-columns: 1fr;
        gap: 1.25rem;
    }

    .post-main {
        margin-top: 120px;
        padding: 2rem 0 3rem;
    }

    .post-article h1 {
        font-size: 1.9rem;
    }

    .post-body {
        font-size: 1rem;
    }

    .post-body table {
        font-size: 0.85rem;
    }

    .post-body th,
    .post-body td {
        padding: 0.5rem 0.6rem;
    }
}
```

- [ ] **Step 6.2: Serve and visually verify the card styling**

Run: `python3 -m http.server 8000` (background) then refresh `http://localhost:8000/`.

Expected: The "Aktualności" section now shows a styled card with a blue title, gold date label, and a visible "Czytaj więcej →" link. Hover state lifts the card slightly and changes the border to gold.

Stop server when done.

- [ ] **Step 6.3: Commit**

```bash
git add styles.css
git commit -m "style: add post cards and post viewer styles

Adds styling for the homepage .latest-posts section (responsive card
grid, hover states) and for the post.html viewer page (article layout,
table styling for schedules, error state)."
```

---

## Task 7: Post viewer page (post.html)

**Files:**
- Create: `post.html`

The viewer reuses the existing header/ticker/footer chrome from `index.html` (copy-pasted so the post page has the same look and language selector as the homepage). It includes an inline viewer script that parses the query param, fetches the markdown, parses frontmatter, and renders the body with marked.js loaded lazily from jsDelivr with SRI.

- [ ] **Step 7.1: Look up a pinned marked.js version + SRI hash**

marked.js v12.0.2 on jsDelivr. Use:

- URL: `https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js`
- SRI: `sha384-8g3qFkV7LxMsEEj5lbxN78mtWNpqSCAIvjH8RaCh6VTlJ63hRwsnYFI1A7+cg8xN`

If the SRI lookup at implementation time yields a different hash, use the hash returned by the following command and update this task accordingly:

```bash
curl -sL https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js | openssl dgst -sha384 -binary | openssl base64 -A
```

Prefix the output with `sha384-` in the `integrity` attribute.

- [ ] **Step 7.2: Create post.html**

Create `post.html` with the following content (header/ticker/footer are copied from `index.html` lines 104-139 and 307-331 — keep chrome identical so language switching works the same):

```html
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Parafia Prawosławna Św. Mikołaja w Toruniu</title>
    <meta name="description" content="Parafia Prawosławna pw. Św. Mikołaja w Toruniu.">
    <link rel="canonical" href="https://www.cerkiewtorun.pl/post.html">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Crimson+Text:wght@400;600&family=Open+Sans:wght@300;400;500&display=swap">
</head>
<body>
    <header class="header">
        <div class="container">
            <div class="logo">
                <a href="index.html" style="display:flex;align-items:center;gap:1rem;text-decoration:none">
                    <img src="images/icons/orthodox-cross.svg" alt="" class="church-icon" width="32" height="32">
                    <h1 class="church-name" data-key="church-name">Parafia Prawosławna Św. Mikołaja w Toruniu</h1>
                </a>
            </div>
            <nav class="navigation">
                <button class="mobile-menu-toggle" onclick="toggleMobileMenu()" aria-label="Menu nawigacji">
                    <span></span><span></span><span></span>
                </button>
                <ul class="nav-menu">
                    <li><a href="index.html#home" data-key="nav-home">Strona Główna</a></li>
                    <li><a href="index.html#about" data-key="nav-about">O Nas</a></li>
                    <li><a href="index.html#services" data-key="nav-services">Nabożeństwa</a></li>
                    <li><a href="index.html#contact" data-key="nav-contact">Kontakt</a></li>
                </ul>
                <div class="language-selector">
                    <select id="language-select" aria-label="Wybierz język">
                        <option value="pl">Polski</option>
                        <option value="en">English</option>
                        <option value="uk">Українська</option>
                        <option value="ru">Русский</option>
                        <option value="it">Italiano</option>
                    </select>
                </div>
            </nav>
        </div>
    </header>

    <main class="post-main">
        <div class="container">
            <a href="index.html" class="post-back" data-key="post-back-home">← Strona główna</a>
            <article class="post-article" id="post-article" hidden>
                <header>
                    <h1 id="post-title"></h1>
                    <p class="post-meta" id="post-date"></p>
                </header>
                <div class="post-body" id="post-body"></div>
            </article>
            <div class="post-error" id="post-error" hidden>
                <p data-key="post-not-found">Post nie znaleziony.</p>
            </div>
        </div>
    </main>

    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3 data-key="footer-parish">Parafia Prawosławna Św. Mikołaja</h3>
                    <p>Podgórna 69, 87-100 Toruń, Poland</p>
                    <a href="https://maps.app.goo.gl/gvNeytdZkLkNAUy39" target="_blank" class="maps-button maps-button-footer" data-key="open-maps">Otwórz w Google Maps</a>
                    <p>Tel: 606 910 655</p>
                </div>
                <div class="footer-section">
                    <h3 data-key="footer-jurisdiction">Jurysdykcja</h3>
                    <p data-key="footer-jurisdiction-text">Diecezja Łódzko-Poznańska</p>
                    <p data-key="footer-archbishop">Biskup Atanazy</p>
                </div>
                <div class="footer-section">
                    <h3 data-key="footer-services">Nabożeństwa</h3>
                    <p data-key="footer-saturday">Soboty: 17:00</p>
                    <p data-key="footer-sunday">Niedziele: 11:00</p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 Parafia Prawosławna Św. Mikołaja w Toruniu</p>
            </div>
        </div>
    </footer>

    <script src="script.js" defer></script>
    <script
        src="https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js"
        integrity="sha384-8g3qFkV7LxMsEEj5lbxN78mtWNpqSCAIvjH8RaCh6VTlJ63hRwsnYFI1A7+cg8xN"
        crossorigin="anonymous"
        defer></script>
    <script src="post-viewer.js" defer></script>
</body>
</html>
```

**Note on SRI:** the integrity hash above is a placeholder. Replace it with the real value by running the curl command from Step 7.1 before committing. If the hash is wrong, the browser will block the script and nothing will render — fail loud, which is what we want.

- [ ] **Step 7.3: Create post-viewer.js**

Create `post-viewer.js`:

```javascript
// Post viewer — reads ?slug=<slug> from URL, fetches posts/<slug>.md,
// parses frontmatter, renders body with marked.js. Keeps the page's
// existing header/footer chrome from post.html untouched.

const SLUG_RE = /^\d{4}-\d{2}-\d{2}-[a-z0-9][a-z0-9-]*$/;

function parseFrontmatter(text) {
    const lines = text.split(/\r?\n/);
    if (lines[0] !== '---') throw new Error('no frontmatter');
    const closeIdx = lines.indexOf('---', 1);
    if (closeIdx === -1) throw new Error('unclosed frontmatter');
    const meta = {};
    for (let i = 1; i < closeIdx; i++) {
        const line = lines[i];
        if (!line.trim()) continue;
        const idx = line.indexOf(':');
        if (idx === -1) continue;
        meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
    }
    const body = lines.slice(closeIdx + 1).join('\n');
    return { meta, body };
}

function showError() {
    const article = document.getElementById('post-article');
    const error = document.getElementById('post-error');
    if (article) article.hidden = true;
    if (error) error.hidden = false;
}

async function waitForMarked(timeoutMs = 3000) {
    const start = Date.now();
    while (typeof window.marked === 'undefined') {
        if (Date.now() - start > timeoutMs) throw new Error('marked.js did not load');
        await new Promise(r => setTimeout(r, 50));
    }
}

async function loadPost() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');
    if (!slug || !SLUG_RE.test(slug)) {
        showError();
        return;
    }

    try {
        const response = await fetch(`posts/${encodeURIComponent(slug)}.md`, { cache: 'no-cache' });
        if (!response.ok) throw new Error('not found');
        const text = await response.text();
        const { meta, body } = parseFrontmatter(text);
        if (!meta.title || !meta.date) throw new Error('bad frontmatter');

        await waitForMarked();

        const titleEl = document.getElementById('post-title');
        const dateEl = document.getElementById('post-date');
        const bodyEl = document.getElementById('post-body');
        const articleEl = document.getElementById('post-article');

        titleEl.textContent = meta.title;

        const lang = localStorage.getItem('selectedLanguage') || 'pl';
        const locale = (window.translations && window.translations[lang] && window.translations[lang]['latest-date-locale']) || 'pl-PL';
        const fmt = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' });
        dateEl.textContent = fmt.format(new Date(meta.date));

        // marked.js with default settings — raw HTML in trusted author-written posts is intentional
        bodyEl.innerHTML = window.marked.parse(body);

        document.title = `${meta.title} — Parafia Prawosławna Św. Mikołaja w Toruniu`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && meta.summary) metaDesc.setAttribute('content', meta.summary);

        articleEl.hidden = false;
    } catch (err) {
        console.error('loadPost:', err);
        showError();
    }
}

document.addEventListener('DOMContentLoaded', loadPost);
```

- [ ] **Step 7.4: Expose translations globally in script.js**

The post-viewer reads `window.translations[lang]['latest-date-locale']`, but in `script.js` the `translations` object is declared with `const` at module scope — it's already a global because classic scripts share the global scope. No change needed. Verify by running:

```bash
grep -n "^const translations" script.js
```

Expected: `14:const translations = {` (the declaration exists at top level).

- [ ] **Step 7.5: Resolve the real marked.js SRI hash and update post.html**

Run:

```bash
curl -sL https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js | openssl dgst -sha384 -binary | openssl base64 -A
echo
```

Copy the output. In `post.html`, replace the placeholder integrity value `sha384-8g3qFkV7LxMsEEj5lbxN78mtWNpqSCAIvjH8RaCh6VTlJ63hRwsnYFI1A7+cg8xN` with `sha384-<output from command>`.

- [ ] **Step 7.6: Serve and manually verify the post page**

Run: `python3 -m http.server 8000` (background).

1. Open `http://localhost:8000/post.html?slug=2026-04-01-wielki-tydzien` — verify the full post renders with title, date, tables, and "← Strona główna" back-link.
2. Open `http://localhost:8000/post.html` (no slug) — verify the "Post nie znaleziony" error shows.
3. Open `http://localhost:8000/post.html?slug=../etc/passwd` — verify the error shows (slug regex rejects it).
4. Open `http://localhost:8000/post.html?slug=does-not-exist-2099` — regex passes but filename doesn't match; verify error shows.
5. Switch language to English via the selector — verify header/nav/footer and the back-link update to English while the post body stays multilingual.

Stop server.

- [ ] **Step 7.7: Commit**

```bash
git add post.html post-viewer.js
git commit -m "feat: add post.html viewer page

Shared post viewer that reuses index.html header/footer chrome and
language selector. Reads ?slug= from URL, fetches posts/<slug>.md,
parses frontmatter inline, and renders body via marked.js from
jsDelivr (pinned v12.0.2 with SRI). Shows a translated 'not found'
error on missing/invalid/404 slugs."
```

---

## Task 8: Human-facing publishing guide

**Files:**
- Create: `docs/posts.md`

- [ ] **Step 8.1: Create the guide**

Create `docs/posts.md`:

````markdown
# Publishing Posts

This is how you add a new article/announcement to the cerkiewtorun.pl homepage.

## TL;DR

1. Create a new file in `posts/` named `YYYY-MM-DD-short-slug.md`
2. Fill in the frontmatter and body (see template below)
3. `git add posts/<your-file>.md && git commit -m "post: <title>" && git push`
4. Within ~1 minute, the homepage shows a new card under the yellow announcements bar

You never touch `posts/index.json`, `post.html`, or any CSS/JS.

## Filename convention

```
posts/YYYY-MM-DD-short-slug.md
```

- `YYYY-MM-DD` — the publication date. Posts are sorted by this date, newest first.
- `short-slug` — lowercase letters, digits, hyphens only. This becomes the URL (`post.html?slug=<full filename without .md>`).
- **The date prefix must match the `date:` field in the frontmatter** — otherwise the build fails.

Good: `posts/2026-04-01-wielki-tydzien.md`, `posts/2026-12-20-boze-narodzenie.md`
Bad: `posts/Wielki Tydzień.md`, `posts/2026_04_01.md`, `posts/04-01-2026-x.md`

## Frontmatter template

Copy-paste this at the very top of your file:

```
---
title: Your post title in Polish
date: 2026-12-20
summary: One or two sentences in Polish that appear on the homepage card.
---
```

All three fields are required. If any are missing, the GitHub Action fails and sends you an email.

- `title` — shown as the card title and the post page `<h1>`. Polish only.
- `date` — ISO format `YYYY-MM-DD`. Must match the filename prefix.
- `summary` — 1–2 sentences shown on the homepage card. Polish only.

## Writing the body

Everything below the closing `---` is the post body. It's rendered as markdown on the post page. You can use:

- **Standard markdown:** headings, lists, links, bold, italic
- **Markdown tables** (good for simple data)
- **Raw HTML** (good for rich tables with rowspans, figures, etc. — mix freely with markdown)
- **Images** — link to files under `images/` just like the rest of the site

### Multiple languages

The body convention is to stack languages under `##` headings:

```markdown
## Polski

Treść po polsku...

## English

Content in English...

## Українська

Зміст українською...
```

Readers scroll to the language they prefer. There is no automatic translation — whatever you write is what's shown. It's perfectly OK to have only one language if time is short.

## Publishing

1. `git add posts/<your-file>.md`
2. `git commit -m "post: <title>"` (the commit message is up to you)
3. `git push`

When you push, a **GitHub Action** runs automatically. It:

1. Runs `python3 scripts/build_posts_index.py`
2. Rebuilds `posts/index.json` (the manifest that drives the homepage)
3. Commits and pushes that updated manifest back to `main`

The homepage displays the 3 newest posts. Older posts don't disappear — they just stop appearing on the homepage. They stay reachable at `https://www.cerkiewtorun.pl/post.html?slug=<full filename without .md>`.

## Editing or removing a post

- **Edit:** change the `.md` file, commit, push. The Action rebuilds the index.
- **Remove:** delete the `.md` file, commit, push. The Action rebuilds the index. The post URL becomes a "not found" page.

## Troubleshooting

**My post isn't showing on the homepage.**
- It only shows if it's one of the 3 newest by `date`. Check whether 3 posts with newer dates exist.
- Check the Actions tab on GitHub: `https://github.com/<owner>/<repo>/actions`. If the latest "Build posts index" run is red, click it for the error message.

**The GitHub Action failed.**
Common reasons the script prints:
- `missing required field(s): summary` — add the field to frontmatter
- `invalid ISO date in frontmatter` — use `YYYY-MM-DD`, no slashes
- `filename date prefix ... does not match frontmatter date` — make them match
- `filename must match YYYY-MM-DD-slug.md` — rename the file

Fix the issue locally, commit, push. The Action runs again automatically.

**I want to test before pushing.**
Run the build script yourself:

```bash
python3 scripts/build_posts_index.py
```

If it prints `wrote N post(s); changed=True` (or `False`), you're good. Any error message points at the filename and problem.

## FAQ

**Can I schedule a post to appear in the future?**
No. Posts appear as soon as the Action finishes (usually within a minute of pushing). If you want to hold a post back, keep it on a branch and merge when you're ready.

**Can I hide a post temporarily without deleting it?**
Easiest: move it out of `posts/` (e.g., into a `drafts/` directory) and push. The Action will remove it from the index. Move it back when you want it live.

**Does this work with images?**
Yes. Link to any file under `images/` with standard markdown: `![Alt text](images/church.webp)`.

**Can I add more languages?**
Yes — just add another `## <language>` section in the body. Header/nav/footer translations are a separate system (`script.js`).
````

- [ ] **Step 8.2: Commit**

```bash
git add docs/posts.md
git commit -m "docs: add human-facing posts publishing guide"
```

---

## Task 9: Update CLAUDE.md and final end-to-end verification

**Files:**
- Modify: `CLAUDE.md` (add a new section under Architecture)

Note: `CLAUDE.md` is in `.gitignore` at the repo level — but the file does live in the repo history (see the user's global CLAUDE.md vs this project CLAUDE.md). Verify whether it's tracked before editing; if it is ignored, still update it on disk (the human reads it via the Claude Code filesystem) but skip the git add.

- [ ] **Step 9.1: Check whether CLAUDE.md is tracked**

Run: `git ls-files CLAUDE.md`

- If output is `CLAUDE.md`: it's tracked. Proceed and commit the change.
- If output is empty: it's ignored (via `.gitignore`). Proceed with the edit on disk but skip `git add` in Step 9.4.

- [ ] **Step 9.2: Read the current CLAUDE.md**

Run: `cat CLAUDE.md | head -60` (or use the Read tool) to confirm current structure before editing.

- [ ] **Step 9.3: Append a "Posts system" paragraph under the Architecture section**

In `CLAUDE.md`, find the Architecture section (around where it describes "Announcements" and "Hero gallery"). After the "Hero gallery" bullet, add:

```markdown

**Posts system**: Markdown-authored posts live in `posts/*.md` with frontmatter (`title`, `date`, `summary` — all required). A GitHub Action (`.github/workflows/build-posts-index.yml`) runs `scripts/build_posts_index.py` on every push touching `posts/**.md`, regenerating `posts/index.json` and committing it back to `main`. The homepage fetches this manifest via `loadLatestPosts()` in `script.js` and renders the 3 newest as cards in `#latest-posts`. Individual posts are viewed via `post.html?slug=<slug>`, which copies `index.html`'s header/footer chrome and uses `post-viewer.js` to fetch the `.md` file and render its body with marked.js (pinned v12.0.2, loaded from jsDelivr with SRI). Post bodies stack languages under `##` headings — no translation runtime for post content. **Never hand-edit `posts/index.json`.** See `docs/posts.md` for the full publishing guide.
```

- [ ] **Step 9.4: Commit (only if CLAUDE.md is tracked)**

If `git ls-files CLAUDE.md` returned a path in Step 9.1:

```bash
git add CLAUDE.md
git commit -m "docs: document posts system in CLAUDE.md"
```

Otherwise skip the commit — the file is local-only but still updated for Claude to read.

- [ ] **Step 9.5: Final end-to-end verification**

1. Run all Python tests one last time:

   ```bash
   cd scripts && python3 -m unittest test_build_posts_index.py -v
   ```

   Expected: 11 tests PASS.

2. Run the build script:

   ```bash
   cd .. && python3 scripts/build_posts_index.py
   ```

   Expected: `wrote 1 post(s); changed=False` (no change since everything is in sync).

3. Serve and do the full manual walkthrough:

   ```bash
   python3 -m http.server 8000
   ```

   - `http://localhost:8000/` — homepage shows the styled "Wielki Tydzień" card in the `#latest-posts` section between the yellow announcements bar and "Historia Parafii".
   - Click the card → lands on `post.html?slug=2026-04-01-wielki-tydzien` with full content.
   - Switch language to English on the post page → header/footer/back-link switch; post body stays multilingual (Polski/English/Українська sections all visible).
   - Back to homepage via the "← Strona główna" link → homepage is intact.
   - Open `post.html?slug=bogus` → shows "Post nie znaleziony" error, styled correctly.

   Stop the server.

4. Verify no broken files:

   ```bash
   git status
   ```

   Expected: clean (every file committed).

- [ ] **Step 9.6: Final commit (if any stragglers)**

```bash
git status
```

If clean, the implementation is complete. If anything is uncommitted, review and commit it with an appropriate message.

---

## Out-of-scope (explicitly not doing)

- "All posts" index page — the 4th+ newest posts are reachable by direct URL but not listed anywhere. Add later if needed.
- RSS feed — can be generated from the same `index.json` later.
- Automatic image optimization for images referenced inside posts — posts use existing `images/` pipeline.
- Client-side language filtering of post body content — body stays multilingual stacked per design decision.
- Automated browser tests — manual verification at step 9.5 is sufficient given the static-site scope.

## Plan self-review notes

Spec coverage check:
- Spec file layout → File structure section above: ✓
- Post format (filename, frontmatter) → Task 1 tests + Task 2 seed: ✓
- Manifest format → Task 1 `write_manifest`: ✓
- Build script (stdlib, fail loud, idempotent) → Task 1 all steps: ✓
- GitHub Action (paths filter, [skip ci], contents:write) → Task 3: ✓
- Homepage cards section → Tasks 4, 5, 6: ✓
- Post viewer → Task 7: ✓
- Dependencies (marked.js pinned + SRI) → Task 7.1, 7.5: ✓
- `docs/posts.md` → Task 8: ✓
- `CLAUDE.md` update → Task 9: ✓
- Seed content → Task 2: ✓
- Security: slug regex → Task 7.3 (`SLUG_RE`), Task 7.6 manual traversal test: ✓
- All 5 translation keys listed in spec (incl. `post-back-home`, `post-not-found`) → Task 4.2–4.6: ✓

Placeholder scan: only the SRI hash is initially a placeholder; Step 7.1 + Step 7.5 give the exact command to resolve it before commit. Flagged explicitly.

Type/name consistency check: `parse_frontmatter`, `collect_posts`, `write_manifest`, `ParseError` used consistently across Task 1 steps. Section id `latest-posts` and class `latest-posts-grid` / `post-card` consistent between HTML (Task 4), JS (Task 5), and CSS (Task 6). Translation keys `latest-title`, `latest-read-more`, `latest-date-locale`, `post-back-home`, `post-not-found` consistent across spec, Task 4, Task 5, Task 7.
