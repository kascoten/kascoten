// ============================
// Mobile Menu
// ============================
const openMenu = document.getElementById('openMenu');
const closeMenu = document.getElementById('closeMenu');
const overlayMenu = document.getElementById('overlayMenu');

openMenu.addEventListener('click', () => {
  overlayMenu.classList.add('active');
  document.body.style.overflow = 'hidden';
});

closeMenu.addEventListener('click', () => {
  overlayMenu.classList.remove('active');
  document.body.style.overflow = 'auto';
});

// ============================
// Carousel Functionality
// ============================
const slidesContainer = document.getElementById('slides');
const slides = document.querySelectorAll('.slide');
const paginationContainer = document.getElementById('pagination');
const nextSlideBtn = document.getElementById('nextSlide');
const prevSlideBtn = document.getElementById('prevSlide');
const playPauseBtn = document.getElementById('playPause');

let currentIndex = 0;
let autoSlide = true;
let slideInterval = setInterval(nextSlide, 6000);

// Create Pagination Lines
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

const paginationSpans = paginationContainer.querySelectorAll('span');


function updateSlides() {
  // Remove active class from all slides
  slides.forEach(slide => slide.classList.remove('active'));
  
  // Animate out old content
  document.querySelectorAll('.hero-left-content').forEach(el => {
    el.classList.remove('enter', 'enter-active');
    el.classList.add('exit');
  });

  // After exit animation, show new slide and animate in content
  setTimeout(() => {
    // Clear all exit states
    document.querySelectorAll('.hero-left-content').forEach(el => {
      el.classList.remove('exit');
    });

    const newSlide = slides[currentIndex];
    newSlide.classList.add('active');

    const newContent = newSlide.querySelector('.hero-left-content');
    const newImage = newSlide.querySelector('.hero-right img');

    if (newContent) {
      newContent.classList.add('enter');
      setTimeout(() => {
        newContent.classList.add('enter-active');
      }, 10);
    }

    // Handle image crossfade
    slides.forEach(slide => {
      const img = slide.querySelector('.hero-right img');
      img.classList.remove('active');
    });

    if (newImage) {
      newImage.classList.add('active');
    }

    // Update pagination
    paginationSpans.forEach((span, index) => {
      span.classList.toggle('active', index === currentIndex);
    });

  }, 300); // Exit animation duration
}






function nextSlide() {
  currentIndex = (currentIndex + 1) % slides.length;
  updateSlides();
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  updateSlides();
}

nextSlideBtn.addEventListener('click', () => {
  nextSlide();
  resetAutoSlide();
});

prevSlideBtn.addEventListener('click', () => {
  prevSlide();
  resetAutoSlide();
});

playPauseBtn.addEventListener('click', () => {
  autoSlide = !autoSlide;
  playPauseBtn.textContent = autoSlide ? '||' : '>';
  if (autoSlide) {
    slideInterval = setInterval(nextSlide, 6000);
  } else {
    clearInterval(slideInterval);
  }
});

function resetAutoSlide() {
  if (autoSlide) {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 6000);
  }
}

// Manually activate first slide content
slides[0].classList.add('active');

const initialSlide = slides[0];
const initialContent = initialSlide.querySelector('.hero-left-content');
const initialImage = initialSlide.querySelector('.hero-right img');

if (initialContent) {
  initialContent.classList.add('enter');
  setTimeout(() => {
    initialContent.classList.add('enter-active');
  }, 10);
}

if (initialImage) {
  initialImage.classList.add('active');
}





/* what we can do */
const menuItems = document.querySelectorAll('#helpMenu li');
const contentPanels = document.querySelectorAll('.content-panel');
const helpContent = document.querySelector('.help-content');

menuItems.forEach(item => {
  item.addEventListener('click', () => {
    // Remove active state from all menu items
    menuItems.forEach(li => li.classList.remove('active'));
    item.classList.add('active');

    // Get the target panel
    const target = item.getAttribute('data-target');
    const panelContent = document.getElementById(target);

    // Desktop behavior
    if (window.innerWidth > 768) {
      contentPanels.forEach(panel => panel.classList.remove('active'));
      panelContent.classList.add('active');
    } else {
      // Mobile behavior: create or show a mobile panel directly below the item
      // Remove any existing mobile panel
      document.querySelectorAll('.mobile-panel').forEach(mp => mp.remove());

      const mobilePanel = document.createElement('div');
      mobilePanel.classList.add('mobile-panel', 'active');
      mobilePanel.innerHTML = panelContent.innerHTML;

      // Insert below clicked menu item
      item.insertAdjacentElement('afterend', mobilePanel);
    }
  });
});


// ============================
// CONTACT PAGE Functionality
// ============================


// Contact Form Submission (Demo Only)
document.addEventListener('DOMContentLoaded', function() {
  // Contact Form
  const form = document.getElementById('contact-form');
  const msg = document.getElementById('form-message');
  if(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      msg.textContent = "Thank you for contacting us! We'll get back to you soon.";
      msg.style.color = "#06402b";
      form.reset();
      setTimeout(() => { msg.textContent = ""; }, 5000);
    });
  }

 // FAQ Collapse
function setupFAQCollapse() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', function() {
      const item = btn.closest('.faq-item');
      const open = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if(!open) item.classList.add('open');
      btn.setAttribute('aria-expanded', String(!open));
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupFAQCollapse);
} else {
  setupFAQCollapse();
}

// ============================
// CONTACT PAGE Functionality END
// ============================


})