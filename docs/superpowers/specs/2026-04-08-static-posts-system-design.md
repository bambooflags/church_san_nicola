# Static Posts System — Design Spec

**Date:** 2026-04-08
**Status:** Approved (pending spec review)
**Context:** cerkiewtorun.pl — static site, GitHub Pages, no build step at runtime.

## Goal

Give the parish maintainer a near-zero-effort way to publish recurring content (seasonal service schedules, announcements, news) as "posts". The 3 most recent posts appear as cards on the homepage under the existing `#announcements` section; each card links to a full post page. The author's workflow is: create one markdown file, `git push`, done.

## Non-goals

- No full i18n translation system for post content. Posts are multilingual by convention (stacked language sections in the body), not by runtime translation.
- No tag/category/search system.
- No "all posts" index page (yet). Older posts stay reachable by direct URL; the homepage only shows the 3 latest.
- No RSS feed (can be added later from the same manifest).
- No comments, no drafts, no scheduled publishing.

## User workflow (steady state)

1. Create `posts/YYYY-MM-DD-short-slug.md`
2. Fill in frontmatter (title, date, summary) + body (stacked multilingual sections)
3. `git commit && git push`
4. A GitHub Action rebuilds `posts/index.json` and commits it back to `main`
5. Homepage card appears on next visit

The author never edits JSON, never runs a build, and never touches the viewer page or styles.

## Architecture

### File layout

```
posts/
  2026-04-01-wielki-tydzien.md      # authored content
  2026-12-20-boze-narodzenie.md
  index.json                         # auto-generated, never hand-edited
post.html                            # shared viewer for all posts
scripts/
  build_posts_index.py               # stdlib-only, runnable locally
.github/workflows/
  build-posts-index.yml              # triggers build script on push
docs/
  posts.md                           # human-facing publishing guide
CLAUDE.md                            # updated with brief pointer
index.html                           # new #latest-posts section
script.js                            # fetch + render cards
styles.css                           # card + post page styles
```

### Post file format

Filename: `YYYY-MM-DD-short-slug.md`. The full filename (minus `.md`) is the slug used in URLs (`post.html?slug=2026-04-01-wielki-tydzien`). The date prefix ensures lexicographic sort matches chronological sort.

```markdown
---
title: Wielki Tydzień i Pascha 2026
date: 2026-04-01
summary: Harmonogram nabożeństw na Wielki Tydzień i Paschę 2026.
---

## Polski

(Polish content — markdown tables, raw HTML, images all allowed)

## English

(English content)

## Українська

(Ukrainian content)
```

**Frontmatter contract:** `title`, `date` (ISO `YYYY-MM-DD`), and `summary` are all required. Any other keys are ignored. Card content on the homepage is Polish-only — no per-language frontmatter.

**Body convention:** languages are stacked under `##` headings. Readers scroll to their language. No runtime language filtering of body content.

### Manifest format (`posts/index.json`)

Auto-generated, sorted by `date` descending:

```json
[
  {
    "slug": "2026-04-01-wielki-tydzien",
    "title": "Wielki Tydzień i Pascha 2026",
    "date": "2026-04-01",
    "summary": "Harmonogram nabożeństw na Wielki Tydzień i Paschę 2026."
  }
]
```

Pretty-printed with 2-space indent and trailing newline so diffs are clean. Written idempotently — if regeneration produces the same bytes, the file is not rewritten (and the Action does not create an empty commit).

### Build script (`scripts/build_posts_index.py`)

Python 3, stdlib only (no pip). Responsibilities:

1. Scan `posts/*.md`
2. For each file: validate filename matches `YYYY-MM-DD-*.md`, parse the frontmatter block between the first pair of `---` lines, extract `title`/`date`/`summary`
3. **Fail loudly** on any malformed post: exit non-zero with a descriptive error naming the file and the problem (missing field, bad date format, duplicate slug, etc.). No silent skipping.
4. Sort entries by `date` descending (ties broken by slug)
5. Write `posts/index.json` only if contents changed

Runnable locally for pre-push verification: `python3 scripts/build_posts_index.py`.

### GitHub Action (`.github/workflows/build-posts-index.yml`)

```yaml
name: Build posts index
on:
  push:
    branches: [main]
    paths:
      - 'posts/**.md'
      - 'scripts/build_posts_index.py'
permissions:
  contents: write
```

Steps:
1. Checkout with `fetch-depth: 0` and `persist-credentials: true`
2. Set up Python 3
3. Run `python3 scripts/build_posts_index.py`
4. If `posts/index.json` is dirty, commit with message `chore: rebuild posts index [skip ci]` and push to `main`
5. If clean, exit 0 with no commit

**Infinite-loop prevention:** `paths:` filter excludes `posts/index.json` itself, so the Action's own commit does not retrigger. `[skip ci]` is a belt-and-suspenders safety net.

**Failure mode:** if the script exits non-zero, the Action fails, an email is sent to the repo owner, and `posts/index.json` stays at its previous value. The homepage keeps showing the previous 3 cards — graceful degradation.

### Homepage cards section

New `<section id="latest-posts">` inserted in `index.html` **between `#announcements` and `#about`**.

Structure:

```html
<section id="latest-posts" class="latest-posts">
  <div class="container">
    <h2 data-key="latest-title">Aktualności</h2>
    <div class="latest-posts-grid"><!-- JS injects 3 cards here --></div>
  </div>
</section>
```

On page load, `script.js`:
1. `fetch('posts/index.json')`
2. Take the first 3 entries
3. For each, inject a card with: formatted date, title, summary, "Czytaj więcej →" link to `post.html?slug=<slug>`
4. If `index.json` is empty or fetch fails → hide the entire section (no empty container, no error message)

Card layout: 3 columns on desktop, 1 column on mobile (responsive grid). Card styling matches existing site aesthetic (cream background, blue accents, gold hover).

**Translation keys added to `script.js`:**
- `latest-title` — section heading ("Aktualności" / "Latest News" / etc.)
- `latest-read-more` — "Czytaj więcej →" / "Read more →" / etc.
- `latest-date-locale` — BCP-47 locale string per language (e.g., `pl-PL`, `en-GB`) used by `Intl.DateTimeFormat` to format card dates
- `post-back-home` — back-link text on `post.html` ("← Strona główna" / etc.)
- `post-not-found` — error state message on `post.html` ("Post nie znaleziony" / etc.)

Card titles and summaries themselves stay in Polish — not translated.

### Post viewer (`post.html`)

Single shared page, reachable at `post.html?slug=<slug>`. Reuses the existing header, ticker, footer, and language selector — copy-pasted from `index.html` so the chrome is identical.

Flow on load:
1. Read `slug` from `?slug=` query param; if absent → error state
2. Validate slug matches `YYYY-MM-DD-[a-z0-9-]+` (path traversal guard)
3. `fetch('posts/<slug>.md')`
4. Parse frontmatter (small inline parser, ~15 lines, no library)
5. Lazy-load marked.js from jsDelivr CDN (only on this page, not on homepage)
6. Render body markdown into `<article class="post-body">`
7. Set `document.title` to `<post title> — Parafia Prawosławna Św. Mikołaja` for sharing/SEO
8. Set `<meta name="description">` from the summary

**Back-link:** a prominent "← Strona główna" link above the article, with a `data-key` translation so it works in all 5 languages.

**Error states:**
- Missing/invalid slug, 404 on fetch, or malformed frontmatter → render a "Post nie znaleziony" message with a link back to home. Translated via `data-key`.

**Language selector:** continues to work for header/footer chrome. Does **not** filter post body content — body stays multilingual stacked (matches the simplicity requirement).

### Dependencies

- **marked.js** — loaded from jsDelivr on `post.html` only, via `<script defer src="...">`. ~30kb gzipped. Pinned to a specific version with SRI hash for security.
- **No new runtime dependencies on the homepage.** PageSpeed scores unaffected.
- **No Python pip packages.** Build script uses stdlib only (`pathlib`, `json`, `re`, `sys`).

## Documentation

### `docs/posts.md` — author-facing guide

Sections:
1. **Quick start** — 3-step recipe
2. **Filename convention** — format + examples
3. **Frontmatter reference** — required fields, formats, copy-pasteable template
4. **Writing the body** — multilingual stacking convention, markdown tables, raw HTML allowed
5. **Publishing** — git push → Action runs → card appears
6. **Editing & removing** — just edit/delete the `.md` file and push
7. **Troubleshooting** — common errors, how to view Action logs, local verification command
8. **FAQ** — "why doesn't my post show on the homepage?" (4th+ oldest), "can I hide a post?" (delete the file), etc.

### `CLAUDE.md` — pointer (~10 lines)

New section under Architecture:

> **Posts system:** markdown-authored blog posts. Files in `posts/*.md` with frontmatter (`title`, `date`, `summary`). A GitHub Action (`build-posts-index.yml`) runs `scripts/build_posts_index.py` on push to regenerate `posts/index.json`. The homepage fetches this manifest and renders the 3 newest as cards under `#announcements`. Individual posts are viewed via the shared `post.html?slug=<slug>` page, which lazy-loads marked.js. Never hand-edit `posts/index.json`. See `docs/posts.md` for the full publishing guide.

## Seed content

As part of initial implementation, the Wielki Tydzień i Pascha 2026 content from the source docx (`~/Downloads/WIELKI TYDZIEŃ I PASCHA 2026.docx`) will be converted into the first real post at `posts/2026-04-01-wielki-tydzien.md`. This serves as both a working example and immediately-useful parish content. The docx contains three tables (Holy Week services, Pascha/Bright Week services, food blessing times) which will render as HTML tables inside the markdown body, with language sections in Polish, Ukrainian, and English.

## Security considerations

- **Path traversal:** `post.html` validates the slug against `^\d{4}-\d{2}-\d{2}-[a-z0-9-]+$` before constructing the fetch URL. Rejects anything else.
- **XSS via markdown:** marked.js is configured with default settings (which escape raw HTML in untrusted contexts). Since posts are author-written and committed to git, they are trusted — raw HTML is intentionally allowed for richer layouts (tables, images with captions, etc.). This is a deliberate choice.
- **GitHub Action permissions:** scoped to `contents: write` only. Uses the default `GITHUB_TOKEN`, no PAT.

## Performance considerations

- Homepage: adds one small `fetch('posts/index.json')` after `DOMContentLoaded`. No new render-blocking resources. Cards injected after paint, so no LCP impact.
- Post page: marked.js is `defer`-loaded from CDN with a long browser cache. Parsing happens client-side but posts are small (< 20kb markdown typically).
- `posts/index.json` stays small (a few hundred bytes per entry) and is fetched once per homepage visit. Browser cache + GitHub Pages CDN handles the rest.

## Testing strategy

**Build script:** unit-test the frontmatter parser and the error paths (missing field, bad date, duplicate slug, malformed YAML-like block). Python `unittest` module, no pytest.

**GitHub Action:** verified by committing a test post during initial setup and watching the Action complete successfully.

**Homepage cards:** manual verification with 0, 1, 2, 3, and 5 posts in the fixture to cover empty state, partial, full, and overflow.

**Post viewer:** manual verification with:
- Valid slug → renders correctly
- Invalid slug → error state
- Slug with path traversal characters → rejected
- All 5 header languages → chrome translates, body stays stacked

## Open questions

None — all decisions resolved during brainstorming.

## Rollout

Single PR containing:
1. `posts/2026-04-01-wielki-tydzien.md` (seed content)
2. `scripts/build_posts_index.py`
3. `.github/workflows/build-posts-index.yml`
4. `post.html`
5. `index.html`, `script.js`, `styles.css` modifications
6. `docs/posts.md`
7. `CLAUDE.md` update
8. `posts/index.json` (committed by the Action after merge, or manually pre-generated in the PR)

After merge, verify the Action runs cleanly on the next unrelated push.
