const DATA_PATH = 'content/data';

async function loadJSON(file) {
  const res = await fetch(`${DATA_PATH}/${file}`);
  if (!res.ok) throw new Error(`Failed to load ${file}`);
  return res.json();
}

function renderMarquee(skills) {
  const track = document.querySelector('.marquee-track');
  if (!track || !skills) return;
  track.innerHTML = skills.map(s => `<span class="marquee-item">${s}</span>`).join('');
}

function renderStats(stats) {
  const grid = document.querySelector('.stats-grid');
  if (!grid || !stats) return;
  grid.innerHTML = stats.map(s => `
    <div class="stat-card">
      <span class="stat-card__num"><span data-count="${s.count}" data-suffix="${s.suffix}">${s.count}${s.suffix || ''}</span></span>
      <span class="stat-card__label">${s.label}</span>
    </div>
  `).join('');
}

function renderExperience(data) {
  const list = document.querySelector('.experience-list');
  if (list && data.rows) {
    list.innerHTML = data.rows.map(r => `
      <div class="experience-row" role="listitem">
        <span class="exp-dot" aria-hidden="true"></span>
        <div class="exp-content">
          <span class="exp-year">${r.year}</span>
          <span class="exp-role">${r.role}</span>
          <span class="exp-company">${r.company}</span>
          ${r.badge ? `<span class="exp-badge">${r.badge}</span>` : ''}
        </div>
      </div>
    `).join('');
  }

  const certGrid = document.querySelector('.cert-grid');
  if (certGrid && data.certifications) {
    certGrid.innerHTML = data.certifications.map(c => `
      <div class="cert-item">
        <span class="cert-item__icon">🏅</span>
        <div>
          <p class="cert-item__name">${c.name}</p>
          <p class="cert-item__issuer">${c.issuer}</p>
        </div>
      </div>
    `).join('');
  }
}

function renderSkillsGrid(skills) {
  const grid = document.querySelector('.skills-grid');
  if (!grid || !skills) return;
  grid.innerHTML = skills.map(s => `<span class="skill-tag">${s}</span>`).join('');
}

function renderProjects(projects) {
  const grid = document.querySelector('.projects-grid');
  if (!grid || !projects) return;
  grid.innerHTML = projects.map(p => {
    const img = p.image
      ? `<div class="project-card__image"><img src="assets/images/${p.image}" alt="${p.title}" loading="lazy" /><div class="project-card__glare" aria-hidden="true"></div></div>`
      : `<div class="project-card__image" style="display:flex;align-items:center;justify-content:center;background:var(--bg-elevated);color:var(--text-muted);font-size:var(--text-xs);font-family:var(--font-mono);">[ Internal Dashboard ]</div>`;
    const tags = p.tags.map(t => `<span class="tag">${t}</span>`).join('');
    return `
      <article class="project-card" data-category="${p.category}">
        <a href="${p.link}" class="project-card__link">
          ${img}
          <div class="project-card__body">
            <div class="project-card__meta">
              <span class="project-card__category">${p.category.replace(/-/g, ' · ')}</span>
              <span class="project-card__year">${p.year}</span>
            </div>
            <h2 class="project-card__title">${p.title}</h2>
            <p class="project-card__desc">${p.description}</p>
            <div class="project-card__footer">
              <div class="project-card__tags">${tags}</div>
              <span class="project-card__arrow">↗</span>
            </div>
          </div>
        </a>
      </article>
    `;
  }).join('');
}

function renderNotes(notes) {
  const list = document.querySelector('.notes-list');
  if (!list || !notes) return;
  list.innerHTML = notes.map(n => {
    const tags = n.tags.map(t => `<span class="tag">${t}</span>`).join('');
    return `
      <article class="note-item">
        <span class="note-item__date">${n.date}</span>
        <div>
          <a href="${n.link}">
            <h2 class="note-item__title">${n.title}</h2>
          </a>
          <p class="note-item__desc">${n.description}</p>
          <div class="note-item__tags">${tags}</div>
        </div>
        <a href="${n.link}" class="note-item__read">Read →</a>
      </article>
    `;
  }).join('');
}

function renderUses(uses) {
  const container = document.querySelector('.uses-content');
  if (!container || !uses) return;
  const icons = {
    package: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>',
    circle: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>'
  };
  container.innerHTML = uses.map(u => `
    <section class="uses-section reveal">
      <h2 class="uses-category-title">${icons[u.icon] || ''} ${u.category}</h2>
      <div class="uses-list">
        ${u.items.map(i => `
          <div class="uses-item">
            <span class="uses-item__emoji">${i.emoji}</span>
            <div>
              <p class="uses-item__name">${i.name}</p>
              <p class="uses-item__desc">${i.desc}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `).join('');
}

function renderEducation(education) {
  const container = document.querySelector('.education-content');
  if (!container || !education) return;
  container.innerHTML = education.map(e => `
    <div class="edu-item">
      <div class="edu-item__body">
        <span class="edu-item__year">${e.year}</span>
        <h3 class="edu-item__degree">${e.degree}</h3>
        <p class="edu-item__school">${e.school}</p>
        ${e.description ? `<p class="edu-item__desc">${e.description}</p>` : ''}
      </div>
    </div>
  `).join('');
}

function renderResearch(research) {
  const list = document.querySelector('.research-list');
  if (!list || !research) return;
  list.innerHTML = research.map(r => {
    const tags = r.tags.map(t => `<span class="tag">${t}</span>`).join('');
    return `
      <article class="research-item">
        <span class="research-item__year">${r.year}</span>
        <div>
          <a href="${r.link}">
            <h2 class="research-item__title">${r.title}</h2>
          </a>
          <p class="research-item__venue">${r.venue}</p>
          <p class="research-item__desc">${r.description}</p>
          <div class="research-item__tags">${tags}</div>
        </div>
      </article>
    `;
  }).join('');
}

async function initContent() {
  try {
    const skills = await loadJSON('skills.json');
    renderMarquee(skills.marquee);
    renderSkillsGrid(skills.grid);

    const stats = await loadJSON('stats.json');
    renderStats(stats);

    const exp = await loadJSON('experience.json');
    renderExperience(exp);

    if (document.querySelector('.projects-grid')) {
      const projects = await loadJSON('projects.json');
      renderProjects(projects);
    }

    if (document.querySelector('.notes-list')) {
      const notes = await loadJSON('notes.json');
      renderNotes(notes);
    }

    if (document.querySelector('.uses-content')) {
      const uses = await loadJSON('uses.json');
      renderUses(uses);
    }

    if (document.querySelector('.education-content')) {
      const education = await loadJSON('education.json');
      renderEducation(education);
    }

    if (document.querySelector('.research-list')) {
      const research = await loadJSON('research.json');
      renderResearch(research);
    }
  } catch (e) {
    console.warn('Content loader:', e.message);
  }
}

window.initContent = initContent;
