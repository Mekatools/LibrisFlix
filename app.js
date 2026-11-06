/* ====================================================================
   LIBRISFLIX FAST-STREAM APPLICATION ENGINE (app.js)
   Hardware-accelerated, zero-lag streaming engine
   ==================================================================== */

(function () {
  'use strict';

  const STATE = {
    movies: [],
    currentMovie: null,
    activeTab: 'home',
    myList: JSON.parse(localStorage.getItem('librisflix_mylist') || '[]'),
    continueWatching: JSON.parse(localStorage.getItem('librisflix_continue') || '{}'),
    watchHistory: JSON.parse(localStorage.getItem('librisflix_history') || '[]'),
    nextCountdownTimer: null
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
    shortcutsCloseBtn: document.getElementById('shortcuts-close-btn'),
    customControls: document.getElementById('custom-video-controls')
  };

  async function initApp() {
    applyBranding();
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
      DOM.navLogo.innerHTML = logoHtml;
      DOM.loaderLogo.innerHTML = logoHtml;
      DOM.footerLogo.innerHTML = logoHtml;
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
    const featured = STATE.movies.find(m => m.id === 'cyrano-1950') || STATE.movies[0];
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

    DOM.heroPlayBtn.onclick = () => openWatchPlayer(movie);
    DOM.heroInfoBtn.onclick = () => openDetailModal(movie);

    if (movie.bookLink && SITE_CONFIG.features.enableBookLinks) {
      DOM.heroBookBtn.href = movie.bookLink;
      DOM.heroBookBtn.style.display = 'inline-flex';
    } else {
      DOM.heroBookBtn.style.display = 'none';
    }
  }

  function renderHomeRows() {
    DOM.rowsContainer.innerHTML = '';

    SITE_CONFIG.homeRows.forEach(rowConf => {
      let rowMovies = [];

      if (rowConf.type === 'continueWatching') {
        if (!SITE_CONFIG.features.enableContinueWatching) return;
        const savedIds = Object.keys(STATE.continueWatching);
        rowMovies = savedIds.map(id => STATE.movies.find(m => m.id === id)).filter(Boolean);
        if (!rowMovies.length) return;
      } else if (rowConf.type === 'myList') {
        if (!SITE_CONFIG.features.enableMyList) return;
        rowMovies = STATE.myList.map(id => STATE.movies.find(m => m.id === id)).filter(Boolean);
        if (!rowMovies.length) return;
      } else if (rowConf.type === 'filter') {
        rowMovies = STATE.movies.filter(m => {
          const val = m[rowConf.filterKey];
          if (Array.isArray(val)) {
            return val.some(v => v.toLowerCase() === rowConf.filterValue.toLowerCase());
          }
          return String(val).toLowerCase() === String(rowConf.filterValue).toLowerCase();
        });
      } else if (rowConf.type === 'sort') {
        rowMovies = [...STATE.movies].sort((a, b) => {
          if (rowConf.order === 'desc') return b[rowConf.sortBy] - a[rowConf.sortBy];
          return a[rowConf.sortBy] - b[rowConf.sortBy];
        });
        if (rowConf.limit) rowMovies = rowMovies.slice(0, rowConf.limit);
      }

      if (rowMovies.length > 0) {
        DOM.rowsContainer.appendChild(createRowElement(rowConf, rowMovies));
      }
    });
  }

  function createRowElement(rowConf, movies) {
    const section = document.createElement('section');
    section.className = 'row-section';
    section.id = rowConf.id;

    const iconHtml = rowConf.icon ? `<i class="fa ${rowConf.icon}"></i> ` : '';

    section.innerHTML = `
      <div class="row-header">
        <h3 class="row-title">${iconHtml}${rowConf.title}</h3>
      </div>
      <div class="row-slider-wrapper">
        <button class="row-nav-arrow row-arrow-left" aria-label="Scroll Left"><i class="fa fa-chevron-left"></i></button>
        <div class="movie-track"></div>
        <button class="row-nav-arrow row-arrow-right" aria-label="Scroll Right"><i class="fa fa-chevron-right"></i></button>
      </div>
    `;

    const track = section.querySelector('.movie-track');
    movies.forEach(movie => {
      const card = createMovieCard(movie, rowConf.type === 'continueWatching');
      track.appendChild(card);
    });

    const arrowLeft = section.querySelector('.row-arrow-left');
    const arrowRight = section.querySelector('.row-arrow-right');

    arrowLeft.onclick = () => {
      track.scrollBy({ left: -window.innerWidth * 0.7, behavior: 'smooth' });
    };
    arrowRight.onclick = () => {
      track.scrollBy({ left: window.innerWidth * 0.7, behavior: 'smooth' });
    };

    return section;
  }

  function createMovieCard(movie, isContinueWatching = false) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.setAttribute('data-id', movie.id);

    let progressHtml = '';
    if (isContinueWatching && STATE.continueWatching[movie.id]) {
      const percent = Math.min(100, Math.round(STATE.continueWatching[movie.id].progress || 0));
      progressHtml = `
        <div class="card-progress-bar">
          <div class="card-progress-fill" style="width: ${percent}%;"></div>
        </div>
      `;
    }

    const fallbackThumb = `https://archive.org/services/img/${movie.sourceValue}`;

    card.innerHTML = `
      <img src="${movie.poster}" alt="${movie.title}" class="card-poster" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='${fallbackThumb}';">
      ${progressHtml}
      <div class="card-overlay">
        <h4 class="card-title">${movie.title}</h4>
        <p class="card-author">${movie.author}</p>
        <div class="card-meta">
          <span>${movie.year}</span>
          <span>${movie.duration}</span>
        </div>
        <div class="card-btns">
          <button class="btn btn-primary btn-sm play-card-btn"><i class="fa fa-play"></i></button>
          <button class="btn btn-secondary btn-sm info-card-btn"><i class="fa fa-info"></i></button>
        </div>
      </div>
    `;

    card.querySelector('.play-card-btn').onclick = (e) => {
      e.stopPropagation();
      openWatchPlayer(movie);
    };

    card.querySelector('.info-card-btn').onclick = (e) => {
      e.stopPropagation();
      openDetailModal(movie);
    };

    card.onclick = () => openDetailModal(movie);
    return card;
  }

  function populateFilterOptions() {
    const genres = new Set();
    const authors = new Set();
    const eras = new Set();

    STATE.movies.forEach(m => {
      if (Array.isArray(m.genre)) m.genre.forEach(g => genres.add(g));
      if (m.author) authors.add(m.author);
      if (m.era) eras.add(m.era);
    });

    [...genres].sort().forEach(g => {
      DOM.filterGenre.innerHTML += `<option value="${g}">${g}</option>`;
    });
    [...authors].sort().forEach(a => {
      DOM.filterAuthor.innerHTML += `<option value="${a}">${a}</option>`;
    });
    [...eras].sort().forEach(e => {
      DOM.filterEra.innerHTML += `<option value="${e}">${e}</option>`;
    });
  }

  function handleFilterChange() {
    const query = DOM.searchInput.value.trim().toLowerCase();
    const selectedGenre = DOM.filterGenre.value;
    const selectedAuthor = DOM.filterAuthor.value;
    const selectedEra = DOM.filterEra.value;
    const sortMode = DOM.filterSort.value;

    let results = STATE.movies.filter(movie => {
      const matchesQuery = !query || 
        movie.title.toLowerCase().includes(query) ||
        movie.author.toLowerCase().includes(query) ||
        movie.originalBook.toLowerCase().includes(query) ||
        (Array.isArray(movie.tags) && movie.tags.some(t => t.toLowerCase().includes(query)));

      const matchesGenre = selectedGenre === 'all' || 
        (Array.isArray(movie.genre) && movie.genre.includes(selectedGenre));

      const matchesAuthor = selectedAuthor === 'all' || movie.author === selectedAuthor;
      const matchesEra = selectedEra === 'all' || movie.era === selectedEra;

      return matchesQuery && matchesGenre && matchesAuthor && matchesEra;
    });

    results.sort((a, b) => {
      if (sortMode === 'year-desc') return b.year - a.year;
      if (sortMode === 'year-asc') return a.year - b.year;
      if (sortMode === 'title-asc') return a.title.localeCompare(b.title);
      if (sortMode === 'author-asc') return a.author.localeCompare(b.author);
      return 0;
    });

    renderCatalogGrid(results);
  }

  function renderCatalogGrid(movies) {
    DOM.catalogGrid.innerHTML = '';
    if (movies.length === 0) {
      DOM.catalogEmptyMsg.style.display = 'block';
    } else {
      DOM.catalogEmptyMsg.style.display = 'none';
      movies.forEach(movie => {
        DOM.catalogGrid.appendChild(createMovieCard(movie));
      });
    }
  }

  function switchTab(tab) {
    STATE.activeTab = tab;
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    if (tab === 'home') {
      DOM.heroBanner.style.display = 'flex';
      DOM.rowsContainer.style.display = 'block';
      DOM.catalogView.style.display = 'none';
      renderHomeRows();
    } else if (tab === 'catalog') {
      DOM.heroBanner.style.display = 'none';
      DOM.rowsContainer.style.display = 'none';
      DOM.catalogView.style.display = 'block';
      DOM.catalogTitle.textContent = 'All Literary Cinema';
      handleFilterChange();
    } else if (tab === 'my-list') {
      DOM.heroBanner.style.display = 'none';
      DOM.rowsContainer.style.display = 'none';
      DOM.catalogView.style.display = 'block';
      DOM.catalogTitle.textContent = 'My Watch & Reading List';
      const listMovies = STATE.myList.map(id => STATE.movies.find(m => m.id === id)).filter(Boolean);
      renderCatalogGrid(listMovies);
    }
  }

  function openDetailModal(movie) {
    STATE.currentMovie = movie;
    DOM.modalBackdrop.style.backgroundImage = `url('${movie.backdrop || movie.poster}')`;
    DOM.modalTitle.textContent = movie.title;
    DOM.modalYear.textContent = movie.year;
    DOM.modalDuration.textContent = movie.duration;
    DOM.modalEra.textContent = movie.era;
    DOM.modalDesc.textContent = movie.description;
    DOM.modalOrigBook.textContent = movie.originalBook;
    DOM.modalAuthor.textContent = movie.author;
    DOM.modalGenres.textContent = Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre;
    DOM.modalLang.textContent = movie.language;
    DOM.modalTags.textContent = movie.tags ? movie.tags.join(' • ') : '';

    if (movie.bookLink && SITE_CONFIG.features.enableBookLinks) {
      DOM.modalBookBtn.href = movie.bookLink;
      DOM.modalBookBtn.style.display = 'inline-flex';
    } else {
      DOM.modalBookBtn.style.display = 'none';
    }

    DOM.modalPlayBtn.onclick = () => {
      closeDetailModal();
      openWatchPlayer(movie);
    };

    updateModalListBtn(movie.id);
    DOM.modalListToggle.onclick = () => toggleMyList(movie.id);

    DOM.modalRelatedGrid.innerHTML = '';
    const related = STATE.movies
      .filter(m => m.id !== movie.id && (m.author === movie.author || m.genre.some(g => movie.genre.includes(g))))
      .slice(0, 4);

    related.forEach(rel => {
      const card = createMovieCard(rel);
      DOM.modalRelatedGrid.appendChild(card);
    });

    DOM.detailModal.classList.add('open');
    DOM.detailModal.setAttribute('aria-hidden', 'false');
  }

  function closeDetailModal() {
    DOM.detailModal.classList.remove('open');
    DOM.detailModal.setAttribute('aria-hidden', 'true');
  }

  function toggleMyList(movieId) {
    const idx = STATE.myList.indexOf(movieId);
    if (idx > -1) {
      STATE.myList.splice(idx, 1);
    } else {
      STATE.myList.push(movieId);
    }
    localStorage.setItem('librisflix_mylist', JSON.stringify(STATE.myList));
    updateMyListCounter();
    updateModalListBtn(movieId);

    if (STATE.activeTab === 'my-list') switchTab('my-list');
    else if (STATE.activeTab === 'home') renderHomeRows();
  }

  function updateModalListBtn(movieId) {
    const inList = STATE.myList.includes(movieId);
    DOM.modalListToggle.innerHTML = inList ? '<i class="fa fa-check"></i>' : '<i class="fa fa-plus"></i>';
    DOM.modalListToggle.title = inList ? 'Remove from My List' : 'Add to My List';
  }

  function updateMyListCounter() {
    DOM.myListCounter.textContent = STATE.myList.length;
  }

  /* ------------------------------------------------------------------
     FAST-STREAM PLAYER ENGINE (Direct streaming, no download freeze)
     ------------------------------------------------------------------ */
  function openWatchPlayer(movie) {
    STATE.currentMovie = movie;
    DOM.playerTitle.textContent = movie.title;
    DOM.playerSubtitle.textContent = `${movie.author} • ${movie.year} • ${movie.originalBook}`;
    DOM.playerOverlay.style.display = 'flex';
    DOM.playerError.style.display = 'none';
    DOM.playerNextOverlay.style.display = 'none';
    clearCountdown();

    recordWatchHistory(movie.id);
    mountInstantStream(movie);
  }

  function mountInstantStream(movie) {
    DOM.playerCanvasContainer.innerHTML = '';
    DOM.customControls.style.display = 'none';

    // Mounts high-speed CDN streaming iframe with zero raw file download lag
    const iframe = document.createElement('iframe');
    iframe.src = `https://archive.org/embed/${movie.sourceValue}?autoplay=1`;
    iframe.className = 'clean-stream-frame';
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.setAttribute('webkitallowfullscreen', 'true');
    iframe.setAttribute('mozallowfullscreen', 'true');
    iframe.setAttribute('allow', 'autoplay; fullscreen');
    iframe.setAttribute('loading', 'eager');
    DOM.playerCanvasContainer.appendChild(iframe);

    // Save continue watching record
    saveContinueWatching(movie.id, 60, 25);
  }

  function saveContinueWatching(id, timestamp, progress) {
    if (!SITE_CONFIG.features.enableContinueWatching) return;
    STATE.continueWatching[id] = {
      timestamp: timestamp,
      progress: progress,
      updatedAt: Date.now()
    };
    localStorage.setItem('librisflix_continue', JSON.stringify(STATE.continueWatching));
  }

  function recordWatchHistory(id) {
    if (!SITE_CONFIG.features.enableWatchHistory) return;
    STATE.watchHistory = STATE.watchHistory.filter(x => x !== id);
    STATE.watchHistory.unshift(id);
    if (STATE.watchHistory.length > 50) STATE.watchHistory.pop();
    localStorage.setItem('librisflix_history', JSON.stringify(STATE.watchHistory));
  }

  function clearCountdown() {
    if (STATE.nextCountdownTimer) {
      clearInterval(STATE.nextCountdownTimer);
      STATE.nextCountdownTimer = null;
    }
  }

  function closeWatchPlayer() {
    clearCountdown();
    DOM.playerCanvasContainer.innerHTML = '';
    DOM.playerOverlay.style.display = 'none';
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    if (STATE.activeTab === 'home') renderHomeRows();
  }

  function bindGlobalEvents() {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        DOM.navbar.classList.add('scrolled');
      } else {
        DOM.navbar.classList.remove('scrolled');
      }
    }, { passive: true });

    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.onclick = () => switchTab(btn.dataset.tab);
    });

    DOM.searchInput.addEventListener('input', () => {
      const q = DOM.searchInput.value.trim();
      DOM.clearSearchBtn.style.display = q.length > 0 ? 'inline-block' : 'none';
      if (q.length > 0 && STATE.activeTab !== 'catalog') {
        switchTab('catalog');
      }
      handleFilterChange();
    });

    DOM.clearSearchBtn.onclick = () => {
      DOM.searchInput.value = '';
      DOM.clearSearchBtn.style.display = 'none';
      handleFilterChange();
    };

    DOM.filterGenre.onchange = handleFilterChange;
    DOM.filterAuthor.onchange = handleFilterChange;
    DOM.filterEra.onchange = handleFilterChange;
    DOM.filterSort.onchange = handleFilterChange;

    DOM.modalCloseBtn.onclick = closeDetailModal;
    DOM.detailModal.onclick = (e) => {
      if (e.target === DOM.detailModal) closeDetailModal();
    };

    DOM.playerBackBtn.onclick = closeWatchPlayer;

    DOM.playerErrorRetry.onclick = () => {
      if (STATE.currentMovie) mountInstantStream(STATE.currentMovie);
    };

    DOM.reportBrokenBtn.onclick = () => {
      const email = SITE_CONFIG.reportLinkEmail || 'curator@example.com';
      const title = STATE.currentMovie ? STATE.currentMovie.title : 'Film';
      const id = STATE.currentMovie ? STATE.currentMovie.id : 'unknown';
      const subject = encodeURIComponent(`[LibrisFlix Broken Link] ${title} (${id})`);
      const body = encodeURIComponent(`Hello,\n\nThe stream for "${title}" appears to be unavailable or broken.\nSource Identifier: ${STATE.currentMovie?.sourceValue}\n\nPlease inspect this entry.`);
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    };

    DOM.shortcutsBtn.onclick = () => DOM.shortcutsModal.classList.add('open');
    DOM.shortcutsCloseBtn.onclick = () => DOM.shortcutsModal.classList.remove('open');
    DOM.shortcutsModal.onclick = (e) => {
      if (e.target === DOM.shortcutsModal) DOM.shortcutsModal.classList.remove('open');
    };

    if (SITE_CONFIG.features.enableKeyboardShortcuts) {
      window.addEventListener('keydown', (e) => {
        if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

        if (e.key === 'Escape') {
          if (DOM.playerOverlay.style.display === 'flex') closeWatchPlayer();
          else if (DOM.detailModal.classList.contains('open')) closeDetailModal();
          else if (DOM.shortcutsModal.classList.contains('open')) DOM.shortcutsModal.classList.remove('open');
        }

        if (e.key === 'f' || e.key === 'F') {
          if (DOM.playerOverlay.style.display === 'flex') {
            e.preventDefault();
            if (!document.fullscreenElement) {
              DOM.playerOverlay.requestFullscreen().catch(() => {});
            } else {
              document.exitFullscreen().catch(() => {});
            }
          }
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', initApp);
})();
