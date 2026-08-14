// ============================
// Load Recent News on Homepage - OPTIMIZED
// ============================

// Wait for Firebase to be available
function waitForFirebase() {
  return new Promise((resolve) => {
    if (window.firebase && window.db) {
      resolve();
    } else {
      const check = setInterval(() => {
        if (window.firebase && window.db) {
          clearInterval(check);
          resolve();
        }
      }, 100);
      setTimeout(() => clearInterval(check), 2000); // Timeout after 2s
    }
  });
}

const recentNewsGrid = document.getElementById('recentNewsGrid');
const homepageFilterButtons = document.querySelectorAll('.filter-tags .filter-btn');
const HOMEPAGE_TIMEOUT = 300; // 300ms max
let allHomepageArticles = [];
let currentHomepageFilter = 'all';

// Load recent news immediately with sample data fallback
if (recentNewsGrid) {
  console.log('🔄 Homepage news: Initializing...');
  
  // Show sample data FIRST
  loadSampleArticlesOnHomepage();
  
  // Then load Firebase in background
  waitForFirebase().then(() => {
    loadRecentNewsOnHomepage();
  }).catch((err) => {
    console.log('Firebase not available, using sample data');
  });
}

async function loadRecentNewsOnHomepage() {
  try {
    if (!window.firebase || !window.db) {
      console.log('⚠️ Firebase not initialized on homepage');
      return;
    }
    
    const { collection, getDocs, query, orderBy, limit } = window.firebase;
    const db = window.db;
    
    const loadStart = performance.now();
    const articlesRef = collection(db, 'articles');
    const q = query(articlesRef, orderBy('publishedAt', 'desc'), limit(6));
    
    // Strict timeout for homepage
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), HOMEPAGE_TIMEOUT)
    );
    
    const querySnapshot = await Promise.race([getDocs(q), timeoutPromise]);
    const articles = [];
    
    querySnapshot.forEach((doc) => {
      articles.push({
        id: doc.id,
        ...doc.data()
      });
    });

    if (articles.length > 0) {
      renderRecentNewsCards(articles);
      const elapsed = Math.round(performance.now() - loadStart);
      console.log(`✓ Homepage news loaded in ${elapsed}ms`);
    }
  } catch (error) {
    console.log('Firebase timeout - using sample data on homepage');
  }
}

function loadSampleArticlesOnHomepage() {
  const sampleArticles = window.KASCOTE_SAMPLE_ARTICLES || [];
  allHomepageArticles = sampleArticles;
  setupHomepageFilters();
  renderHomepageArticles(sampleArticles);
}

function renderRecentNewsCards(articles) {
  recentNewsGrid.innerHTML = articles.map(article => createRecentNewsCard(article)).join('');
}

function createRecentNewsCard(article) {
  const date = new Date(article.publishedAt.seconds ? article.publishedAt.seconds * 1000 : article.publishedAt);
  const formattedDate = date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });

  const categoryLabel = article.category.charAt(0).toUpperCase() + article.category.slice(1);

  return `
    <a href="post-detail.html?id=${article.id}" class="recent-news-card">
      <div class="recent-news-card-image">
        <img src="${article.imageUrl}" alt="${article.title}" loading="lazy">
      </div>
      <div class="recent-news-card-content">
        <span class="recent-news-card-category">${categoryLabel}</span>
        <div class="recent-news-card-date">${formattedDate}</div>
        <h3 class="recent-news-card-title">${article.title}</h3>
        <p class="recent-news-card-excerpt">${article.excerpt}</p>
        <div class="recent-news-card-footer">
          <span class="recent-news-author">${article.author}</span>
          <span class="recent-news-link">Read More →</span>
        </div>
      </div>
    </a>
  `;
}

// ============================
// Setup Homepage Filters
// ============================
function setupHomepageFilters() {
  homepageFilterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      homepageFilterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentHomepageFilter = btn.getAttribute('data-filter');
      renderHomepageArticles(allHomepageArticles);
    });
  });
}

// ============================
// Render Homepage Articles with Filtering
// ============================
function renderHomepageArticles(articles) {
  let filteredArticles = articles;
  
  if (currentHomepageFilter !== 'all') {
    filteredArticles = articles.filter(article => article.category === currentHomepageFilter);
  }
  
  // Show first 6 articles
  const displayArticles = filteredArticles.slice(0, 6);
  renderRecentNewsCards(displayArticles);
}
