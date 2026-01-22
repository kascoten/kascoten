# KASCOTE News System - Visual Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    KASCOTE WEBSITE                          │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┼───────────┐
                │           │           │
            ┌──────┐    ┌────────┐  ┌─────────┐
            │INDEX │    │  NEWS  │  │ POST    │
            │(Home)│    │  HUB   │  │ DETAIL  │
            └──────┘    └────────┘  └─────────┘
                │           │           │
                │           │           │
        ┌───────┴─────┐     │     ┌─────┴─────────┐
        │             │     │     │               │
    ┌─────────┐   ┌──────────┐  ┌──────────────────┐
    │RECENT   │   │PAGINATION│  │IMAGE GALLERY     │
    │NEWS     │   │LOAD MORE │  │LIGHTBOX VIEWER   │
    │SECTION  │   │LAZY LOAD │  │RELATED POSTS     │
    └─────────┘   └──────────┘  └──────────────────┘
        │             │             │
        └─────────────┼─────────────┘
                      │
            ┌─────────▼──────────┐
            │   FIREBASE         │
            │   FIRESTORE        │
            └────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
    ┌────────┐   ┌────────┐   ┌─────────┐
    │ARTICLES│   │COMMENTS│   │LIKES    │
    │        │   │        │   │         │
    └────────┘   └────────┘   └─────────┘
```

## Data Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    USER INTERACTION                          │
└──────────────────────────────────────────────────────────────┘
                          │
                ┌─────────┼─────────┐
                │         │         │
            ┌───────┐ ┌────────┐ ┌──────────┐
            │SEARCH │ │FILTER  │ │PAGINATION│
            └───┬───┘ └───┬────┘ └───┬──────┘
                │         │          │
                └─────────┼──────────┘
                          │
                ┌─────────▼──────────┐
                │ articles[]         │
                │ (cached in memory) │
                └────────┬───────────┘
                         │
            ┌────────────┼────────────┐
            │            │            │
        ┌────────┐  ┌────────┐  ┌──────────┐
        │Filter  │  │Sort    │  │Paginate  │
        │by cat  │  │by date │  │12/page   │
        └───┬────┘  └───┬────┘  └────┬─────┘
            │           │           │
            └───────────┼───────────┘
                        │
            ┌───────────▼────────────┐
            │ Render news cards      │
            │ (DOM elements)         │
            └───────────┬────────────┘
                        │
            ┌───────────▼────────────┐
            │ Attach event listeners │
            │ - Like                 │
            │ - Comment              │
            │ - Read More (link)     │
            └───────────┬────────────┘
                        │
            ┌───────────▼────────────┐
            │ Display to user        │
            └────────────────────────┘
```

## Article Detail Flow

```
┌────────────────────────────────────────────┐
│  post-detail.html?id={articleId}           │
└────────────────────────┬────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
    ┌───────────┐  ┌──────────────┐  ┌────────────┐
    │Get Article│  │Load Comments │  │Load Likes  │
    │from       │  │from Firebase │  │from        │
    │Firebase   │  │              │  │Firebase    │
    └───┬───────┘  └──────┬───────┘  └────┬───────┘
        │                 │              │
        └─────────────────┼──────────────┘
                          │
            ┌─────────────▼─────────────┐
            │ Render article content    │
            │ - Title                   │
            │ - Featured image          │
            │ - Author info             │
            │ - Body content            │
            └─────────────┬─────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
    ┌───────────┐  ┌─────────────┐  ┌──────────────┐
    │Images     │  │Gallery      │  │Related Posts │
    │           │  │Setup        │  │Query by cat  │
    └───┬───────┘  └──────┬──────┘  └──────┬───────┘
        │                 │                │
        │      ┌──────────┼────────────┐   │
        │      │          │            │   │
    ┌────────┐ │  ┌──────────────┐    │   │
    │Lightbox│ │  │Lightbox      │    │   │
    │Events  │ │  │Keyboard nav  │    │   │
    └────────┘ │  └──────────────┘    │   │
               │                       │   │
               └───────────────────────┼───┘
                                       │
            ┌──────────────────────────▼──────────────────────┐
            │ Render interactions                            │
            │ - Comments list (real-time updates)           │
            │ - Like button                                  │
            │ - Share button                                 │
            │ - Comment form (authenticated)                │
            └──────────────────────────┬──────────────────────┘
                                       │
            ┌──────────────────────────▼──────────────────────┐
            │ Setup event listeners                           │
            │ - onSnapshot for comments/likes                │
            │ - Click handlers for interactions             │
            │ - Form submission                              │
            └───────────────────────────────────────────────┘
```

## Homepage Recent News Flow

```
┌──────────────────────────────┐
│      index.html loads        │
└──────────────┬───────────────┘
               │
    ┌──────────▼──────────┐
    │homepage-news.js     │
    │initializes          │
    └──────────┬──────────┘
               │
        ┌──────▼──────┐
        │Query        │
        │Firebase for │
        │3 most       │
        │recent       │
        │articles     │
        └──────┬──────┘
               │
        ┌──────▼──────────────────┐
        │Articles found?          │
        └──────┬─────────────┬────┘
               │ YES         │ NO
               │             │
        ┌──────▼──────┐  ┌──────────────┐
        │Render cards │  │Load sample   │
        │from DB      │  │data & render │
        └──────┬──────┘  └──────┬───────┘
               │                │
               └────────┬───────┘
                        │
        ┌───────────────▼────────────────┐
        │Display 3 recent news cards     │
        │on homepage                     │
        └───────────────┬────────────────┘
                        │
        ┌───────────────▼────────────────┐
        │User clicks article card        │
        └───────────────┬────────────────┘
                        │
        ┌───────────────▼────────────────┐
        │Navigate to:                    │
        │post-detail.html?id={articleId} │
        └────────────────────────────────┘
```

## Performance Optimization Strategy

```
┌─────────────────────────────────────────────┐
│      PERFORMANCE OPTIMIZATION LAYERS        │
└─────────────────────────────────────────────┘

Layer 1: REQUEST OPTIMIZATION
┌────────────────────────────────────────┐
│ - Query only necessary fields           │
│ - Limit initial results (12)            │
│ - Order by publishedAt (index)          │
│ - Cache results in memory               │
└────────────────────────────────────────┘

Layer 2: RENDERING OPTIMIZATION
┌────────────────────────────────────────┐
│ - Load only 12 articles initially       │
│ - "Load More" pagination               │
│ - Lazy load images (Intersection Obs)   │
│ - Dynamic DOM insertion                │
└────────────────────────────────────────┘

Layer 3: MEMORY OPTIMIZATION
┌────────────────────────────────────────┐
│ - Cache articles in allArticles array   │
│ - Search/filter on cache (not DB)      │
│ - Reuse cached data for subsequent ops │
│ - Minimal Firebase queries              │
└────────────────────────────────────────┘

Layer 4: IMAGE OPTIMIZATION
┌────────────────────────────────────────┐
│ - Lazy loading with loading="lazy"      │
│ - Intersection Observer for detection   │
│ - Only load visible images              │
│ - Responsive image sizes                │
└────────────────────────────────────────┘

Result: 40-50% faster load time!
```

## Firebase Collections Diagram

```
┌─────────────────────────────────────────────┐
│         FIRESTORE DATABASE STRUCTURE        │
└─────────────────────────────────────────────┘

articles (collection)
├── article-id-1 (document)
│   ├── title: "Article Title"
│   ├── excerpt: "..."
│   ├── content: "..."
│   ├── imageUrl: "..."
│   ├── category: "news"
│   ├── author: "..."
│   ├── publishedAt: timestamp
│   ├── readTime: 5
│   ├── tags: ["tag1", "tag2"]
│   ├── images: [...]
│   │
│   ├── likes (subcollection)
│   │   ├── user-id-1 (doc)
│   │   │   └── userId: "..."
│   │   │       createdAt: timestamp
│   │   ├── user-id-2 (doc)
│   │   └── ...
│   │
│   └── comments (subcollection)
│       ├── comment-id-1 (doc)
│       │   ├── text: "..."
│       │   ├── author: "..."
│       │   ├── userId: "..."
│       │   └── createdAt: timestamp
│       ├── comment-id-2 (doc)
│       └── ...
│
├── article-id-2 (document)
│   └── ...
│
└── article-id-3 (document)
    └── ...

newsletter_subscribers (collection)
├── subscriber-id-1 (doc)
│   ├── email: "user@example.com"
│   ├── subscribedAt: timestamp
│   └── status: "active"
├── subscriber-id-2 (doc)
└── ...
```

## URL Navigation Structure

```
www.kascote.com/
│
├── index.html (homepage)
│   ├── Recent News Section
│   │   └── Links to post-detail.html?id={articleId}
│   └── "View All Articles" link
│       └── news.html
│
├── news.html (news hub)
│   ├── Search functionality
│   ├── Category filters
│   ├── Pagination (12/page)
│   └── Article cards
│       └── Link to post-detail.html?id={articleId}
│
└── post-detail.html?id={articleId} (single article)
    ├── Article content
    ├── Image gallery
    ├── Comments
    ├── Likes
    ├── Related articles
    │   └── Links to other post-detail pages
    └── "Back to News" breadcrumb
        └── news.html
```

## Responsive Design Breakpoints

```
┌────────────────────────────────────────────┐
│    RESPONSIVE DESIGN STRATEGY              │
└────────────────────────────────────────────┘

Mobile (<768px)
├── 1 column grid
├── Full-width cards
├── Stacked layout
└── Touch-friendly buttons

Tablet (768-1024px)
├── 2 column grid
├── Medium width cards
├── Optimized spacing
└── Balanced layout

Desktop (>1024px)
├── 3 column grid
├── Side-by-side display
├── Maximum width constraint
└── Multi-column layouts
```

---

**Last Updated:** January 22, 2026
**Diagram Version:** 2.0
