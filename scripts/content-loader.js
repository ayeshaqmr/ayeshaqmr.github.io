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
    const titleColors = ['#eb6f92', '#f6c177', '#31748f', '#c4a7e7', '#9ccfd8', '#f6c177', '#eb6f92', '#c4a7e7'];
    const funkyLine1 = ['#eb6f92', '#f6c177', '#31748f', '#9ccfd8', '#c4a7e7', '#ea9a97', '#f6c177', '#31748f'];
    const funkyLine2 = ['#9ccfd8', '#c4a7e7', '#eb6f92', '#f6c177', '#ea9a97', '#31748f', '#9ccfd8', '#eb6f92'];
    const placements = [
      { x: -12, y: -4, rot: -5, z: 1 },
      { x: 8, y: 2, rot: 3, z: 2 },
      { x: -4, y: 6, rot: -3, z: 3 },
      { x: 14, y: -3, rot: 6, z: 4 },
      { x: -10, y: 4, rot: -4, z: 5 },
      { x: 5, y: -6, rot: 4, z: 6 },
      { x: 12, y: 5, rot: -6, z: 7 },
      { x: -7, y: -5, rot: 5, z: 8 },
    ];
    certGrid.innerHTML = data.certifications.map((c, i) => {
      const color = titleColors[i % titleColors.length];
      const line1 = funkyLine1[i % funkyLine1.length];
      const line2 = funkyLine2[i % funkyLine2.length];
      const p = placements[i % placements.length];
      const code = c.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
      const num = String(i + 1).padStart(2, '0');
      const shortName = c.name.length > 26 ? c.name.slice(0, 24) + '..' : c.name;
      const uid = 'c' + i;
      return `
      <div class="cassette" style="transform:translate(${p.x}%,${p.y}%) rotate(${p.rot}deg); z-index:${p.z}">
        <svg viewBox="0 0 380 200" class="cassette-svg">
          <defs>
            <linearGradient id="shell${uid}" x1="0" y1="0" x2="0.3" y2="1">
              <stop offset="0%" stop-color="#FDF9F7"/>
              <stop offset="50%" stop-color="#f0ebe3"/>
              <stop offset="100%" stop-color="#e4ddd3"/>
            </linearGradient>
            <radialGradient id="reel${uid}" cx="50%" cy="45%" r="55%">
              <stop offset="0%" stop-color="#e8e0d0"/>
              <stop offset="60%" stop-color="#c4b89a"/>
              <stop offset="100%" stop-color="#948968"/>
            </radialGradient>
            <filter id="shadow${uid}">
              <feDropShadow dx="4" dy="5" stdDeviation="4" flood-color="#000" flood-opacity="0.2"/>
            </filter>
          </defs>
          <rect x="10" y="10" width="360" height="180" rx="10" fill="url(#shell${uid})" stroke="#c9beac" stroke-width="2" filter="url(#shadow${uid})"/>
          <rect x="30" y="52" width="320" height="90" fill="#f0e6cc"/>
          <rect x="30" y="52" width="320" height="11" fill="${line1}" opacity="0.35"/>
          <rect x="30" y="63" width="320" height="10" fill="${line2}" opacity="0.25"/>
          <rect x="30" y="118" width="320" height="10" fill="${line2}" opacity="0.25"/>
          <rect x="30" y="128" width="320" height="14" fill="${line1}" opacity="0.35"/>
          <text x="190" y="34" font-size="14" font-weight="700" fill="${color}" font-family="Georgia, serif" text-anchor="middle">${shortName}</text>
          <text x="190" y="46" font-size="8" fill="#6b5480" font-family="Georgia, serif" text-anchor="middle" letter-spacing="1">issued by ${c.issuer} &#8226; ${code.toLowerCase()}-${num}-2026</text>
          <circle cx="108" cy="101" r="27" fill="#d8cdb2" stroke="#7d715c" stroke-width="2"/>
          <circle cx="108" cy="101" r="8" fill="#5a5140"/>
          <g stroke="#7d715c" stroke-width="2">
            <line x1="108" y1="82" x2="108" y2="74"/><line x1="108" y1="120" x2="108" y2="128"/>
            <line x1="89" y1="101" x2="81" y2="101"/><line x1="127" y1="101" x2="135" y2="101"/>
            <line x1="94" y1="87" x2="88" y2="81"/><line x1="122" y1="87" x2="128" y2="81"/>
            <line x1="94" y1="115" x2="88" y2="121"/><line x1="122" y1="115" x2="128" y2="121"/>
          </g>
          <circle cx="272" cy="101" r="27" fill="#d8cdb2" stroke="#7d715c" stroke-width="2"/>
          <circle cx="272" cy="101" r="8" fill="#5a5140"/>
          <g stroke="#7d715c" stroke-width="2">
            <line x1="272" y1="82" x2="272" y2="74"/><line x1="272" y1="120" x2="272" y2="128"/>
            <line x1="253" y1="101" x2="245" y2="101"/><line x1="291" y1="101" x2="299" y2="101"/>
            <line x1="258" y1="87" x2="252" y2="81"/><line x1="286" y1="87" x2="292" y2="81"/>
            <line x1="258" y1="115" x2="252" y2="121"/><line x1="286" y1="115" x2="292" y2="121"/>
          </g>
        </svg>
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
