const GITHUB_USER = 'ayeshaqmr';

function renderContributionGraph() {
  const wrap = document.getElementById('github-graph-img-wrap');
  if (!wrap) return;

  const img = document.createElement('img');
  img.src = `https://ghchart.rshah.org/b4637a/${GITHUB_USER}`;
  img.alt = `${GITHUB_USER}'s GitHub contribution chart`;
  img.style.cssText = 'width:100%; border-radius:4px; opacity:0; transition:opacity 0.6s ease;';
  img.loading = 'lazy';

  img.onload  = () => { img.style.opacity = '1'; };
  img.onerror = () => {
    wrap.innerHTML = `<p style="font-family:var(--font-mono);font-size:11px;color:var(--text-muted);text-align:center;padding:24px 0;">
      GitHub graph unavailable offline — view live on <a href="https://github.com/${GITHUB_USER}" style="color:var(--accent-dim)">github.com/${GITHUB_USER}</a>
    </p>`;
  };

  wrap.appendChild(img);
}

function renderGithubStatsCard() {
  const wrap = document.getElementById('github-stats-card');
  if (!wrap) return;

  const params = new URLSearchParams({
    username: GITHUB_USER,
    show_icons: 'true',
    theme: 'transparent',
    bg_color: '191724',
    text_color: '908caa',
    icon_color: 'c4a7e7',
    border_color: '2a2841',
    title_color: 'e0def4',
    hide_border: 'false',
    count_private: 'true',
    show: 'reviews,discussions_started',
  });

  const img = document.createElement('img');
  img.src = `https://github-readme-stats.vercel.app/api?${params}`;
  img.alt = `${GITHUB_USER}'s GitHub stats`;
  img.style.cssText = 'max-width:100%;border-radius:6px;opacity:0;transition:opacity 0.6s ease;';
  img.loading = 'lazy';
  img.onload  = () => { img.style.opacity = '1'; };
  img.onerror = () => { wrap.style.display = 'none'; };
  wrap.appendChild(img);
}

function initGithub() {
  const graphWrap = document.getElementById('github-graph-img-wrap');
  if (graphWrap) {
    graphWrap.innerHTML = '';
    renderContributionGraph();
  }
  const statsWrap = document.getElementById('github-stats-card');
  if (statsWrap) {
    statsWrap.innerHTML = '';
    renderGithubStatsCard();
  }
}

window.initGithub = initGithub;
