// ============================
// Visitations Page Functionality - MIRRORS NEWS PAGE
// ============================

// Global variables for Firebase access
const { collection, getDocs, query, where, orderBy, serverTimestamp, onSnapshot, doc, addDoc, deleteDoc, getDoc } = window.firebase || {};
const auth = window.auth;
const db = window.db;

// DOM Elements
const visitationsGrid = document.getElementById('visitationsGrid');
const newsletterForm = document.getElementById('newsletterForm');
const newsletterMessage = document.getElementById('newsletterMessage');
const commentsModal = document.getElementById('commentsModal');
const modalClose = document.querySelector('.modal-close');
const submitComment = document.getElementById('submitComment');
const commentInput = document.getElementById('commentInput');
const commentsList = document.getElementById('commentsList');

let allArticles = [];
let currentSort = 'newest';
let currentArticleId = null;

// ============================
// Initialize Visitations Page
// ============================
function initializeVisitationsPage() {
  // Show content IMMEDIATELY with sample data
  loadSampleArticles();
  setupEventListeners();
  setupIntersectionObserver();
  
  window.logContentReady('Visitations Grid');
}

// ============================
// Load Sample Articles (for demo)
// ============================
function loadSampleArticles() {
  // Use single source of truth from shared-articles.js
  const sampleArticles = window.KASCOTE_SAMPLE_ARTICLES || [];

  // Filter only visitation articles
  const visitationArticles = sampleArticles.filter(article => article.category === 'visitations');
  
  allArticles = visitationArticles;
  if (visitationArticles.length > 0) {
    const sorted = applySorting(visitationArticles);
    renderArticles(sorted);
  }
}

// ============================
// Render Articles
// ============================
function renderArticles(articles) {
  if (articles.length === 0) {
    visitationsGrid.innerHTML = '';
    return;
  }

  // Render articles in grid
  visitationsGrid.innerHTML = articles.map(article => createNewsCard(article)).join('');
  attachCardEventListeners();
}

// ============================
// Create News Card HTML
// ============================
function createNewsCard(article) {
  const date = new Date(article.publishedAt.seconds ? article.publishedAt.seconds * 1000 : article.publishedAt);
  const formattedDate = date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });

  const categoryLabel = 'Visitation';
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
            <button class="card-action-btn like-btn" data-article-id="${article.id}" title="Like this visitation">
              <i class="far fa-heart"></i>
              <span style="margin-left: 0.3rem; font-size: 0.9rem;">${article.likesCount || 50}</span>
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
  // Sort dropdown
  const sortDropdown = document.getElementById('visitationsSortDropdown');
  if (sortDropdown) {
    sortDropdown.addEventListener('change', handleSort);
  }

  // Newsletter form
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', handleNewsletterSubmit);
  }

  // Modal close
  if (modalClose) {
    modalClose.addEventListener('click', closeCommentsModal);
  }
  if (commentsModal) {
    commentsModal.addEventListener('click', (e) => {
      if (e.target === commentsModal) closeCommentsModal();
    });
  }

  // Submit comment button
  if (submitComment) {
    submitComment.addEventListener('click', handleCommentSubmit);
  }
}

// ============================
// Handle Sort
// ============================
function handleSort(e) {
  currentSort = e.target.value;
  const sorted = applySorting(allArticles);
  renderArticles(sorted);
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
    return new Date(publishedAt).getTime();
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
// Handle Like Article
// ============================
function handleLikeArticle(e) {
  e.preventDefault();
  const btn = e.currentTarget;
  const articleId = btn.dataset.articleId;
  const currentUser = auth?.currentUser;

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
  if (commentsModal) {
    commentsModal.classList.add('active');
  }
}

// ============================
// Load Comments
// ============================
function loadComments(articleId) {
  if (!db || !commentsList) return;
  
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
  const currentUser = auth?.currentUser;

  if (!currentUser) {
    alert('Please log in to comment');
    return;
  }

  if (!commentInput || !commentInput.value.trim()) {
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
  
  if (!db) {
    showNewsletterMessage('Newsletter subscription temporarily unavailable', 'error');
    return;
  }
  
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
  if (!newsletterMessage) return;
  
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
  if (commentsModal) {
    commentsModal.classList.remove('active');
  }
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
document.addEventListener('DOMContentLoaded', initializeVisitationsPage);

// Alternative: Initialize immediately if DOM is already ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeVisitationsPage);
} else {
  initializeVisitationsPage();
}

