import { useState, useEffect } from 'react';
import { useAuth } from '@/template';
import {
  fetchPosts,
  votePost,
  savePost,
  joinCommunity,
  trackPostView,
  getAIRecommendations,
} from '../services/readitService';
import { Post } from '../types/readit';

export function useReadit(feedType: 'home' | 'trending' | 'personalized' = 'home') {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPosts = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      let fetchedPosts: Post[];

      if (feedType === 'personalized' && user) {
        fetchedPosts = await getAIRecommendations(user.id, 'personalized');
      } else if (feedType === 'trending') {
        fetchedPosts = await getAIRecommendations(undefined, 'trending');
      } else {
        fetchedPosts = await fetchPosts(user?.id);
      }

      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [user, feedType]);

  const handleRefresh = async () => {
    await loadPosts(true);
  };

  const handleVote = async (postId: string, voteType: 'up' | 'down') => {
    if (!user) return;

    const postIndex = posts.findIndex((p) => p.id === postId);
    if (postIndex === -1) return;

    const post = posts[postIndex];
    const previousVote = post.user_vote;
    const newPosts = [...posts];

    // Optimistic update
    if (previousVote === voteType) {
      // Remove vote
      newPosts[postIndex] = {
        ...post,
        upvotes: voteType === 'up' ? post.upvotes - 1 : post.upvotes,
        downvotes: voteType === 'down' ? post.downvotes - 1 : post.downvotes,
        user_vote: null,
      };
    } else if (previousVote) {
      // Change vote
      newPosts[postIndex] = {
        ...post,
        upvotes: voteType === 'up' ? post.upvotes + 1 : post.upvotes - 1,
        downvotes: voteType === 'down' ? post.downvotes + 1 : post.downvotes - 1,
        user_vote: voteType,
      };
    } else {
      // New vote
      newPosts[postIndex] = {
        ...post,
        upvotes: voteType === 'up' ? post.upvotes + 1 : post.upvotes,
        downvotes: voteType === 'down' ? post.downvotes + 1 : post.downvotes,
        user_vote: voteType,
      };
    }

    setPosts(newPosts);

    // Actual API call
    const { error } = await votePost(user.id, postId, voteType);
    if (error) {
      // Revert on error
      setPosts(posts);
      console.error('Error voting:', error);
    }
  };

  const handleJoin = async (postId: string) => {
    if (!user) return;

    const postIndex = posts.findIndex((p) => p.id === postId);
    if (postIndex === -1) return;

    const post = posts[postIndex];
    if (!post.community_id) return;

    const newPosts = [...posts];
    newPosts[postIndex] = {
      ...post,
      is_joined: !post.is_joined,
    };

    setPosts(newPosts);

    const { error } = await joinCommunity(user.id, post.community_id);
    if (error) {
      setPosts(posts);
      console.error('Error joining community:', error);
    }
  };

  const handleSave = async (postId: string) => {
    if (!user) return;

    const postIndex = posts.findIndex((p) => p.id === postId);
    if (postIndex === -1) return;

    const post = posts[postIndex];
    const newPosts = [...posts];
    newPosts[postIndex] = {
      ...post,
      is_saved: !post.is_saved,
    };

    setPosts(newPosts);

    const { error } = await savePost(user.id, postId);
    if (error) {
      setPosts(posts);
      console.error('Error saving post:', error);
    }
  };

  const handleView = async (postId: string) => {
    await trackPostView(postId, user?.id);
  };

  return {
    posts,
    loading,
    refreshing,
    handleRefresh,
    handleVote,
    handleJoin,
    handleSave,
    handleView,
  };
}
