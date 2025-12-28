export interface Post {
  id: string;
  subreddit: string;
  subredditIcon: string;
  author: string;
  title: string;
  content?: string;
  imageUrl?: string;
  videoUrl?: string;
  upvotes: number;
  downvotes: number;
  comments: number;
  shares: number;
  postedAt: string;
  userVote?: 'up' | 'down' | null;
  joined?: boolean;
  saved?: boolean;
}

export interface Community {
  id: string;
  name: string;
  icon: string;
  members?: string;
  description?: string;
  joined?: boolean;
}

export interface User {
  id: string;
  username: string;
  avatar: string;
  karma: number;
}
