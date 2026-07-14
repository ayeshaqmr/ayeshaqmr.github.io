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
    '.reveal-scale',
    '.reveal-up',
    '.reveal-stagger',
    '.experience-row',
    '.section-line',
    '.page-hero__line',
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
    const inner = section.querySelector(':scope > .section-header + *') ||
                  section.querySelector(':scope > div');
    if (!inner) return;

    gsap.fromTo(inner,
      { y: 40 },
      {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        }
      }
    );
  });

  document.querySelectorAll('.stat-card').forEach((card) => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, { scale: 1.05, duration: 0.3, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { scale: 1, duration: 0.3, ease: 'power2.out' });
    });
  });

  document.querySelectorAll('.section-label').forEach(label => {
    gsap.fromTo(label,
      { y: 20 },
      {
        y: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: label,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
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
        el.textContent = Math.floor(ease * target) + suffix;
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
  const navLinks = document.querySelectorAll('.navbar-drawer__list a[href^="#"]');
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

function initScrollIndicator() {
  const thumb = document.querySelector('.scroll-indicator__thumb');
  if (!thumb) return;
  const update = () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const progress = total > 0 ? window.scrollY / total : 0;
    const trackHeight = thumb.parentElement.offsetHeight;
    const thumbHeight = thumb.offsetHeight;
    const maxTranslate = trackHeight - thumbHeight;
    thumb.style.transform = `translateY(${progress * maxTranslate}px)`;
  };
  window.removeEventListener('scroll', thumb._scrollHandler);
  thumb._scrollHandler = update;
  window.addEventListener('scroll', update, { passive: true });
  update();
}

function initProjectFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card-item[data-category]');
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

function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const onScroll = () => {
    const scrolled = window.scrollY > 8;
    navbar.classList.toggle('navbar--scrolled', scrolled);
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
  initSectionLines();
  initCopyEmail();
  initSmoothNav();
  initScrollIndicator();
  initProjectFilter();
  initNavbarScroll();

  if (typeof window.initMagneticButtons === 'function') window.initMagneticButtons();
  if (typeof window.initMarquee === 'function') window.initMarquee();
  if (typeof window.initContent === 'function') await window.initContent();
  if (typeof window.initGithub === 'function' && document.getElementById('github-graph-img-wrap')) {
    window.initGithub();
  }

  initScrollReveal();

  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

window.initPage = initPage;

document.addEventListener('DOMContentLoaded', initPage);
