const cursor = document.querySelector('.custom-cursor');

if (!cursor) {
  /* no cursor element on page */
} else {
  let mx = 0, my = 0;
  let cx = 0, cy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.opacity = '1';
  });

  (function loop() {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
    requestAnimationFrame(loop);
  })();

  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });

  const hoverTargets = 'a, button, .project-card-item, .skill-tag, .filter-btn, .contact__email-btn, .contact__social-link, .hero__avatar-frame, .cassette';

  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) cursor.classList.add('cursor-hover');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) cursor.classList.remove('cursor-hover');
  });

  cursor.style.opacity = '0';
}
