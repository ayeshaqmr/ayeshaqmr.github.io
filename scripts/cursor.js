const dot       = document.querySelector('.cursor-dot');
const ring      = document.querySelector('.cursor-ring');
const spotlight = document.querySelector('.cursor-spotlight');

if (!dot || !ring) {  }
else {

  let mx = 0, my = 0, rx = 0, ry = 0;
  let hovering = false;
  let magnetX = 0, magnetY = 0;
  let currentType = '';

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;

    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';

    if (spotlight) {
      spotlight.style.left = mx + 'px';
      spotlight.style.top  = my + 'px';
      spotlight.style.opacity = '1';
    }
  });

  (function loop() {
    if (hovering) {
      magnetX += (mx - magnetX) * 0.15;
      magnetY += (my - magnetY) * 0.15;
      rx += (magnetX - rx) * 0.1;
      ry += (magnetY - ry) * 0.1;
    } else {
      magnetX = mx;
      magnetY = my;
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
    }
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(loop);
  })();

  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
    if (spotlight) spotlight.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });

  const cursorTypes = [
    { selector: '.project-card-item',                       cls: 'cursor-card' },
    { selector: '.hero__avatar-frame, .navbar__avatar',      cls: 'cursor-profile' },
    { selector: '.contact__email-btn, .contact__social-link, .contact__card', cls: 'cursor-contact' },
    { selector: '.skill-tag, .tag',                          cls: 'cursor-skill' },
    { selector: 'button, .filter-btn, .btn',                 cls: 'cursor-btn' },
  ];

  const defaultCls = 'hovering';

  function clearCursorClasses() {
    dot.className = 'cursor-dot';
    ring.className = 'cursor-ring';
    currentType = '';
  }

  function applyCursorType(el) {
    clearCursorClasses();
    for (const t of cursorTypes) {
      if (el.closest(t.selector)) {
        dot.classList.add(defaultCls, t.cls);
        ring.classList.add(defaultCls, t.cls);
        currentType = t.cls;
        return;
      }
    }
    dot.classList.add(defaultCls);
    ring.classList.add(defaultCls);
  }

  document.addEventListener('mouseover', e => {
    const target = e.target.closest('a, button, .project-card-item, .skill-tag, .tag, .filter-btn, .contact__email-btn, .uses-item, .cert-item, .hero__avatar-frame');
    if (target) {
      hovering = true;
      applyCursorType(target);
      if (spotlight) spotlight.classList.add('hovering');
    }
  });

  document.addEventListener('mouseout', e => {
    const target = e.target.closest('a, button, .project-card-item, .skill-tag, .tag, .filter-btn, .contact__email-btn, .uses-item, .cert-item, .hero__avatar-frame');
    if (target) {
      hovering = false;
      clearCursorClasses();
      if (spotlight) spotlight.classList.remove('hovering');
    }
  });

  dot.style.opacity  = '0';
  ring.style.opacity = '0';
  document.addEventListener('mousemove', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  }, { once: true });
}
