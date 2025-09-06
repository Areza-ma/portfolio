/* ===============================
   Portfolio Hamari Anir — JS NASA-like
   =============================== */
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Portfolio initialisé');

  /* ---------------------------------
   * 0) Helpers & flags
   * --------------------------------- */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------
   * 1) Animations au scroll (IntersectionObserver)
   *    -> désactivées si prefers-reduced-motion
   * --------------------------------- */
  if (!prefersReduced && 'IntersectionObserver' in window) {
    const animatedItems = document.querySelectorAll('.animate');
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      }
    }, { threshold: 0.2 });
    animatedItems.forEach(el => io.observe(el));
  } else {
    // accessibilité : tout visible immédiatement
    document.querySelectorAll('.animate').forEach(el => el.classList.add('visible'));
  }

  /* ---------------------------------
   * 2) Menu mobile accessible
   * --------------------------------- */
  const nav = document.querySelector('.primary-nav');
  const navToggle = document.querySelector('.nav-toggle');
  if (nav && navToggle) {
    navToggle.addEventListener('click', () => {
      const open = nav.getAttribute('data-open') === 'true';
      nav.setAttribute('data-open', String(!open));
      navToggle.setAttribute('aria-expanded', String(!open));
    });

    // Fermer au clic extérieur / sur lien
    document.addEventListener('click', (e) => {
      const clickedInside = e.target.closest('.primary-nav') || e.target.closest('.nav-toggle');
      if (!clickedInside && nav.getAttribute('data-open') === 'true') {
        nav.setAttribute('data-open', 'false');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        if (nav.getAttribute('data-open') === 'true') {
          nav.setAttribute('data-open', 'false');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  /* ---------------------------------
   * 3) Thème : système ↔︎ sombre ↔︎ clair
   *    - fonctionne avec body.dark ET data-theme
   * --------------------------------- */
  const THEME_KEY = 'pref-theme'; // 'system' | 'dark' | 'light'
  const themeBtn = document.getElementById('dark-mode-toggle');

  function themeLabel(mode) {
    if (mode === 'dark') return '🌙 Mode dark';
    if (mode === 'light') return '☀️ Mode light';
    return '🖥️ Mode system';
  }
  function applyTheme(mode) {
    // compat ancien CSS (body.dark) + nouveau (data-theme)
    document.body.classList.toggle('dark', mode === 'dark');
    document.body.setAttribute('data-theme', mode);
    localStorage.setItem(THEME_KEY, mode);
    if (themeBtn) {
      themeBtn.textContent = themeLabel(mode);
      themeBtn.setAttribute('aria-pressed', mode === 'dark' ? 'true' : 'false');
      themeBtn.title = 'Changer le thème (system → dark → light)';
    }
  }
  function nextTheme(mode) {
    return mode === 'system' ? 'dark' : mode === 'dark' ? 'light' : 'system';
  }

  const savedTheme = localStorage.getItem(THEME_KEY) || 'system';
  applyTheme(savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const curr = document.body.getAttribute('data-theme') || 'system';
      applyTheme(nextTheme(curr));
    });
  }

  /* ---------------------------------
   * 4) Lightbox minimaliste (images .lightbox)
   * --------------------------------- */
  const lightboxImgs = document.querySelectorAll('img.lightbox, .project-img.lightbox');
  if (lightboxImgs.length) {
    const overlay = document.createElement('div');
    overlay.id = 'lightbox-overlay';
    Object.assign(overlay.style, {
      position: 'fixed', inset: '0', background: 'rgba(0,0,0,.9)',
      display: 'grid', placeItems: 'center', zIndex: '1000',
      visibility: 'hidden', opacity: '0', transition: 'opacity .25s ease'
    });
    const img = document.createElement('img');
    Object.assign(img.style, { maxWidth: '92%', maxHeight: '92%', borderRadius: '12px' });
    overlay.appendChild(img);
    document.body.appendChild(overlay);

    function open(src, alt='') {
      img.src = src; img.alt = alt || '';
      overlay.style.visibility = 'visible';
      requestAnimationFrame(() => { overlay.style.opacity = '1'; });
      document.addEventListener('keydown', onKey);
    }
    function close() {
      overlay.style.opacity = '0';
      setTimeout(() => { overlay.style.visibility = 'hidden'; img.src = ''; }, 200);
      document.removeEventListener('keydown', onKey);
    }
    function onKey(e) { if (e.key === 'Escape') close(); }

    lightboxImgs.forEach(el => {
      el.style.cursor = 'zoom-in';
      el.addEventListener('click', () => open(el.currentSrc || el.src, el.alt));
    });
    overlay.addEventListener('click', close);
  }

  /* ---------------------------------
   * 5) Formulaire de contact (feedback UX)
   * --------------------------------- */
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // Tu peux remplacer ce bloc par une vraie intégration (EmailJS, Formspree, backend…)
      alert('📨 Merci pour votre message ! Je vous réponds dès que possible.');
      form.reset();
    });
  }

  /* ---------------------------------
   * 6) Filtres de projets (data-filter / data-tags)
   *    -> compatibles avec le HTML optimisé des projets
   * --------------------------------- */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-filter]');
    if (!btn) return;
    const tag = btn.getAttribute('data-filter');
    const cards = document.querySelectorAll('article.project');
    cards.forEach(card => {
      const tags = (card.getAttribute('data-tags') || '').split(',').map(s => s.trim());
      card.style.display = (tag === 'all' || tags.includes(tag)) ? '' : 'none';
    });
    // état visuel actif (optionnel)
    document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });

  /* ---------------------------------
   * 7) Lien d’évitement (skip-link) — focus vers #contenu
   * --------------------------------- */
  const skip = document.querySelector('.skip-link');
  const main = document.querySelector('#contenu');
  if (skip && main) {
    skip.addEventListener('click', () => {
      main.setAttribute('tabindex', '-1');
      main.focus();
      // nettoie après focus pour éviter tab stop permanent
      setTimeout(() => main.removeAttribute('tabindex'), 300);
    });
  }
});
