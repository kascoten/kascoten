import { 
  auth, 
  provider, 
  db, 
  doc, 
  setDoc, 
  getDoc,
  serverTimestamp, 
  onAuthStateChanged, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  deleteDoc,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut
} from '../firebase.js';


// ============================
// Header Hide on Scroll
// ============================
let lastScrollY = window.scrollY;
const header = document.querySelector('.main-header');

if (header) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > lastScrollY && window.scrollY > 45) {
      header.classList.add('hide');
    } else {
      header.classList.remove('hide');
    }
    lastScrollY = window.scrollY;
  });
}

// ============================
// Mobile Menu
// ============================
const openMenu = document.getElementById('openMenu');
const closeMenu = document.getElementById('closeMenu');
const overlayMenu = document.getElementById('overlayMenu');

if (openMenu && closeMenu && overlayMenu) {
  openMenu.addEventListener('click', () => {
    overlayMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  closeMenu.addEventListener('click', () => {
    overlayMenu.classList.remove('active');
    document.body.style.overflow = 'auto';
  });
}

// ============================
// Carousel Functionality
// ============================
const slidesContainer = document.getElementById('slides');

if (slidesContainer) {
  const slides = document.querySelectorAll('.slide');
  const paginationContainer = document.getElementById('pagination');
  const nextSlideBtn = document.getElementById('nextSlide');
  const prevSlideBtn = document.getElementById('prevSlide');
  const playPauseBtn = document.getElementById('playPause');

  if (slides.length === 0) {
    console.warn('Carousel: no slides found — carousel disabled.');
  } else {
    // If pagination or controls are missing, warn and continue with limited behavior.
    if (!paginationContainer) console.warn('Carousel: #pagination element not found — pagination will be disabled.');
    if (!nextSlideBtn) console.warn('Carousel: #nextSlide not found — next button disabled.');
    if (!prevSlideBtn) console.warn('Carousel: #prevSlide not found — prev button disabled.');
    if (!playPauseBtn) console.warn('Carousel: #playPause not found — play/pause disabled.');

    let currentIndex = 0;
    let autoSlide = true;
    let slideInterval = setInterval(nextSlide, 6000);

    // Create Pagination Lines (only if container exists)
    if (paginationContainer) {
      slides.forEach((_, index) => {
        const span = document.createElement('span');
        if (index === 0) span.classList.add('active');
        span.addEventListener('click', () => {
          currentIndex = index;
          updateSlides();
          resetAutoSlide();
        });
        paginationContainer.appendChild(span);
      });
    }

    const paginationSpans = paginationContainer ? paginationContainer.querySelectorAll('span') : [];

    function updateSlides() {
      slides.forEach(slide => slide.classList.remove('active'));
      document.querySelectorAll('.hero-left-content').forEach(el => {
        el.classList.remove('enter', 'enter-active');
        el.classList.add('exit');
      });

      setTimeout(() => {
        document.querySelectorAll('.hero-left-content').forEach(el => el.classList.remove('exit'));
        const newSlide = slides[currentIndex];
        newSlide.classList.add('active');
        const newContent = newSlide.querySelector('.hero-left-content');
        const newImage = newSlide.querySelector('.hero-right img');
        if (newContent) {
          newContent.classList.add('enter');
          setTimeout(() => newContent.classList.add('enter-active'), 10);
        }
        slides.forEach(slide => {
          const img = slide.querySelector('.hero-right img');
          if (img) img.classList.remove('active');
        });
        if (newImage) newImage.classList.add('active');
        if (paginationSpans.length) paginationSpans.forEach((span, i) => span.classList.toggle('active', i === currentIndex));
      }, 300);
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlides();
    }

    function prevSlide() {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateSlides();
    }

    if (nextSlideBtn) nextSlideBtn.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });
    if (prevSlideBtn) prevSlideBtn.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });
    if (playPauseBtn) playPauseBtn.addEventListener('click', () => {
      autoSlide = !autoSlide;
      playPauseBtn.textContent = autoSlide ? '||' : '▶';
      if (autoSlide) slideInterval = setInterval(nextSlide, 6000);
      else clearInterval(slideInterval);
    });

    function resetAutoSlide() {
      if (autoSlide) {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 6000);
      }
    }

    // initial state
    slides[0].classList.add('active');
    const initialContent = slides[0].querySelector('.hero-left-content');
    const initialImage = slides[0].querySelector('.hero-right img');
    if (initialContent) {
      initialContent.classList.add('enter');
      setTimeout(() => initialContent.classList.add('enter-active'), 10);
    }
    if (initialImage) initialImage.classList.add('active');
  }
}

// ============================
// What we can do section
// ============================
const menuItems = document.querySelectorAll('#helpMenu li');
if (menuItems.length > 0) {
  const contentPanels = document.querySelectorAll('.content-panel');
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      menuItems.forEach(li => li.classList.remove('active'));
      item.classList.add('active');
      const target = item.getAttribute('data-target');
      const panelContent = document.getElementById(target);

      if (window.innerWidth > 768) {
        contentPanels.forEach(panel => panel.classList.remove('active'));
        panelContent.classList.add('active');
      } else {
        document.querySelectorAll('.mobile-panel').forEach(mp => mp.remove());
        const mobilePanel = document.createElement('div');
        mobilePanel.classList.add('mobile-panel', 'active');
        mobilePanel.innerHTML = panelContent.innerHTML;
        item.insertAdjacentElement('afterend', mobilePanel);
      }
    });
  });
}

// ============================
// CONTACT PAGE Functionality
// ============================
const form = document.getElementById('contact-form');
if (form) {
  const msg = document.getElementById('form-message');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    try {
      await addDoc(collection(db, 'contacts'), {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
        submittedAt: serverTimestamp(),
        status: 'new'
      });
      msg.textContent = "Thank you! Your message has been sent successfully.";
      msg.style.color = '#06402b';
      form.reset();
    } catch (error) {
      console.error('Error saving contact message: ', error);
      msg.textContent = 'Sorry, there was an error sending your message. Please try again.';
      msg.style.color = 'red';
    }
  });
}

const faqQuestions = document.querySelectorAll('.faq-question');
if (faqQuestions.length > 0) {
  function setupFAQCollapse() {
    faqQuestions.forEach(btn => {
      btn.addEventListener('click', function() {
        const item = btn.closest('.faq-item');
        const open = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!open) item.classList.add('open');
        btn.setAttribute('aria-expanded', String(!open));
      });
    });
  }
  setupFAQCollapse();
}

// ====================================================================================
// INITIALIZE DYNAMIC FEATURES AFTER DOM IS FULLY LOADED
// We wrap this in a DOMContentLoaded listener to ensure all HTML elements,
// including the comment modal at the end of the body, are available to the script.
// ====================================================================================
document.addEventListener('DOMContentLoaded', () => {
  
  // ============================
  // POST INTERACTIONS (LIKES & COMMENTS) - LOAD COUNTERS AND SET UP LISTENERS
  // ============================
  function initializePostInteractions() {
    const postCards = document.querySelectorAll('[data-post-id]');
    if (postCards.length === 0) return;

    postCards.forEach(card => {
      const postId = card.dataset.postId;
      const likeBtn = card.querySelector('.like-btn');
      const likeCountSpan = likeBtn ? likeBtn.querySelector('.like-count') : null;
      const commentBtn = card.querySelector('.comment-btn');
      const commentCountSpan = commentBtn ? commentBtn.querySelector('.comment-count') : null;

      // Load and display like count, and check if current user liked it
      if (likeBtn && likeCountSpan) {
        const likesRef = collection(db, 'posts', postId, 'likes');
        onSnapshot(likesRef, (snapshot) => {
          likeCountSpan.textContent = snapshot.size;
          const currentUser = auth.currentUser;
          if (currentUser) {
            const userLikeRef = doc(db, 'posts', postId, 'likes', currentUser.uid);
            getDoc(userLikeRef).then(docSnap => {
              if (docSnap.exists()) {
                likeBtn.classList.add('liked');
                likeBtn.style.color = '#0a66c2';
              } else {
                likeBtn.classList.remove('liked');
                likeBtn.style.color = '#65676b';
              }
            });
          }
        });
      }

      // Load and display comment count
      if (commentBtn && commentCountSpan) {
        const commentsRef = collection(db, 'posts', postId, 'comments');
        onSnapshot(commentsRef, (snapshot) => {
          commentCountSpan.textContent = snapshot.size;
        });
      }

      // Share button
      const shareBtn = card.querySelector('.share-btn');
      if (shareBtn) {
        shareBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (!navigator.share) return alert("Sharing is not supported on your browser.");
          const cardTitle = card.querySelector('h3')?.textContent || 'Check this out!';
          const cardText = card.querySelector('p')?.textContent || 'KASCOTEN visitation';
          navigator.share({
            title: cardTitle,
            text: cardText,
            url: window.location.href,
          }).catch(console.error);
        });
      }
    });
  }

  // Initialize all the dynamic features now that the DOM is ready.
  initializePostInteractions();

  function loadCommentsForPost(postId, commentsListElement) {
    const commentsRef = collection(db, 'posts', postId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'desc'));

    onSnapshot(q, (snapshot) => {
      commentsListElement.innerHTML = '';
      if (snapshot.empty) {
        commentsListElement.innerHTML = '<p style="text-align: center; color: #888; padding: 1rem 0;">No comments yet.</p>';
      } else {
        snapshot.forEach(doc => {
          const comment = doc.data();
          const commentElement = document.createElement('div');
          commentElement.classList.add('comment');
          commentElement.innerHTML = `
            <img src="${comment.photoURL}" alt="${comment.displayName}" class="comment-author-photo">
            <div class="comment-content">
              <strong>${comment.displayName}</strong>
              <p>${comment.text}</p>
            </div>
          `;
          commentsListElement.appendChild(commentElement);
        });
      }
    });
  }

  // ============================
  // Post Engagement & Comments Modal
  // ============================

  // Open comment modal AND LOAD COMMENTS
  document.querySelectorAll('.comment-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const postId = this.dataset.postId;
      const modal = document.getElementById(`commentsModal-${postId}`);
      const commentsList = document.getElementById(`commentsList-${postId}`);
      
      if (modal && commentsList) {
        // Load comments from Firebase before showing modal
        loadCommentsForPost(postId, commentsList);
        modal.classList.add('active');
      }
    });
  });

  // Close modal
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const modal = this.closest('.modal');
      if (modal) modal.classList.remove('active');
    });
  });

  // Close modal on outside click
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        this.classList.remove('active');
      }
    });
  });

  // Submit comment
  document.querySelectorAll('.submit-comment').forEach(btn => {
    btn.addEventListener('click', async function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const postId = this.dataset.postId;
      const input = document.querySelector(`.comment-input[data-post-id="${postId}"]`);
      const commentsList = document.getElementById(`commentsList-${postId}`);
      
      if (!input || !input.value.trim()) {
        console.warn('Empty comment or no input found');
        return;
      }

      const currentUser = auth.currentUser;
      if (!currentUser) {
        alert('You must be logged in to comment.');
        return;
      }

      try {
        // SAVE TO FIREBASE
        const commentsRef = collection(db, 'posts', postId, 'comments');
        await addDoc(commentsRef, {
          text: input.value.trim(),
          displayName: currentUser.displayName || currentUser.email,
          photoURL: currentUser.photoURL || generateInitialsAvatar(currentUser.displayName || currentUser.email),
          uid: currentUser.uid,
          createdAt: serverTimestamp()
        });

        // Clear input after successful save
        input.value = '';
        console.log('Comment saved to Firebase successfully');
        
        // Comments will auto-reload via loadCommentsForPost listener
      } catch (error) {
        console.error('Error saving comment:', error);
        alert('Failed to post comment. Please try again.');
      }
    });
  });

  // Like button - SAVE TO FIREBASE (unified handler)
  document.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', async function(e) {
      e.stopPropagation();
      
      const postId = this.dataset.postId;
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        alert('You must be logged in to like a post.');
        return;
      }

      try {
        const likeDocRef = doc(db, 'posts', postId, 'likes', currentUser.uid);
        const docSnap = await getDoc(likeDocRef);
        
        if (docSnap.exists()) {
          // Unlike: delete the like
          await deleteDoc(likeDocRef);
          this.classList.remove('liked');
          this.style.color = '#65676b';
        } else {
          // Like: add the like
          await setDoc(likeDocRef, {
            userId: currentUser.uid,
            likedAt: serverTimestamp()
          });
          this.classList.add('liked');
          this.style.color = '#0a66c2';
        }
        console.log('Like status updated in Firebase');
      } catch (error) {
        console.error('Error updating like:', error);
        alert('Failed to update like. Please try again.');
      }
    });
  });

});

// ============================
// HELPER FUNCTIONS
// ============================
function generateInitialsAvatar(name) {
  if (!name) name = 'U';
  const nameParts = name.split(' ');
  let initials = nameParts.length > 1 ? nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0) : name.substring(0, 2);
  initials = initials.toUpperCase();
  const svg = `<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#06402b" /><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-size="16px" font-family="Arial, sans-serif" font-weight="bold">${initials}</text></svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// ============================
// FIREBASE AUTHENTICATION
// ============================
const loginBtn = document.getElementById('loginBtn');
const userProfile = document.getElementById('userProfile');
const userName = document.getElementById('userName');
const userPhoto = document.getElementById('userPhoto');
const logoutBtn = document.getElementById('logoutBtn');

// Process any pending redirect sign-in result before attaching sign-in handlers
getRedirectResult(auth).then((result) => {
  if (result && result.user) {
    console.log('Redirect sign-in result processed on load:', result);
  }
}).catch((error) => {
  console.error('Error obtaining redirect result on load:', error);
});

let signingIn = false;
loginBtn.addEventListener('click', async () => {
  if (signingIn) return;
  signingIn = true;
  loginBtn.disabled = true;
  try {
    await signInWithPopup(auth, provider);
  } catch (err) {
    console.error('Login error (popup):', err);
    if (err.code === 'auth/cancelled-popup-request' || err.code === 'auth/popup-closed-by-user') {
      // fallback to redirect if popup was cancelled/interrupted
      try {
        await signInWithRedirect(auth, provider);
        return;
      } catch (rErr) {
        console.error('Redirect fallback failed:', rErr);
        alert(rErr.message || JSON.stringify(rErr));
      }
    } else {
      alert(err.message || JSON.stringify(err));
    }
  } finally {
    signingIn = false;
    loginBtn.disabled = false;
  }
});

// (Redirect result is processed on load above to avoid conflicting flows)

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    signOut(auth).catch((error) => console.error("Logout error:", error));
  });
}

onAuthStateChanged(auth, (user) => {
  if (loginBtn && userProfile && userName && userPhoto) {
    if (user) {
      console.log("User is signed in. Updating UI.", user);
      const userDocRef = doc(db, 'users', user.uid);
      setDoc(userDocRef, {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        lastLogin: serverTimestamp()
      }, { merge: true });

      loginBtn.style.display = "none";
      userProfile.style.display = "flex";
      userPhoto.src = user.photoURL || generateInitialsAvatar(user.displayName || user.email);
      userName.textContent = user.displayName || user.email;
    } else {
      loginBtn.style.display = "inline-block";
      userProfile.style.display = "none";
      console.log("No user signed in");
    }
  }
});
