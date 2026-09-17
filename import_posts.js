import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCaNUTiyitKI-4rvjI6NC60RmxcEJA9OCk",
  authDomain: "kascoten1.firebaseapp.com",
  projectId: "kascoten1",
  storageBucket: "kascoten1.firebasestorage.app",
  messagingSenderId: "848423451775",
  appId: "1:848423451775:web:d8cd4f7612fc405269534a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const articles = [
  {
    title: "4th NIIF Nigerian Indonesian Investment and Trade Forum",
    excerpt: "KASCOTE delegates participate in the 4th NIIF Nigerian Indonesian Investment and Trade Forum.",
    content: "KASCOTE delegates actively participated in the 4th NIIF Nigerian Indonesian Investment and Trade Forum. The forum served as a significant platform for fostering economic cooperation and trade relations between Nigeria and Indonesia, providing our members with valuable insights and networking opportunities.",
    imageUrl: "KASCOTEN IMAGES/2026/New/4th-niif-nigerian-indonesian-investment-and-trade-forum/4th-niif-nigerian-indonesian-investment-and-trade-forum.jpeg",
    category: "events",
    author: "KASCOTE Admin",
    readTime: 2,
    tags: ["2026", "Indonesia", "Trade Forum", "NIIF"],
    images: [
      { url: "KASCOTEN IMAGES/2026/New/4th-niif-nigerian-indonesian-investment-and-trade-forum/4th-niif-nigerian-indonesian-investment-and-trade-forum.jpeg", caption: "Forum Event 1" },
      { url: "KASCOTEN IMAGES/2026/New/4th-niif-nigerian-indonesian-investment-and-trade-forum/4th-niif-nigerian-indonesian-investment-and-trade-forum1.jpeg", caption: "Forum Event 2" }
    ],
    videoUrls: [
      "KASCOTEN IMAGES/2026/New/4th-niif-nigerian-indonesian-investment-and-trade-forum/4th-niif-nigerian-indonesian-investment-and-trade-forum.mp4",
      "KASCOTEN IMAGES/2026/New/4th-niif-nigerian-indonesian-investment-and-trade-forum/4th-niif-nigerian-indonesian-investment-and-trade-forum1.mp4",
      "KASCOTEN IMAGES/2026/New/4th-niif-nigerian-indonesian-investment-and-trade-forum/4th-niif-nigerian-indonesian-investment-and-trade-forum2.mp4"
    ]
  },
  {
    title: "Cairo University Visit",
    excerpt: "KASCOTE official visit to Cairo University.",
    content: "In a continuous effort to build strong academic and entrepreneurial partnerships, KASCOTE delegates visited Cairo University. This visit aimed to explore opportunities for educational exchange, skill development, and collaboration in research and development for our members and local businesses.",
    imageUrl: "KASCOTEN IMAGES/2026/New/cairo-university-visit/cairo-university-visit.jpeg",
    category: "visitations",
    author: "KASCOTE Admin",
    readTime: 2,
    tags: ["2026", "Cairo", "University Visit"],
    images: [
      { url: "KASCOTEN IMAGES/2026/New/cairo-university-visit/cairo-university-visit.jpeg", caption: "Cairo University Visit 1" },
      { url: "KASCOTEN IMAGES/2026/New/cairo-university-visit/cairo-university-visit1.jpeg", caption: "Cairo University Visit 2" }
    ]
  },
  {
    title: "KPMI Monthly B2B Business Matchmaking Indonesia",
    excerpt: "Participating in the KPMI Monthly B2B Business Matchmaking in Indonesia.",
    content: "KASCOTE continues to expand its international reach by participating in the KPMI Monthly B2B Business Matchmaking event in Indonesia. This initiative connects our members with Indonesian entrepreneurs and businesses, fostering mutual growth and expanding market access.",
    imageUrl: "kascote logo.png", // Fallback image since there's only a video
    category: "b2b",
    author: "KASCOTE Admin",
    readTime: 2,
    tags: ["2026", "Indonesia", "B2B", "KPMI"],
    images: [],
    videoUrls: [
      "KASCOTEN IMAGES/2026/New/kpmi-monthly-b2b-business-matchmaking-indonesia/kpmi-monthly-b2b-business-matchmaking-indonesia.mp4"
    ]
  },
  {
    title: "Matchmaking in Indonesia",
    excerpt: "Business matchmaking sessions with partners in Indonesia.",
    content: "Our delegation engaged in strategic matchmaking sessions in Indonesia, working closely with local chambers of commerce and business associations to secure valuable partnerships for KASCOTE members.",
    imageUrl: "kascote logo.png",
    category: "b2b",
    author: "KASCOTE Admin",
    readTime: 2,
    tags: ["2026", "Indonesia", "B2B"],
    images: [],
    videoUrls: [
      "KASCOTEN IMAGES/2026/New/matchmaking-indonesia/matchmaking-indonesia.mp4",
      "KASCOTEN IMAGES/2026/New/matchmaking-indonesia/matchmaking-indonesia1.mp4",
      "KASCOTEN IMAGES/2026/New/matchmaking-indonesia/matchmaking-indonesia2.mp4"
    ]
  },
  {
    title: "Ministry of Works and Housing Nigeria Visit Abuja",
    excerpt: "Official KASCOTE visit to the Ministry of Works and Housing in Abuja.",
    content: "KASCOTE leadership paid an official visit to the Ministry of Works and Housing in Abuja to discuss infrastructural development, business opportunities, and support for the trade and entrepreneurial sector in Kano State and across the nation.",
    imageUrl: "kascote logo.png",
    category: "visitations",
    author: "KASCOTE Admin",
    readTime: 2,
    tags: ["2026", "Abuja", "Ministry of Works and Housing"],
    images: [],
    videoUrls: [
      "KASCOTEN IMAGES/2026/New/ministry-of-works-and-housing-nigeria-visit-abuja/ministry-of-works-and-housing-nigeria-visit-abuja.mp4",
      "KASCOTEN IMAGES/2026/New/ministry-of-works-and-housing-nigeria-visit-abuja/ministry-of-works-and-housing-nigeria-visit-abuja1.mp4",
      "KASCOTEN IMAGES/2026/New/ministry-of-works-and-housing-nigeria-visit-abuja/ministry-of-works-and-housing-nigeria-visit-abuja2.mp4"
    ]
  },
  {
    title: "Ammasco Lubricants Visit with Indonesian Delegation",
    excerpt: "Indonesian delegation visits Ammasco Lubricants alongside KASCOTE.",
    content: "In a showcase of local industrial capacity, KASCOTE facilitated a visit for the Indonesian delegation to Ammasco Lubricants. The visit highlighted the potential for cross-border collaboration in the manufacturing and oil sectors.",
    imageUrl: "KASCOTEN IMAGES/2026/New/ammasco-lubricants-visit-with-indonesian-delegation.jpeg",
    category: "visitations",
    author: "KASCOTE Admin",
    readTime: 2,
    tags: ["2026", "Indonesia", "Ammasco"],
    images: [
      { url: "KASCOTEN IMAGES/2026/New/ammasco-lubricants-visit-with-indonesian-delegation.jpeg", caption: "Ammasco Visit 1" },
      { url: "KASCOTEN IMAGES/2026/New/ammasco-lubricants-visit-with-indonesian-delegation1.jpeg", caption: "Ammasco Visit 2" }
    ],
    videoUrls: [
      "KASCOTEN IMAGES/2026/New/ammasco-lubricants-visit-with-indonesian-delegation3.mp4"
    ]
  },
  {
    title: "Business Dinner with Indonesia",
    excerpt: "Gala business dinner hosting Indonesian partners.",
    content: "A successful business dinner was held to honor and strengthen relations with our Indonesian partners, celebrating the growing bilateral ties between Kano's business community and Indonesian enterprises.",
    imageUrl: "kascote logo.png",
    category: "events",
    author: "KASCOTE Admin",
    readTime: 1,
    tags: ["2026", "Indonesia", "Business Dinner"],
    images: [],
    videoUrls: [
      "KASCOTEN IMAGES/2026/New/business dinner indonesia.mp4"
    ]
  },
  {
    title: "Khairun Khalifa Isyaka Rabiu University Nigeria Visit",
    excerpt: "KASCOTE visit to Khairun Khalifa Isyaka Rabiu University.",
    content: "Strengthening the bridge between academia and industry, KASCOTE leadership visited Khairun Khalifa Isyaka Rabiu University. The visit focused on fostering entrepreneurship and innovation among the youth and creating internship and mentorship programs for students.",
    imageUrl: "KASCOTEN IMAGES/2026/New/khairun-khalifa-isyaka-rabiu-uinversity-nigeria-vist.jpeg",
    category: "visitations",
    author: "KASCOTE Admin",
    readTime: 2,
    tags: ["2026", "University Visit", "Education"],
    images: [
      { url: "KASCOTEN IMAGES/2026/New/khairun-khalifa-isyaka-rabiu-uinversity-nigeria-vist.jpeg", caption: "University Visit 1" },
      { url: "KASCOTEN IMAGES/2026/New/khairun-khalifa-isyaka-rabiu-uinversity-nigeria-vist1.jpeg", caption: "University Visit 2" }
    ]
  }
];

async function importArticles() {
  console.log('Starting import...');
  const articlesRef = collection(db, 'articles');
  
  for (const article of articles) {
    try {
      // Append video URLs as HTML video tags into content if they exist
      if (article.videoUrls && article.videoUrls.length > 0) {
        article.content += "\\n\\n### Videos\\n";
        article.videoUrls.forEach(vUrl => {
          article.content += `\\n<video width="100%" controls><source src="${vUrl}" type="video/mp4">Your browser does not support the video tag.</video>\\n`;
        });
      }
      delete article.videoUrls; // Remove temporary property before saving

      const docRef = await addDoc(articlesRef, {
        ...article,
        publishedAt: serverTimestamp()
      });
      console.log(`Added article: ${article.title} with ID: ${docRef.id}`);
    } catch (e) {
      console.error(`Error adding article ${article.title}: `, e);
    }
  }
  console.log('Import finished.');
  process.exit(0);
}

importArticles();
