"""Tests for build_posts_index.py — stdlib unittest."""
import json
import tempfile
import unittest
from pathlib import Path

from build_posts_index import parse_frontmatter, ParseError, collect_posts


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
            self.assertIn('\n    "slug"', text)

    def test_idempotent_no_rewrite(self):
        from build_posts_index import write_manifest
        with tempfile.TemporaryDirectory() as tmp:
            out = Path(tmp) / "index.json"
            entries = [{"slug": "a", "title": "A", "date": "2026-01-01", "summary": "s"}]
            self.assertTrue(write_manifest(out, entries))
            self.assertFalse(write_manifest(out, entries))


if __name__ == '__main__':
    unittest.main()
