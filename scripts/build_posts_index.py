"""Scan posts/*.md, validate frontmatter, write posts/index.json.

Stdlib only. Runnable locally: python3 scripts/build_posts_index.py
Run from the repository root.
"""
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
