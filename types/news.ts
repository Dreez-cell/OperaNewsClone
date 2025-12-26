export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  source: string;
  publishedAt: string;
  readTime: string;
  saved?: boolean;
}

export interface NewsCategory {
  id: string;
  name: string;
  icon: string;
}
