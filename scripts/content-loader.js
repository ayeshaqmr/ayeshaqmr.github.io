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
      { y: 0, rot: -4, z: 1 },
      { y: 30, rot: 3, z: 2 },
      { y: 0, rot: -5, z: 3 },
      { y: 30, rot: 4, z: 4 },
      { y: 0, rot: -3, z: 5 },
      { y: 30, rot: 5, z: 6 },
      { y: 0, rot: -6, z: 7 },
      { y: 30, rot: 3, z: 8 },
    ];
    certGrid.innerHTML = data.certifications.map((c, i) => {
      const color = titleColors[i % titleColors.length];
      const line1 = funkyLine1[i % funkyLine1.length];
      const line2 = funkyLine2[i % funkyLine2.length];
      const p = placements[i % placements.length];
      const code = c.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
      const num = String(i + 1).padStart(2, '0');
      const shortName = c.name.length > 20 ? c.name.slice(0, 18) + '..' : c.name;
      const uid = 'c' + i;
      return `
      <div class="cassette" style="transform:translateY(${p.y}px) rotate(${p.rot}deg); z-index:${p.z}">
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
          <text x="190" y="34" font-size="13" font-weight="600" fill="${color}" font-family="Georgia, serif" text-anchor="middle">${shortName}</text>
          <text x="190" y="46" font-size="8" fill="#6b5480" font-family="Georgia, serif" text-anchor="middle" letter-spacing="1">${c.issuer} &#8226; ${code.toLowerCase()}-${num}-2026</text>
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

    const exp = await loadJSON('experience.json');
    renderExperience(exp);

    if (document.querySelector('.projects-cards')) {
      const projects = await loadJSON('projects.json');
      renderProjects(projects);
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
