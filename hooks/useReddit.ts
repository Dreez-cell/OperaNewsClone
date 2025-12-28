import { useState, useEffect } from 'react';
import { Post } from '../types/reddit';
import { getPosts, toggleVote, toggleJoinCommunity, toggleSavePost } from '../services/redditService';

export const useReddit = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPosts = () => {
    const postsData = getPosts();
    setPosts(postsData);
    setLoading(false);
  };

  useEffect(() => {
    setTimeout(() => {
      loadPosts();
    }, 500);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadPosts();
      setRefreshing(false);
    }, 1000);
  };

  const handleVote = (postId: string, voteType: 'up' | 'down') => {
    setPosts((prev) => toggleVote(postId, voteType, prev));
  };

  const handleJoin = (postId: string) => {
    setPosts((prev) => toggleJoinCommunity(postId, prev));
  };

  const handleSave = (postId: string) => {
    setPosts((prev) => toggleSavePost(postId, prev));
  };

  return {
    posts,
    loading,
    refreshing,
    handleRefresh,
    handleVote,
    handleJoin,
    handleSave,
  };
};
