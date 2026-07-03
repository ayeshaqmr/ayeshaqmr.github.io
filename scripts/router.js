(function () {
  let isNavigating = false;

  function getPagePath() {
    const path = window.location.pathname.split('/').pop();
    return path || 'index.html';
  }

  function isInternalHtmlLink(link) {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('javascript') || href.startsWith('tel:')) return false;
    if (link.hasAttribute('download') || link.target === '_blank') return false;
    return href.includes('.html') || href === '/' || href === '';
  }

  function normalizeHref(href) {
    if (href === '/' || href === '') return 'index.html';
    return href.split('#')[0];
  }

  function fadeOverlay(from, to) {
    return new Promise(resolve => {
      const overlay = document.querySelector('.page-transition-overlay');
      if (!overlay) return resolve();
      if (typeof gsap === 'undefined') {
        overlay.classList.toggle('active', to === 1);
        return resolve();
      }
      gsap.set(overlay, { opacity: from, display: 'block', pointerEvents: 'all' });
      gsap.to(overlay, { opacity: to, duration: 0.3, ease: 'power2.inOut', onComplete: () => {
        if (to === 0) {
          gsap.set(overlay, { pointerEvents: 'none' });
        }
        resolve();
      }});
    });
  }

  async function navigateTo(href, pushState = true) {
    if (isNavigating) return;
    isNavigating = true;

    const url = new URL(href, window.location.href);
    const fetchUrl = url.pathname.split('/').pop() || 'index.html';
    const fullUrl = fetchUrl + url.search;

    await fadeOverlay(0, 1);

    try {
      const response = await fetch(fullUrl);
      if (!response.ok) throw new Error('Page not found');

      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const newMain = doc.querySelector('main.main-content');
      const currentMain = document.querySelector('main.main-content');

      if (!newMain || !currentMain) throw new Error('Main content not found');

      currentMain.replaceWith(newMain.cloneNode(true));

      if (doc.title) document.title = doc.title;

      document.body.classList.remove('page-article', 'page-case-study', 'page-research');
      if (fetchUrl.includes('article')) document.body.classList.add('page-article');
      if (fetchUrl.includes('case-study')) document.body.classList.add('page-case-study');
      if (fetchUrl.includes('research')) document.body.classList.add('page-research');

      if (pushState) {
        history.pushState({ spa: true }, '', fullUrl);
      }

      if (typeof window.initPage === 'function') {
        window.initPage();
      }

      window.scrollTo(0, 0);
    } catch {
      window.location.href = href;
    } finally {
      await fadeOverlay(1, 0);
      isNavigating = false;
    }
  }

  function handleLinkClick(e) {
    const link = e.target.closest('a[href]');
    if (!link || !isInternalHtmlLink(link)) return;

    const href = link.getAttribute('href');
    if (href.startsWith('#')) return;

    e.preventDefault();
    navigateTo(href);
  }

  window.addEventListener('popstate', () => {
    const path = getPagePath();
    const search = window.location.search;
    navigateTo(path + search, false);
  });

  document.addEventListener('click', handleLinkClick);

  window.navigateTo = navigateTo;
})();
