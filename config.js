/* ====================================================================
   LIBRISFLIX FINAL BULLETPROOF ENGINE (app.js)
   ==================================================================== */

(function () {
  'use strict';

  const MASTER_CATALOG = [
    {
      id: "pride-and-prejudice-book",
      title: "Pride and Prejudice",
      year: 1813,
      author: "Jane Austen",
      originalBook: "Pride and Prejudice (1813)",
      genre: ["Romance", "Satire", "Classic"],
      language": "English",
      era": "Victorian & Regency",
      description: "Jane Austen's timeless comedy of manners. Follow the turbulent relationship between Elizabeth Bennet and Fitzwilliam Darcy.",
      poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/PrideAndPrejudiceTitlePage.jpg/440px-PrideAndPrejudiceTitlePage.jpg",
      backdrop: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/PrideAndPrejudiceTitlePage.jpg/1280px-PrideAndPrejudiceTitlePage.jpg",
      duration: "Full Book",
      sourceType": null,
      sourceValue: null,
      bookArchiveId": "prideandprejudic00aust_3",
      tags": ["Jane Austen", "Regency", "Masterpiece"]
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
    }
  ];

  const STATE = {
    movies: MASTER_CATALOG,
    currentMovie: null,
    activeTab: 'home',
    myList: JSON.parse(localStorage.getItem('librisflix_mylist') || '[]'),
    continueWatching: JSON.parse(localStorage.getItem('librisflix_continue') || '{}'),
    watchHistory: JSON.parse(localStorage.getItem('librisflix_history') || '[]')
  };

  function initApp() {
    // 1. Force remove loading screen immediately no matter what
    const loader = document.getElementById('loading-screen');
    if (loader) {
      loader.classList.add('fade-out');
      setTimeout(() => loader.style.display = 'none', 300);
    }

    // 2. Render Hero & Rows
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle && STATE.movies.length > 0) {
      const m = STATE.movies[0];
      heroTitle.textContent = m.title;
      document.getElementById('hero-desc').textContent = m.description;
      document.getElementById('hero-author').textContent = `By ${m.author}`;
      document.getElementById('hero-year').textContent = m.year;
      document.getElementById('hero-backdrop').style.backgroundImage = `url('${m.poster}')`;
      
      document.getElementById('hero-play-btn').onclick = () => openPlayer(m);
      document.getElementById('hero-read-btn').onclick = () => openReader(m);
    }

    renderRows();
    setupEvents();
  }

  function renderRows() {
    const container = document.getElementById('rows-container');
    if (!container) return;
    container.innerHTML = `
      <div class="row-section">
        <h3 class="row-title"><i class="fa fa-film"></i> Library Catalog</h3>
        <div class="movie-track" id="main-track"></div>
      </div>
    `;
    const track = document.getElementById('main-track');
    STATE.movies.forEach(movie => {
      const card = document.createElement('div');
      card.className = 'movie-card';
      card.innerHTML = `
        <img src="${movie.poster}" alt="${movie.title}" class="card-poster" loading="lazy" onerror="this.onerror=null;this.src='https://archive.org/services/img/${movie.bookArchiveId}';">
        <div class="card-overlay">
          <h4 class="card-title">${movie.title}</h4>
          <div class="card-btns">
            ${movie.sourceValue ? `<button class="btn btn-primary btn-sm play-btn"><i class="fa fa-play"></i></button>` : ''}
            <button class="btn btn-secondary btn-sm read-btn"><i class="fa fa-book-open"></i></button>
          </div>
        </div>
      `;
      if (movie.sourceValue) {
        card.querySelector('.play-btn').onclick = (e) => { e.stopPropagation(); openPlayer(movie); };
      }
      card.querySelector('.read-btn').onclick = (e) => { e.stopPropagation(); openReader(movie); };
      track.appendChild(card);
    });
  }

  function openPlayer(movie) {
    const overlay = document.getElementById('player-overlay');
    const container = document.getElementById('player-canvas-container');
    document.getElementById('player-title').textContent = movie.title;
    document.getElementById('player-subtitle').textContent = movie.author;
    container.innerHTML = `<iframe src="https://archive.org/embed/${movie.sourceValue}?autoplay=1" class="clean-stream-frame" allowfullscreen allow="autoplay; fullscreen"></iframe>`;
    overlay.style.display = 'flex';
  }

  function openReader(movie) {
    const overlay = document.getElementById('reader-overlay');
    const iframe = document.getElementById('reader-iframe');
    document.getElementById('reader-title').textContent = movie.originalBook || movie.title;
    document.getElementById('reader-author').textContent = `By ${movie.author}`;
    iframe.src = `https://archive.org/embed/${movie.bookArchiveId || movie.sourceValue}?view=theater`;
    overlay.style.display = 'flex';
  }

  function setupEvents() {
    const backPlayer = document.getElementById('player-back-btn');
    if (backPlayer) {
      backPlayer.onclick = () => {
        document.getElementById('player-canvas-container').innerHTML = '';
        document.getElementById('player-overlay').style.display = 'none';
      };
    }

    const backReader = document.getElementById('reader-back-btn');
    if (backReader) {
      backReader.onclick = () => {
        document.getElementById('reader-iframe').src = '';
        document.getElementById('reader-overlay').style.display = 'none';
      };
    }
  }

  // Failsafe execution
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

  // Absolute safety timeout: Forces loader off after 1 second no matter what
  setTimeout(() => {
    const loader = document.getElementById('loading-screen');
    if (loader) {
      loader.classList.add('fade-out');
      loader.style.display = 'none';
    }
  }, 1000);
})();
