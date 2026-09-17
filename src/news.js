// ============================
// News Page Functionality - OPTIMIZED FOR <1s LOAD
// ============================

// Global variables for Firebase access
const { collection, getDocs, query, where, orderBy, serverTimestamp, onSnapshot, doc, addDoc, deleteDoc, getDoc } = window.firebase;
const auth = window.auth;
const db = window.db;
const provider = window.provider;

// DOM Elements
const newsGrid = document.getElementById('newsGrid');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');
const noResults = document.getElementById('noResults');
const carouselControlsContainer = document.getElementById('carouselControlsContainer');
const newsletterForm = document.getElementById('newsletterForm');
const newsletterMessage = document.getElementById('newsletterMessage');
const commentsModal = document.getElementById('commentsModal');
const modalClose = document.querySelector('.modal-close');
const submitComment = document.getElementById('submitComment');
const commentInput = document.getElementById('commentInput');
const commentsList = document.getElementById('commentsList');

let allArticles = [];
let currentFilter = 'all';
let currentSort = 'newest';
let currentArticleId = null;
let currentPage = 1;
const articlesPerPage = 12;
const FIREBASE_TIMEOUT = 400; // 400ms max for Firebase

// ============================
// Initialize News Page
// ============================
function initializeNewsPage() {
  const startTime = performance.now();
  
  // Show content IMMEDIATELY with sample data
  loadSampleArticles();
  setupEventListeners();
  setupIntersectionObserver();
  
  window.logContentReady('Articles Grid');
  
  // Load Firebase data in background (non-blocking)
  loadArticlesFromFirebase();
}

// ============================
// Load Articles from Firebase (Non-blocking with Timeout)
// ============================
async function loadArticlesFromFirebase() {
  try {
    const firebaseStart = performance.now();
    const articlesRef = collection(db, 'articles');
    const q = query(articlesRef, orderBy('publishedAt', 'desc'));
    
    // Strict timeout - don't wait more than 400ms
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Firebase timeout')), FIREBASE_TIMEOUT)
    );
    
    const querySnapshot = await Promise.race([getDocs(q), timeoutPromise]);
    const loadedArticles = [];
    
    querySnapshot.forEach((doc) => {
      loadedArticles.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Only update if we have articles
    if (loadedArticles.length > 0) {
      allArticles = loadedArticles;
      renderArticles(allArticles);
      const elapsed = Math.round(performance.now() - firebaseStart);
      console.log(`✓ Loaded ${loadedArticles.length} articles in ${elapsed}ms`);
    }
  } catch (error) {
    // Silent fail - sample data already displayed
    console.log('Firebase load timeout - using cached data');
  }
}

// ============================
// Load Sample Articles (for demo)
// ============================
function loadSampleArticles() {
  // Use single source of truth from post-detail.js (window.KASCOTE_SAMPLE_ARTICLES)
  const sampleArticles = window.KASCOTE_SAMPLE_ARTICLES || [];

  allArticles = sampleArticles;
  if (sampleArticles.length > 0) {
    const sorted = applySorting(sampleArticles);
    renderArticles(sorted);
  }
}

// ============================
// Render Articles with Carousel Pagination
// ============================
function renderArticles(articles, resetPage = true) {
  if (articles.length === 0) {
    newsGrid.innerHTML = '';
    noResults.style.display = 'flex';
    carouselControlsContainer.style.display = 'none';
    return;
  }

  noResults.style.display = 'none';
  if (resetPage) {
    currentPage = 1;
  }
  
  // Calculate pagination
  const totalPages = Math.ceil(articles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const paginatedArticles = articles.slice(startIndex, endIndex);
  
  // Render articles in grid
  newsGrid.innerHTML = paginatedArticles.map(article => createNewsCard(article)).join('');
  attachCardEventListeners();
  
  // Show carousel controls if more than one page
  if (totalPages > 1) {
    carouselControlsContainer.style.display = 'block';
    carouselControlsContainer.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; gap: 1rem; flex-wrap: wrap;">
        <button id="prevBtn" class="carousel-btn prev-btn" style="
          background: var(--kascoten-red);
          color: white;
          border: none;
          padding: 0.6rem 1rem;
          border-radius: 0;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          white-space: nowrap;
        ">
          <i class="fas fa-chevron-left"></i> Previous
        </button>
        <div class="page-info" style="font-weight: 600; color: var(--text-muted); min-width: auto; text-align: center; font-size: 0.9rem;">
          Page <span id="currentPageNum">${currentPage}</span> of <span id="totalPageNum">${totalPages}</span>
        </div>
        <button id="nextBtn" class="carousel-btn next-btn" style="
          background: var(--kascoten-red);
          color: white;
          border: none;
          padding: 0.6rem 1rem;
          border-radius: 0;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          white-space: nowrap;
        ">
          Next <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    `;
    attachCarouselListeners(articles, totalPages);
  } else {
    carouselControlsContainer.style.display = 'none';
  }
}

// ============================
// Carousel Navigation Listeners
// ============================
function attachCarouselListeners(articles, totalPages) {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const currentPageNum = document.getElementById('currentPageNum');
  const totalPageNum = document.getElementById('totalPageNum');
  
  if (!prevBtn || !nextBtn) return;
  
  const updateButtons = () => {
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    
    if (currentPage === 1) {
      prevBtn.style.opacity = '0.5';
      prevBtn.style.cursor = 'not-allowed';
    } else {
      prevBtn.style.opacity = '1';
      prevBtn.style.cursor = 'pointer';
    }
    
    if (currentPage === totalPages) {
      nextBtn.style.opacity = '0.5';
      nextBtn.style.cursor = 'not-allowed';
    } else {
      nextBtn.style.opacity = '1';
      nextBtn.style.cursor = 'pointer';
    }
    
    if (currentPageNum) currentPageNum.textContent = currentPage;
    if (totalPageNum) totalPageNum.textContent = totalPages;
  };
  
  updateButtons();
  
  prevBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentPage > 1) {
      currentPage--;
      renderArticles(articles, false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
  
  nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentPage < totalPages) {
      currentPage++;
      renderArticles(articles, false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}



// ============================
// Create News Card HTML with link to detail page
// ============================
function createNewsCard(article) {
  const date = new Date(article.publishedAt.seconds ? article.publishedAt.seconds * 1000 : article.publishedAt);
  const formattedDate = date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });

  const categoryLabel = article.category.charAt(0).toUpperCase() + article.category.slice(1);
  const isVideo = article.imageUrl && /\.(mp4|webm|mov|avi|mkv)$/i.test(article.imageUrl);

  return `
    <div class="news-card" data-article-id="${article.id}" data-category="${article.category}">
      <div class="news-card-image">
        ${isVideo ? 
          `<video src="${article.imageUrl}" autoplay muted loop playsinline loading="lazy" class="lazy-image" style="width: 100%; height: 100%; object-fit: cover;"></video>` : 
          `<img src="${article.imageUrl}" alt="${article.title}" loading="lazy" class="lazy-image">`
        }
        <span class="news-card-badge">${categoryLabel}</span>
      </div>
      <div class="news-card-content">
        <div class="news-card-date">
          <i class="fas fa-calendar-alt"></i>
          <span>${formattedDate}</span>
          <span style="margin-left: auto;">${article.readTime || 5} min read</span>
        </div>
        <h3 class="news-card-title">${article.title}</h3>
        <p class="news-card-excerpt">${article.excerpt}</p>
        <div class="news-card-footer">
          <div class="news-card-author">
            <div class="news-card-author-avatar">${getInitials(article.author)}</div>
            <span>${article.author}</span>
          </div>
          <div class="news-card-actions">
            <button class="card-action-btn like-btn" data-article-id="${article.id}" title="Like this article">
              <i class="far fa-heart"></i>
              <span style="margin-left: 0.3rem; font-size: 0.9rem;">${article.likesCount || 30}</span>
            </button>
            <button class="card-action-btn comment-btn" data-article-id="${article.id}" title="View comments">
              <i class="far fa-comment"></i>
            </button>
            <a href="post-detail.html?id=${article.id}" class="card-action-btn read-more">
              Read More <i class="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================
// Get Initials for Avatar
// ============================
function getInitials(name) {
  if (!name) return 'U';
  const parts = name.split(' ');
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
}

// ============================
// Setup Event Listeners
// ============================
function setupEventListeners() {
  // Search functionality
  searchInput.addEventListener('input', handleSearch);

  // Filter buttons
  filterButtons.forEach(btn => {
    btn.addEventListener('click', handleFilter);
  });

  // Sort dropdown
  const sortDropdown = document.getElementById('sortDropdown');
  if (sortDropdown) {
    sortDropdown.addEventListener('change', handleSort);
  }

  // Newsletter form
  newsletterForm.addEventListener('submit', handleNewsletterSubmit);

  // Modal close
  modalClose.addEventListener('click', closeCommentsModal);
  commentsModal.addEventListener('click', (e) => {
    if (e.target === commentsModal) closeCommentsModal();
  });

  // Submit comment button
  submitComment.addEventListener('click', handleCommentSubmit);
}

// ============================
// Attach Card Event Listeners
// ============================
function attachCardEventListeners() {
  // Like buttons
  document.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', handleLikeArticle);
  });

  // Comment buttons
  document.querySelectorAll('.comment-btn').forEach(btn => {
    btn.addEventListener('click', handleOpenComments);
  });
}

// ============================
// Handle Search
// ============================
function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase();

  const filtered = allArticles.filter(article => 
    article.title.toLowerCase().includes(searchTerm) ||
    article.excerpt.toLowerCase().includes(searchTerm) ||
    article.content.toLowerCase().includes(searchTerm)
  );

  const categoryFiltered = currentFilter === 'all' 
    ? filtered 
    : filtered.filter(a => a.category === currentFilter);

  const sorted = applySorting(categoryFiltered);
  renderArticles(sorted);
}

// ============================
// Handle Filter
// ============================
function handleFilter(e) {
  filterButtons.forEach(btn => btn.classList.remove('active'));
  e.target.classList.add('active');
  
  currentFilter = e.target.dataset.filter;
  
  const searchTerm = searchInput.value.toLowerCase();
  let filtered = allArticles;

  if (searchTerm) {
    filtered = filtered.filter(article => 
      article.title.toLowerCase().includes(searchTerm) ||
      article.excerpt.toLowerCase().includes(searchTerm)
    );
  }

  if (currentFilter !== 'all') {
    filtered = filtered.filter(a => a.category === currentFilter);
  }

  filtered = applySorting(filtered);
  renderArticles(filtered);
}

// ============================
// Handle Sort
// ============================
function handleSort(e) {
  currentSort = e.target.value;
  
  const searchTerm = searchInput.value.toLowerCase();
  let filtered = allArticles;

  if (searchTerm) {
    filtered = filtered.filter(article => 
      article.title.toLowerCase().includes(searchTerm) ||
      article.excerpt.toLowerCase().includes(searchTerm) ||
      article.content.toLowerCase().includes(searchTerm)
    );
  }

  if (currentFilter !== 'all') {
    filtered = filtered.filter(a => a.category === currentFilter);
  }

  filtered = applySorting(filtered);
  renderArticles(filtered);
}

// ============================
// Apply Sorting
// ============================
function applySorting(articles) {
  const sorted = [...articles];
  
  // Helper function to convert publishedAt to timestamp
  const getTimestamp = (publishedAt) => {
    if (!publishedAt) return 0;
    if (typeof publishedAt === 'object' && publishedAt.seconds) {
      return publishedAt.seconds * 1000;
    }
    if (publishedAt instanceof Date) {
      return publishedAt.getTime();
    }
    return new Date(publishedAt).getTime() || 0;
  };
  
  switch(currentSort) {
    case 'newest':
      sorted.sort((a, b) => getTimestamp(b.publishedAt) - getTimestamp(a.publishedAt));
      break;
    case 'oldest':
      sorted.sort((a, b) => getTimestamp(a.publishedAt) - getTimestamp(b.publishedAt));
      break;
    case 'alphabetical':
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'most-liked':
      sorted.sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
      break;
    default:
      sorted.sort((a, b) => getTimestamp(b.publishedAt) - getTimestamp(a.publishedAt));
  }
  
  return sorted;
}

// ============================
// Handle Like Article
// ============================
function handleLikeArticle(e) {
  e.preventDefault();
  const btn = e.currentTarget;
  const articleId = btn.dataset.articleId;
  const currentUser = auth.currentUser;

  if (!currentUser) {
    alert('Please log in to like articles');
    return;
  }

  // Find the article in shared articles
  const article = window.KASCOTE_SAMPLE_ARTICLES.find(a => a.id === articleId);
  if (!article) {
    console.error('Article not found');
    return;
  }

  try {
    // Toggle like on the article object
    if (!article.userLiked) {
      article.likesCount++;
      article.userLiked = true;
      btn.classList.add('liked');
      btn.innerHTML = '<i class="fas fa-heart"></i>';
    } else {
      article.likesCount--;
      article.userLiked = false;
      btn.classList.remove('liked');
      btn.innerHTML = '<i class="far fa-heart"></i>';
    }
    
    console.log(`Article ${articleId} likes updated to ${article.likesCount}`);
  } catch (error) {
    console.error('Error liking article:', error);
    alert('Error updating like. Please try again.');
  }
}

// ============================
// Handle Open Comments
// ============================
function handleOpenComments(e) {
  e.preventDefault();
  const articleId = e.currentTarget.dataset.articleId;
  currentArticleId = articleId;
  
  loadComments(articleId);
  commentsModal.classList.add('active');
}

// ============================
// Load Comments
// ============================
function loadComments(articleId) {
  const commentsRef = collection(db, 'articles', articleId, 'comments');
  const q = query(commentsRef, orderBy('createdAt', 'desc'));

  onSnapshot(q, (snapshot) => {
    commentsList.innerHTML = '';
    
    if (snapshot.empty) {
      commentsList.innerHTML = '<p style="text-align: center; color: #888; padding: 1rem;">No comments yet. Be the first to comment!</p>';
    } else {
      snapshot.forEach((doc) => {
        const comment = doc.data();
        const date = new Date(comment.createdAt.seconds * 1000);
        const timeAgo = getTimeAgo(date);

        commentsList.innerHTML += `
          <div class="comment">
            <div class="comment-avatar">${getInitials(comment.author)}</div>
            <div class="comment-body">
              <div class="comment-author">${comment.author}</div>
              <div class="comment-text">${comment.text}</div>
              <div class="comment-time">${timeAgo}</div>
            </div>
          </div>
        `;
      });
    }
  });
}

// ============================
// Handle Comment Submit
// ============================
async function handleCommentSubmit(e) {
  e.preventDefault();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    alert('Please log in to comment');
    return;
  }

  if (!commentInput.value.trim()) {
    alert('Please enter a comment');
    return;
  }

  try {
    const commentsRef = collection(db, 'articles', currentArticleId, 'comments');
    await addDoc(commentsRef, {
      text: commentInput.value.trim(),
      author: currentUser.displayName || currentUser.email,
      userId: currentUser.uid,
      createdAt: serverTimestamp()
    });

    commentInput.value = '';
  } catch (error) {
    console.error('Error posting comment:', error);
    alert('Error posting comment. Please try again.');
  }
}

// ============================
// Handle Read More (removed - now uses direct link)
// ============================

// ============================
// Setup Intersection Observer for Lazy Loading
// ============================
function setupIntersectionObserver() {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        } else if (img.classList.contains('lazy-image')) {
          observer.unobserve(img);
        }
      }
    });
  }, {
    rootMargin: '50px'
  });

  // Observe images when rendered
  setTimeout(() => {
    document.querySelectorAll('.lazy-image').forEach(img => {
      imageObserver.observe(img);
    });
  }, 100);
}

// ============================
// Handle Newsletter Submit
// ============================
async function handleNewsletterSubmit(e) {
  e.preventDefault();
  const email = newsletterForm.querySelector('.newsletter-input').value;

  if (!email) {
    showNewsletterMessage('Please enter an email address', 'error');
    return;
  }

  try {
    const subscribersRef = collection(db, 'newsletter_subscribers');
    await addDoc(subscribersRef, {
      email: email.toLowerCase(),
      subscribedAt: serverTimestamp(),
      status: 'active'
    });

    showNewsletterMessage('Thank you for subscribing!', 'success');
    newsletterForm.reset();
  } catch (error) {
    console.error('Error subscribing:', error);
    showNewsletterMessage('Error subscribing. Please try again.', 'error');
  }
}

// ============================
// Show Newsletter Message
// ============================
function showNewsletterMessage(message, type) {
  newsletterMessage.textContent = message;
  newsletterMessage.className = `newsletter-message ${type}`;
  
  setTimeout(() => {
    newsletterMessage.textContent = '';
  }, 4000);
}

// ============================
// Close Comments Modal
// ============================
function closeCommentsModal() {
  commentsModal.classList.remove('active');
  currentArticleId = null;
}

// ============================
// Utility: Get Time Ago
// ============================
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;

  if (interval > 1) return Math.floor(interval) + ' years ago';
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';
  return Math.floor(seconds) + ' seconds ago';
}

// ============================
// Initialize on DOM Ready
// ============================
document.addEventListener('DOMContentLoaded', initializeNewsPage);

// Alternative: Initialize immediately if DOM is already ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeNewsPage);
} else {
  initializeNewsPage();
}
