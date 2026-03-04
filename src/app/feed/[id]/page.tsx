"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import VideoCard from "@/components/VideoCard";
import { Video } from "@/data/mockVideos";
import { useInView } from "react-intersection-observer";

// specific categories like subscriptions and history that we don't have API data for 
const MockPages = ["subscriptions", "history", "playlists", "watch-later", "liked", "downloads", "settings", "report", "help"];

export default function FeedPage() {
  const params = useParams();
  const idValue = Array.isArray(params.id) ? params.id[0] : params.id;
  const id = idValue || "";
  
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  const isMockPage = MockPages.includes(id);

  const fetchVideos = useCallback(async (token: string | null = null) => {
    if (isMockPage) {
       setLoading(false);
       return;
    }

    if (token) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setVideos([]);
    }

    try {
      let url = `/api/videos?q=${encodeURIComponent(id)}`;
      if (token) {
        url += `&pageToken=${token}`;
      }
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.videos) {
        setVideos((prev) => {
           if (!token) return data.videos;
           const existingIds = new Set(prev.map(v => v.id));
           const newVideos = data.videos.filter((v: Video) => !existingIds.has(v.id));
           return [...prev, ...newVideos];
        });
        setNextPageToken(data.nextPageToken || null);
      }
    } catch (error) {
      console.error("Failed to fetch videos", error);
    } finally {
      if (token) setLoadingMore(false);
      else setLoading(false);
    }
  }, [id, isMockPage]);

  // Initial fetch
  useEffect(() => {
    fetchVideos(null);
  }, [fetchVideos]);

  // Load more when scrolled to bottom
  useEffect(() => {
    if (inView && !loading && !loadingMore && nextPageToken) {
      fetchVideos(nextPageToken);
    }
  }, [inView, loading, loadingMore, nextPageToken, fetchVideos]);


  if (isMockPage) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-semibold capitalize mb-2">{id.replace('-', ' ')}</h2>
        <p className="text-muted-foreground">Sign in to complete your {id.replace('-', ' ')} functionality. (OAuth Mocked)</p>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6">
      <h2 className="mb-6 text-xl font-bold capitalize">{id} Videos</h2>
      
      <div className="grid gap-4 pb-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {videos.map((video, index) => (
          <div key={`${video.id}-${index}`} style={{ animationDelay: `${(index % 12) * 50}ms` }}>
            <VideoCard video={video} />
          </div>
        ))}
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-yt-red border-t-transparent"></div>
        </div>
      )}

      {/* Infinite scroll trigger */}
      {nextPageToken && !loading && (
        <div ref={ref} className="flex w-full items-center justify-center py-10">
          {loadingMore && (
             <div className="h-8 w-8 animate-spin rounded-full border-4 border-yt-red border-t-transparent"></div>
          )}
        </div>
      )}
    </div>
  );
}
