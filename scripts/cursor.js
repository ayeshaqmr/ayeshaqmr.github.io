const dot       = document.querySelector('.cursor-dot');
const ring      = document.querySelector('.cursor-ring');
const spotlight = document.querySelector('.cursor-spotlight');

if (!dot || !ring) {  }
else {

  let mx = 0, my = 0, rx = 0, ry = 0;

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
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
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

  const targets = 'a, button, .project-card, .skill-tag, .tag, .filter-btn, .contact__email-btn, .uses-item, .note-item, .cert-item';

  document.addEventListener('mouseover', e => {
    if (e.target.closest(targets)) {
      dot.classList.add('hovering');
      ring.classList.add('hovering');
    }
  });

  document.addEventListener('mouseout', e => {
    if (e.target.closest(targets)) {
      dot.classList.remove('hovering');
      ring.classList.remove('hovering');
    }
  });

  dot.style.opacity  = '0';
  ring.style.opacity = '0';
  document.addEventListener('mousemove', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  }, { once: true });
}
