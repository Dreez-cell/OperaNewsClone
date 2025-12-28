import { Post, Community } from '../types/reddit';

export const mockCommunities: Community[] = [
  { id: '1', name: 'r/AnythingGoesNews', icon: '📰', members: '245K', joined: true },
  { id: '2', name: 'r/entertainment', icon: '🎬', members: '1.2M', joined: true },
  { id: '3', name: 'r/Foodforthought', icon: '🍔', members: '890K', joined: true },
  { id: '4', name: 'r/geopolitics', icon: '🌍', members: '567K', joined: true },
  { id: '5', name: 'r/news', icon: '📡', members: '5.6M', joined: true },
  { id: '6', name: 'r/pocketgrids', icon: '📱', members: '123K', joined: true },
  { id: '7', name: 'r/YNNews', icon: '📺', members: '340K', joined: false },
  { id: '8', name: 'r/technology', icon: '💻', members: '12.4M', joined: false },
  { id: '9', name: 'r/worldnews', icon: '🌐', members: '28.1M', joined: false },
];

export const recentlyVisited: Community[] = [
  { id: '10', name: 'r/redditdev', icon: '👨‍💻' },
  { id: '6', name: 'r/pocketgrids', icon: '📱' },
  { id: '5', name: 'r/news', icon: '📡' },
];

const mockPosts: Post[] = [
  {
    id: '1',
    subreddit: 'r/freelance_forhire',
    subredditIcon: '💼',
    author: 'u/JobPoster',
    title: '[Hiring] We are Hiring: Virtual Assistant (Remote) $20/HOUR',
    content: 'We are looking for 12 reliable Virtual Assistant to join our team on a remote basis. Job Type: Remote Pay: $20 per hour Schedule: Flexible (must meet deadlines) Responsibilities H...',
    upvotes: 75,
    downvotes: 0,
    comments: 183,
    shares: 59,
    postedAt: '18h',
    joined: false,
  },
  {
    id: '2',
    subreddit: 'r/AnythingGoesNews',
    subredditIcon: '📰',
    author: 'u/NewsShare',
    title: 'JD Vance now claims the UK and France having nuclear weapons is a national security risk for the US',
    imageUrl: 'https://images.unsplash.com/photo-1495573258723-2c7be7a646ce?w=800&q=80',
    upvotes: 782,
    downvotes: 0,
    comments: 230,
    shares: 99,
    postedAt: '1d',
    joined: false,
  },
  {
    id: '3',
    subreddit: 'r/YNNews',
    subredditIcon: '📺',
    author: 'u/VideoNews',
    title: 'Someone requested a Boppin video',
    videoUrl: 'https://example.com/video',
    imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
    upvotes: 3800,
    downvotes: 0,
    comments: 4264,
    shares: 5900,
    postedAt: '7h',
    joined: false,
  },
  {
    id: '4',
    subreddit: 'r/technology',
    subredditIcon: '💻',
    author: 'u/TechGuru',
    title: 'New AI breakthrough promises to revolutionize smartphone photography',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
    upvotes: 1245,
    downvotes: 0,
    comments: 456,
    shares: 234,
    postedAt: '5h',
    joined: false,
  },
  {
    id: '5',
    subreddit: 'r/worldnews',
    subredditIcon: '🌐',
    author: 'u/GlobalNews',
    title: 'Breaking: Major climate agreement reached at international summit',
    imageUrl: 'https://images.unsplash.com/photo-1451847251646-8a6c0dd1510c?w=800&q=80',
    upvotes: 5621,
    downvotes: 0,
    comments: 1234,
    shares: 890,
    postedAt: '3h',
    joined: false,
  },
  {
    id: '6',
    subreddit: 'r/entertainment',
    subredditIcon: '🎬',
    author: 'u/MovieBuff',
    title: 'Exclusive: Behind the scenes of the most anticipated movie of 2025',
    imageUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80',
    upvotes: 892,
    downvotes: 0,
    comments: 178,
    shares: 123,
    postedAt: '9h',
    joined: true,
  },
];

export const getPosts = (): Post[] => {
  return mockPosts;
};

export const toggleVote = (postId: string, voteType: 'up' | 'down', posts: Post[]): Post[] => {
  return posts.map((post) => {
    if (post.id === postId) {
      const currentVote = post.userVote;
      let newUpvotes = post.upvotes;
      let newDownvotes = post.downvotes;
      let newUserVote: 'up' | 'down' | null = voteType;

      // Remove previous vote
      if (currentVote === 'up') {
        newUpvotes -= 1;
      } else if (currentVote === 'down') {
        newDownvotes -= 1;
      }

      // Apply new vote
      if (currentVote === voteType) {
        newUserVote = null;
      } else if (voteType === 'up') {
        newUpvotes += 1;
      } else {
        newDownvotes += 1;
      }

      return { ...post, upvotes: newUpvotes, downvotes: newDownvotes, userVote: newUserVote };
    }
    return post;
  });
};

export const toggleJoinCommunity = (postId: string, posts: Post[]): Post[] => {
  return posts.map((post) =>
    post.id === postId ? { ...post, joined: !post.joined } : post
  );
};

export const toggleSavePost = (postId: string, posts: Post[]): Post[] => {
  return posts.map((post) =>
    post.id === postId ? { ...post, saved: !post.saved } : post
  );
};

export const getSavedPosts = (posts: Post[]): Post[] => {
  return posts.filter((post) => post.saved);
};
