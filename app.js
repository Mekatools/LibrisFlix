/* LibrisFlix app.js - drives index.html. Catalog data comes from movies.json */
(function () {
  'use strict';

  var CFG = window.LIBRISFLIX_CONFIG || { moviesUrl: 'movies.json', loaderTimeoutMs: 4000 };
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- safe storage ---------- */
  function load(key, fallback) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch (e) { return fallback; }
  }
  function save(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }

  var STATE = {
    movies: [],
    tab: 'home',
    query: '',
    current: null,
    myList: load('librisflix_mylist', []),
    custom: load('librisflix_custom', [])
  };

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function hasFilm(m) { return !!(m.sourceType && m.sourceValue); }
  function hasBook(m) { return !!(m.bookArchiveId || (!hasFilm(m) && m.sourceValue)); }
  function bookId(m) { return m.bookArchiveId || m.sourceValue; }
  function show(el, on) { if (el) el.style.display = on ? '' : 'none'; }

  /* ---------- loader (always goes away) ---------- */
  var loaderHidden = false;
  function hideLoader() {
    if (loaderHidden) return;
    loaderHidden = true;
    var l = $('loading-screen');
    if (!l) return;
    l.style.transition = 'opacity .3s';
    l.style.opacity = '0';
    setTimeout(function () { l.style.display = 'none'; }, 300);
  }
  setTimeout(hideLoader, CFG.loaderTimeoutMs || 4000);
  window.addEventListener('error', hideLoader);
  window.addEventListener('unhandledrejection', hideLoader);

  /* ---------- data ---------- */
  function loadMovies() {
    return fetch(CFG.moviesUrl || 'movies.json', { cache: 'no-cache' })
      .then(function (r) {
        if (!r.ok) throw new Error('movies.json HTTP ' + r.status);
        return r.json();
      })
      .then(function (list) {
        if (!Array.isArray(list)) throw new Error('movies.json must be a list');
        var ids = {};
        list.forEach(function (m) { ids[m.id] = 1; });
        var extra = STATE.custom.filter(function (m) { return !ids[m.id]; });
        STATE.movies = list.concat(extra);
      });
  }

  /* ---------- cards ---------- */
  function cardHTML(m) {
    return '<div class="movie-card" data-id="' + esc(m.id) + '">' +
      '<img class="card-poster" loading="lazy" src="' + esc(m.poster || '') + '" alt="' + esc(m.title) + '" data-arch="' + esc(bookId(m) || '') + '">' +
      '<div class="card-overlay"><h4 class="card-title">' + esc(m.title) + '</h4>' +
      '<div class="card-btns">' +
      (hasFilm(m) ? '<button class="btn btn-primary btn-sm" data-act="play" title="Watch"><i class="fa fa-play"></i></button> ' : '') +
      (hasBook(m) ? '<button class="btn btn-secondary btn-sm" data-act="read" title="Read"><i class="fa fa-book-open"></i></button>' : '') +
      '</div></div></div>';
  }

  function rowHTML(title, icon, list) {
    if (!list.length) return '';
    return '<div class="row-section"><div class="row-header"><h3 class="row-title"><i class="fa ' + icon + '"></i> ' + esc(title) + '</h3></div>' +
      '<div class="row-slider-wrapper"><div class="movie-track">' + list.map(cardHTML).join('') + '</div></div></div>';
  }

  function renderHome() {
    var films = STATE.movies.filter(hasFilm);
    var books = STATE.movies.filter(function (m) { return !hasFilm(m); });
    var hindi = STATE.movies.filter(function (m) { return /hindi/i.test(m.language || ''); });
    var mine = STATE.movies.filter(function (m) { return STATE.myList.indexOf(m.id) > -1; });
    var html = rowHTML('Watch the Films', 'fa-film', films) +
      rowHTML('Read the Original Books', 'fa-book', books) +
      rowHTML('Hindi Classics', 'fa-clapperboard', hindi) +
      rowHTML('My List', 'fa-check', mine);
    var c = $('rows-container');
    if (c) c.innerHTML = html || '<p style="padding:2rem">No titles found. Check movies.json.</p>';
  }

  function renderHero() {
    var m = STATE.movies.filter(hasFilm)[0] || STATE.movies[0];
    if (!m) return;
    STATE.hero = m;
    $('hero-title').textContent = m.title;
    $('hero-desc').textContent = m.description || '';
    $('hero-author').textContent = 'By ' + (m.author || '');
    $('hero-year').textContent = m.year || '';
    $('hero-duration').textContent = m.duration || '';
    var bg = m.backdrop || m.poster;
    if (bg) $('hero-backdrop').style.backgroundImage = "url('" + bg + "')";
    show($('hero-play-btn'), hasFilm(m));
    show($('hero-read-btn'), hasBook(m));
  }

  /* ---------- catalog / filters ---------- */
  function fillSelect(id, values, allLabel) {
    var sel = $(id); if (!sel) return;
    var cur = sel.value || 'all';
    sel.innerHTML = '<option value="all">' + allLabel + '</option>' +
      values.map(function (v) { return '<option value="' + esc(v) + '">' + esc(v) + '</option>'; }).join('');
    sel.value = values.indexOf(cur) > -1 ? cur : 'all';
  }
  function uniq(arr) { return arr.filter(function (v, i) { return v && arr.indexOf(v) === i; }).sort(); }

  function buildFilters() {
    var g = [];
    STATE.movies.forEach(function (m) { g = g.concat(m.genre || []); });
    fillSelect('filter-genre', uniq(g), 'All Genres');
    fillSelect('filter-author', uniq(STATE.movies.map(function (m) { return m.author; })), 'All Authors');
    fillSelect('filter-era', uniq(STATE.movies.map(function (m) { return m.era; })), 'All Eras');
  }

  function filtered() {
    var g = $('filter-genre').value, a = $('filter-author').value, e = $('filter-era').value, s = $('filter-sort').value;
    var q = STATE.query.trim().toLowerCase();
    var list = STATE.movies.filter(function (m) {
      if (STATE.tab === 'my-list' && STATE.myList.indexOf(m.id) < 0) return false;
      if (g !== 'all' && (m.genre || []).indexOf(g) < 0) return false;
      if (a !== 'all' && m.author !== a) return false;
      if (e !== 'all' && m.era !== e) return false;
      if (q) {
        var hay = [m.title, m.author, m.originalBook, m.description, m.language].concat(m.genre || [], m.tags || []).join(' ').toLowerCase();
        if (hay.indexOf(q) < 0) return false;
      }
      return true;
    });
    if (s === 'year-desc') list.sort(function (x, y) { return (y.year || 0) - (x.year || 0); });
    else if (s === 'year-asc') list.sort(function (x, y) { return (x.year || 0) - (y.year || 0); });
    else if (s === 'title-asc') list.sort(function (x, y) { return String(x.title).localeCompare(y.title); });
    else if (s === 'author-asc') list.sort(function (x, y) { return String(x.author).localeCompare(y.author); });
    return list;
  }

  function renderCatalog() {
    var list = filtered();
    $('catalog-grid').innerHTML = list.map(cardHTML).join('');
    show($('catalog-empty-msg'), list.length === 0);
    $('catalog-view-title').textContent =
      STATE.tab === 'my-list' ? 'My List' : (STATE.query ? 'Search results' : 'Browse Full Library');
  }

  function setTab(tab) {
    STATE.tab = tab;
    document.querySelectorAll('.nav-btn').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-tab') === tab);
    });
    var home = tab === 'home' && !STATE.query;
    show($('hero-banner'), home);
    show($('rows-container'), home);
    show($('catalog-view'), !home);
    if (home) renderHome(); else renderCatalog();
    window.scrollTo(0, 0);
  }

  function refresh() {
    $('my-list-counter').textContent = STATE.myList.length;
    setTab(STATE.tab);
  }

  /* ---------- my list ---------- */
  function toggleList(id) {
    var i = STATE.myList.indexOf(id);
    if (i > -1) STATE.myList.splice(i, 1); else STATE.myList.push(id);
    save('librisflix_mylist', STATE.myList);
    $('my-list-counter').textContent = STATE.myList.length;
  }

  /* ---------- modal ---------- */
  function openModal(m) {
    STATE.current = m;
    $('modal-title').textContent = m.title;
    $('modal-year').textContent = m.year || '';
    $('modal-duration').textContent = m.duration || '';
    $('modal-era').textContent = m.era || '';
    $('modal-desc').textContent = m.description || '';
    $('modal-orig-book').textContent = m.originalBook || '';
    $('modal-author').textContent = m.author || '';
    $('modal-genres').textContent = (m.genre || []).join(', ');
    $('modal-lang').textContent = m.language || '';
    $('modal-tags').textContent = (m.tags || []).join(', ');
    var bg = m.backdrop || m.poster;
    $('modal-backdrop').style.backgroundImage = bg ? "url('" + bg + "')" : '';
    show($('modal-play-btn'), hasFilm(m));
    show($('modal-read-btn'), hasBook(m));
    updateListBtn();
    var related = STATE.movies.filter(function (x) {
      return x.id !== m.id && (x.author === m.author || (x.genre || []).some(function (g) { return (m.genre || []).indexOf(g) > -1; }));
    }).slice(0, 6);
    $('modal-related-grid').innerHTML = related.map(cardHTML).join('');
    $('detail-modal').classList.add('open');
    $('detail-modal').setAttribute('aria-hidden', 'false');
  }
  function updateListBtn() {
    var on = STATE.current && STATE.myList.indexOf(STATE.current.id) > -1;
    $('modal-list-toggle').innerHTML = '<i class="fa ' + (on ? 'fa-check' : 'fa-plus') + '"></i>';
  }
  function closeOverlay(id) {
    var el = $(id); if (!el) return;
    el.classList.remove('open');
    el.setAttribute('aria-hidden', 'true');
  }

  /* ---------- player & reader ---------- */
  function openPlayer(m) {
    if (!hasFilm(m)) return;
    STATE.current = m;
    $('player-title').textContent = m.title;
    $('player-subtitle').textContent = (m.author || '') + (m.year ? ' \u2022 ' + m.year : '');
    show($('player-read-book-btn'), hasBook(m));
    show($('player-error'), false);
    show($('player-next-overlay'), false);
    loadPlayerFrame();
    $('player-overlay').style.display = 'flex';
  }
  function loadPlayerFrame() {
    var m = STATE.current; if (!m) return;
    $('player-canvas-container').innerHTML =
      '<iframe class="clean-stream-frame" src="https://archive.org/embed/' + encodeURIComponent(m.sourceValue) +
      '" allowfullscreen allow="autoplay; fullscreen"></iframe>';
  }
  function closePlayer() {
    $('player-canvas-container').innerHTML = '';
    $('player-overlay').style.display = 'none';
  }
  function openReader(m) {
    if (!hasBook(m)) return;
    STATE.current = m;
    $('reader-title').textContent = m.originalBook || m.title;
    $('reader-author').textContent = 'By ' + (m.author || '');
    show($('reader-watch-film-btn'), hasFilm(m));
    $('reader-iframe').src = 'https://archive.org/embed/' + encodeURIComponent(bookId(m)) + '?view=theater';
    $('reader-overlay').style.display = 'flex';
  }
  function closeReader() {
    $('reader-iframe').src = 'about:blank';
    $('reader-overlay').style.display = 'none';
  }

  function byId(id) {
    return STATE.movies.filter(function (m) { return m.id === id; })[0];
  }

  /* ---------- add custom work ---------- */
  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function formWork() {
    var movieId = $('form-movie-id').value.trim();
    var title = $('form-title').value.trim();
    return {
      id: slug(title) + (movieId ? '-film' : '-book'),
      title: title,
      year: parseInt($('form-year').value, 10) || null,
      author: $('form-author').value.trim(),
      originalBook: $('form-book').value.trim(),
      genre: $('form-genre').value.split(',').map(function (s) { return s.trim(); }).filter(Boolean),
      language: $('form-lang').value.trim() || 'English',
      era: 'Classic',
      description: $('form-desc').value.trim(),
      poster: $('form-poster').value.trim(),
      backdrop: $('form-poster').value.trim(),
      duration: movieId ? 'Film' : 'Full Book',
      sourceType: movieId ? 'archive' : null,
      sourceValue: movieId || null,
      bookArchiveId: $('form-book-id').value.trim(),
      tags: []
    };
  }

  /* ---------- events ---------- */
  function setupEvents() {
    document.querySelectorAll('.nav-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        STATE.query = ''; $('global-search-input').value = '';
        setTab(b.getAttribute('data-tab'));
      });
    });
    $('nav-logo').addEventListener('click', function (e) {
      e.preventDefault(); STATE.query = ''; $('global-search-input').value = ''; setTab('home');
    });

    $('global-search-input').addEventListener('input', function (e) {
      STATE.query = e.target.value;
      if (STATE.tab === 'home' && STATE.query) STATE.tab = 'catalog';
      setTab(STATE.tab);
    });
    $('clear-search-btn').addEventListener('click', function () {
      STATE.query = ''; $('global-search-input').value = ''; setTab(STATE.tab);
    });

    ['filter-genre', 'filter-author', 'filter-era', 'filter-sort'].forEach(function (id) {
      $(id).addEventListener('change', renderCatalog);
    });

    // card clicks (home rows, catalog grid, related grid)
    document.addEventListener('click', function (e) {
      var card = e.target.closest ? e.target.closest('.movie-card') : null;
      if (!card) return;
      var m = byId(card.getAttribute('data-id'));
      if (!m) return;
      var btn = e.target.closest('[data-act]');
      if (btn) {
        closeOverlay('detail-modal');
        if (btn.getAttribute('data-act') === 'play') openPlayer(m); else openReader(m);
      } else {
        openModal(m);
      }
    });

    // poster fallback
    document.addEventListener('error', function (e) {
      var img = e.target;
      if (!img || img.tagName !== 'IMG' || !img.classList.contains('card-poster')) return;
      var a = img.getAttribute('data-arch');
      if (a && !img.getAttribute('data-tried')) {
        img.setAttribute('data-tried', '1');
        img.src = 'https://archive.org/services/img/' + encodeURIComponent(a);
      } else {
        img.style.visibility = 'hidden';
        if (img.parentNode) img.parentNode.style.background = '#2a2a2a';
      }
    }, true);

    // hero
    $('hero-play-btn').addEventListener('click', function () { if (STATE.hero) openPlayer(STATE.hero); });
    $('hero-read-btn').addEventListener('click', function () { if (STATE.hero) openReader(STATE.hero); });
    $('hero-info-btn').addEventListener('click', function () { if (STATE.hero) openModal(STATE.hero); });

    // modal
    $('modal-close-btn').addEventListener('click', function () { closeOverlay('detail-modal'); });
    $('detail-modal').addEventListener('click', function (e) { if (e.target === this) closeOverlay('detail-modal'); });
    $('modal-play-btn').addEventListener('click', function () { closeOverlay('detail-modal'); openPlayer(STATE.current); });
    $('modal-read-btn').addEventListener('click', function () { closeOverlay('detail-modal'); openReader(STATE.current); });
    $('modal-list-toggle').addEventListener('click', function () {
      if (!STATE.current) return;
      toggleList(STATE.current.id); updateListBtn();
      if (STATE.tab === 'my-list' || STATE.tab === 'home') setTab(STATE.tab);
    });

    // player / reader
    $('player-back-btn').addEventListener('click', closePlayer);
    $('reader-back-btn').addEventListener('click', closeReader);
    $('player-read-book-btn').addEventListener('click', function () { var m = STATE.current; closePlayer(); openReader(m); });
    $('reader-watch-film-btn').addEventListener('click', function () { var m = STATE.current; closeReader(); openPlayer(m); });
    $('report-broken-btn').addEventListener('click', function () { show($('player-error'), true); });
    $('player-error-retry').addEventListener('click', function () { show($('player-error'), false); loadPlayerFrame(); });
    $('cancel-next-btn').addEventListener('click', function () { show($('player-next-overlay'), false); });

    // add work
    $('add-work-btn').addEventListener('click', function () {
      $('add-work-modal').classList.add('open'); $('add-work-modal').setAttribute('aria-hidden', 'false');
    });
    $('add-modal-close-btn').addEventListener('click', function () { closeOverlay('add-work-modal'); });
    $('custom-work-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var w = formWork();
      STATE.custom.push(w); save('librisflix_custom', STATE.custom);
      STATE.movies.push(w);
      this.reset(); $('form-lang').value = 'English';
      closeOverlay('add-work-modal');
      buildFilters(); refresh();
    });
    $('copy-json-btn').addEventListener('click', function () {
      var txt = JSON.stringify(formWork(), null, 2) + ',';
      var btn = this;
      var done = function () { btn.innerHTML = '<i class="fa fa-check"></i> Copied'; setTimeout(function () { btn.innerHTML = '<i class="fa fa-code"></i> Copy JSON'; }, 1500); };
      if (navigator.clipboard) navigator.clipboard.writeText(txt).then(done, function () { window.prompt('Copy this:', txt); });
      else window.prompt('Copy this:', txt);
    });

    // shortcuts
    $('shortcuts-btn').addEventListener('click', function () {
      $('shortcuts-modal').classList.add('open'); $('shortcuts-modal').setAttribute('aria-hidden', 'false');
    });
    $('shortcuts-close-btn').addEventListener('click', function () { closeOverlay('shortcuts-modal'); });

    // Esc closes the top-most thing
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if ($('player-overlay').style.display === 'flex') closePlayer();
      else if ($('reader-overlay').style.display === 'flex') closeReader();
      else ['add-work-modal', 'shortcuts-modal', 'detail-modal'].forEach(closeOverlay);
    });
  }

  /* ---------- start ---------- */
  function start() {
    var y = $('current-year'); if (y) y.textContent = new Date().getFullYear();
    try { setupEvents(); } catch (err) { console.error('LibrisFlix events:', err); }
    loadMovies()
      .then(function () {
        buildFilters(); renderHero(); refresh();
      })
      .catch(function (err) {
        console.error('LibrisFlix: could not load catalog', err);
        var c = $('rows-container');
        if (c) c.innerHTML = '<p style="padding:2rem">Could not load movies.json (' + esc(err.message) + '). ' +
          'If you opened index.html directly from your computer, use the Cloudflare link or a local server instead.</p>';
      })
      .then(hideLoader);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
