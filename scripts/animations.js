let scrollRevealObserver = null;

function destroyPage() {
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.getAll().forEach(t => t.kill());
  }
  if (scrollRevealObserver) {
    scrollRevealObserver.disconnect();
    scrollRevealObserver = null;
  }

}

function initScrollReveal() {
  const selector = [
    '.reveal',
    '.reveal--left',
    '.reveal-stagger',
    '.experience-row',
    '.note-item',
    '.research-item',
    '.section-line',
  ].join(',');

  const els = document.querySelectorAll(selector);
  if (!els.length) return;

  scrollRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      if (entry.target.classList.contains('experience-row')) {
        const rows = [...document.querySelectorAll('.experience-row')];
        const idx  = rows.indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('visible'), idx * 60);
      } else if (entry.target.classList.contains('note-item')) {
        const items = [...document.querySelectorAll('.note-item')];
        const idx   = items.indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('visible'), idx * 60);
      } else if (entry.target.classList.contains('research-item')) {
        const items = [...document.querySelectorAll('.research-item')];
        const idx   = items.indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('visible'), idx * 60);
      } else {
        entry.target.classList.add('visible');
      }

      scrollRevealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => scrollRevealObserver.observe(el));
}

function initHeroGSAP() {
  const heroName = document.querySelector('.hero__name');
  if (!heroName) return;
  heroName.style.opacity = '0';
  heroName.style.transition = 'opacity 0.8s ease 0.3s';
  requestAnimationFrame(() => { heroName.style.opacity = '1'; });
}

function initSectionParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll('.section').forEach(section => {
    const inner = section.querySelector(':scope > .section-header + *');
    if (!inner) return;

    gsap.fromTo(inner,
      { y: 20 },
      {
        y: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      }
    );
  });
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const dur    = 1600;
      const start  = performance.now();

      (function step(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / dur, 1);
        const ease     = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(ease * target) + (progress === 1 ? suffix : '');
        if (progress < 1) requestAnimationFrame(step);
      })(start);

      obs.unobserve(el);
    });
  }, { threshold: 0.6 });

  counters.forEach(c => obs.observe(c));
}

function initClock() {
  const el = document.getElementById('navbar-time');
  if (!el) return;
  function tick() {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Karachi', hour12: false });
    el.textContent = `${time} PKT`;
  }
  tick();
  setInterval(tick, 1000);
}

function initScrollspy() {
  const navLinks = document.querySelectorAll('.navbar-nav__item a[href^="#"]');
  if (!navLinks.length) return;

  const sections = [...navLinks].map(l => {
    const id = l.getAttribute('href').slice(1);
    return document.getElementById(id);
  }).filter(Boolean);

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
      }
    });
  }, { threshold: 0, rootMargin: '-20% 0px -60% 0px' });

  sections.forEach(s => obs.observe(s));
}

function initActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const onArticle = path.includes('article');
  const onCaseStudy = path.includes('case-study');
  const onResearch = path.includes('research');
  const links = document.querySelectorAll('.navbar-nav__item a, .navbar-drawer__list a');

  links.forEach(link => {
    const href = link.getAttribute('href')?.split('?')[0] || '';
    const linkPath = href === '/' || href === '' ? 'index.html' : href;
    let match = linkPath === path
      || (path === '' && linkPath === 'index.html');

    if (onArticle && linkPath === 'notes.html') match = true;
    if (onCaseStudy && linkPath === 'case-study.html') match = true;
    if (onResearch && linkPath === 'research.html') match = true;

    link.classList.toggle('active', match);
    if (match) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

function initSectionLines() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.section-line').forEach(l => obs.observe(l));
}

function initCopyEmail() {
  document.querySelectorAll('.contact__email-btn, [data-copy]').forEach(btn => {
    if (btn.dataset.copyBound) return;
    btn.dataset.copyBound = 'true';
    btn.addEventListener('click', () => {
      const text = btn.dataset.email || btn.dataset.copy || btn.textContent.trim();
      navigator.clipboard?.writeText(text).then(() => {
        btn.classList.add('copied');
        setTimeout(() => btn.classList.remove('copied'), 2200);
      });
    });
  });
}

function initSmoothNav() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    if (link.dataset.smoothBound) return;
    link.dataset.smoothBound = 'true';
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      const offset = 60;
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    });
  });
}

function initReadingProgress() {
  const bar = document.querySelector('.reading-progress');
  if (!bar) return;
  const update = () => {
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    const progress = total > 0 ? window.scrollY / total : 0;
    bar.style.transform = `scaleX(${progress})`;
  };
  window.removeEventListener('scroll', bar._scrollHandler);
  bar._scrollHandler = update;
  window.addEventListener('scroll', update, { passive: true });
  update();
}

function initProjectFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card[data-category]');
  if (!btns.length) return;

  btns.forEach(btn => {
    if (btn.dataset.filterBound) return;
    btn.dataset.filterBound = 'true';
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;

      cards.forEach((card, i) => {
        const show = cat === 'all' || card.dataset.category?.includes(cat);
        if (typeof gsap !== 'undefined') {
          gsap.to(card, {
            opacity: show ? 1 : 0,
            scale: show ? 1 : 0.96,
            y: show ? 0 : 8,
            duration: 0.35,
            delay: show ? i * 0.04 : 0,
            ease: 'power2.out',
            overwrite: 'auto',
            onStart: () => { if (show) card.style.display = 'flex'; else card.style.pointerEvents = 'none'; },
            onComplete: () => { if (!show) card.style.display = 'none'; else card.style.pointerEvents = 'all'; },
          });
        } else {
          card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          card.style.opacity    = show ? '1' : '0';
          card.style.transform  = show ? 'scale(1)' : 'scale(0.96)';
          card.style.pointerEvents = show ? 'all' : 'none';
          card.style.display    = 'flex';
        }
      });
    });
  });
}

function initTilt() {
  if (typeof VanillaTilt === 'undefined') return;
  document.querySelectorAll('.project-card').forEach(el => {
    if (el.vanillaTilt) el.vanillaTilt.destroy();
  });
  VanillaTilt.init(document.querySelectorAll('.project-card'), {
    max: 4,
    speed: 600,
    glare: true,
    'max-glare': 0.08,
    gyroscope: false,
  });
}

function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('navbar--scrolled', window.scrollY > 8);
  };

  window.removeEventListener('scroll', navbar._scrollHandler);
  navbar._scrollHandler = onScroll;
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

async function initPage() {
  destroyPage();
  initHeroGSAP();
  initClock();
  initSectionParallax();
  initCounters();
  initScrollspy();
  initActiveNav();
  initSectionLines();
  initCopyEmail();
  initSmoothNav();
  initReadingProgress();
  initProjectFilter();
  initNavbarScroll();

  document.body.classList.remove('page-article', 'page-case-study', 'page-research');
  const page = window.location.pathname.split('/').pop() || 'index.html';
  if (page.includes('article')) document.body.classList.add('page-article');
  if (page.includes('case-study')) document.body.classList.add('page-case-study');
  if (page.includes('research')) document.body.classList.add('page-research');

  if (typeof window.initMagneticButtons === 'function') window.initMagneticButtons();
  if (typeof window.initMarquee === 'function') window.initMarquee();
  if (typeof window.initContent === 'function') await window.initContent();
  if (typeof window.initGithub === 'function' && document.getElementById('github-graph-img-wrap')) {
    window.initGithub();
  }
  if (typeof window.initArticle === 'function' && document.getElementById('markdown-container')) {
    window.initArticle();
  }

  initScrollReveal();

  setTimeout(initTilt, 500);

  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

window.initPage = initPage;

document.addEventListener('DOMContentLoaded', initPage);
