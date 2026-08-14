// ============================
// Post Detail Page JavaScript - OPTIMIZED FOR <1s LOAD
// ============================

// Wait for Firebase to be available
function waitForFirebase() {
  return new Promise((resolve) => {
    if (window.firebase && window.db && window.auth) {
      resolve();
    } else {
      const check = setInterval(() => {
        if (window.firebase && window.db && window.auth) {
          clearInterval(check);
          resolve();
        }
      }, 100);
      setTimeout(() => clearInterval(check), 2000);
    }
  });
}

// DOM Elements
const postLoading = document.getElementById('postLoading');
const postDetailContainer = document.getElementById('postDetailContainer');
const relatedArticlesSection = document.getElementById('relatedArticlesSection');
const shareBtn = document.getElementById('shareBtn');
const shareBtn2 = document.getElementById('shareBtn2');
const likeBtn = document.getElementById('likeBtn');
const commentBtn = document.getElementById('commentBtn');
const commentForm = document.getElementById('commentForm');
const submitCommentBtn = document.getElementById('submitCommentBtn');
const commentTextarea = document.getElementById('commentTextarea');
const commentsList = document.getElementById('commentsList');

let currentArticleId = null;
let currentArticle = null;
const FIREBASE_TIMEOUT = 300; // 300ms max for Firebase calls

// Article data is now loaded from shared-articles.js
// (loaded before this script in the HTML file)
// Backward compatibility alias
const sampleArticlesForDetail = window.KASCOTE_SAMPLE_ARTICLES;

// ============================
// Initialize Post Detail Page - Non-blocking
// ============================
async function initializePostDetailPage() {
  const startTime = performance.now();
  
  // Wait for Firebase to be available
  await waitForFirebase();
  
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get('id');

  if (!articleId) {
    postLoading.innerHTML = `
      <i class="fas fa-exclamation-circle"></i>
      <p>No article specified. <a href="news.html">Back to news</a></p>
    `;
    return;
  }

  currentArticleId = articleId;
  likeBtn.dataset.articleId = articleId;
  commentBtn.dataset.articleId = articleId;

  // Load article detail with timeout
  await loadArticleDetail(articleId);
  setupEventListeners();
  
  window.logContentReady('Article Detail');
  
  // Load comments and related articles in parallel (non-blocking)
  loadComments(articleId);
  loadRelatedArticles(articleId);
}

// ============================
// Load Article Detail (with Timeout)
// ============================
async function loadArticleDetail(articleId) {
  try {
    if (!window.firebase || !window.db) {
      throw new Error('Firebase not initialized');
    }
    
    const { doc, getDoc } = window.firebase;
    const db = window.db;
    
    const loadStart = performance.now();
    const docRef = doc(db, 'articles', articleId);
    
    // Set strict timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Load timeout')), FIREBASE_TIMEOUT)
    );
    
    const docSnap = await Promise.race([getDoc(docRef), timeoutPromise]);

    if (docSnap.exists()) {
      currentArticle = {
        id: docSnap.id,
        ...docSnap.data()
      };

      renderArticleDetail(currentArticle);
      postLoading.style.display = 'none';
      postDetailContainer.style.display = 'block';

      const elapsed = Math.round(performance.now() - loadStart);
      console.log(`✓ Article loaded in ${elapsed}ms`);

      // Load engagement data without waiting
      loadEngagementData(articleId);
    } else {
      // Check sample data if Firebase doesn't have it
      const sampleArticle = sampleArticlesForDetail.find(a => a.id === articleId);
      if (sampleArticle) {
        currentArticle = sampleArticle;
        renderArticleDetail(currentArticle);
        postLoading.style.display = 'none';
        postDetailContainer.style.display = 'block';
        console.log('✓ Sample article loaded');
      } else {
        postLoading.innerHTML = `
          <i class="fas fa-exclamation-circle"></i>
          <p>Article not found. <a href="news.html">Back to news</a></p>
        `;
      }
    }
  } catch (error) {
    console.log('Article load error - checking sample data', error.message);
    // Check sample data on error
    const sampleArticle = sampleArticlesForDetail.find(a => a.id === articleId);
    if (sampleArticle) {
      currentArticle = sampleArticle;
      renderArticleDetail(currentArticle);
      postLoading.style.display = 'none';
      postDetailContainer.style.display = 'block';
      console.log('✓ Sample article loaded (from error fallback)');
    } else {
      postLoading.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <p>Error loading article. <a href="news.html">Back to news</a></p>
      `;
    }
  }
}

// ============================
// Render Article Detail
// ============================
function renderArticleDetail(article) {
  const date = new Date(article.publishedAt.seconds ? article.publishedAt.seconds * 1000 : article.publishedAt);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const categoryLabel = (article.category || 'News').charAt(0).toUpperCase() + (article.category || 'News').slice(1);

  // Update breadcrumb
  document.getElementById('breadcrumbTitle').textContent = article.title;

  // Update meta
  document.getElementById('articleCategory').textContent = categoryLabel;
  document.getElementById('articleDate').innerHTML = `<i class="fas fa-calendar"></i> ${formattedDate}`;
  document.getElementById('readTime').innerHTML = `<i class="fas fa-clock"></i> ${article.readTime || 5} min read`;

  // Update title
  document.getElementById('articleTitle').textContent = article.title;

  // Update author info
  document.getElementById('authorName').textContent = article.author;
  document.getElementById('authorBio').textContent = `Published on ${formattedDate}`;
  document.getElementById('authorAvatar').textContent = getInitials(article.author);

  // Update featured image
  document.getElementById('featuredImage').src = article.imageUrl;
  document.getElementById('featuredImage').alt = article.title;
  if (article.imageCaption) {
    document.getElementById('imageCaption').textContent = article.imageCaption;
  }

  // Update content
  const contentDiv = document.getElementById('articleContent');
  contentDiv.innerHTML = parseContent(article.content);

  // Update page title
  document.title = `${article.title} - KASCOTE`;

  // Handle gallery images
  if (article.images && article.images.length > 0) {
    renderImageGallery(article.images);
  }

  // Handle tags
  if (article.tags && article.tags.length > 0) {
    renderTags(article.tags);
  }
}

// ============================
// Parse Content (support markdown-like syntax)
// ============================
function parseContent(content) {
  if (!content) return '';

  let html = content
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.+)$/gm, '<p>$1</p>')
    .replace(/<p><\/p>/g, '')
    .replace(/\[image:([^\]]+)\]/g, '<img src="$1" alt="article image" loading="lazy">')
    .replace(/\[gallery:([^\]]+)\]/g, '<div class="embedded-gallery" data-gallery="$1"></div>');

  // Handle basic markdown-like headers in content
  html = html.replace(/<p>## (.*?)<\/p>/g, '<h2>$1</h2>');
  html = html.replace(/<p>### (.*?)<\/p>/g, '<h3>$1</h3>');

  return html;
}

// ============================
// Render Image Gallery
// ============================
function renderImageGallery(images) {
  const gallerySection = document.getElementById('imageGallerySection');
  const galleryDiv = document.getElementById('imageGallery');

  if (!images || images.length === 0) return;

  gallerySection.style.display = 'block';
  galleryDiv.innerHTML = images.map((img, index) => {
    const isVideo = /\.(mp4|webm|mov|avi|mkv)$/i.test(img.url);
    return `
    <div class="gallery-image-item" data-index="${index}">
      ${isVideo ? 
        `<video src="${img.url}" controls loading="lazy" style="width: 100%; height: 100%; object-fit: cover;"></video>` :
        `<img src="${img.url}" alt="${img.caption || 'Gallery item'}" loading="lazy">`
      }
      <div class="gallery-image-overlay">
        <i class="fas fa-expand"></i>
      </div>
    </div>
  `;
  }).join('');

  // Add click handlers for lightbox
  galleryDiv.querySelectorAll('.gallery-image-item').forEach(item => {
    item.addEventListener('click', () => {
      const index = parseInt(item.dataset.index);
      openImageLightbox(images, index);
    });
  });
}

// ============================
// Open Image Lightbox
// ============================
function openImageLightbox(images, startIndex) {
  const isVideo = /\.(mp4|webm|mov|avi|mkv)$/i.test(images[startIndex].url);
  
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox-overlay';
  lightbox.innerHTML = `
    <div class="lightbox-content">
      <button class="lightbox-close">&times;</button>
      <button class="lightbox-prev">&lt;</button>
      ${isVideo ? 
        `<video class="lightbox-video" src="${images[startIndex].url}" controls style="max-width: 100%; max-height: 80vh; object-fit: contain;"></video>` :
        `<img class="lightbox-image" src="${images[startIndex].url}" alt="Full size">`
      }
      <button class="lightbox-next">&gt;</button>
      <div class="lightbox-caption">${images[startIndex].caption || ''}</div>
    </div>
  `;

  document.body.appendChild(lightbox);

  let currentIndex = startIndex;

  lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.remove());
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.remove();
  });

  lightbox.querySelector('.lightbox-prev').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateLightboxMedia();
  });

  lightbox.querySelector('.lightbox-next').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateLightboxMedia();
  });

  function updateLightboxMedia() {
    const isCurrentVideo = /\.(mp4|webm|mov|avi|mkv)$/i.test(images[currentIndex].url);
    const mediaContainer = lightbox.querySelector('.lightbox-content');
    const oldMedia = mediaContainer.querySelector('.lightbox-image, .lightbox-video');
    
    if (oldMedia) oldMedia.remove();
    
    const newMedia = isCurrentVideo ? 
      document.createElement('video') : 
      document.createElement('img');
    
    if (isCurrentVideo) {
      newMedia.className = 'lightbox-video';
      newMedia.src = images[currentIndex].url;
      newMedia.controls = true;
      newMedia.style.cssText = 'max-width: 100%; max-height: 80vh; object-fit: contain;';
    } else {
      newMedia.className = 'lightbox-image';
      newMedia.src = images[currentIndex].url;
      newMedia.alt = 'Full size';
      newMedia.style.cssText = 'max-width: 100%; max-height: 80vh; object-fit: contain;';
    }
    
    // Insert before caption
    const caption = mediaContainer.querySelector('.lightbox-caption');
    mediaContainer.insertBefore(newMedia, caption);
    
    lightbox.querySelector('.lightbox-caption').textContent = images[currentIndex].caption || '';
  }
}

// ============================
// Render Tags
// ============================
function renderTags(tags) {
  const tagsDiv = document.getElementById('articleTags');
  tagsDiv.innerHTML = tags.map(tag => `<a href="news.html?tag=${tag}" class="article-tag">#${tag}</a>`).join('');
}

// ============================
// Load Engagement Data
// ============================
async function loadEngagementData(articleId) {
  try {
    if (!window.firebase || !window.db) {
      console.log('Firebase not ready for engagement data');
      return;
    }
    
    const { collection, onSnapshot } = window.firebase;
    const db = window.db;
    const auth = window.auth;
    
    // Load likes count
    const likesRef = collection(db, 'articles', articleId, 'likes');
    onSnapshot(likesRef, (snapshot) => {
      document.getElementById('likeCount').textContent = snapshot.size;

      // Check if current user liked
      if (auth.currentUser) {
        const currentUserLiked = snapshot.docs.some(doc => doc.id === auth.currentUser.uid);
        if (currentUserLiked) {
          likeBtn.classList.add('liked');
          likeBtn.innerHTML = '<i class="fas fa-heart"></i><span id="likeCount">' + snapshot.size + '</span>';
        }
      }
    });

    // Load comments count
    const commentsRef = collection(db, 'articles', articleId, 'comments');
    onSnapshot(commentsRef, (snapshot) => {
      document.getElementById('commentCount').textContent = snapshot.size;
    });
  } catch (error) {
    console.error('Error loading engagement data:', error);
  }
}

// ============================
// Load Comments
// ============================
function loadComments(articleId) {
  try {
    if (!window.firebase || !window.db) {
      console.log('Firebase not ready for comments');
      commentsList.innerHTML = '<div class="comment-empty">Unable to load comments at this time</div>';
      return;
    }
    
    const { collection, query, orderBy, onSnapshot } = window.firebase;
    const db = window.db;
    
    const commentsRef = collection(db, 'articles', articleId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'desc'));

    onSnapshot(q, (snapshot) => {
      commentsList.innerHTML = '';

      if (snapshot.empty) {
        commentsList.innerHTML = '<div class="comment-empty">No comments yet. Be the first to comment!</div>';
      } else {
        snapshot.forEach((doc) => {
          const comment = doc.data();
          const timeAgo = getTimeAgo(new Date(comment.createdAt.seconds * 1000));

          commentsList.innerHTML += `
            <div class="comment-item">
              <div class="comment-avatar-small">${getInitials(comment.author)}</div>
              <div class="comment-content">
                <div class="comment-header">
                  <span class="comment-author">${comment.author}</span>
                  <span class="comment-time">${timeAgo}</span>
                </div>
                <div class="comment-text">${escapeHtml(comment.text)}</div>
              </div>
            </div>
          `;
        });
      }
    }, (error) => {
      console.log('Comments load error:', error.message);
      commentsList.innerHTML = '<div class="comment-empty">Unable to load comments</div>';
    });
  } catch (error) {
    console.log('Comments error:', error);
  }
}

// ============================
// Load Related Articles (non-blocking with timeout)
// ============================
async function loadRelatedArticles(currentArticleId) {
  try {
    if (!currentArticle || !window.firebase || !window.db) {
      relatedArticlesSection.style.display = 'none';
      return;
    }
    
    const { collection, query, where, orderBy, getDocs } = window.firebase;
    const db = window.db;

    // Set timeout for related articles load
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Related timeout')), FIREBASE_TIMEOUT)
    );

    const articlesRef = collection(db, 'articles');
    const q = query(
      articlesRef,
      where('category', '==', currentArticle.category),
      orderBy('publishedAt', 'desc')
    );

    const querySnapshot = await Promise.race([getDocs(q), timeoutPromise]);
    let related = [];

    querySnapshot.forEach((doc) => {
      if (doc.id !== currentArticleId && related.length < 3) {
        related.push({
          id: doc.id,
          ...doc.data()
        });
      }
    });

    if (related.length > 0) {
      renderRelatedArticles(related);
      relatedArticlesSection.style.display = 'block';
    }
  } catch (error) {
    console.log('Related articles timeout - skipping');
    relatedArticlesSection.style.display = 'none';
  }
}

// ============================
// Render Related Articles
// ============================
function renderRelatedArticles(articles) {
  const relatedGrid = document.getElementById('relatedGrid');
  relatedGrid.innerHTML = articles.map(article => {
    const date = new Date(article.publishedAt.seconds ? article.publishedAt.seconds * 1000 : article.publishedAt);
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    return `
      <a href="post-detail.html?id=${article.id}" class="related-card">
        <div class="related-card-image">
          <img src="${article.imageUrl}" alt="${article.title}" loading="lazy">
        </div>
        <div class="related-card-body">
          <h3 class="related-card-title">${article.title}</h3>
          <p class="related-card-excerpt">${article.excerpt}</p>
          <div class="related-card-date">${formattedDate}</div>
        </div>
      </a>
    `;
  }).join('');
}

// ============================
// Setup Event Listeners
// ============================
function setupEventListeners() {
  // Like button
  likeBtn.addEventListener('click', handleLikeArticle);

  // Comment button
  commentBtn.addEventListener('click', () => {
    commentTextarea.focus();
    commentTextarea.scrollIntoView({ behavior: 'smooth' });
  });

  // Share buttons
  if (shareBtn) shareBtn.addEventListener('click', handleShare);
  if (shareBtn2) shareBtn2.addEventListener('click', handleShare);

  // Comment form
  commentForm.addEventListener('submit', handleCommentSubmit);
}

// ============================
// Handle Like Article
// ============================
async function handleLikeArticle(e) {
  e.preventDefault();

  if (!window.firebase || !window.db || !window.auth) {
    alert('Service not available');
    return;
  }

  const auth = window.auth;
  const currentUser = auth.currentUser;
  if (!currentUser) {
    alert('Please log in to like articles');
    return;
  }

  try {
    const { doc, getDoc, deleteDoc, addDoc, collection, serverTimestamp } = window.firebase;
    const db = window.db;
    
    const likeRef = doc(db, 'articles', currentArticleId, 'likes', currentUser.uid);
    const likeSnap = await getDoc(likeRef);

    if (likeSnap.exists()) {
      await deleteDoc(likeRef);
      likeBtn.classList.remove('liked');
    } else {
      await addDoc(collection(db, 'articles', currentArticleId, 'likes'), {
        userId: currentUser.uid,
        createdAt: serverTimestamp()
      });
      likeBtn.classList.add('liked');
    }
  } catch (error) {
    console.error('Error liking article:', error);
    alert('Error updating like. Please try again.');
  }
}

// ============================
// Handle Share
// ============================
function handleShare() {
  if (navigator.share) {
    navigator.share({
      title: currentArticle.title,
      text: currentArticle.excerpt,
      url: window.location.href
    }).catch(err => console.error('Error sharing:', err));
  } else {
    // Fallback: copy link to clipboard
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  }
}

// ============================
// Handle Comment Submit
// ============================
async function handleCommentSubmit(e) {
  e.preventDefault();

  if (!window.firebase || !window.db || !window.auth) {
    alert('Service not available');
    return;
  }

  const auth = window.auth;
  const currentUser = auth.currentUser;
  if (!currentUser) {
    alert('Please log in to comment');
    return;
  }

  if (!commentTextarea.value.trim()) {
    alert('Please enter a comment');
    return;
  }

  try {
    const { collection, addDoc, serverTimestamp } = window.firebase;
    const db = window.db;
    
    const commentsRef = collection(db, 'articles', currentArticleId, 'comments');
    await addDoc(commentsRef, {
      text: commentTextarea.value.trim(),
      author: currentUser.displayName || currentUser.email,
      userId: currentUser.uid,
      createdAt: serverTimestamp()
    });

    commentTextarea.value = '';
    submitCommentBtn.blur();
  } catch (error) {
    console.error('Error posting comment:', error);
    alert('Error posting comment. Please try again.');
  }
}

// ============================
// Utility Functions
// ============================
function getInitials(name) {
  if (!name) return 'U';
  const parts = name.split(' ');
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
}

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

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ============================
// Lightbox Styles (injected)
// ============================
const lightboxStyles = `
  .lightbox-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 5000;
    animation: fadeIn 0.3s ease;
  }

  .lightbox-content {
    position: relative;
    max-width: 90%;
    max-height: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .lightbox-image {
    max-width: 100%;
    max-height: 80vh;
    object-fit: contain;
  }

  .lightbox-close {
    position: absolute;
    top: -40px;
    right: 0;
    background: none;
    border: none;
    color: var(--white);
    font-size: 2rem;
    cursor: pointer;
  }

  .lightbox-prev,
  .lightbox-next {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: var(--white);
    font-size: 2rem;
    padding: 1rem;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .lightbox-prev:hover,
  .lightbox-next:hover {
    background: rgba(255, 255, 255, 0.4);
  }

  .lightbox-prev {
    left: 1rem;
  }

  .lightbox-next {
    right: 1rem;
  }

  .lightbox-caption {
    color: var(--white);
    text-align: center;
    margin-top: 1rem;
    font-size: 0.95rem;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = lightboxStyles;
document.head.appendChild(styleSheet);

// ============================
// Initialize on DOM Ready
// ============================
document.addEventListener('DOMContentLoaded', initializePostDetailPage);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePostDetailPage);
} else {
  initializePostDetailPage();
}
