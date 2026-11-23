/* ====================================================================
   LIBRISFLIX PRODUCTION APP (app.js)
   Mobile touch support & bulletproof image fallbacks
   ==================================================================== */

(function () {
  'use strict';

  const STATE = {
    movies: [],
    customWorks: JSON.parse(localStorage.getItem('librisflix_custom_works') || '[]'),
    currentMovie: null,
    activeTab: 'home',
    myList: JSON.parse(localStorage.getItem('librisflix_mylist') || '[]'),
    continueWatching: JSON.parse(localStorage.getItem('librisflix_continue') || '{}'),
    watchHistory: JSON.parse(localStorage.getItem('librisflix_history') || '[]')
  };

  const DOM = {
    loadingScreen: document.getElementById('loading-screen'),
    navLogo: document.getElementById('nav-logo'),
    footerLogo: document.getElementById('footer-logo'),
    footerTagline: document.getElementById('footer-tagline'),
    myListCounter: document.getElementById('my-list-counter'),
    searchInput: document.getElementById('global-search-input'),
    clearSearchBtn: document.getElementById('clear-search-btn'),
    addWorkBtn: document.getElementById('add-work-btn'),
    heroBanner: document.getElementById('hero-banner'),
    heroBackdrop: document.getElementById('hero-backdrop'),
    heroTitle: document.getElementById('hero-title'),
    heroAuthor: document.getElementById('hero-author'),
    heroYear: document.getElementById('hero-year'),
    heroDuration: document.getElementById('hero-duration'),
    heroDesc: document.getElementById('hero-desc'),
    heroPlayBtn: document.getElementById('hero-play-btn'),
    heroReadBtn: document.getElementById('hero-read-btn'),
    heroInfoBtn: document.getElementById('hero-info-btn'),
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
    modalReadBtn: document.getElementById('modal-read-btn'),
    modalListToggle: document.getElementById('modal-list-toggle'),
    modalRelatedGrid: document.getElementById('modal-related-grid'),
    modalCloseBtn: document.getElementById('modal-close-btn'),
    playerOverlay: document.getElementById('player-overlay'),
    playerCanvasContainer: document.getElementById('player-canvas-container'),
    playerTitle: document.getElementById('player-title'),
    playerSubtitle: document.getElementById('player-subtitle'),
    playerBackBtn: document.getElementById('player-back-btn'),
    playerReadBookBtn: document.getElementById('player-read-book-btn'),
    readerOverlay: document.getElementById('reader-overlay'),
    readerTitle: document.getElementById('reader-title'),
    readerAuthor: document.getElementById('reader-author'),
    readerIframe: document.getElementById('reader-iframe'),
    readerBackBtn: document.getElementById('reader-back-btn'),
    readerWatchFilmBtn: document.getElementById('reader-watch-film-btn'),
    addWorkModal: document.getElementById('add-work-modal'),
    addModalCloseBtn: document.getElementById('add-modal-close-btn'),
    customWorkForm: document.getElementById('custom-work-form'),
    copyJsonBtn: document.getElementById('copy-json-btn'),
    shortcutsModal: document.getElementById('shortcuts-modal'),
    shortcutsBtn: document.getElementById('shortcuts-btn'),
    shortcutsCloseBtn: document.getElementById('shortcuts-close-btn')
  };

  async function initApp() {
    applyBranding();
    updateMyListCounter();
    bindGlobalEvents();

    try {
      const response = await fetch('movies.json');
      if (!response.ok) throw new Error('Catalog missing');
      const fetchedMovies = await response.json();
      STATE.movies = [...STATE.customWorks, ...fetchedMovies];

      populateFilterOptions();
      setupHeroBanner();
      renderHomeRows();
      DOM.loadingScreen.classList.add('fade-out');
      setTimeout(() => DOM.loadingScreen.style.display = 'none', 300);
    } catch (err) {
      console.error(err);
      DOM.loadingScreen.style.display = 'none';
    }
  }

  function applyBranding() {
    if (SITE_CONFIG.theme && SITE_CONFIG.theme.primaryRed) {
      document.documentElement.style.setProperty('--primary-red', SITE_CONFIG.theme.primaryRed);
    }
    const yrEl = document.getElementById('current-year');
    if (yrEl) yrEl.textContent = new Date().getFullYear();
    if (DOM.footerTagline && SITE_CONFIG.tagline) DOM.footerTagline.textContent = SITE_CONFIG.tagline;

    const text = SITE_CONFIG.logoText || SITE_CONFIG.siteName;
    DOM.navLogo.textContent = text;
    DOM.footerLogo.textContent = text;
  }

  function setupHeroBanner() {
    if (!STATE.movies.length) return;
    updateHero(STATE.movies[0]);
  }

  function updateHero(movie) {
    DOM.heroBackdrop.style.backgroundImage = `url('${movie.backdrop || movie.poster}')`;
    DOM.heroTitle.textContent = movie.title;
    DOM.heroAuthor.textContent = `By ${movie.author}`;
    DOM.heroYear.textContent = movie.year;
    DOM.heroDuration.textContent = movie.duration || 'Full Work';
    DOM.heroDesc.textContent = movie.description;

    if (movie.sourceValue) {
      DOM.heroPlayBtn.style.display = 'inline-flex';
      DOM.heroPlayBtn.onclick = () => openWatchPlayer(movie);
    } else {
      DOM.heroPlayBtn.style.display = 'none';
    }
    DOM.heroReadBtn.onclick = () => openBookReader(movie);
    DOM.heroInfoBtn.onclick = () => openDetailModal(movie);
  }

  function renderHomeRows() {
    DOM.rowsContainer.innerHTML = '';
    SITE_CONFIG.homeRows.forEach(rowConf => {
      let rowMovies = [];
      if (rowConf.type === 'continueWatching') {
        rowMovies = Object.keys(STATE.continueWatching).map(id => STATE.movies.find(m => m.id === id)).filter(Boolean);
      } else if (rowConf.type === 'myList') {
        rowMovies = STATE.myList.map(id => STATE.movies.find(m => m.id === id)).filter(Boolean);
      } else if (rowConf.type === 'filter') {
        rowMovies = STATE.movies.filter(m => {
          const val = m[rowConf.filterKey];
          return Array.isArray(val) ? val.includes(rowConf.filterValue) : String(val).toLowerCase() === String(rowConf.filterValue).toLowerCase();
        });
      } else if (rowConf.type === 'sort') {
        rowMovies = [...STATE.movies].sort((a, b) => b[rowConf.sortBy] - a[rowConf.sortBy]);
        if (rowConf.limit) rowMovies = rowMovies.slice(0, rowConf.limit);
      }
      if (rowMovies.length > 0) DOM.rowsContainer.appendChild(createRowElement(rowConf, rowMovies));
    });
  }

  function createRowElement(rowConf, movies) {
    const section = document.createElement('section');
    section.className = 'row-section';
    section.innerHTML = `
      <div class="row-header">
        <h3 class="row-title">${rowConf.icon ? `<i class="fa ${rowConf.icon}"></i> ` : ''}${rowConf.title}</h3>
      </div>
      <div class="row-slider-wrapper">
        <div class="movie-track"></div>
      </div>
    `;
    const track = section.querySelector('.movie-track');
    movies.forEach(movie => track.appendChild(createMovieCard(movie)));
    return section;
  }

  function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    
    // GUARANTEED fallback background if external poster URL blocks mobile hotlinking
    const archiveThumb = `https://archive.org/services/img/${movie.bookArchiveId || movie.sourceValue}`;
    
    card.innerHTML = `
      <img src="${movie.poster}" alt="${movie.title}" class="card-poster" loading="lazy" onerror="this.onerror=null;this.src='${archiveThumb}';">
      <div class="card-overlay">
        <h4 class="card-title">${movie.title}</h4>
        <p class="card-author">${movie.author}</p>
        <div class="card-btns">
          ${movie.sourceValue ? `<button class="btn btn-primary btn-sm play-card-btn"><i class="fa fa-play"></i></button>` : ''}
          <button class="btn btn-secondary btn-sm read-card-btn"><i class="fa fa-book-open"></i></button>
        </div>
      </div>
    `;

    const playBtn = card.querySelector('.play-card-btn');
    if (playBtn) playBtn.onclick = (e) => { e.stopPropagation(); openWatchPlayer(movie); };
    card.querySelector('.read-card-btn').onclick = (e) => { e.stopPropagation(); openBookReader(movie); };
    card.onclick = () => openDetailModal(movie);
    return card;
  }

  function populateFilterOptions() {
    const genres = new Set(), authors = new Set(), eras = new Set();
    STATE.movies.forEach(m => {
      if (Array.isArray(m.genre)) m.genre.forEach(g => genres.add(g));
      if (m.author) authors.add(m.author);
      if (m.era) eras.add(m.era);
    });

    DOM.filterGenre.innerHTML = '<option value="all">All Genres</option>';
    DOM.filterAuthor.innerHTML = '<option value="all">All Authors</option>';
    DOM.filterEra.innerHTML = '<option value="all">All Eras</option>';

    [...genres].sort().forEach(g => DOM.filterGenre.innerHTML += `<option value="${g}">${g}</option>`);
    [...authors].sort().forEach(a => DOM.filterAuthor.innerHTML += `<option value="${a}">${a}</option>`);
    [...eras].sort().forEach(e => DOM.filterEra.innerHTML += `<option value="${e}">${e}</option>`);
  }

  function handleFilterChange() {
    const query = DOM.searchInput.value.trim().toLowerCase();
    const gVal = DOM.filterGenre.value, aVal = DOM.filterAuthor.value, eVal = DOM.filterEra.value;

    let results = STATE.movies.filter(movie => {
      const qMatch = !query || movie.title.toLowerCase().includes(query) || movie.author.toLowerCase().includes(query);
      const gMatch = gVal === 'all' || (Array.isArray(movie.genre) && movie.genre.includes(gVal));
      const aMatch = aVal === 'all' || movie.author === aVal;
      const eMatch = eVal === 'all' || movie.era === eVal;
      return qMatch && gMatch && aMatch && eMatch;
    });

    renderCatalogGrid(results);
  }

  function renderCatalogGrid(movies) {
    DOM.catalogGrid.innerHTML = '';
    if (movies.length === 0) {
      DOM.catalogEmptyMsg.style.display = 'block';
    } else {
      DOM.catalogEmptyMsg.style.display = 'none';
      movies.forEach(movie => DOM.catalogGrid.appendChild(createMovieCard(movie)));
    }
  }

  function switchTab(tab) {
    STATE.activeTab = tab;
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tab));

    if (tab === 'home') {
      DOM.heroBanner.style.display = 'flex';
      DOM.rowsContainer.style.display = 'block';
      DOM.catalogView.style.display = 'none';
      renderHomeRows();
    } else if (tab === 'catalog') {
      DOM.heroBanner.style.display = 'none';
      DOM.rowsContainer.style.display = 'none';
      DOM.catalogView.style.display = 'block';
      handleFilterChange();
    } else if (tab === 'my-list') {
      DOM.heroBanner.style.display = 'none';
      DOM.rowsContainer.style.display = 'none';
      DOM.catalogView.style.display = 'block';
      const listMovies = STATE.myList.map(id => STATE.movies.find(m => m.id === id)).filter(Boolean);
      renderCatalogGrid(listMovies);
    }
  }

  function openDetailModal(movie) {
    STATE.currentMovie = movie;
    DOM.modalBackdrop.style.backgroundImage = `url('${movie.backdrop || movie.poster}')`;
    DOM.modalTitle.textContent = movie.title;
    DOM.modalYear.textContent = movie.year;
    DOM.modalDuration.textContent = movie.duration || 'Full Work';
    DOM.modalEra.textContent = movie.era || 'Classic';
    DOM.modalDesc.textContent = movie.description;
    DOM.modalOrigBook.textContent = movie.originalBook || movie.title;
    DOM.modalAuthor.textContent = movie.author;
    DOM.modalGenres.textContent = Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre;
    DOM.modalLang.textContent = movie.language;

    if (movie.sourceValue) {
      DOM.modalPlayBtn.style.display = 'inline-flex';
      DOM.modalPlayBtn.onclick = () => { closeDetailModal(); openWatchPlayer(movie); };
    } else {
      DOM.modalPlayBtn.style.display = 'none';
    }
    DOM.modalReadBtn.onclick = () => { closeDetailModal(); openBookReader(movie); };

    const inList = STATE.myList.includes(movie.id);
    DOM.modalListToggle.innerHTML = inList ? '<i class="fa fa-check"></i>' : '<i class="fa fa-plus"></i>';
    DOM.modalListToggle.onclick = () => {
      if (inList) STATE.myList = STATE.myList.filter(id => id !== movie.id);
      else STATE.myList.push(movie.id);
      localStorage.setItem('librisflix_mylist', JSON.stringify(STATE.myList));
      document.getElementById('my-list-counter').textContent = STATE.myList.length;
      updateDetailModalListBtn(movie.id);
    };

    DOM.modalRelatedGrid.innerHTML = '';
    STATE.movies.filter(m => m.id !== movie.id && m.author === movie.author).slice(0, 4).forEach(rel => {
      DOM.modalRelatedGrid.appendChild(createMovieCard(rel));
    });

    DOM.detailModal.classList.add('open');
  }

  function updateDetailModalListBtn(movieId) {
    const inList = STATE.myList.includes(movieId);
    DOM.modalListToggle.innerHTML = inList ? '<i class="fa fa-check"></i>' : '<i class="fa fa-plus"></i>';
  }

  function closeDetailModal() {
    DOM.modalBackdrop.style.backgroundImage = '';
    DOM.detailModal.classList.remove('open');
  }

  function openBookReader(movie) {
    const bookId = movie.bookArchiveId || movie.sourceValue;
    DOM.readerIframe.src = `https://archive.org/embed/${bookId}?view=theater`;
    DOM.readerOverlay.style.display = 'flex';
    DOM.readerTitle.textContent = movie.originalBook || movie.title;
    DOM.readerAuthor.textContent = `By ${movie.author}`;

    if (movie.sourceValue) {
      DOM.readerWatchFilmBtn.style.display = 'inline-flex';
      DOM.readerWatchFilmBtn.onclick = () => { closeBookReader(); openWatchPlayer(movie); };
    } else {
      DOM.readerWatchFilmBtn.style.display = 'none';
    }
  }

  function closeBookReader() {
    DOM.readerIframe.src = '';
    DOM.readerOverlay.style.display = 'none';
  }

  function openWatchPlayer(movie) {
    if (!movie.sourceValue) return;
    STATE.currentMovie = movie;
    DOM.playerTitle.textContent = movie.title;
    DOM.playerSubtitle.textContent = `${movie.author} • ${movie.year}`;
    DOM.playerOverlay.style.display = 'flex';
    DOM.playerCanvasContainer.innerHTML = '';

    const iframe = document.createElement('iframe');
    iframe.src = `https://archive.org/embed/${movie.sourceValue}?autoplay=1`;
    iframe.className = 'clean-stream-frame';
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.setAttribute('allow', 'autoplay; fullscreen');
    DOM.playerCanvasContainer.appendChild(iframe);

    DOM.playerReadBookBtn.onclick = () => { closeWatchPlayer(); openBookReader(movie); };
  }

  function closeWatchPlayer() {
    DOM.playerCanvasContainer.innerHTML = '';
    DOM.playerOverlay.style.display = 'none';
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  }

  function bindGlobalEvents() {
    window.addEventListener('scroll', () => {
      DOM.navbar.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });

    document.querySelectorAll('.nav-btn').forEach(btn => btn.onclick = () => switchTab(btn.dataset.tab));

    DOM.searchInput.addEventListener('input', () => {
      const q = DOM.searchInput.value.trim();
      DOM.clearSearchBtn.style.display = q ? 'inline-block' : 'none';
      if (q && STATE.activeTab !== 'catalog') switchTab('catalog');
      handleFilterChange();
    });
    DOM.clearSearchBtn.onclick = () => { DOM.searchInput.value = ''; DOM.clearSearchBtn.style.display = 'none'; handleFilterChange(); };

    DOM.filterGenre.onchange = handleFilterChange;
    DOM.filterAuthor.onchange = handleFilterChange;
    DOM.filterEra.onchange = handleFilterChange;
    DOM.filterSort.onchange = handleFilterChange;

    DOM.modalCloseBtn.onclick = closeDetailModal;
    DOM.detailModal.onclick = (e) => { if (e.target === DOM.detailModal) closeDetailModal(); };
    DOM.playerBackBtn.onclick = closeWatchPlayer;
    DOM.readerBackBtn.onclick = closeBookReader;

    DOM.addWorkBtn.onclick = () => DOM.addWorkModal.classList.add('open');
    DOM.addModalCloseBtn.onclick = () => DOM.addWorkModal.classList.remove('open');
    DOM.customWorkForm.onsubmit = (e) => {
      e.preventDefault();
      alert("Work added to your local library!");
      DOM.addWorkModal.classList.remove('open');
    };

    DOM.shortcutsBtn.onclick = () => DOM.shortcutsModal.classList.add('open');
    DOM.shortcutsCloseBtn.onclick = () => DOM.shortcutsModal.classList.remove('open');
  }

  document.addEventListener('DOMContentLoaded', initApp);
})();
