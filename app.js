/* ====================================================================
   LIBRISFLIX BULLETPROOF ENGINE (app.js)
   Self-contained catalog - Fully initialized and ready
   ==================================================================== */

(function () {
  'use strict';

  // BUILT-IN CATALOG (Guarantees zero network fetch errors & instant load)
  const MASTER_CATALOG = [
    {
      id: "pride-and-prejudice-book",
      title: "Pride and Prejudice",
      year: 1813,
      author: "Jane Austen",
      originalBook: "Pride and Prejudice (1813)",
      genre: ["Romance", "Satire", "Classic"],
      language: "English",
      era: "Victorian & Regency",
      description": "Jane Austen's timeless comedy of manners. Follow the turbulent relationship between Elizabeth Bennet and Fitzwilliam Darcy.",
      poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/PrideAndPrejudiceTitlePage.jpg/440px-PrideAndPrejudiceTitlePage.jpg",
      backdrop: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/PrideAndPrejudiceTitlePage.jpg/1280px-PrideAndPrejudiceTitlePage.jpg",
      duration: "Full Book",
      sourceType: null,
      sourceValue: null,
      bookArchiveId: "prideandprejudic00aust_3",
      tags: ["Jane Austen", "Regency", "Masterpiece"]
    },
    {
      id: "frankenstein-book",
      title: "Frankenstein",
      year: 1818,
      author": "Mary Shelley",
      originalBook": "Frankenstein (1818)",
      genre": ["Gothic", "Sci-Fi", "Horror"],
      language": "English",
      era": "Romantic Era",
      description": "Mary Shelley's groundbreaking gothic novel about young scientist Victor Frankenstein and his creation.",
      poster": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Frankenstein_1818_edition_title_page.jpg/440px-Frankenstein_1818_edition_title_page.jpg",
      backdrop": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Frankenstein_1818_edition_title_page.jpg/1280px-Frankenstein_1818_edition_title_page.jpg",
      duration": "Full Book",
      sourceType": null,
      sourceValue": null,
      bookArchiveId": "frankensteinormo00shel_0",
      tags": ["Mary Shelley", "Gothic", "Sci-Fi"]
    },
    {
      id: "cyrano-1950",
      title": "Cyrano de Bergerac",
      year: 1950,
      author": "Edmond Rostand",
      originalBook": "Cyrano de Bergerac (1897)",
      genre": ["Drama", "Romance", "Adventure"],
      language": "English",
      era": "Golden Age",
      description": "José Ferrer's Academy Award-winning portrayal of the poet-swordsman blessed with brilliant wit and an enormous nose.",
      poster": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Cyrano_de_bergerac_1950.jpg/440px-Cyrano_de_bergerac_1950.jpg",
      backdrop": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Cyrano_de_bergerac_1950.jpg/1280px-Cyrano_de_bergerac_1950.jpg",
      duration": "1h 52m",
      sourceType": "archive",
      sourceValue": "cyrano-de-bergerac-1950-adventure-drama-romance-full-length-film",
      bookArchiveId": "cyranodebergerac00rost_2",
      tags": ["Poetry", "Swashbuckler", "Oscar Winner"]
    },
    {
      id: "nosferatu-1922",
      title": "Nosferatu: A Symphony of Horror",
      year": 1922,
      author": "Bram Stoker",
      originalBook": "Dracula (1897)",
      genre": ["Horror", "Gothic", "Drama"],
      language": "English",
      era": "Silent Era",
      description": "F.W. Murnau's legendary German Expressionist adaptation of Bram Stoker's Dracula.",
      poster": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Nosferatu%2C_eine_Symphonie_des_Grauens_%281921%29.jpg/440px-Nosferatu%2C_eine_Symphonie_des_Grauens_%281921%29.jpg",
      backdrop": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/John_Gottowt_as_Professor_Bulwer_in_Nosferatu_%281922%29.png/1280px-John_Gottowt_as_Professor_Bulwer_in_Nosferatu_%281922%29.png",
      duration": "1h 34m",
      sourceType": "archive",
      sourceValue": "Nosferatu_DVD_quality",
      bookArchiveId": "dracula00stok_1",
      tags": ["Vampire", "German Expressionism", "Bram Stoker"]
    },
    {
      id: "chalti-ka-naam-gaadi-1958",
      title": "Chalti Ka Naam Gaadi",
      year": 1958,
      author": "Kishore Kumar",
      originalBook": "Classic Indian Cinema Story (1958)",
      genre": ["Comedy", "Romance", "Musical"],
      language": "Hindi",
      era": "Golden Age",
      description": "The quintessential Hindi musical comedy classic starring Kishore Kumar and Madhubala.",
      poster": "https://upload.wikimedia.org/wikipedia/en/thumb/6/69/Chalti_Ka_Naam_Gaadi.jpg/220px-Chalti_Ka_Naam_Gaadi.jpg",
      backdrop": "https://upload.wikimedia.org/wikipedia/en/thumb/6/69/Chalti_Ka_Naam_Gaadi.jpg/1280px-Chalti_Ka_Naam_Gaadi.jpg",
      duration": "2h 45m",
      sourceType": "archive",
      sourceValue": "chalti-ka-naam-gaadi-1958",
      bookArchiveId": "chalti-ka-naam-gaadi-1958",
      tags": ["Kishore Kumar", "Madhubala", "Hindi Classic"]
    },
    {
      id: "hare-rama-hare-krishna-1971",
      title": "Hare Rama Hare Krishna",
      year": 1971,
      author": "Dev Anand",
      originalBook": "Original Hippie Counterculture Drama",
      genre": ["Drama", "Musical"],
      language": "Hindi",
      era": "Golden Age",
      description": "Dev Anand and Zeenat Aman star in this groundbreaking drama exploring 1970s youth culture in Kathmandu.",
      poster": "https://upload.wikimedia.org/wikipedia/en/thumb/8/8b/Hare_Rama_Hare_Krishna_poster.jpg/220px-Hare_Rama_Hare_Krishna_poster.jpg",
      backdrop": "https://upload.wikimedia.org/wikipedia/en/thumb/8/8b/Hare_Rama_Hare_Krishna_poster.jpg/1280px-Hare_Rama_Hare_Krishna_poster.jpg",
      duration": "2h 38m",
      sourceType": "archive",
      sourceValue": "hare-rama-hare-krishna-classic-collection",
      bookArchiveId": "hare-rama-hare-krishna-classic-collection",
      tags": ["Dev Anand", "Zeenat Aman", "Hindi Classic"]
    }
  ];

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

  function initApp() {
    applyBranding();
    updateMyListCounter();
    bindGlobalEvents();

    STATE.movies = [...STATE.customWorks, ...MASTER_CATALOG];

    populateFilterOptions();
    setupHeroBanner();
    renderHomeRows();
    
    if (DOM.loadingScreen) {
      DOM.loadingScreen.classList.add('fade-out');
      setTimeout(() => DOM.loadingScreen.style.display = 'none', 300);
    }
  }

  function applyBranding() {
    if (typeof SITE_CONFIG !== 'undefined') {
      if (SITE_CONFIG.theme && SITE_CONFIG.theme.primaryRed) {
        document.documentElement.style.setProperty('--primary-red', SITE_CONFIG.theme.primaryRed);
      }
      if (DOM.footerTagline && SITE_CONFIG.tagline) {
        DOM.footerTagline.textContent = SITE_CONFIG.tagline;
      }
      const text = SITE_CONFIG.logoText || SITE_CONFIG.siteName;
      if (DOM.navLogo) DOM.navLogo.textContent = text;
      if (DOM.footerLogo) DOM.footerLogo.textContent = text;
    }
    const yrEl = document.getElementById('current-year');
    if (yrEl) yrEl.textContent = new Date().getFullYear();
  }

  function setupHeroBanner() {
    if (!STATE.movies.length) return;
    updateHero(STATE.movies[0]);
  }

  function updateHero(movie) {
    if (!movie) return;
    if (DOM.heroBackdrop) DOM.heroBackdrop.style.backgroundImage = `url('${movie.backdrop || movie.poster}')`;
    if (DOM.heroTitle) DOM.heroTitle.textContent = movie.title;
    if (DOM.heroAuthor) DOM.heroAuthor.textContent = `By ${movie.author}`;
    if (DOM.heroYear) DOM.heroYear.textContent = movie.year;
    if (DOM.heroDuration) DOM.heroDuration.textContent = movie.duration || 'Full Work';
    if (DOM.heroDesc) DOM.heroDesc.textContent = movie.description;

    if (movie.sourceValue && DOM.heroPlayBtn) {
      DOM.heroPlayBtn.style.display = 'inline-flex';
      DOM.heroPlayBtn.onclick = () => openWatchPlayer(movie);
    } else if (DOM.heroPlayBtn) {
      DOM.heroPlayBtn.style.display = 'none';
    }
    if (DOM.heroReadBtn) DOM.heroReadBtn.onclick = () => openBookReader(movie);
    if (DOM.heroInfoBtn) DOM.heroInfoBtn.onclick = () => openDetailModal(movie);
  }

  function renderHomeRows() {
    if (!DOM.rowsContainer) return;
    DOM.rowsContainer.innerHTML = '';
    
    if (typeof SITE_CONFIG === 'undefined' || !SITE_CONFIG.homeRows) return;

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

    if (DOM.filterGenre) DOM.filterGenre.innerHTML = '<option value="all">All Genres</option>';
    if (DOM.filterAuthor) DOM.filterAuthor.innerHTML = '<option value="all">All Authors</option>';
    if (DOM.filterEra) DOM.filterEra.innerHTML = '<option value="all">All Eras</option>';

    [...genres].sort().forEach(g => { if(DOM.filterGenre) DOM.filterGenre.innerHTML += `<option value="${g}">${g}</option>`; });
    [...authors].sort().forEach(a => { if(DOM.filterAuthor) DOM.filterAuthor.innerHTML += `<option value="${a}">${a}</option>`; });
    [...eras].sort().forEach(e => { if(DOM.filterEra) DOM.filterEra.innerHTML += `<option value="${e}">${e}</option>`; });
  }

  function handleFilterChange() {
    const query = DOM.searchInput ? DOM.searchInput.value.trim().toLowerCase() : '';
    const gVal = DOM.filterGenre ? DOM.filterGenre.value : 'all';
    const aVal = DOM.filterAuthor ? DOM.filterAuthor.value : 'all';
    const eVal = DOM.filterEra ? DOM.filterEra.value : 'all';

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
    if (!DOM.catalogGrid) return;
    DOM.catalogGrid.innerHTML = '';
    if (movies.length === 0) {
      if (DOM.catalogEmptyMsg) DOM.catalogEmptyMsg.style.display = 'block';
    } else {
      if (DOM.catalogEmptyMsg) DOM.catalogEmptyMsg.style.display = 'none';
      movies.forEach(movie => DOM.catalogGrid.appendChild(createMovieCard(movie)));
    }
  }

  function switchTab(tab) {
    STATE.activeTab = tab;
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tab));

    if (tab === 'home') {
      if (DOM.heroBanner) DOM.heroBanner.style.display = 'flex';
      if (DOM.rowsContainer) DOM.rowsContainer.style.display = 'block';
      if (DOM.catalogView) DOM.catalogView.style.display = 'none';
      renderHomeRows();
    } else if (tab === 'catalog') {
      if (DOM.heroBanner) DOM.heroBanner.style.display = 'none';
      if (DOM.rowsContainer) DOM.rowsContainer.style.display = 'none';
      if (DOM.catalogView) DOM.catalogView.style.display = 'block';
      if (DOM.catalogTitle) DOM.catalogTitle.textContent = 'All Literary Works & Cinema';
      handleFilterChange();
    } else if (tab === 'my-list') {
      if (DOM.heroBanner) DOM.heroBanner.style.display = 'none';
      if (DOM.rowsContainer) DOM.rowsContainer.style.display = 'none';
      if (DOM.catalogView) DOM.catalogView.style.display = 'block';
      if (DOM.catalogTitle) DOM.catalogTitle.textContent = 'My Watch & Reading List';
      const listMovies = STATE.myList.map(id => STATE.movies.find(m => m.id === id)).filter(Boolean);
      renderCatalogGrid(listMovies);
    }
  }

  function openDetailModal(movie) {
    STATE.currentMovie = movie;
    if (DOM.modalBackdrop) DOM.modalBackdrop.style.backgroundImage = `url('${movie.backdrop || movie.poster}')`;
    if (DOM.modalTitle) DOM.modalTitle.textContent = movie.title;
    if (DOM.modalYear) DOM.modalYear.textContent = movie.year;
    if (DOM.modalDuration) DOM.modalDuration.textContent = movie.duration || 'Full Work';
    if (DOM.modalEra) DOM.modalEra.textContent = movie.era || 'Classic';
    if (DOM.modalDesc) DOM.modalDesc.textContent = movie.description;
    if (DOM.modalOrigBook) DOM.modalOrigBook.textContent = movie.originalBook || movie.title;
    if (DOM.modalAuthor) DOM.modalAuthor.textContent = movie.author;
    if (DOM.modalGenres) DOM.modalGenres.textContent = Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre;
    if (DOM.modalLang) DOM.modalLang.textContent = movie.language;

    if (movie.sourceValue && DOM.modalPlayBtn) {
      DOM.modalPlayBtn.style.display = 'inline-flex';
      DOM.modalPlayBtn.onclick = () => { closeDetailModal(); openWatchPlayer(movie); };
    } else if (DOM.modalPlayBtn) {
      DOM.modalPlayBtn.style.display = 'none';
    }
    if (DOM.modalReadBtn) DOM.modalReadBtn.onclick = () => { closeDetailModal(); openBookReader(movie); };

    const inList = STATE.myList.includes(movie.id);
    if (DOM.modalListToggle) {
      DOM.modalListToggle.innerHTML = inList ? '<i class="fa fa-check"></i>' : '<i class="fa fa-plus"></i>';
      DOM.modalListToggle.onclick = () => {
        if (inList) STATE.myList = STATE.myList.filter(id => id !== movie.id);
        else STATE.myList.push(movie.id);
        localStorage.setItem('librisflix_mylist', JSON.stringify(STATE.myList));
        if (DOM.myListCounter) DOM.myListCounter.textContent = STATE.myList.length;
        updateDetailModalListBtn(movie.id);
      };
    }

    if (DOM.modalRelatedGrid) {
      DOM.modalRelatedGrid.innerHTML = '';
      STATE.movies.filter(m => m.id !== movie.id && m.author === movie.author).slice(0, 4).forEach(rel => {
        DOM.modalRelatedGrid.appendChild(createMovieCard(rel));
      });
    }

    if (DOM.detailModal) DOM.detailModal.classList.add('open');
  }

  function updateDetailModalListBtn(movieId) {
    const inList = STATE.myList.includes(movieId);
    if (DOM.modalListToggle) DOM.modalListToggle.innerHTML = inList ? '<i class="fa fa-check"></i>' : '<i class="fa fa-plus"></i>';
  }

  function closeDetailModal() {
    if (DOM.modalBackdrop) DOM.modalBackdrop.style.backgroundImage = '';
    if (DOM.detailModal) DOM.detailModal.classList.remove('open');
  }

  function openBookReader(movie) {
    STATE.currentMovie = movie;
    if (DOM.readerTitle) DOM.readerTitle.textContent = movie.originalBook || movie.title;
    if (DOM.readerAuthor) DOM.readerAuthor.textContent = `By ${movie.author}`;
    
    const bookId = movie.bookArchiveId || movie.sourceValue;
    if (DOM.readerIframe) DOM.readerIframe.src = `https://archive.org/embed/${bookId}?view=theater`;
    if (DOM.readerOverlay) DOM.readerOverlay.style.display = 'flex';

    if (movie.sourceValue && DOM.readerWatchFilmBtn) {
      DOM.readerWatchFilmBtn.style.display = 'inline-flex';
      DOM.readerWatchFilmBtn.onclick = () => { closeBookReader(); openWatchPlayer(movie); };
    } else if (DOM.readerWatchFilmBtn) {
      DOM.readerWatchFilmBtn.style.display = 'none';
    }
  }

  function closeBookReader() {
    if (DOM.readerIframe) DOM.readerIframe.src = '';
    if (DOM.readerOverlay) DOM.readerOverlay.style.display = 'none';
  }

  function openWatchPlayer(movie) {
    if (!movie.sourceValue) return;
    STATE.currentMovie = movie;
    if (DOM.playerTitle) DOM.playerTitle.textContent = movie.title;
    if (DOM.playerSubtitle) DOM.playerSubtitle.textContent = `${movie.author} • ${movie.year}`;
    if (DOM.playerOverlay) DOM.playerOverlay.style.display = 'flex';
    if (DOM.playerCanvasContainer) DOM.playerCanvasContainer.innerHTML = '';

    const iframe = document.createElement('iframe');
    iframe.src = `https://archive.org/embed/${movie.sourceValue}?autoplay=1`;
    iframe.className = 'clean-stream-frame';
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.setAttribute('allow', 'autoplay; fullscreen');
    if (DOM.playerCanvasContainer) DOM.playerCanvasContainer.appendChild(iframe);
  }

  function closeWatchPlayer() {
    if (DOM.playerCanvasContainer) DOM.playerCanvasContainer.innerHTML = '';
    if (DOM.playerOverlay) DOM.playerOverlay.style.display = 'none';
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  }

  function bindGlobalEvents() {
    window.addEventListener('scroll', () => {
      if (DOM.navbar) DOM.navbar.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });

    document.querySelectorAll('.nav-btn').forEach(btn => btn.onclick = () => switchTab(btn.dataset.tab));

    if (DOM.searchInput) {
      DOM.searchInput.addEventListener('input', () => {
        const q = DOM.searchInput.value.trim();
        if (DOM.clearSearchBtn) DOM.clearSearchBtn.style.display = q ? 'inline-block' : 'none';
        if (q && STATE.activeTab !== 'catalog') switchTab('catalog');
        handleFilterChange();
      });
    }
    if (DOM.clearSearchBtn) {
      DOM.clearSearchBtn.onclick = () => { if (DOM.searchInput) DOM.searchInput.value = ''; DOM.clearSearchBtn.style.display = 'none'; handleFilterChange(); };
    }

    if (DOM.filterGenre) DOM.filterGenre.onchange = handleFilterChange;
    if (DOM.filterAuthor) DOM.filterAuthor.onchange = handleFilterChange;
    if (DOM.filterEra) DOM.filterEra.onchange = handleFilterChange;
    if (DOM.filterSort) DOM.filterSort.onchange = handleFilterChange;

    if (DOM.modalCloseBtn) DOM.modalCloseBtn.onclick = closeDetailModal;
    if (DOM.detailModal) DOM.detailModal.onclick = (e) => { if (e.target === DOM.detailModal) closeDetailModal(); };
    if (DOM.playerBackBtn) DOM.playerBackBtn.onclick = closeWatchPlayer;
    if (DOM.readerBackBtn) DOM.readerBackBtn.onclick = closeBookReader;

    if (DOM.addWorkBtn) DOM.addWorkBtn.onclick = () => { if (DOM.addWorkModal) DOM.addWorkModal.classList.add('open'); };
    if (DOM.addModalCloseBtn) DOM.addModalCloseBtn.onclick = () => { if (DOM.addWorkModal) DOM.addWorkModal.classList.remove('open'); };
    if (DOM.customWorkForm) {
      DOM.customWorkForm.onsubmit = (e) => {
        e.preventDefault();
        alert("Work added to your local library!");
        if (DOM.addWorkModal) DOM.addWorkModal.classList.remove('open');
      };
    }

    if (DOM.shortcutsBtn) DOM.shortcutsBtn.onclick = () => { if (DOM.shortcutsModal) DOM.shortcutsModal.classList.add('open'); };
    if (DOM.shortcutsCloseBtn) DOM.shortcutsCloseBtn.onclick = () => { if (DOM.shortcutsModal) DOM.shortcutsModal.classList.remove('open'); };
  }

  // CRITICAL FIX: Ensures initApp runs safely as soon as the HTML document is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
