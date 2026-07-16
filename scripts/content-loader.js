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
      const code = c.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
      const num = String(i + 1).padStart(2, '0');
      const shortName = c.name.length > 24 ? c.name.slice(0, 22) + '..' : c.name;
      const topicsList = c.topics.split(',').slice(0, 2).join(' · ');
      const month = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][i % 12];
      return `
      <div class="stamp" style="transform:translateY(${p.y}px) rotate(${p.rot}deg); z-index:${p.z}">
        <div class="stamp-top">
          <div class="stamp-cent">
            <div class="stamp-cent__num">${code}</div>
            <div class="stamp-cent__label">Cert</div>
          </div>
          <div class="stamp-banner" style="background:${accent}">
            <div class="stamp-banner__title">CERTIFIED</div>
            <div class="stamp-banner__sub">${c.issuer.toUpperCase()}</div>
          </div>
        </div>
        <div class="stamp-mid">
          <svg viewBox="0 0 200 50" class="stamp-squiggle">
            <path d="M0,8 Q5,0 10,8 T20,8 T30,8 T40,8 T50,8 T60,8 T70,8 T80,8 T90,8 T100,8 T110,8 T120,8 T130,8 T140,8 T150,8 T160,8 T170,8 T180,8 T190,8 T200,8" fill="none" stroke="var(--border)" stroke-width="1.2"/>
            <path d="M0,20 Q5,12 10,20 T20,20 T30,20 T40,20 T50,20 T60,20 T70,20 T80,20 T90,20 T100,20 T110,20 T120,20 T130,20 T140,20 T150,20 T160,20 T170,20 T180,20 T190,20 T200,20" fill="none" stroke="var(--border)" stroke-width="1.2"/>
            <path d="M0,32 Q5,24 10,32 T20,32 T30,32 T40,32 T50,32 T60,32 T70,32 T80,32 T90,32 T100,32 T110,32 T120,32 T130,32 T140,32 T150,32 T160,32 T170,32 T180,32 T190,32 T200,32" fill="none" stroke="var(--border)" stroke-width="1.2"/>
            <circle cx="170" cy="20" r="18" fill="none" stroke="${accent}" stroke-width="1.5" stroke-dasharray="3 2.5" opacity="0.7"/>
            <text x="170" y="17" font-size="6" fill="${accent}" text-anchor="middle" font-family="var(--font-mono)">${shortName.length > 12 ? shortName.slice(0,10) + '..' : shortName}</text>
            <text x="170" y="26" font-size="5" fill="${accent}" text-anchor="middle" font-family="var(--font-mono)" opacity="0.7">2026</text>
          </svg>
        </div>
        <div class="stamp-bottom">
          <span>${month} · 2026</span>
          <span>No. ${code}-${num}-2026</span>
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
