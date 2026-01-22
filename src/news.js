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
const newsletterForm = document.getElementById('newsletterForm');
const newsletterMessage = document.getElementById('newsletterMessage');
const commentsModal = document.getElementById('commentsModal');
const modalClose = document.querySelector('.modal-close');
const submitComment = document.getElementById('submitComment');
const commentInput = document.getElementById('commentInput');
const commentsList = document.getElementById('commentsList');

let allArticles = [];
let currentFilter = 'all';
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
  const sampleArticles = [
    {
      id: '1',
      title: 'KASCOTE Strengthens Trade Ties with Indonesia',
      excerpt: 'KASCOTE proudly represented Nigeria at the prestigious 40th Indonesian Trade Expo 2025, forging new partnerships and trade opportunities for our members in Asia.',
      content: 'KASCOTE proudly represented Nigeria at the prestigious 40th Indonesian Trade Expo 2025, where Chairman and President Alhaji Hassan Yaro stood shoulder to shoulder with international business leaders. This landmark trade mission showcases Kano\'s commitment to global commerce and entrepreneurship.',
      imageUrl: 'KASCOTEN IMAGES/indonesian trade expo 2025/Indonesian-trade-expo-25-2.1.jpg',
      category: 'news',
      author: 'KASCOTE Communications',
      publishedAt: new Date(2025, 11, 20),
      readTime: 5
    },
    {
      id: '2',
      title: 'Sommet de l\'Elevage: Kano\'s Agricultural Innovation Showcased',
      excerpt: 'Our delegation participated in the world\'s leading sustainable livestock show in France, showcasing Kano\'s agricultural potential to 120,000+ international visitors.',
      content: 'In October 2025, KASCOTE attended Sommet de l\'élevage — the world\'s No.1 sustainable livestock and agricultural show in France. This event drew over 120,000 visitors from 90 countries, providing an exceptional platform for Kano\'s traders and farmers to showcase their products and establish international connections.',
      imageUrl: 'KASCOTEN IMAGES/Sommet de l\'élevage Visit/Sommet de l\'élevage Visit6.jpg',
      category: 'events',
      author: 'KASCOTE Leadership',
      publishedAt: new Date(2025, 9, 15),
      readTime: 6
    },
    {
      id: '3',
      title: 'Understanding Global Trade Opportunities for MSMEs',
      excerpt: 'A comprehensive guide on how small and medium enterprises can leverage international trade missions to expand their market reach.',
      content: 'Small and medium enterprises (MSMEs) form the backbone of Kano\'s economy. In this article, we explore key strategies for MSMEs to participate in global trade, from preparation to execution. Learn how KASCOTE\'s trade missions create pathways to international markets.',
      imageUrl: 'KASCOTEN IMAGES/year-2026-new-yaer-flyer.jpeg',
      category: 'blog',
      author: 'Business Development Team',
      publishedAt: new Date(2025, 11, 10),
      readTime: 7
    },
    {
      id: '4',
      title: 'New Year 2026: Setting Business Goals for Growth',
      excerpt: 'As we step into 2026, discover strategies to set ambitious yet achievable business goals and leverage KASCOTE\'s resources for success.',
      content: 'The new year brings fresh opportunities for Kano\'s business community. Whether you\'re a trader, farmer, or manufacturer, this guide provides actionable strategies for setting 2026 goals. Learn how KASCOTE\'s programs can support your growth journey.',
      imageUrl: 'KASCOTEN IMAGES/year-2026-new-yaer-flyer.jpeg',
      category: 'insights',
      author: 'Strategic Planning Office',
      publishedAt: new Date(2026, 0, 5),
      readTime: 8
    },
    {
      id: '5',
      title: 'KASCOTE Delegation Visits Nigerian Embassy in Indonesia',
      excerpt: 'A diplomatic mission strengthening bilateral business relations between Nigeria and Indonesia through official government channels.',
      content: 'As part of their official trade mission to Jakarta, Indonesia, the leadership and members of KASCOTE paid a courtesy visit to the Embassy of the Federal Republic of Nigeria in Indonesia. This diplomatic engagement reinforces our commitment to fostering international business partnerships at the highest levels.',
      imageUrl: 'KASCOTEN IMAGES/indonesian trade expo 2025/Indonesian-trade-expo-25-8.jpg',
      category: 'news',
      author: 'KASCOTE Leadership',
      publishedAt: new Date(2025, 11, 12),
      readTime: 4
    },
    {
      id: '6',
      title: 'Women Entrepreneurs in Kano: Breaking Barriers',
      excerpt: 'Celebrating the achievements of Kano\'s women entrepreneurs and exploring support programs available through KASCOTE.',
      content: 'Women entrepreneurs are driving innovation and economic growth in Kano. This article highlights success stories from our female members and discusses resources KASCOTE provides to support women in business, including networking opportunities and mentorship programs.',
      imageUrl: 'https://res.cloudinary.com/dfvumcrsy/image/upload/v1753270696/kascoten-membership_jeh8uq.jpg',
      category: 'blog',
      author: 'Women\'s Business Initiative',
      publishedAt: new Date(2025, 10, 28),
      readTime: 6
    }
  ];

  allArticles = sampleArticles;
  renderArticles(allArticles);
}

// ============================
// Render Articles with Pagination
// ============================
function renderArticles(articles) {
  if (articles.length === 0) {
    newsGrid.innerHTML = '';
    noResults.style.display = 'flex';
    return;
  }

  noResults.style.display = 'none';
  
  // Show only articles for current page
  const startIndex = 0;
  const endIndex = articlesPerPage;
  const paginated = articles.slice(startIndex, endIndex);
  
  newsGrid.innerHTML = paginated.map(article => createNewsCard(article)).join('');
  attachCardEventListeners();
  
  // Add pagination info
  if (articles.length > articlesPerPage) {
    newsGrid.innerHTML += `
      <div class="pagination-info" style="grid-column: 1/-1; text-align: center; padding: 2rem 0; color: var(--text-muted);">
        <p>Showing ${endIndex} of ${articles.length} articles</p>
        <button class="load-more-btn" id="loadMoreBtn" style="
          background: var(--kascoten-red);
          color: white;
          border: none;
          padding: 0.8rem 2rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          margin-top: 1rem;
        ">Load More</button>
      </div>
    `;
    
    document.getElementById('loadMoreBtn').addEventListener('click', () => {
      loadMoreArticles(articles);
    });
  }
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

  return `
    <div class="news-card" data-article-id="${article.id}" data-category="${article.category}">
      <div class="news-card-image">
        <img src="${article.imageUrl}" alt="${article.title}" loading="lazy" class="lazy-image">
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

  renderArticles(categoryFiltered);
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

  renderArticles(filtered);
}

// ============================
// Handle Like Article
// ============================
async function handleLikeArticle(e) {
  e.preventDefault();
  const btn = e.currentTarget;
  const articleId = btn.dataset.articleId;
  const currentUser = auth.currentUser;

  if (!currentUser) {
    alert('Please log in to like articles');
    return;
  }

  try {
    const likeRef = doc(db, 'articles', articleId, 'likes', currentUser.uid);
    const likeSnap = await getDoc(likeRef);

    if (likeSnap.exists()) {
      await deleteDoc(likeRef);
      btn.classList.remove('liked');
      btn.innerHTML = '<i class="far fa-heart"></i>';
    } else {
      await addDoc(collection(db, 'articles', articleId, 'likes'), {
        userId: currentUser.uid,
        createdAt: serverTimestamp()
      });
      btn.classList.add('liked');
      btn.innerHTML = '<i class="fas fa-heart"></i>';
    }
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
// Load More Articles
// ============================
function loadMoreArticles(articles) {
  const startIndex = articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const newArticles = articles.slice(startIndex, endIndex);
  
  const paginationInfo = document.querySelector('.pagination-info');
  
  newArticles.forEach(article => {
    const cardHTML = createNewsCard(article);
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = cardHTML;
    newsGrid.insertBefore(tempDiv.firstChild, paginationInfo);
  });
  
  articlesPerPage += articlesPerPage;
  
  if (endIndex >= articles.length) {
    paginationInfo.remove();
  } else {
    paginationInfo.querySelector('p').textContent = `Showing ${endIndex} of ${articles.length} articles`;
  }
  
  attachCardEventListeners();
}

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
