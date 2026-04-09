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
