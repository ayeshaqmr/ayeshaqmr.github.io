async function initArticle() {
  const container = document.getElementById('markdown-container');
  if (!container) return;

  if (typeof marked === 'undefined') {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  const urlParams = new URLSearchParams(window.location.search);
  const postFile = urlParams.get('post') || 'graph-routing';

  container.innerHTML = '<p class="article-loading">Loading content…</p>';

  try {
    const response = await fetch(`content/${postFile}.md`);
    if (!response.ok) throw new Error('Post not found');

    const markdown = await response.text();
    container.innerHTML = marked.parse(markdown);
    container.classList.add('visible');

    const h1Match = markdown.match(/^#\s+(.*)/m);
    if (h1Match) {
      document.title = `${h1Match[1]} — Ayesha Qamar`;
    }
  } catch {
    container.innerHTML = '<h1 class="article-title">404</h1><p>Sorry, this post couldn\'t be loaded.</p>';
  }
}

window.initArticle = initArticle;
