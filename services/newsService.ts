import { NewsArticle, NewsCategory } from '../types/news';

export const newsCategories: NewsCategory[] = [
  { id: 'all', name: 'All', icon: 'apps' },
  { id: 'trending', name: 'Trending', icon: 'trending-up' },
  { id: 'sports', name: 'Sports', icon: 'football' },
  { id: 'entertainment', name: 'Entertainment', icon: 'film' },
  { id: 'politics', name: 'Politics', icon: 'briefcase' },
  { id: 'business', name: 'Business', icon: 'stats-chart' },
  { id: 'technology', name: 'Technology', icon: 'phone-portrait' },
  { id: 'health', name: 'Health', icon: 'heart' },
];

const mockArticles: NewsArticle[] = [
  {
    id: '1',
    title: 'Kenya Sets New Record in Athletics Championship',
    description: 'Team Kenya dominated the World Athletics Championship with record-breaking performances across multiple events.',
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
    category: 'sports',
    source: 'Sports Daily',
    publishedAt: '2h ago',
    readTime: '3 min read',
  },
  {
    id: '2',
    title: 'New Tech Hub Opens in Nairobi',
    description: 'A state-of-the-art technology innovation center launches in Nairobi, promising to boost Kenya\'s tech ecosystem.',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
    category: 'technology',
    source: 'Tech News',
    publishedAt: '4h ago',
    readTime: '5 min read',
  },
  {
    id: '3',
    title: 'Breaking: Economic Growth Surpasses Expectations',
    description: 'Latest economic indicators show Kenya\'s economy growing faster than projected, signaling strong recovery.',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
    category: 'business',
    source: 'Business Today',
    publishedAt: '5h ago',
    readTime: '4 min read',
  },
  {
    id: '4',
    title: 'Music Festival Announces Star-Studded Lineup',
    description: 'Top African and international artists confirmed for this year\'s biggest music festival in East Africa.',
    imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
    category: 'entertainment',
    source: 'Entertainment Weekly',
    publishedAt: '6h ago',
    readTime: '2 min read',
  },
  {
    id: '5',
    title: 'Government Launches New Healthcare Initiative',
    description: 'Comprehensive healthcare program aims to provide free medical services to millions of citizens nationwide.',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
    category: 'health',
    source: 'Health Monitor',
    publishedAt: '8h ago',
    readTime: '6 min read',
  },
  {
    id: '6',
    title: 'Parliament Debates New Education Reform Bill',
    description: 'Lawmakers engage in heated discussions over proposed changes to the national education curriculum.',
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&q=80',
    category: 'politics',
    source: 'Political Digest',
    publishedAt: '10h ago',
    readTime: '7 min read',
  },
  {
    id: '7',
    title: 'Local Team Wins Regional Championship',
    description: 'After an intense final match, the home team secures victory and brings the trophy back to Kenya.',
    imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80',
    category: 'sports',
    source: 'Sports News',
    publishedAt: '12h ago',
    readTime: '3 min read',
  },
  {
    id: '8',
    title: 'AI Startup Raises $10M in Funding',
    description: 'Kenyan artificial intelligence company secures major investment to expand operations across Africa.',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    category: 'technology',
    source: 'Tech Tribune',
    publishedAt: '14h ago',
    readTime: '5 min read',
  },
];

export const getNewsByCategory = (categoryId: string): NewsArticle[] => {
  if (categoryId === 'all') {
    return mockArticles;
  }
  if (categoryId === 'trending') {
    return mockArticles.slice(0, 5);
  }
  return mockArticles.filter((article) => article.category === categoryId);
};

export const toggleSaveArticle = (articleId: string, articles: NewsArticle[]): NewsArticle[] => {
  return articles.map((article) =>
    article.id === articleId ? { ...article, saved: !article.saved } : article
  );
};

export const getSavedArticles = (articles: NewsArticle[]): NewsArticle[] => {
  return articles.filter((article) => article.saved);
};
