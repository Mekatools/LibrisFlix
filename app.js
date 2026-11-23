/* ====================================================================
   LIBRISFLIX FAST-STREAM APPLICATION ENGINE (app.js)
   Clean single-player stream, smooth auto-hiding top bar, responsive UI
   ==================================================================== */

(function () {
  'use strict';

  const DEFAULTS = { accent: '', quality: 'fast', speed: 1, autoNext: true, cardSize: 'medium' };
  let SETTINGS = Object.assign({}, DEFAULTS);
  try { Object.assign(SETTINGS, JSON.parse(localStorage.getItem('librisflix_settings') || '{}')); } catch (e) {}

  const STATE = {
    movies: [],
    currentMovie: null,
    activeTab: 'home',
    myList: JSON.parse(localStorage.getItem('librisflix_mylist') || '[]'),
    continueWatching: JSON.parse(localStorage.getItem('librisflix_continue') || '{}'),
    watchHistory: JSON.parse(localStorage.getItem('librisflix_history') || '[]'),
    liveRows: {},
    nextCountdownTimer: null,
    lastSave: 0,
    controlsHideTimeout: null
  };

  const DOM = {
    loadingScreen: document.getElementById('loading-screen'),
    loaderLogo: document.getElementById('loader-logo'),
    loaderStatus: document.getElementById('loader-status'),
    siteFavicon: document.getElementById('site-favicon'),
    navbar: document.getElementById('navbar'),
    navLogo: document.getElementById('nav-logo'),
    footerLogo: document.getElementById('footer-logo'),
    footerTagline: document.getElementById('footer-tagline'),
    myListCounter: document.getElementById('my-list-counter'),
    drawerMyListCounter: document.getElementById('drawer-my-list-counter'),
    mobileMenuToggle: document.getElementById('mobile-menu-toggle'),
    mobileDrawer: document.getElementById('mobile-drawer'),
    mobileDrawerOverlay: document.getElementById('mobile-drawer-overlay'),
    drawerCloseBtn: document.getElementById('drawer-close-btn'),
    searchInput: document.getElementById('global-search-input'),
    clearSearchBtn: document.getElementById('clear-search-btn'),
    heroBanner: document.getElementById('hero-banner'),
    heroBackdrop: document.getElementById('hero-backdrop'),
    heroTitle: document.getElementById('hero-title'),
    heroAuthor: document.getElementById('hero-author'),
    heroYear: document.getElementById('hero-year'),
    heroDuration: document.getElementById('hero-duration'),
    heroDesc: document.getElementById('hero-desc'),
    heroPlayBtn: document.getElementById('hero-play-btn'),
    heroInfoBtn: document.getElementById('hero-info-btn'),
    heroBookBtn: document.getElementById('hero-book-btn'),
    rowsContainer: document.getElementById('rows-container'),
    catalogView: document.getElementById('catalog-view'),
    catalogGrid: document.getElementById('catalog-grid'),
    catalogTitle: document.getElementById('catalog-view-title'),
    catalogEmptyMsg: document.getElementById('catalog-empty-msg'),
    filterGenre: document.getElementById('filter-genre'),
    filterAuthor: document.getElementById('filter-author'),
    filterEra: document.getElementById('filter-era'),
    filterSort: document.getElementById('filter-sort'),
    detailModal: document.getElementById('detail-modal'),
    modalBackdrop: document.getElementById('modal-backdrop'),
    modalTitle: document.getElementById('modal-title'),
    modalYear: document.getElementById('modal-year'),
    modalDuration: document.getElementById('modal-duration'),
    modalEra: document.getElementById('modal-era'),
    modalDesc: document.getElementById('modal-desc'),
    modalOrigBook: document.getElementById('modal-orig-book'),
    modalAuthor: document.getElementById('modal-author'),
    modalGenres: document.getElementById('modal-genres'),
    modalLang: document.getElementById('modal-lang'),
    modalTags: document.getElementById('modal-tags'),
    modalPlayBtn: document.getElementById('modal-play-btn'),
    modalListToggle: document.getElementById('modal-list-toggle'),
    modalBookBtn: document.getElementById('modal-book-btn'),
    modalRelatedGrid: document.getElementById('modal-related-grid'),
    modalCloseBtn: document.getElementById('modal-close-btn'),
    playerOverlay: document.getElementById('player-overlay'),
    playerCanvasContainer: document.getElementById('player-canvas-container'),
    playerTitle: document.getElementById('player-title'),
    playerSubtitle: document.getElementById('player-subtitle'),
    playerBackBtn: document.getElementById('player-back-btn'),
    playerError: document.getElementById('player-error'),
    playerErrorRetry: document.getElementById('player-error-retry'),
    reportBrokenBtn: document.getElementById('report-broken-btn'),
    playerNextOverlay: document.getElementById('player-next-overlay'),
    nextTitle: document.getElementById('next-title'),
    nextAuthor: document.getElementById('next-author'),
    nextCountdown: document.getElementById('next-countdown'),
    playNextBtn: document.getElementById('play-next-btn'),
    cancelNextBtn: document.getElementById('cancel-next-btn'),
    shortcutsModal: document.getElementById('shortcuts-modal'),
    shortcutsBtn: document.getElementById('shortcuts-btn'),
    shortcutsCloseBtn: document.getElementById('shortcuts-close-btn')
  };

  async function initApp() {
    ['https://archive.org', 'https://ia800000.us.archive.org'].forEach(u => {
      const l = document.createElement('link'); l.rel = 'preconnect'; l.href = u; document.head.appendChild(l);
    });
    applyBranding();
    try { applySettings(); buildSettingsUI(); } catch (e) { console.warn('Settings failed:', e); }
    updateMyListCounter();
    bindGlobalEvents();

    try {
      const response = await fetch('movies.json');
      if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to load catalog.`);
      STATE.movies = await response.json();

      populateFilterOptions();
      setupHeroBanner();
      renderHomeRows();
      finishLoading();

      loadLiveRows().then(() => {
        populateFilterOptions();
        if (STATE.activeTab === 'home') renderHomeRows();
        else if (STATE.activeTab === 'catalog') handleFilterChange();
      }).catch(err => console.warn('Live rows failed:', err));
    } catch (err) {
      console.error(err);
      DOM.loaderStatus.innerHTML = `<span style="color:#e50914">Failed to load movie catalog.</span><br><small>${err.message}</small>`;
    }
  }

  function applyBranding() {
    if (SITE_CONFIG.theme) {
      const root = document.documentElement;
      if (SITE_CONFIG.theme.primaryRed) root.style.setProperty('--primary-red', SITE_CONFIG.theme.primaryRed);
      if (SITE_CONFIG.theme.darkBg) root.style.setProperty('--dark-bg', SITE_CONFIG.theme.darkBg);
      if (SITE_CONFIG.theme.cardBg) root.style.setProperty('--card-bg', SITE_CONFIG.theme.cardBg);
      if (SITE_CONFIG.theme.textLight) root.style.setProperty('--text-light', SITE_CONFIG.theme.textLight);
      if (SITE_CONFIG.theme.accentGold) root.style.setProperty('--accent-gold', SITE_CONFIG.theme.accentGold);
    }

    const yrEl = document.getElementById('current-year');
    if (yrEl) yrEl.textContent = new Date().getFullYear();

    if (DOM.footerTagline && SITE_CONFIG.tagline) {
      DOM.footerTagline.textContent = SITE_CONFIG.tagline;
    }

    if (SITE_CONFIG.showLogoImage && SITE_CONFIG.logoImage) {
      const logoHtml = `<img src="${SITE_CONFIG.logoImage}" alt="${SITE_CONFIG.siteName}">`;
      const nameHtml = `<span class="logo-text">${SITE_CONFIG.logoText || SITE_CONFIG.siteName}</span>`;
      DOM.navLogo.innerHTML = logoHtml + nameHtml;
      DOM.loaderLogo.innerHTML = logoHtml;
      DOM.footerLogo.innerHTML = logoHtml + nameHtml;
      DOM.siteFavicon.type = 'image/png';
      DOM.siteFavicon.href = SITE_CONFIG.logoImage;
    } else {
      const text = SITE_CONFIG.logoText || SITE_CONFIG.siteName;
      DOM.navLogo.textContent = text;
      DOM.loaderLogo.textContent = text;
      DOM.footerLogo.textContent = text;
    }
  }

  function finishLoading() {
    setTimeout(() => {
      DOM.loadingScreen.classList.add('fade-out');
      setTimeout(() => {
        DOM.loadingScreen.style.display = 'none';
      }, 400);
    }, 250);
  }

  function setupHeroBanner() {
    if (!STATE.movies.length) return;
    const featured = STATE.movies.find(m => m.id === SITE_CONFIG.featuredId) || STATE.movies[0];
    updateHero(featured);
  }

  function updateHero(movie) {
    const posterImg = movie.backdrop || movie.poster;
    DOM.heroBackdrop.style.backgroundImage = `url('${posterImg}')`;
    DOM.heroTitle.textContent = movie.title;
    DOM.heroAuthor.textContent = `By ${movie.author}`;
    DOM.heroYear.textContent = movie.year;
    DOM.heroDuration.textContent = movie.duration;
    DOM.heroDesc.textContent = movie.description;

    DOM.heroPlayBtn
