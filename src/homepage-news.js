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
const HOMEPAGE_TIMEOUT = 300; // 300ms max

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
    const q = query(articlesRef, orderBy('publishedAt', 'desc'), limit(3));
    
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
  const sampleArticles = [
    {
      id: '1',
      title: 'KASCOTE Strengthens Trade Ties with Indonesia',
      excerpt: 'KASCOTE proudly represented Nigeria at the prestigious 40th Indonesian Trade Expo 2025, forging new partnerships and trade opportunities for our members in Asia.',
      content: 'KASCOTE proudly represented Nigeria at the prestigious 40th Indonesian Trade Expo 2025, where Chairman and President Alhaji Hassan Yaro stood shoulder to shoulder with international business leaders. This landmark trade mission showcases Kano\'s commitment to global commerce and entrepreneurship.\n\nThe Indonesian Trade Expo brought together over 5,000 exhibitors from 50 countries, making it one of Asia\'s largest trade exhibitions. Our delegation engaged with potential partners in agriculture, manufacturing, and textile industries.\n\nKey achievements from this mission include:\n- Signed partnerships with 3 major Indonesian trading companies\n- Established connections with agricultural exporters for Kano products\n- Explored opportunities for joint ventures in manufacturing\n- Strengthened diplomatic relations through official channels\n\nThis success demonstrates KASCOTE\'s commitment to opening international markets for our members and positioning Kano as a regional trading hub.',
      imageUrl: 'KASCOTEN IMAGES/indonesian trade expo 2025/Indonesian-trade-expo-25-2.1.jpg',
      category: 'news',
      author: 'KASCOTE Communications',
      publishedAt: new Date(2025, 11, 20),
      readTime: 5,
      tags: ['international', 'trade', 'indonesia', 'exports'],
      images: [
        {
          url: 'KASCOTEN IMAGES/indonesian trade expo 2025/Indonesian-trade-expo-25-2.1.jpg',
          caption: 'KASCOTE delegation at Indonesian Trade Expo 2025'
        },
        {
          url: 'KASCOTEN IMAGES/indonesian trade expo 2025/Indonesian-trade-expo-25-8.jpg',
          caption: 'Business leaders networking at the expo'
        }
      ]
    },
    {
      id: '2',
      title: 'Sommet de l\'Elevage: Kano\'s Agricultural Innovation Showcased',
      excerpt: 'Our delegation participated in the world\'s leading sustainable livestock show in France, showcasing Kano\'s agricultural potential to 120,000+ international visitors.',
      content: 'In October 2025, KASCOTE attended Sommet de l\'élevage — the world\'s No.1 sustainable livestock and agricultural show in France. This event drew over 120,000 visitors from 90 countries, providing an exceptional platform for Kano\'s traders and farmers to showcase their products and establish international connections.\n\nSommet de l\'élevage is the premier global event for the livestock and meat industry. It attracts industry leaders, investors, and decision-makers from across the world. Our participation positioned Kano\'s agricultural sector on the international stage.\n\nOur delegation showcased:\n- Kano\'s quality livestock products\n- Sustainable farming practices\n- Agricultural technology innovations\n- Traditional production methods\n\nNetworking outcomes:\n- Explored export opportunities to European markets\n- Connected with international agricultural investors\n- Learned best practices in sustainable livestock farming\n- Established relationships with major importers\n\nThis participation strengthens Kano\'s position as a leading agricultural hub in Africa.',
      imageUrl: 'KASCOTEN IMAGES/Sommet de l\'élevage Visit/Sommet de l\'élevage Visit6.jpg',
      category: 'events',
      author: 'KASCOTE Leadership',
      publishedAt: new Date(2025, 9, 15),
      readTime: 6,
      tags: ['agriculture', 'livestock', 'france', 'sustainability'],
      images: [
        {
          url: 'KASCOTEN IMAGES/Sommet de l\'élevage Visit/Sommet de l\'élevage Visit6.jpg',
          caption: 'KASCOTE booth at Sommet de l\'élevage'
        }
      ]
    },
    {
      id: '3',
      title: 'Understanding Global Trade Opportunities for MSMEs',
      excerpt: 'A comprehensive guide on how small and medium enterprises can leverage international trade missions to expand their market reach.',
      content: 'Small and medium enterprises (MSMEs) form the backbone of Kano\'s economy. In this article, we explore key strategies for MSMEs to participate in global trade, from preparation to execution. Learn how KASCOTE\'s trade missions create pathways to international markets.\n\nWhy MSMEs Need Global Trade:\n- Access to larger markets\n- Higher profit margins on international sales\n- Technology and knowledge transfer\n- Business network expansion\n- Currency diversification\n\nSteps for MSME Success:\n\n1. Preparation Phase\n- Ensure product quality meets international standards\n- Obtain necessary certifications\n- Build strong company profile\n- Develop marketing materials\n\n2. Trade Mission Selection\n- Choose missions aligned with your industry\n- Register with KASCOTE early\n- Coordinate logistics\n- Prepare product samples\n\n3. During the Mission\n- Network actively\n- Make meaningful connections\n- Explore partnerships\n- Gather market intelligence\n\n4. Follow-up\n- Maintain contact with prospects\n- Develop business proposals\n- Negotiate terms\n- Execute agreements\n\nKASCOTE provides support at every step through our comprehensive trade mission programs. Join us and expand your business globally!',
      imageUrl: 'KASCOTEN IMAGES/year-2026-new-yaer-flyer.jpeg',
      category: 'blog',
      author: 'Business Development Team',
      publishedAt: new Date(2025, 11, 10),
      readTime: 7,
      tags: ['msme', 'trade', 'business', 'guide'],
      images: []
    }
  ];

  renderRecentNewsCards(sampleArticles);
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
