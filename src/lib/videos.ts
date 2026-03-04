import { Video } from "./types";

export const videos: Video[] = [
  {
    id: "1",
    title: "Building a YouTube Clone with Next.js App Router",
    channel: "Wenaco Dev",
    views: 12450,
    createdAt: "2025-12-15T10:00:00.000Z",
    duration: "14:32",
    thumbnailUrl: "/thumbnails/youtube-clone.png",
    videoUrl: "/videos/youtube-clone.mp4",
  },
  {
    id: "2",
    title: "Zustand State Management Crash Course",
    channel: "Wenaco Dev",
    views: 8450,
    createdAt: "2025-11-02T15:30:00.000Z",
    duration: "9:10",
    thumbnailUrl: "/thumbnails/zustand.png",
    videoUrl: "/videos/zustand.mp4",
  },
];

export function formatViews(views: number) {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M views`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K views`;
  return `${views} views`;
}

export function timeAgo(isoDate: string): string {
  const created = new Date(isoDate).getTime();
  const now = Date.now();
  const diffMs = now - created;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 30) return `${diffDays} days ago`;
  const months = Math.floor(diffDays / 30);
  if (months === 1) return "1 month ago";
  if (months < 12) return `${months} months ago`;
  const years = Math.floor(months / 12);
  return years === 1 ? "1 year ago" : `${years} years ago`;
}

export function getVideoById(id: string): Video | undefined {
  return videos.find((v) => v.id === id);
}
export async function fetchPopularVideos() {
  const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  const endpoint = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&regionCode=US&maxResults=10&key=${API_KEY}`;
  
  const res = await fetch(endpoint);
  const data = await res.json();
  
  return data.items;
}
