const DATA_PATH = 'content/data';

async function loadJSON(file) {
  const res = await fetch(`${DATA_PATH}/${file}`);
  if (!res.ok) throw new Error(`Failed to load ${file}`);
  return res.json();
}

function renderMarquee(skills) {
  const track = document.querySelector('.marquee-track');
  if (!track || !skills) return;
  const isObject = skills.length > 0 && typeof skills[0] === 'object';
  track.innerHTML = skills.map(s => {
    const name = isObject ? s.name : s;
    const icon = isObject ? s.icon : null;
    const iconHtml = icon
      ? `<img src="https://cdn.simpleicons.org/${icon}/908caa" alt="" width="12" height="12" loading="lazy" />`
      : '';
    return `<span class="marquee-item">${iconHtml}${name}</span>`;
  }).join('');
}

function renderStats(stats) {
  const grid = document.querySelector('.stats-grid');
  if (!grid || !stats) return;
  grid.innerHTML = stats.map(s => `
    <div class="stat-card">
      <div class="stat-card__top">
        <div class="stat-card__roller">
          <div class="stat-card__digit" data-count="${s.count}">${s.count}</div>
        </div>
        <span class="stat-card__label">${s.label}</span>
      </div>
      <div class="stat-card__bar">
        <div class="stat-card__bar-fill" data-fill="${s.fill || 50}"></div>
      </div>
    </div>
  `).join('');
}

function renderExperience(data) {
  const list = document.querySelector('.timeline');
  if (list && data.rows) {
    const lineHtml = '<div class="timeline__line" aria-hidden="true"></div>';
    const itemsHtml = data.rows.map(r => `
      <div class="timeline-item" role="listitem">
        <div class="timeline-item__dot" aria-hidden="true"></div>
        <div class="timeline-item__content">
          <span class="timeline-item__date">${r.year}</span>
          <h3 class="timeline-item__title">${r.role}</h3>
          <p class="timeline-item__company">${r.company}</p>
          ${r.badge ? `<span class="timeline-item__badge">${r.badge}</span>` : ''}
        </div>
      </div>
    `).join('');
    list.innerHTML = lineHtml + itemsHtml;
  }

  const certGrid = document.querySelector('.cert-grid');
  if (certGrid && data.certifications) {
    certGrid.innerHTML = data.certifications.map((c, i) => {
      const issuer = c.issuer.split('·')[0].trim();
      return `
      <div class="cd">
        <div class="cd__disc">
          <div class="cd__shine"></div>
          <div class="cd__label">
            <p class="cd__title">${c.name}</p>
            <p class="cd__issuer">${issuer}</p>
          </div>
          <div class="cd__hole"></div>
        </div>
      </div>`;
    }).join('');
  }
}

function renderSkillsGrid(skills) {
  const grid = document.querySelector('.skills-grid');
  if (!grid || !skills) return;
  const isObject = skills.length > 0 && typeof skills[0] === 'object';
  grid.innerHTML = skills.map(s => {
    const name  = isObject ? s.name : s;
    const icon  = isObject ? s.icon : null;
    const color = isObject ? s.color : null;
    const iconHtml = icon
      ? `<img class="skill-tag__icon" src="https://cdn.simpleicons.org/${icon}/${color.replace('#','')}" alt="" width="14" height="14" loading="lazy" />`
      : '';
    const style = color ? `--skill-color:${color}` : '';
    return `<span class="skill-tag" style="${style}">${iconHtml}<span class="skill-tag__name">${name}</span></span>`;
  }).join('');
}

function renderProjects(projects) {
  const grid = document.querySelector('.projects-cards');
  if (!grid || !projects) return;
  grid.innerHTML = projects.map((p, i) => {
    const num = String(i + 1).padStart(2, '0');
    const tags = p.tags.map(t => `<span class="tag">${t}</span>`).join('');
    return `
      <a href="${p.link}" class="project-card-item" data-category="${p.category}">
        <div class="project-card-item__top">
          <span class="project-card-item__number">${num}</span>
          <span class="project-card-item__category">${p.category}</span>
        </div>
        <h3 class="project-card-item__title">${p.title}</h3>
        <p class="project-card-item__desc">${p.description}</p>
        <div class="project-card-item__footer">
          <div class="project-card-item__tags">${tags}</div>
          <span class="project-card-item__arrow">→</span>
        </div>
      </a>
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

async function initContent() {
  try {
    const skills = await loadJSON('skills.json');
    renderMarquee(skills);
    renderSkillsGrid(skills);

    const stats = await loadJSON('stats.json');
    renderStats(stats);

    const exp = await loadJSON('experience.json');
    renderExperience(exp);

    if (document.querySelector('.projects-grid')) {
      const projects = await loadJSON('projects.json');
      renderProjects(projects);
    }

    if (document.querySelector('.uses-content')) {
      const uses = await loadJSON('uses.json');
      renderUses(uses);
    }

    if (document.querySelector('.education-content')) {
      const education = await loadJSON('education.json');
      renderEducation(education);
    }


  } catch (e) {
    console.warn('Content loader:', e.message);
  }
}

window.initContent = initContent;
