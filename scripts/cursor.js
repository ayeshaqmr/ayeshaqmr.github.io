const cursor = document.querySelector('.custom-cursor');
const cursorInner = document.querySelector('.custom-cursor-inner');

if (!cursor || !cursorInner) {
  /* no cursor elements on page */
} else {
  let mx = 0, my = 0;
  let cx = 0, cy = 0;
  let ix = 0, iy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.opacity = '1';
    cursorInner.style.opacity = '1';
  });

  (function loop() {
    cx += (mx - cx) * 0.08;
    cy += (my - cy) * 0.08;
    ix += (mx - ix) * 0.25;
    iy += (my - iy) * 0.25;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
    cursorInner.style.left = ix + 'px';
    cursorInner.style.top = iy + 'px';
    requestAnimationFrame(loop);
  })();

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorInner.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    cursorInner.style.opacity = '1';
  });

  const hoverTargets = 'a, button, .project-card-item, .skill-tag, .filter-btn, .contact__email-btn, .contact__social-link, .hero__avatar-frame, .stamp';

  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.add('cursor-hover');
      cursorInner.classList.add('cursor-hover');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.remove('cursor-hover');
      cursorInner.classList.remove('cursor-hover');
    }
  });

  cursor.style.opacity = '0';
  cursorInner.style.opacity = '0';
}
