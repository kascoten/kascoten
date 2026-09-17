import fs from 'fs';

const newArticles = [
  {
    title: "4th NIIF Nigerian Indonesian Investment and Trade Forum",
    excerpt: "KASCOTE delegates participate in the 4th NIIF Nigerian Indonesian Investment and Trade Forum.",
    content: "KASCOTE delegates actively participated in the 4th NIIF Nigerian Indonesian Investment and Trade Forum. The forum served as a significant platform for fostering economic cooperation and trade relations between Nigeria and Indonesia, providing our members with valuable insights and networking opportunities.",
    imageUrl: "KASCOTEN IMAGES/2026/New/4th-niif-nigerian-indonesian-investment-and-trade-forum/4th-niif-nigerian-indonesian-investment-and-trade-forum.jpeg",
    category: "events",
    author: "KASCOTE Admin",
    publishedAt: `new Date()`,
    readTime: 2,
    likesCount: 120,
    tags: ["2026", "Indonesia", "Trade Forum", "NIIF"],
    images: [
      { url: "KASCOTEN IMAGES/2026/New/4th-niif-nigerian-indonesian-investment-and-trade-forum/4th-niif-nigerian-indonesian-investment-and-trade-forum.jpeg", caption: "Forum Event 1" },
      { url: "KASCOTEN IMAGES/2026/New/4th-niif-nigerian-indonesian-investment-and-trade-forum/4th-niif-nigerian-indonesian-investment-and-trade-forum1.jpeg", caption: "Forum Event 2" },
      { url: "KASCOTEN IMAGES/2026/New/4th-niif-nigerian-indonesian-investment-and-trade-forum/4th-niif-nigerian-indonesian-investment-and-trade-forum.mp4", caption: "Video 1" },
      { url: "KASCOTEN IMAGES/2026/New/4th-niif-nigerian-indonesian-investment-and-trade-forum/4th-niif-nigerian-indonesian-investment-and-trade-forum1.mp4", caption: "Video 2" },
      { url: "KASCOTEN IMAGES/2026/New/4th-niif-nigerian-indonesian-investment-and-trade-forum/4th-niif-nigerian-indonesian-investment-and-trade-forum2.mp4", caption: "Video 3" }
    ]
  },
  {
    title: "Cairo University Visit",
    excerpt: "KASCOTE official visit to Cairo University.",
    content: "In a continuous effort to build strong academic and entrepreneurial partnerships, KASCOTE delegates visited Cairo University. This visit aimed to explore opportunities for educational exchange, skill development, and collaboration in research and development for our members and local businesses.",
    imageUrl: "KASCOTEN IMAGES/2026/New/cairo-university-visit/cairo-university-visit.jpeg",
    category: "visitations",
    author: "KASCOTE Admin",
    publishedAt: `new Date()`,
    readTime: 2,
    likesCount: 85,
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
    imageUrl: "kascote logo.png",
    category: "b2b",
    author: "KASCOTE Admin",
    publishedAt: `new Date()`,
    readTime: 2,
    likesCount: 110,
    tags: ["2026", "Indonesia", "B2B", "KPMI"],
    images: [
      { url: "KASCOTEN IMAGES/2026/New/kpmi-monthly-b2b-business-matchmaking-indonesia/kpmi-monthly-b2b-business-matchmaking-indonesia.mp4", caption: "B2B Event Highlights" }
    ]
  },
  {
    title: "Matchmaking in Indonesia",
    excerpt: "Business matchmaking sessions with partners in Indonesia.",
    content: "Our delegation engaged in strategic matchmaking sessions in Indonesia, working closely with local chambers of commerce and business associations to secure valuable partnerships for KASCOTE members.",
    imageUrl: "kascote logo.png",
    category: "b2b",
    author: "KASCOTE Admin",
    publishedAt: `new Date()`,
    readTime: 2,
    likesCount: 95,
    tags: ["2026", "Indonesia", "B2B"],
    images: [
      { url: "KASCOTEN IMAGES/2026/New/matchmaking-indonesia/matchmaking-indonesia.mp4", caption: "Matchmaking Video 1" },
      { url: "KASCOTEN IMAGES/2026/New/matchmaking-indonesia/matchmaking-indonesia1.mp4", caption: "Matchmaking Video 2" },
      { url: "KASCOTEN IMAGES/2026/New/matchmaking-indonesia/matchmaking-indonesia2.mp4", caption: "Matchmaking Video 3" }
    ]
  },
  {
    title: "Ministry of Works and Housing Nigeria Visit Abuja",
    excerpt: "Official KASCOTE visit to the Ministry of Works and Housing in Abuja.",
    content: "KASCOTE leadership paid an official visit to the Ministry of Works and Housing in Abuja to discuss infrastructural development, business opportunities, and support for the trade and entrepreneurial sector in Kano State and across the nation.",
    imageUrl: "kascote logo.png",
    category: "visitations",
    author: "KASCOTE Admin",
    publishedAt: `new Date()`,
    readTime: 2,
    likesCount: 75,
    tags: ["2026", "Abuja", "Ministry of Works and Housing"],
    images: [
      { url: "KASCOTEN IMAGES/2026/New/ministry-of-works-and-housing-nigeria-visit-abuja/ministry-of-works-and-housing-nigeria-visit-abuja.mp4", caption: "Ministry Visit Video 1" },
      { url: "KASCOTEN IMAGES/2026/New/ministry-of-works-and-housing-nigeria-visit-abuja/ministry-of-works-and-housing-nigeria-visit-abuja1.mp4", caption: "Ministry Visit Video 2" },
      { url: "KASCOTEN IMAGES/2026/New/ministry-of-works-and-housing-nigeria-visit-abuja/ministry-of-works-and-housing-nigeria-visit-abuja2.mp4", caption: "Ministry Visit Video 3" }
    ]
  },
  {
    title: "Ammasco Lubricants Visit with Indonesian Delegation",
    excerpt: "Indonesian delegation visits Ammasco Lubricants alongside KASCOTE.",
    content: "In a showcase of local industrial capacity, KASCOTE facilitated a visit for the Indonesian delegation to Ammasco Lubricants. The visit highlighted the potential for cross-border collaboration in the manufacturing and oil sectors.",
    imageUrl: "KASCOTEN IMAGES/2026/New/ammasco-lubricants-visit-with-indonesian-delegation.jpeg",
    category: "visitations",
    author: "KASCOTE Admin",
    publishedAt: `new Date()`,
    readTime: 2,
    likesCount: 130,
    tags: ["2026", "Indonesia", "Ammasco"],
    images: [
      { url: "KASCOTEN IMAGES/2026/New/ammasco-lubricants-visit-with-indonesian-delegation.jpeg", caption: "Ammasco Visit 1" },
      { url: "KASCOTEN IMAGES/2026/New/ammasco-lubricants-visit-with-indonesian-delegation1.jpeg", caption: "Ammasco Visit 2" },
      { url: "KASCOTEN IMAGES/2026/New/ammasco-lubricants-visit-with-indonesian-delegation3.mp4", caption: "Ammasco Visit Highlights" }
    ]
  },
  {
    title: "Business Dinner with Indonesia",
    excerpt: "Gala business dinner hosting Indonesian partners.",
    content: "A successful business dinner was held to honor and strengthen relations with our Indonesian partners, celebrating the growing bilateral ties between Kano's business community and Indonesian enterprises.",
    imageUrl: "kascote logo.png",
    category: "events",
    author: "KASCOTE Admin",
    publishedAt: `new Date()`,
    readTime: 1,
    likesCount: 105,
    tags: ["2026", "Indonesia", "Business Dinner"],
    images: [
      { url: "KASCOTEN IMAGES/2026/New/business dinner indonesia.mp4", caption: "Business Dinner Highlights" }
    ]
  },
  {
    title: "Khairun Khalifa Isyaka Rabiu University Nigeria Visit",
    excerpt: "KASCOTE visit to Khairun Khalifa Isyaka Rabiu University.",
    content: "Strengthening the bridge between academia and industry, KASCOTE leadership visited Khairun Khalifa Isyaka Rabiu University. The visit focused on fostering entrepreneurship and innovation among the youth and creating internship and mentorship programs for students.",
    imageUrl: "KASCOTEN IMAGES/2026/New/khairun-khalifa-isyaka-rabiu-uinversity-nigeria-vist.jpeg",
    category: "visitations",
    author: "KASCOTE Admin",
    publishedAt: `new Date()`,
    readTime: 2,
    likesCount: 90,
    tags: ["2026", "University Visit", "Education"],
    images: [
      { url: "KASCOTEN IMAGES/2026/New/khairun-khalifa-isyaka-rabiu-uinversity-nigeria-vist.jpeg", caption: "University Visit 1" },
      { url: "KASCOTEN IMAGES/2026/New/khairun-khalifa-isyaka-rabiu-uinversity-nigeria-vist1.jpeg", caption: "University Visit 2" }
    ]
  }
];

const filePath = './src/shared-articles.js';
let content = fs.readFileSync(filePath, 'utf-8');

let newArticlesString = newArticles.map((article, index) => {
  let str = JSON.stringify(article, null, 2);
  str = str.replace(/"publishedAt": "new Date\(\)"/g, 'publishedAt: new Date()');
  // assign an id based on current length + index
  return str.replace(/^\{\n/, `{\n  id: '2026_new_${index}',\n`);
}).join(',\\n');

// Find the last bracket of the array and insert the new objects
content = content.replace(/\];\s*$/, ',\\n' + newArticlesString + '\\n];\\n');

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Successfully appended ' + newArticles.length + ' articles to ' + filePath);
