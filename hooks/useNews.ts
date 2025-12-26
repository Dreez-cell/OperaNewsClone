import { useState, useEffect } from 'react';
import { NewsArticle } from '../types/news';
import { getNewsByCategory, toggleSaveArticle } from '../services/newsService';

export const useNews = (category: string = 'all') => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadArticles = () => {
    const newsData = getNewsByCategory(category);
    setArticles(newsData);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      loadArticles();
    }, 500);
  }, [category]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadArticles();
      setRefreshing(false);
    }, 1000);
  };

  const handleToggleSave = (articleId: string) => {
    setArticles((prev) => toggleSaveArticle(articleId, prev));
  };

  return {
    articles,
    loading,
    refreshing,
    handleRefresh,
    handleToggleSave,
  };
};
