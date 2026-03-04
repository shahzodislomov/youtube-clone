"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import VideoCard from "@/components/VideoCard";
import { Video } from "@/data/mockVideos";
import { useInView } from "react-intersection-observer";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  const fetchVideos = useCallback(async (token: string | null = null) => {
    if (!query) {
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
      let url = `/api/videos?q=${encodeURIComponent(query)}`;
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
  }, [query]);

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

  return (
    <div className="px-4 md:px-6 max-w-[1280px] mx-auto">
      <h2 className="mb-6 text-xl font-bold">Search results for "{query}"</h2>
      
      <div className="grid gap-4 pb-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-yt-red border-t-transparent"></div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
