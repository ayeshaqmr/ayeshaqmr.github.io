/* Turns the existing .projects-cards items into a desktop rolodex stack. */
document.addEventListener('DOMContentLoaded', () => {
  const deck = document.querySelector('#projects .projects-cards');
  if (!deck || deck.dataset.rolodexReady) return;

  const cards = [...deck.querySelectorAll('.project-card-item')];
  if (cards.length < 2) return;
  deck.dataset.rolodexReady = 'true';
  deck.classList.add('rolodex-projects');

  let active = 0;
  const controls = document.createElement('div');
  controls.className = 'rolodex-controls';
  controls.innerHTML = `
    <button class="rolodex-control" type="button" data-rolodex="previous" aria-label="Previous project">←</button>
    <span class="rolodex-count" aria-live="polite"></span>
    <button class="rolodex-control" type="button" data-rolodex="next" aria-label="Next project">→</button>`;
  deck.after(controls);
  const count = controls.querySelector('.rolodex-count');

  function paint() {
    cards.forEach((card, index) => {
      const ahead = (index - active + cards.length) % cards.length;
      const behind = (active - index + cards.length) % cards.length;
      const visible = ahead < 5 || behind === 1;
      let x = 0, y = 0, rotate = 0, depth = 1;

      if (ahead === 0) {
        depth = 10;
      } else if (ahead < 5) {
        x = ahead * 28;
        y = ahead * 22;
        rotate = ahead * 1.8;
        depth = 10 - ahead;
      } else if (behind === 1) {
        x = -48;
        y = 36;
        rotate = -4;
        depth = 1;
      }

      card.style.setProperty('--x', `${x}px`);
      card.style.setProperty('--y', `${y}px`);
      card.style.setProperty('--rotate', `${rotate}deg`);
      card.style.setProperty('--depth', depth);
      card.classList.toggle('is-active', ahead === 0);
      card.classList.toggle('is-hidden', !visible);
      card.setAttribute('aria-hidden', ahead === 0 ? 'false' : 'true');
    });
    count.textContent = `${String(active + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
  }

  function move(by) {
    active = (active + by + cards.length) % cards.length;
    paint();
  }

  controls.addEventListener('click', event => {
    const action = event.target.closest('[data-rolodex]')?.dataset.rolodex;
    if (action) move(action === 'next' ? 1 : -1);
  });

  deck.addEventListener('click', event => {
    const card = event.target.closest('.project-card-item');
    const index = cards.indexOf(card);
    if (index >= 0 && index !== active) {
      event.preventDefault();
      active = index;
      paint();
    }
  });

  paint();
});
