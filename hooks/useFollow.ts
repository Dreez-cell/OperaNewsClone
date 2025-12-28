import { useState, useEffect } from 'react';
import { useAuth } from '@/template';
import { followUser, checkFollowStatus } from '../services/readitService';

export function useFollow(userId?: string) {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && userId && user.id !== userId) {
      checkStatus();
    }
  }, [user, userId]);

  const checkStatus = async () => {
    if (!user || !userId) return;

    const { isFollowing: status } = await checkFollowStatus(user.id, userId);
    setIsFollowing(status);
  };

  const toggleFollow = async () => {
    if (!user || !userId || user.id === userId) return;

    setLoading(true);
    const { isFollowing: newStatus, error } = await followUser(user.id, userId);
    
    if (!error) {
      setIsFollowing(newStatus);
    } else {
      console.error('Error toggling follow:', error);
    }
    
    setLoading(false);
  };

  return {
    isFollowing,
    loading,
    toggleFollow,
  };
}
