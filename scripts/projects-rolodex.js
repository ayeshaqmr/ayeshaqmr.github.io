/* Layer the existing project cards as tabs, preserving the mobile grid. */
document.addEventListener('DOMContentLoaded', () => {
  const stack = document.querySelector('#projects .projects-cards');
  if (!stack || stack.dataset.stackReady) return;

  const cards = [...stack.querySelectorAll('.project-card-item')];
  if (cards.length < 2) return;
  stack.dataset.stackReady = 'true';
  stack.classList.add('project-stack');

  const tabColors = ['#ef4444', '#f59e0b', '#4f46e5', '#a855f7', '#0ea5a4'];
  cards.forEach((card, index) => card.style.setProperty('--tab-color', tabColors[index % tabColors.length]));

  let active = 0;
  const controls = document.createElement('div');
  controls.className = 'stack-controls';
  controls.innerHTML = `
    <button class="stack-control" type="button" data-stack="previous" aria-label="Previous project">←</button>
    <span class="stack-count" aria-live="polite"></span>
    <button class="stack-control" type="button" data-stack="next" aria-label="Next project">→</button>`;
  stack.after(controls);
  const count = controls.querySelector('.stack-count');

  function renderStack() {
    cards.forEach((card, index) => {
      const distance = (index - active + cards.length) % cards.length;
      const visible = distance < 4;
      const y = distance === 0 ? 90 : (3 - distance) * 30;
      card.style.setProperty('--stack-y', `${y}px`);
      card.style.setProperty('--stack-z', distance === 0 ? 10 : 5 - distance);
      card.classList.toggle('is-active', distance === 0);
      card.classList.toggle('is-hidden', !visible);
      card.setAttribute('aria-hidden', distance === 0 ? 'false' : 'true');
    });
    count.textContent = `${String(active + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
  }

  controls.addEventListener('click', (event) => {
    const action = event.target.closest('[data-stack]')?.dataset.stack;
    if (!action) return;
    active = (active + (action === 'next' ? 1 : -1) + cards.length) % cards.length;
    renderStack();
  });

  renderStack();
});
