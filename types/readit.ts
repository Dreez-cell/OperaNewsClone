export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
}

export interface Community {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  icon_url?: string;
  banner_url?: string;
  member_count: number;
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  community_id?: string;
  title: string;
  content?: string;
  post_type: 'text' | 'image' | 'video' | 'link';
  media_urls?: string[];
  link_url?: string;
  upvotes: number;
  downvotes: number;
  comment_count: number;
  share_count: number;
  view_count: number;
  trending_score: number;
  created_at: string;
  updated_at: string;
  user_profiles?: UserProfile;
  communities?: Community;
  user_vote?: 'up' | 'down' | null;
  is_saved?: boolean;
  is_joined?: boolean;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  parent_comment_id?: string;
  content: string;
  upvotes: number;
  downvotes: number;
  created_at: string;
  updated_at: string;
  user_profiles?: UserProfile;
  replies?: Comment[];
}

export interface DirectMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  media_url?: string;
  is_read: boolean;
  created_at: string;
  sender?: UserProfile;
  receiver?: UserProfile;
}

export interface UserFollow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface UserAnalytics {
  id: string;
  user_id: string;
  total_posts: number;
  total_comments: number;
  total_upvotes_received: number;
  total_followers: number;
  total_following: number;
  karma_score: number;
  updated_at: string;
}

export interface Hashtag {
  id: string;
  tag: string;
  use_count: number;
  trending_score: number;
  created_at: string;
}

export interface TrendingTopic {
  topic: string;
  description: string;
  relevance: number;
}
