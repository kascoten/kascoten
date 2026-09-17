import fs from 'fs';

const enrichedArticles = [
  {
    id: '2026_new_0',
    title: "4th NIIF Nigerian Indonesian Investment and Trade Forum",
    excerpt: "KASCOTE delegates participated in the 4th NIIF, a premier platform fostering economic cooperation, bilateral trade, and industrial partnerships between Nigeria and Indonesia.",
    content: "The 4th NIIF Nigerian Indonesian Investment and Trade Forum presented a significant opportunity for KASCOTE to strengthen economic bridges between Kano's business community and Indonesian enterprises.\\n\\nEvent Overview\\nThe forum served as a premier bilateral platform designed to facilitate cross-border investments and trade relationships. It brought together government officials, industry leaders, and entrepreneurs from both nations to discuss actionable strategies for economic cooperation.\\n\\nStrategic Discussions\\n- Policy alignment for seamless import-export operations\\n- Manufacturing partnerships and industrial development\\n- Technology transfer in the agricultural and textile sectors\\n\\nOutcomes for KASCOTE Members\\nOur delegation successfully established direct contacts with key Indonesian manufacturers, paving the way for cost-effective supply chains. Several memorandums of understanding (MoUs) were initiated, promising a robust pipeline of trade activities over the coming year.",
    imageUrl: "KASCOTEN IMAGES/2026/New/4th-niif-nigerian-indonesian-investment-and-trade-forum/4th-niif-nigerian-indonesian-investment-and-trade-forum.jpeg",
    category: "events",
    author: "KASCOTE Trade Mission",
    publishedAt: `new Date()`,
    readTime: 4,
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
    id: '2026_new_1',
    title: "Cairo University Visit",
    excerpt: "KASCOTE leadership conducted an official academic mission to Cairo University, fostering knowledge exchange and entrepreneurship development for youth.",
    content: "Recognizing that education is the bedrock of sustainable economic growth, a KASCOTE delegation embarked on a strategic academic mission to Cairo University. This visit aimed to bridge the gap between academia and the business sector.\\n\\nMission Objectives\\n- To explore collaborative research initiatives relevant to African trade markets.\\n- To establish frameworks for youth entrepreneurship and business mentorship programs.\\n- To facilitate knowledge exchange between Nigerian business leaders and Egyptian scholars.\\n\\nKey Highlights\\nThe delegation toured the university's innovation hubs and engaged in productive dialogue with faculty heads. Discussions centered around adapting modern business curricula to suit the practical realities of the West African trade ecosystem.\\n\\nFuture Prospects\\nPreliminary agreements were reached to launch a cross-border internship program, allowing top students to gain hands-on experience within KASCOTE's network of businesses, thereby nurturing the next generation of industry leaders.",
    imageUrl: "KASCOTEN IMAGES/2026/New/cairo-university-visit/cairo-university-visit1.jpeg",
    category: "visitations",
    author: "KASCOTE Academic Relations",
    publishedAt: `new Date()`,
    readTime: 3,
    likesCount: 85,
    tags: ["2026", "Cairo", "University Visit"],
    images: [
      { url: "KASCOTEN IMAGES/2026/New/cairo-university-visit/cairo-university-visit1.jpeg", caption: "Cairo University Visit 1" },
      { url: "KASCOTEN IMAGES/2026/New/cairo-university-visit/cairo-university-visit1.jpeg", caption: "Cairo University Visit 2" }
    ]
  },
  {
    id: '2026_new_2',
    title: "KPMI Monthly B2B Business Matchmaking Indonesia",
    excerpt: "A high-impact B2B matchmaking event connecting KASCOTE members directly with Indonesian suppliers, cutting out middlemen to maximize profitability.",
    content: "KASCOTE successfully participated in the KPMI Monthly B2B Business Matchmaking event held in Indonesia. This initiative represents our ongoing commitment to removing trade barriers and providing our members with direct access to international markets.\\n\\nThe Matchmaking Process\\nThe event featured a series of structured, one-on-one negotiations between Kano-based entrepreneurs and pre-vetted Indonesian manufacturers. This targeted approach ensured that members engaged only with suppliers relevant to their specific industries.\\n\\nIndustries Represented\\n- Textiles and Garments\\n- Agricultural Machinery\\n- Food Processing\\n- Consumer Electronics\\n\\nStrategic Advantages\\nBy bypassing traditional intermediaries, our members were able to negotiate favorable pricing, establish exclusive distributorships, and ensure higher quality control for imported goods. The relationships forged during this event are expected to significantly boost the trade volume between the two regions.",
    imageUrl: "KASCOTEN IMAGES/2026/New/kpmi-monthly-b2b-business-matchmaking-indonesia/kpmi-monthly-b2b-business-matchmaking-indonesia.mp4",
    category: "b2b",
    author: "KASCOTE B2B Network",
    publishedAt: `new Date()`,
    readTime: 4,
    likesCount: 110,
    tags: ["2026", "Indonesia", "B2B", "KPMI"],
    images: [
      { url: "KASCOTEN IMAGES/2026/New/kpmi-monthly-b2b-business-matchmaking-indonesia/kpmi-monthly-b2b-business-matchmaking-indonesia.mp4", caption: "B2B Event Highlights" }
    ]
  },
  {
    id: '2026_new_3',
    title: "Matchmaking in Indonesia",
    excerpt: "Extensive business matchmaking sessions conducted across Indonesia, establishing critical supply chain links and joint venture opportunities.",
    content: "Building on the momentum of bilateral trade agreements, KASCOTE coordinated extensive matchmaking sessions across major industrial hubs in Indonesia. The primary goal was to secure long-term, reliable supply chain partnerships for Kano's business ecosystem.\\n\\nSession Highlights\\n- Facilitated over 40 direct business meetings with Indonesian exporters.\\n- Conducted on-site factory visits to verify production capacity and quality standards.\\n- Negotiated flexible payment terms and logistical arrangements tailored to the Nigerian market.\\n\\nKey Achievements\\nMembers successfully secured contracts for the importation of raw materials and finished goods, while simultaneously exploring avenues to export Nigerian agricultural products to Southeast Asia. These matchmaking sessions serve as a testament to KASCOTE's proactive approach to international trade development.",
    imageUrl: "KASCOTEN IMAGES/2026/New/matchmaking-indonesia/matchmaking-indonesia.mp4",
    category: "b2b",
    author: "KASCOTE Trade Mission",
    publishedAt: `new Date()`,
    readTime: 3,
    likesCount: 95,
    tags: ["2026", "Indonesia", "B2B"],
    images: [
      { url: "KASCOTEN IMAGES/2026/New/matchmaking-indonesia/matchmaking-indonesia.mp4", caption: "Matchmaking Video 1" },
      { url: "KASCOTEN IMAGES/2026/New/matchmaking-indonesia/matchmaking-indonesia1.mp4", caption: "Matchmaking Video 2" },
      { url: "KASCOTEN IMAGES/2026/New/matchmaking-indonesia/matchmaking-indonesia2.mp4", caption: "Matchmaking Video 3" }
    ]
  },
  {
    id: '2026_new_4',
    title: "Ministry of Works and Housing Nigeria Visit Abuja",
    excerpt: "KASCOTE leadership engaged with the Ministry of Works and Housing in Abuja to advocate for improved trade infrastructure and business facilities.",
    content: "In a bid to address the infrastructural challenges facing the business community, KASCOTE leadership undertook an official advocacy visit to the Ministry of Works and Housing in Abuja. \\n\\nAdvocacy Agenda\\n- Upgrading road networks connecting major trade hubs in Northern Nigeria.\\n- Developing modern, accessible warehousing facilities and industrial parks.\\n- Streamlining regulatory approvals for commercial real estate development.\\n\\nCollaborative Outcomes\\nThe Ministry expressed a strong commitment to partnering with the private sector. Constructive dialogues led to the proposal of a joint committee aimed at fast-tracking infrastructural projects that directly impact trade efficiency. KASCOTE remains dedicated to engaging government bodies to foster an enabling environment for economic prosperity.",
    imageUrl: "KASCOTEN IMAGES/2026/New/ministry-of-works-and-housing-nigeria-visit-abuja/ministry-of-works-and-housing-nigeria-visit-abuja.mp4",
    category: "visitations",
    author: "KASCOTE Policy Advocacy",
    publishedAt: `new Date()`,
    readTime: 3,
    likesCount: 75,
    tags: ["2026", "Abuja", "Ministry of Works and Housing", "Advocacy"],
    images: [
      { url: "KASCOTEN IMAGES/2026/New/ministry-of-works-and-housing-nigeria-visit-abuja/ministry-of-works-and-housing-nigeria-visit-abuja.mp4", caption: "Ministry Visit Video 1" },
      { url: "KASCOTEN IMAGES/2026/New/ministry-of-works-and-housing-nigeria-visit-abuja/ministry-of-works-and-housing-nigeria-visit-abuja1.mp4", caption: "Ministry Visit Video 2" },
      { url: "KASCOTEN IMAGES/2026/New/ministry-of-works-and-housing-nigeria-visit-abuja/ministry-of-works-and-housing-nigeria-visit-abuja2.mp4", caption: "Ministry Visit Video 3" }
    ]
  },
  {
    id: '2026_new_5',
    title: "Ammasco Lubricants Visit with Indonesian Delegation",
    excerpt: "Showcasing Kano's industrial prowess, an Indonesian delegation toured Ammasco Lubricants to explore cross-border manufacturing collaborations.",
    content: "To demonstrate the manufacturing capabilities of the Kano business environment, KASCOTE facilitated a comprehensive tour of the Ammasco Lubricants facility for a visiting Indonesian delegation.\\n\\nShowcasing Local Excellence\\nAmmasco Lubricants stands as a beacon of local industrial success. The delegation was given an in-depth view of the production lines, quality control laboratories, and the expansive distribution network that powers the brand across West Africa.\\n\\nExploring Synergies\\nThe visit sparked vital discussions regarding:\\n- Sourcing high-quality raw materials and additives from Indonesia.\\n- Adopting advanced, eco-friendly manufacturing technologies.\\n- Potential joint ventures to expand product lines and market reach.\\n\\nThis interaction not only highlighted Nigeria's potential as a manufacturing hub but also opened doors for technological exchange and robust industrial partnerships between the two countries.",
    imageUrl: "KASCOTEN IMAGES/2026/New/ammasco-lubricants-visit-with-indonesian-delegation.jpeg",
    category: "visitations",
    author: "KASCOTE Industrial Relations",
    publishedAt: `new Date()`,
    readTime: 4,
    likesCount: 130,
    tags: ["2026", "Indonesia", "Ammasco", "Manufacturing"],
    images: [
      { url: "KASCOTEN IMAGES/2026/New/ammasco-lubricants-visit-with-indonesian-delegation.jpeg", caption: "Ammasco Visit 1" },
      { url: "KASCOTEN IMAGES/2026/New/ammasco-lubricants-visit-with-indonesian-delegation1.jpeg", caption: "Ammasco Visit 2" },
      { url: "KASCOTEN IMAGES/2026/New/ammasco-lubricants-visit-with-indonesian-delegation3.mp4", caption: "Ammasco Visit Highlights" }
    ]
  },
  {
    id: '2026_new_6',
    title: "Business Dinner with Indonesia",
    excerpt: "A gala business dinner celebrating the burgeoning economic ties and successful trade negotiations between Nigerian and Indonesian enterprises.",
    content: "Following days of rigorous meetings and site visits, KASCOTE hosted a grand business dinner to honor the Indonesian delegation. The event served as a celebration of the successful negotiations and the strengthening of bilateral ties.\\n\\nNetworking and Cultural Exchange\\nThe dinner provided a relaxed environment for business leaders, government officials, and entrepreneurs to engage in informal networking. It was an evening marked by cultural exchange, highlighting the shared values and mutual respect that underpin successful international partnerships.\\n\\nLooking Ahead\\nDuring the closing remarks, leaders from both sides reaffirmed their commitment to sustaining the momentum generated during the trade mission. The dinner concluded with the symbolic signing of preliminary partnership agreements, setting a positive tone for future collaborative endeavors.",
    imageUrl: "KASCOTEN IMAGES/2026/business dinner indonesia.mp4",
    category: "events",
    author: "KASCOTE Leadership",
    publishedAt: `new Date()`,
    readTime: 2,
    likesCount: 105,
    tags: ["2026", "Indonesia", "Business Dinner", "Networking"],
    images: [
      { url: "KASCOTEN IMAGES/2026/business dinner indonesia.mp4", caption: "Business Dinner Highlights" }
    ]
  },
  {
    id: '2026_new_7',
    title: "Khairun Khalifa Isyaka Rabiu University Nigeria Visit",
    excerpt: "Connecting the classroom to the boardroom through a strategic visit to Khairun Khalifa Isyaka Rabiu University to foster youth entrepreneurship.",
    content: "KASCOTE recognizes that the future of commerce lies in the hands of the youth. In a deliberate effort to bridge academia and industry, our leadership visited Khairun Khalifa Isyaka Rabiu University.\\n\\nEmpowering the Next Generation\\nThe visit focused on establishing tangible links between theoretical education and practical business applications. Key discussions with university administrators included:\\n- Developing a curriculum that addresses current market demands.\\n- Establishing a robust student mentorship program led by experienced KASCOTE members.\\n- Creating pathways for internships and graduate employment within the local business community.\\n\\nThis initiative underscores KASCOTE's dedication to community development and ensuring a sustainable pipeline of innovative entrepreneurs equipped to tackle the challenges of tomorrow's economy.",
    imageUrl: "KASCOTEN IMAGES/2026/khairun-khalifa-isyaka-rabiu-uinversity-nigeria-vist.jpeg",
    category: "visitations",
    author: "KASCOTE Youth Initiative",
    publishedAt: `new Date()`,
    readTime: 3,
    likesCount: 90,
    tags: ["2026", "University Visit", "Education", "Entrepreneurship"],
    images: [
      { url: "KASCOTEN IMAGES/2026/khairun-khalifa-isyaka-rabiu-uinversity-nigeria-vist.jpeg", caption: "University Visit 1" },
      { url: "KASCOTEN IMAGES/2026/khairun-khalifa-isyaka-rabiu-uinversity-nigeria-vist1.jpeg", caption: "University Visit 2" }
    ]
  }
];

const filePath = './src/shared-articles.js';
let content = fs.readFileSync(filePath, 'utf-8');

// The issue was we had syntax errors in the file due to my previous scripts messing up newlines.
// First, let's fix the file by loading it from the clean base.
// I will find the start of the first new article and cut the file there.
const searchStr = "id: '2026_new_0'";
let index = content.indexOf(searchStr);

if (index !== -1) {
  // Find the opening brace before this ID
  let braceIndex = content.lastIndexOf('{', index);
  
  if (braceIndex !== -1) {
    // Keep everything before this brace
    let baseContent = content.substring(0, braceIndex).trimEnd();
    
    // Format the new articles
    let newArticlesString = enrichedArticles.map((article) => {
      let str = JSON.stringify(article, null, 2);
      str = str.replace(/"publishedAt": "new Date\(\)"/g, 'publishedAt: new Date()');
      str = str.replace(/"id": "([^"]+)"/g, "id: '$1'");
      return str;
    }).join(',\n');
    
    // Clean base content trailing commas
    if (baseContent.endsWith(',')) {
      baseContent = baseContent.slice(0, -1);
    }

    const finalContent = baseContent + ',\n' + newArticlesString + '\n];\n';
    
    fs.writeFileSync(filePath, finalContent, 'utf-8');
    console.log('Successfully enriched posts and fixed placeholders with valid syntax.');
  } else {
    console.log('Could not find opening brace.');
  }
} else {
  // If `2026_new_0` is gone because the file is completely broken, we need to locate where to append.
  console.log('Could not find 2026_new_0. Please manually check the file state.');
}
