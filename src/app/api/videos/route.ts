import { NextResponse } from 'next/server';
import { Video } from '@/data/mockVideos';

function formatDuration(pt: string) {
  const match = pt.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return "0:00";
  const h = match[1] ? parseInt(match[1].replace('H', '')) : 0;
  const m = match[2] ? parseInt(match[2].replace('M', '')) : 0;
  const s = match[3] ? parseInt(match[3].replace('S', '')) : 0;

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatViews(viewCount: string) {
  const views = parseInt(viewCount);
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`;
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K views`;
  return `${views} views`;
}

function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const months = Math.floor(diffInSeconds / (30 * 24 * 3600));
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;

  const days = Math.floor(diffInSeconds / (24 * 3600));
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;

  const hours = Math.floor(diffInSeconds / 3600);
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;

  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;

  return "Just now";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const id = searchParams.get("id") || "";
  const channelId = searchParams.get("channelId") || "";
  const pageToken = searchParams.get("pageToken") || "";
  
  const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  if (!API_KEY) {
    return NextResponse.json({ error: "No API key configured" }, { status: 500 });
  }

  try {
    let endpoint = "";
    
    if (id) {
      endpoint = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${id}&key=${API_KEY}`;
    } else if (channelId) {
       // Search endpoint to get video IDs from a channel
       let searchEndpoint = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&channelId=${channelId}&type=video&key=${API_KEY}`;
       if (pageToken) searchEndpoint += `&pageToken=${pageToken}`;
       const searchRes = await fetch(searchEndpoint);
       const searchData = await searchRes.json();
       
       if (!searchData.items || searchData.items.length === 0) {
          return NextResponse.json({ videos: [], nextPageToken: null });
       }
       const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
       endpoint = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${API_KEY}`;
       // Stash nextPageToken globally for this request logic
       (request as any).nextPageToken = searchData.nextPageToken;
    } else if (q) {
      // Search endpoint doesn't give duration/views directly, so we search, get IDs, then get video details
      let searchEndpoint = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${encodeURIComponent(q)}&type=video&key=${API_KEY}`;
      if (pageToken) searchEndpoint += `&pageToken=${pageToken}`;
      const searchRes = await fetch(searchEndpoint);
      const searchData = await searchRes.json();
      
      if (!searchData.items || searchData.items.length === 0) {
         return NextResponse.json({ videos: [], nextPageToken: null });
      }
      const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
      endpoint = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${API_KEY}`;
      (request as any).nextPageToken = searchData.nextPageToken;
    } else {
      endpoint = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&regionCode=US&maxResults=12&key=${API_KEY}`;
      if (pageToken) endpoint += `&pageToken=${pageToken}`;
    }

    const res = await fetch(endpoint);
    const data = await res.json();
    
    if (!res.ok) {
      console.error("YouTube API Response Error:", data);
      return NextResponse.json({ 
        error: "YouTube API Error", 
        details: data.error?.message || "Unknown error" 
      }, { status: res.status });
    }

    // Fallback to data.nextPageToken if it was a direct videos call (mostPopular)
    const nextPageToken = (request as any).nextPageToken || data.nextPageToken || null;

    const formattedVideos: Video[] = (data.items || []).map((item: any) => ({
      id: item.id?.videoId || item.id,
      title: item.snippet?.title || "No Title",
      thumbnail: item.snippet?.thumbnails?.maxres?.url || item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url || "",
      channel: {
        id: item.snippet?.channelId || "",
        name: item.snippet?.channelTitle || "Unknown Channel",
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(item.snippet?.channelTitle || "Unknown")}`,
        verified: parseInt(item.statistics?.subscriberCount || "0") > 100000,
      },
      views: item.statistics?.viewCount ? formatViews(item.statistics.viewCount) : "0 views",
      uploadedAt: item.snippet?.publishedAt ? timeAgo(item.snippet.publishedAt) : "Unknown date",
      duration: item.contentDetails?.duration ? formatDuration(item.contentDetails.duration) : "0:00",
      description: item.snippet?.description || "",
      // For playing the video inline, we use the YouTube embed URL
      videoUrl: `https://www.youtube.com/embed/${item.id?.videoId || item.id}?autoplay=1`
    }));

    return NextResponse.json({ videos: formattedVideos, nextPageToken });
  } catch (error) {
    console.error("YouTube API Error:", error);
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
  }
}
