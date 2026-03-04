export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  channel: {
    id?: string;
    name: string;
    avatar: string;
    verified: boolean;
  };
  views: string;
  uploadedAt: string;
  duration: string;
  description?: string;
  videoUrl?: string;
}

export const mockVideos: Video[] = [
  {
    id: "1",
    title: "Building a Full Stack App in 2024 - Complete Tutorial",
    thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=640&h=360&fit=crop",
    channel: {
      name: "Code Master",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop",
      verified: true,
    },
    views: "1.2M views",
    uploadedAt: "2 weeks ago",
    duration: "45:32",
    description: "Learn how to build a complete full stack application from scratch using modern technologies.",
  },
  {
    id: "2",
    title: "Top 10 JavaScript Tips Every Developer Should Know",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=640&h=360&fit=crop",
    channel: {
      name: "JS Ninja",
      avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&h=80&fit=crop",
      verified: true,
    },
    views: "856K views",
    uploadedAt: "5 days ago",
    duration: "12:45",
    description: "Essential JavaScript tips that will level up your coding skills instantly.",
  },
  {
    id: "3",
    title: "React 19 New Features Explained",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=640&h=360&fit=crop",
    channel: {
      name: "React Weekly",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop",
      verified: false,
    },
    views: "423K views",
    uploadedAt: "1 month ago",
    duration: "28:15",
    description: "Deep dive into all the new features coming in React 19.",
  },
  {
    id: "4",
    title: "CSS Grid vs Flexbox - When to Use What",
    thumbnail: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=640&h=360&fit=crop",
    channel: {
      name: "CSS Tricks",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop",
      verified: true,
    },
    views: "2.1M views",
    uploadedAt: "3 months ago",
    duration: "18:22",
    description: "Master the differences between CSS Grid and Flexbox layouts.",
  },
  {
    id: "5",
    title: "Machine Learning Basics for Web Developers",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=640&h=360&fit=crop",
    channel: {
      name: "AI Academy",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=80&h=80&fit=crop",
      verified: true,
    },
    views: "678K views",
    uploadedAt: "1 week ago",
    duration: "52:18",
    description: "Introduction to machine learning concepts for frontend developers.",
  },
  {
    id: "6",
    title: "Building Your First Mobile App with React Native",
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=640&h=360&fit=crop",
    channel: {
      name: "Mobile Dev Pro",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
      verified: false,
    },
    views: "345K views",
    uploadedAt: "4 days ago",
    duration: "1:15:44",
    description: "Complete guide to building cross-platform mobile apps.",
  },
  {
    id: "7",
    title: "The Future of Web Development in 2025",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=640&h=360&fit=crop",
    channel: {
      name: "Tech Trends",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop",
      verified: true,
    },
    views: "1.8M views",
    uploadedAt: "2 months ago",
    duration: "32:10",
    description: "Predictions and trends shaping the future of web development.",
  },
  {
    id: "8",
    title: "Docker Tutorial for Beginners",
    thumbnail: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=640&h=360&fit=crop",
    channel: {
      name: "DevOps Journey",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop",
      verified: true,
    },
    views: "567K views",
    uploadedAt: "3 weeks ago",
    duration: "42:55",
    description: "Learn Docker from scratch with practical examples.",
  },
  {
    id: "9",
    title: "TypeScript Advanced Types Deep Dive",
    thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=640&h=360&fit=crop",
    channel: {
      name: "TypeScript Master",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop",
      verified: false,
    },
    views: "234K views",
    uploadedAt: "6 days ago",
    duration: "38:20",
    description: "Advanced TypeScript techniques for professional developers.",
  },
  {
    id: "10",
    title: "Building a Real-Time Chat Application",
    thumbnail: "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=640&h=360&fit=crop",
    channel: {
      name: "WebSocket Pro",
      avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=80&h=80&fit=crop",
      verified: true,
    },
    views: "890K views",
    uploadedAt: "2 weeks ago",
    duration: "58:30",
    description: "Build a complete real-time chat app with WebSockets.",
  },
  {
    id: "11",
    title: "Next.js 14 App Router Complete Guide",
    thumbnail: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=640&h=360&fit=crop",
    channel: {
      name: "Next.js Hub",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop",
      verified: true,
    },
    views: "1.5M views",
    uploadedAt: "1 month ago",
    duration: "1:25:00",
    description: "Master the new App Router in Next.js 14.",
  },
  {
    id: "12",
    title: "Tailwind CSS Pro Tips and Tricks",
    thumbnail: "https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?w=640&h=360&fit=crop",
    channel: {
      name: "Tailwind Labs",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop",
      verified: true,
    },
    views: "445K views",
    uploadedAt: "5 days ago",
    duration: "22:15",
    description: "Professional tips to supercharge your Tailwind workflow.",
  },
];

export const categories = [
  "All",
  "Music",
  "Gaming",
  "News",
  "Live",
  "Programming",
  "Podcasts",
  "Movies",
  "Sports",
  "Learning",
  "Fashion",
  "Cooking",
  "Recently uploaded",
  "Watched",
];
