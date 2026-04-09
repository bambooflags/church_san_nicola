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

```
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
