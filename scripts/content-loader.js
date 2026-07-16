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
    const accentColors = ['#c4a7e7', '#eb6f92', '#9ccfd8', '#f6c177', '#c4a7e7', '#eb6f92', '#9ccfd8', '#f6c177'];
    const placements = [
      { y: 0, rot: -2, z: 1 },
      { y: 8, rot: 1.5, z: 2 },
      { y: 0, rot: -1, z: 3 },
      { y: 8, rot: 2, z: 4 },
      { y: 0, rot: -1.5, z: 5 },
      { y: 8, rot: 1, z: 6 },
      { y: 0, rot: -2.5, z: 7 },
      { y: 8, rot: 1.5, z: 8 },
    ];
    certGrid.innerHTML = data.certifications.map((c, i) => {
      const accent = accentColors[i % accentColors.length];
      const p = placements[i % placements.length];
      const issuerCert = c.issuer.toUpperCase() + ' CERT';
      const patterns = [
        `<path d="M0,8 Q5,0 10,8 T20,8 T30,8 T40,8 T50,8 T60,8 T70,8 T80,8 T90,8 T100,8 T110,8 T120,8" fill="none" stroke="#1c1a18" stroke-width="1.2"/>
         <path d="M0,20 Q5,12 10,20 T20,20 T30,20 T40,20 T50,20 T60,20 T70,20 T80,20 T90,20 T100,20 T110,20 T120,20" fill="none" stroke="#1c1a18" stroke-width="1.2"/>
         <path d="M0,32 Q5,24 10,32 T20,32 T30,32 T40,32 T50,32 T60,32 T70,32 T80,32 T90,32 T100,32 T110,32 T120,32" fill="none" stroke="#1c1a18" stroke-width="1.2"/>`,
        `<line x1="0" y1="8" x2="120" y2="8" stroke="#1c1a18" stroke-width="1.2" stroke-dasharray="4 3"/>
         <line x1="0" y1="20" x2="120" y2="20" stroke="#1c1a18" stroke-width="1.2" stroke-dasharray="4 3"/>
         <line x1="0" y1="32" x2="120" y2="32" stroke="#1c1a18" stroke-width="1.2" stroke-dasharray="4 3"/>`,
        `<path d="M0,10 L10,5 L20,10 L30,5 L40,10 L50,5 L60,10 L70,5 L80,10 L90,5 L100,10 L110,5 L120,10" fill="none" stroke="#1c1a18" stroke-width="1.2"/>
         <path d="M0,22 L10,17 L20,22 L30,17 L40,22 L50,17 L60,22 L70,17 L80,22 L90,17 L100,22 L110,17 L120,22" fill="none" stroke="#1c1a18" stroke-width="1.2"/>
         <path d="M0,34 L10,29 L20,34 L30,29 L40,34 L50,29 L60,34 L70,29 L80,34 L90,29 L100,34 L110,29 L120,34" fill="none" stroke="#1c1a18" stroke-width="1.2"/>`,
        `<circle cx="20" cy="20" r="3" fill="none" stroke="#1c1a18" stroke-width="1"/>
         <circle cx="40" cy="20" r="3" fill="none" stroke="#1c1a18" stroke-width="1"/>
         <circle cx="60" cy="20" r="3" fill="none" stroke="#1c1a18" stroke-width="1"/>
         <circle cx="80" cy="20" r="3" fill="none" stroke="#1c1a18" stroke-width="1"/>
         <circle cx="100" cy="20" r="3" fill="none" stroke="#1c1a18" stroke-width="1"/>
         <line x1="0" y1="35" x2="120" y2="35" stroke="#1c1a18" stroke-width="0.8" stroke-dasharray="1 3"/>`,
        `<path d="M0,15 Q15,5 30,15 T60,15 T90,15 T120,15" fill="none" stroke="#1c1a18" stroke-width="1.2"/>
         <path d="M0,25 Q15,35 30,25 T60,25 T90,25 T120,25" fill="none" stroke="#1c1a18" stroke-width="1.2"/>`,
        `<rect x="10" y="6" width="100" height="28" rx="4" fill="none" stroke="#1c1a18" stroke-width="1" stroke-dasharray="3 2"/>
         <line x1="10" y1="20" x2="110" y2="20" stroke="#1c1a18" stroke-width="0.6" stroke-dasharray="2 4"/>`,
        `<path d="M0,10 C20,0 40,20 60,10 S100,0 120,10" fill="none" stroke="#1c1a18" stroke-width="1.2"/>
         <path d="M0,25 C20,15 40,35 60,25 S100,15 120,25" fill="none" stroke="#1c1a18" stroke-width="1.2"/>`,
        `<path d="M5,5 L115,5 M5,15 L115,15 M5,25 L115,25 M5,35 L115,35" fill="none" stroke="#1c1a18" stroke-width="0.8" stroke-dasharray="1 5"/>
         <circle cx="60" cy="20" r="8" fill="none" stroke="#1c1a18" stroke-width="1"/>`
      ];
      const pattern = patterns[i % patterns.length];
      return `
      <div class="stamp" style="transform:translateY(${p.y}px) rotate(${p.rot}deg); z-index:${p.z}">
        <div class="stamp-top">
          <div class="stamp-title" style="background:${accent}">
            <div class="stamp-title__name">${c.name}</div>
          </div>
        </div>
        <div class="stamp-mid">
          <div class="stamp-mid-row">
            <div class="stamp-cent">
              <div class="stamp-cent__num">${issuerCert.split(' ').map(w => w[0]).join('')}</div>
              <div class="stamp-cent__label">${issuerCert}</div>
            </div>
            <svg viewBox="0 0 120 40" class="stamp-squiggle">
              ${pattern}
              <circle cx="105" cy="20" r="12" fill="none" stroke="${accent}" stroke-width="1.2" stroke-dasharray="2.5 2" opacity="0.55"/>
              <text x="105" y="22" font-size="4.5" fill="${accent}" text-anchor="middle" font-family="var(--font-mono)">CERT</text>
            </svg>
          </div>
        </div>
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
