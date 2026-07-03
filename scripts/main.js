function initMagneticButtons() {
  document.querySelectorAll('.btn-magnetic').forEach(wrap => {
    if (wrap.dataset.magneticBound) return;
    wrap.dataset.magneticBound = 'true';
    const btn = wrap.querySelector('.btn') || wrap;
    wrap.addEventListener('mousemove', e => {
      const rect   = wrap.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) * 0.35;
      const dy     = (e.clientY - cy) * 0.35;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    wrap.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
      btn.style.transition = 'transform 0.5s var(--ease-expo)';
      setTimeout(() => { btn.style.transition = ''; }, 500);
    });
  });
}

window.initMagneticButtons = initMagneticButtons;

function initMobileNav() {
  const burger = document.querySelector('[data-burger]');
  const drawer = document.querySelector('[data-drawer]');
  if (!burger || !drawer) return;

  const close = () => {
    drawer.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('nav-open');
  };

  const open = () => {
    drawer.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('nav-open');
  };

  burger.addEventListener('click', () => {
    drawer.classList.contains('open') ? close() : open();
  });

  drawer.querySelector('[data-drawer-close]')?.addEventListener('click', close);

  document.querySelectorAll('.navbar-drawer__list a').forEach(link => {
    link.addEventListener('click', close);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });
}

function initTheme() {
  document.documentElement.setAttribute('data-theme', 'dark');
}

function initMarquee() {
  document.querySelectorAll('.marquee-section').forEach(section => {
    if (section.dataset.ready) return;

    const content = section.querySelector('.marquee-content');
    const track = section.querySelector('.marquee-track');
    if (!content || !track) return;

    const clone = track.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    content.appendChild(clone);
    section.dataset.ready = 'true';
  });
}

window.initMarquee = initMarquee;

function initLazyImages() {
  const imgs = document.querySelectorAll('img[loading="lazy"]');
  if ('loading' in HTMLImageElement.prototype) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const img = e.target;
        img.src = img.dataset.src || img.src;
        obs.unobserve(img);
      }
    });
  });
  imgs.forEach(img => obs.observe(img));
}

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initTheme();
  initLazyImages();
});
