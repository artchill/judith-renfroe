/* =========================================================
   Judith Renfroe — Author Website JS
   Handles:
     • SPA navigation (show/hide page sections)
     • Theme toggle (light/dark) with persistence
     • Mobile menu toggle
     • Contact form submission (front-end feedback)
     • Footer year update
   ========================================================= */

(function () {
  'use strict';

  /* ---------------------------------------------
     1. SPA NAVIGATION
     --------------------------------------------- */
  const pages       = document.querySelectorAll('.page');
  const navLinks    = document.querySelectorAll('[data-link]');
  const topNavLinks = document.querySelectorAll('.nav-links a');

  /**
   * Show the page with the given id, hide all others, and
   * sync active state on top-nav links.
   */
  function showPage(id) {
    const target = document.getElementById(id);
    if (!target) return;

    pages.forEach((p) => p.classList.remove('page--active'));
    target.classList.add('page--active');

    // Update active top-nav highlight
    topNavLinks.forEach((a) => {
      const linkId = a.getAttribute('data-link');
      a.classList.toggle('active', linkId === id);
    });

    // Scroll to top of new page for cleaner UX
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update URL hash without triggering jump
    history.replaceState(null, '', '#' + id);

    // Close mobile menu if open
    closeMobileMenu();
  }

  // Wire every element with [data-link] to act as a tab
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = link.getAttribute('data-link');
      showPage(id);
    });
  });

  // Honor initial hash so a deep-link (e.g. site.com/#books) opens the right tab
  function loadInitialPage() {
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById(hash)) {
      showPage(hash);
    } else {
      showPage('home');
    }
  }

  /* ---------------------------------------------
     2. THEME TOGGLE
     --------------------------------------------- */
  const themeToggle = document.getElementById('theme-toggle');
  const root        = document.documentElement;
  const STORAGE_KEY = 'jr-theme';

  /**
   * Apply theme by setting data-theme on <html>.
   * Smooth color transitions are handled in CSS.
   */
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (_) { /* ignore quota / privacy */ }
  }

  function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (_) { /* ignore */ }
    if (saved === 'light' || saved === 'dark') {
      applyTheme(saved);
      return;
    }
    // Respect OS preference on first visit
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }

  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') || 'light';
    applyTheme(current === 'light' ? 'dark' : 'light');
  });

  /* ---------------------------------------------
     3. MOBILE MENU
     --------------------------------------------- */
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu    = document.getElementById('primary-menu');

  function closeMobileMenu() {
    if (!navMenu || !menuToggle) return;
    navMenu.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // Close mobile menu if window is resized to desktop width
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 720) closeMobileMenu();
    }, 120);
  });

  /* ---------------------------------------------
     4. CONTACT FORM
     --------------------------------------------- */
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic native validation
      if (!form.checkValidity()) {
        status.textContent = 'Please complete all fields before sending.';
        status.style.color = 'crimson';
        form.reportValidity();
        return;
      }

      // In a real deployment, replace this with a fetch() to your backend
      // (e.g. Netlify Forms, Formspree, a serverless endpoint, etc.).
      status.textContent = 'Thank you — your message has been sent. ✨';
      status.style.color = '';
      form.reset();

      // Clear status after a moment
      setTimeout(() => { status.textContent = ''; }, 5000);
    });
  }

  /* ---------------------------------------------
     5. FOOTER YEAR
     --------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------
     6. INIT
     --------------------------------------------- */
  initTheme();
  loadInitialPage();

  // Handle browser back/forward through hash changes
  window.addEventListener('hashchange', loadInitialPage);
})();
