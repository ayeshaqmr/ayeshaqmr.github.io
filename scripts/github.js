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

async function renderPinnedRepos() {
  const wrap = document.getElementById('pinned-repos-grid');
  if (!wrap) return;

  wrap.innerHTML = `<div style="font-family:var(--font-mono);font-size:11px;color:var(--text-muted);padding:var(--space-4);">Loading repos…</div>`;

  let repos;

  try {
    const res = await fetch(`https://gh-pinned-repos.egoist.dev/?username=${GITHUB_USER}`);
    repos = await res.json();
  } catch {
    repos = null;
  }

  if (!repos || repos.length === 0) {
    try {
      const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=stars&per_page=6&direction=desc`);
      if (res.ok) {
        repos = (await res.json()).map(r => ({
          repo: r.name,
          description: r.description,
          language: r.language,
          stars: r.stargazers_count,
          link: r.html_url,
        }));
      }
    } catch {
      repos = null;
    }
  }

  if (!repos || repos.length === 0) {
    wrap.innerHTML = `<div style="font-family:var(--font-mono);font-size:11px;color:var(--text-muted);padding:var(--space-5);text-align:center;">
      Unable to load repos. <a href="https://github.com/${GITHUB_USER}" target="_blank" style="color:var(--accent-dim)">View on GitHub →</a>
    </div>`;
    return;
  }

  wrap.innerHTML = '';
  repos.slice(0, 6).forEach(repo => {
    const card = document.createElement('a');
    card.href   = repo.link || `https://github.com/${GITHUB_USER}/${repo.repo}`;
    card.target = '_blank';
    card.rel    = 'noopener';
    card.className = 'repo-card';
    card.innerHTML = `
      <div class="repo-card__header">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" style="color:var(--text-muted);flex-shrink:0">
          <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"/>
        </svg>
        <span class="repo-card__name">${repo.repo}</span>
      </div>
      ${repo.description ? `<p class="repo-card__desc">${repo.description}</p>` : ''}
      <div class="repo-card__footer">
        ${repo.language ? `<span class="repo-card__lang">${repo.language}</span>` : ''}
        <span class="repo-card__stars">★ ${repo.stars || 0}</span>
        <span class="repo-card__arrow">↗</span>
      </div>
    `;
    wrap.appendChild(card);
  });

  if (!document.getElementById('repo-card-style')) {
    const style = document.createElement('style');
    style.id = 'repo-card-style';
    style.textContent = `
      #pinned-repos-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1px;
        background: var(--border);
        border: 1px solid var(--border);
        border-radius: var(--card-radius);
        overflow: hidden;
      }
      .repo-card {
        background: linear-gradient(135deg, rgba(196,167,231,0.04) 0%, var(--bg-surface) 100%);
        padding: var(--space-5);
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        transition: all 0.3s var(--ease-expo);
        position: relative;
      }
      .repo-card::after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 2px;
        background: #c4a7e7;
        opacity: 0;
        transition: opacity 0.3s var(--ease-expo);
      }
      .repo-card:hover {
        background: linear-gradient(135deg, rgba(196,167,231,0.08) 0%, var(--bg-elevated) 100%);
      }
      .repo-card:hover::after { opacity: 0.6; }
      .repo-card__header {
        display: flex;
        align-items: center;
        gap: var(--space-2);
      }
      .repo-card__name {
        font-family: var(--font-mono);
        font-size: var(--text-sm);
        font-weight: 600;
        color: var(--text-primary);
        transition: color var(--transition-fast);
      }
      .repo-card:hover .repo-card__name { color: #c4a7e7; }
      .repo-card__desc {
        font-size: 11px;
        color: var(--text-muted);
        line-height: 1.5;
        flex: 1;
      }
      .repo-card__footer {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        margin-top: var(--space-2);
      }
      .repo-card__lang {
        font-family: var(--font-mono);
        font-size: 10px;
        color: #c4a7e7;
        background: rgba(196,167,231,0.1);
        border: 1px solid rgba(196,167,231,0.2);
        padding: 1px 6px;
        border-radius: 2px;
      }
      .repo-card__stars {
        font-family: var(--font-mono);
        font-size: 10px;
        color: var(--text-muted);
      }
      .repo-card__arrow {
        margin-left: auto;
        font-size: var(--text-base);
        color: var(--text-muted);
        transition: color var(--transition-fast), transform var(--transition-fast);
      }
      .repo-card:hover .repo-card__arrow { color: #c4a7e7; transform: translate(3px,-3px); }
      @media(max-width:768px) { #pinned-repos-grid { grid-template-columns: 1fr; } }
    `;
    document.head.appendChild(style);
  }
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
  const reposWrap = document.getElementById('pinned-repos-grid');
  if (reposWrap) {
    renderPinnedRepos();
  }
}

window.initGithub = initGithub;
