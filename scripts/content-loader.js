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
      const issuerUpper = c.issuer.toUpperCase();
      const issuerLabel = issuerUpper + ' CERT';
      const isTall = i % 3 === 1;
      if (isTall) {
        return `
        <div class="stamp stamp-tall" style="transform:translateY(${p.y}px) rotate(${p.rot}deg); z-index:${p.z}">
          <div class="airpost-header"><span>POST SERVICE</span></div>
          <div class="airpost-badge-wrap">
            <svg class="squiggle-side" viewBox="0 0 60 120">
              <path d="M8,0 Q0,4 8,8 T8,16 T8,24 T8,32 T8,40 T8,48 T8,56 T8,64 T8,72 T8,80 T8,88 T8,96 T8,104 T8,112" fill="none" stroke="#493D60" stroke-width="1.4"/>
              <path d="M20,0 Q12,4 20,8 T20,16 T20,24 T20,32 T20,40 T20,48 T20,56 T20,64 T20,72 T20,80 T20,88 T20,96 T20,104 T20,112" fill="none" stroke="#493D60" stroke-width="1.4"/>
            </svg>
            <div class="cent-badge" style="background:${accent}">
              <div class="cent-badge-num">${issuerUpper}</div>
              <div class="cent-badge-label">Cert</div>
            </div>
          </div>
          <div class="stamp-footer-single">${c.name}</div>
          <div class="airpost-bar">${issuerUpper}</div>
        </div>`;
      }
      return `
      <div class="stamp" style="transform:translateY(${p.y}px) rotate(${p.rot}deg); z-index:${p.z}">
        <div class="cent-box">
          <div class="cent-num">${issuerUpper}</div>
          <div class="cent-label">Cert</div>
          <div class="cent-star">★</div>
        </div>
        <div class="post-block" style="background:${accent}">
          <div class="post-title">CERTIFIED</div>
          <div class="post-sub">${issuerUpper}</div>
        </div>
        <svg class="squiggle-corner" viewBox="0 0 90 60">
          <path d="M0,8 Q4,0 8,8 T16,8 T24,8 T32,8 T40,8 T48,8 T56,8 T64,8 T72,8 T80,8 T88,8" fill="none" stroke="#493D60" stroke-width="1.4"/>
          <path d="M0,18 Q4,10 8,18 T16,18 T24,18 T32,18 T40,18 T48,18 T56,18 T64,18 T72,18 T80,18 T88,18" fill="none" stroke="#493D60" stroke-width="1.4"/>
          <path d="M0,28 Q4,20 8,28 T16,28 T24,28 T32,28 T40,28 T48,28 T56,28 T64,28 T72,28 T80,28 T88,28" fill="none" stroke="#493D60" stroke-width="1.4"/>
          <path d="M0,38 Q4,30 8,38 T16,38 T24,38 T32,38 T40,38 T48,38 T56,38 T64,38 T72,38 T80,38 T88,38" fill="none" stroke="#493D60" stroke-width="1.4"/>
        </svg>
        <div class="stamp-footer">
          <span>${c.name}</span>
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
