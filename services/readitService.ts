import { getSupabaseClient } from '@/template';
import { Post, Comment, DirectMessage, UserProfile, Community, Hashtag, UserAnalytics } from '../types/readit';

const supabase = getSupabaseClient();

// ============================================
// POSTS
// ============================================

export const fetchPosts = async (userId?: string, limit = 20) => {
  try {
    let query = supabase
      .from('posts')
      .select(`
        *,
        user_profiles!posts_user_id_fkey(id, username, email, avatar_url),
        communities(id, name, display_name, icon_url)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    const { data: posts, error } = await query;
    if (error) throw error;

    if (!posts) return [];

    // Get user votes and saves if logged in
    if (userId) {
      const postIds = posts.map((p) => p.id);
      
      const { data: votes } = await supabase
        .from('post_votes')
        .select('post_id, vote_type')
        .eq('user_id', userId)
        .in('post_id', postIds);

      const { data: saves } = await supabase
        .from('saved_posts')
        .select('post_id')
        .eq('user_id', userId)
        .in('post_id', postIds);

      const { data: memberships } = await supabase
        .from('community_members')
        .select('community_id')
        .eq('user_id', userId);

      const voteMap = new Map(votes?.map((v) => [v.post_id, v.vote_type]) || []);
      const saveSet = new Set(saves?.map((s) => s.post_id) || []);
      const joinedSet = new Set(memberships?.map((m) => m.community_id) || []);

      return posts.map((post) => ({
        ...post,
        user_vote: voteMap.get(post.id) || null,
        is_saved: saveSet.has(post.id),
        is_joined: post.community_id ? joinedSet.has(post.community_id) : false,
      }));
    }

    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

export const createPost = async (
  userId: string,
  title: string,
  content: string,
  postType: 'text' | 'image' | 'video' | 'link',
  mediaUrls?: string[],
  linkUrl?: string,
  communityId?: string
) => {
  try {
    // Extract and create hashtags
    const hashtagRegex = /#(\w+)/g;
    const hashtags = content.match(hashtagRegex)?.map((h) => h.slice(1).toLowerCase()) || [];

    const { data: post, error } = await supabase
      .from('posts')
      .insert({
        user_id: userId,
        community_id: communityId,
        title,
        content,
        post_type: postType,
        media_urls: mediaUrls,
        link_url: linkUrl,
      })
      .select()
      .single();

    if (error) throw error;

    // Create hashtags
    for (const tag of hashtags) {
      const { data: hashtag } = await supabase
        .from('hashtags')
        .upsert({ tag, use_count: 1 }, { onConflict: 'tag', ignoreDuplicates: false })
        .select()
        .single();

      if (hashtag) {
        await supabase
          .from('post_hashtags')
          .insert({ post_id: post.id, hashtag_id: hashtag.id });
      }
    }

    return { data: post, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

export const votePost = async (userId: string, postId: string, voteType: 'up' | 'down') => {
  try {
    const { data: existing } = await supabase
      .from('post_votes')
      .select('*')
      .eq('user_id', userId)
      .eq('post_id', postId)
      .single();

    if (existing) {
      if (existing.vote_type === voteType) {
        // Remove vote
        const { error } = await supabase
          .from('post_votes')
          .delete()
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        // Change vote
        const { error } = await supabase
          .from('post_votes')
          .update({ vote_type: voteType })
          .eq('id', existing.id);
        if (error) throw error;
      }
    } else {
      // New vote
      const { error } = await supabase
        .from('post_votes')
        .insert({ user_id: userId, post_id: postId, vote_type: voteType });
      if (error) throw error;
    }

    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const savePost = async (userId: string, postId: string) => {
  try {
    const { data: existing } = await supabase
      .from('saved_posts')
      .select('*')
      .eq('user_id', userId)
      .eq('post_id', postId)
      .single();

    if (existing) {
      const { error } = await supabase
        .from('saved_posts')
        .delete()
        .eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('saved_posts')
        .insert({ user_id: userId, post_id: postId });
      if (error) throw error;
    }

    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const trackPostView = async (postId: string, userId?: string) => {
  try {
    await supabase.from('post_analytics').insert({
      post_id: postId,
      user_id: userId,
      event_type: 'view',
    });

    await supabase
      .from('posts')
      .update({ view_count: supabase.sql`view_count + 1` })
      .eq('id', postId);
  } catch (error) {
    console.error('Error tracking view:', error);
  }
};

// ============================================
// COMMENTS
// ============================================

export const fetchComments = async (postId: string) => {
  try {
    const { data: comments, error } = await supabase
      .from('comments')
      .select(`
        *,
        user_profiles!comments_user_id_fkey(id, username, email, avatar_url)
      `)
      .eq('post_id', postId)
      .is('parent_comment_id', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return comments || [];
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
};

export const createComment = async (userId: string, postId: string, content: string, parentId?: string) => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        user_id: userId,
        post_id: postId,
        content,
        parent_comment_id: parentId,
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// ============================================
// COMMUNITIES
// ============================================

export const joinCommunity = async (userId: string, communityId: string) => {
  try {
    const { data: existing } = await supabase
      .from('community_members')
      .select('*')
      .eq('user_id', userId)
      .eq('community_id', communityId)
      .single();

    if (existing) {
      const { error } = await supabase
        .from('community_members')
        .delete()
        .eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('community_members')
        .insert({ user_id: userId, community_id: communityId });
      if (error) throw error;
    }

    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// ============================================
// USER FOLLOWS
// ============================================

export const followUser = async (followerId: string, followingId: string) => {
  try {
    const { data: existing } = await supabase
      .from('user_follows')
      .select('*')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .single();

    if (existing) {
      const { error } = await supabase
        .from('user_follows')
        .delete()
        .eq('id', existing.id);
      if (error) throw error;
      return { isFollowing: false, error: null };
    } else {
      const { error } = await supabase
        .from('user_follows')
        .insert({ follower_id: followerId, following_id: followingId });
      if (error) throw error;
      return { isFollowing: true, error: null };
    }
  } catch (error: any) {
    return { isFollowing: false, error: error.message };
  }
};

export const checkFollowStatus = async (followerId: string, followingId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_follows')
      .select('*')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .single();

    return { isFollowing: !!data, error: null };
  } catch (error: any) {
    return { isFollowing: false, error: error.message };
  }
};

// ============================================
// DIRECT MESSAGES
// ============================================

export const fetchConversations = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('direct_messages')
      .select(`
        *,
        sender:user_profiles!direct_messages_sender_id_fkey(id, username, email, avatar_url),
        receiver:user_profiles!direct_messages_receiver_id_fkey(id, username, email, avatar_url)
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }
};

export const sendMessage = async (senderId: string, receiverId: string, content: string) => {
  try {
    const { data, error } = await supabase
      .from('direct_messages')
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        content,
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// ============================================
// ANALYTICS
// ============================================

export const fetchUserAnalytics = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_analytics')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return null;
  }
};

// ============================================
// TRENDING & AI
// ============================================

export const fetchTrending = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('trending-analysis');
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching trending:', error);
    return null;
  }
};

export const getAIRecommendations = async (userId?: string, context: 'home' | 'trending' | 'personalized' = 'home') => {
  try {
    const { data, error } = await supabase.functions.invoke('ai-recommendations', {
      body: { userId, context, limit: 20 },
    });
    
    if (error) throw error;
    return data?.posts || [];
  } catch (error) {
    console.error('Error fetching AI recommendations:', error);
    return [];
  }
};

export const moderateContent = async (content: string, title?: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('ai-content-moderation', {
      body: { content, title },
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error moderating content:', error);
    return { safe: true, reason: '', categories: [] };
  }
};

// ============================================
// MEDIA UPLOAD
// ============================================

export const uploadImage = async (userId: string, file: File | Blob, fileName: string) => {
  try {
    const filePath = `${userId}/${Date.now()}_${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('post-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('post-images')
      .getPublicUrl(filePath);

    return { url: urlData.publicUrl, error: null };
  } catch (error: any) {
    return { url: null, error: error.message };
  }
};

export const uploadVideo = async (userId: string, file: File | Blob, fileName: string) => {
  try {
    const filePath = `${userId}/${Date.now()}_${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('post-videos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('post-videos')
      .getPublicUrl(filePath);

    return { url: urlData.publicUrl, error: null };
  } catch (error: any) {
    return { url: null, error: error.message };
  }
};
