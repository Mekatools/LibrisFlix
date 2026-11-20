let allMovies = [];
let currentFilter = 'all';

// Load movies from movies.json
async function loadMovies() {
  try {
    const res = await fetch('movies.json');
    allMovies = await res.json();
    renderMovies(allMovies);
  } catch (err) {
    console.error('Failed to load movies.json', err);
  }
}

// Render cards
function renderMovies(movies) {
  const grid = document.getElementById('moviesGrid');
  grid.innerHTML = '';

  if (movies.length === 0) {
    grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #94a3b8;">No movies found.</p>`;
    return;
  }

  movies.forEach(movie => {
    const card = document.createElement('div');
    card.className = 'movie-card';

    const litSection = movie.isLiterature
      ? `<div class="lit-info">📚 <strong>${movie.literature.bookTitle}</strong> by ${movie.literature.author}</div>`
      : '';

    const readBtn = movie.literature?.bookUrl
      ? `<a href="${movie.literature.bookUrl}" target="_blank" rel="noopener" class="btn-read">📖 Read Book</a>`
      : '';

    card.innerHTML = `
      <div class="poster-box">
        <img src="${movie.poster}" alt="${movie.title}" loading="lazy" />
        <span class="lang-tag">${movie.language}</span>
      </div>
      <div class="movie-content">
        <h3>${movie.title} (${movie.year})</h3>
        ${litSection}
        <p class="desc">${movie.description}</p>
        <div class="card-actions">
          <button class="btn-watch" onclick="openPlayer('${movie.title}', '${movie.videoUrl}')">▶ Watch</button>
          ${readBtn}
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

// Filter handling
function applyFilters() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();

  const filtered = allMovies.filter(movie => {
    // Language / Literature filter
    let matchesCategory = true;
    if (currentFilter === 'English' || currentFilter === 'Hindi') {
      matchesCategory = movie.language === currentFilter;
    } else if (currentFilter === 'literature') {
      matchesCategory = movie.isLiterature === true;
    }

    // Search filter
    const matchesSearch =
      movie.title.toLowerCase().includes(searchTerm) ||
      (movie.literature?.author && movie.literature.author.toLowerCase().includes(searchTerm)) ||
      (movie.genre && movie.genre.toLowerCase().includes(searchTerm));

    return matchesCategory && matchesSearch;
  });

  renderMovies(filtered);
}

// Filter button clicks
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    applyFilters();
  });
});

// Live search typing
document.getElementById('searchInput').addEventListener('input', applyFilters);

// Video Player Modal
const modal = document.getElementById('videoModal');
const iframe = document.getElementById('videoIframe');
const titleElem = document.getElementById('modalTitle');

window.openPlayer = function(title, url) {
  titleElem.innerText = title;
  iframe.src = url;
  modal.style.display = 'flex';
};

document.getElementById('closeBtn').addEventListener('click', () => {
  modal.style.display = 'none';
  iframe.src = '';
});

// Close modal if user clicks outside the video box
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
    iframe.src = '';
  }
});

// Start app
loadMovies();
