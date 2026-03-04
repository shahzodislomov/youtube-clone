"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import VideoPlayer from "@/components/VideoPlayer";
import { Video } from "@/data/mockVideos";

function WatchContent() {
  const searchParams = useSearchParams();
  const v = searchParams.get("v");
  const router = useRouter();

  const [video, setVideo] = useState<Video | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!v) {
       router.push("/");
       return;
    }

    async function fetchWatchData() {
      setLoading(true);
      try {
        // Fetch specific video by ID
        const resVideo = await fetch(`/api/videos?id=${encodeURIComponent(v as string)}`);
        const dataVideo = await resVideo.json();
        
        if (dataVideo.videos && dataVideo.videos.length > 0) {
          setVideo(dataVideo.videos[0]);
          
          // Fetch related videos (we map to most popular as a related surrogate for now)
          const resRelated = await fetch(`/api/videos`);
          const dataRelated = await resRelated.json();
          if (dataRelated.videos) {
            setRelatedVideos(dataRelated.videos.filter((rv: Video) => rv.id !== v));
          }
        }
      } catch (error) {
        console.error("Failed to fetch watch data", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchWatchData();
  }, [v, router]);

  if (loading || !video) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-yt-red border-t-transparent"></div>
      </div>
    );
  }

  return (
    <VideoPlayer 
      video={video} 
      relatedVideos={relatedVideos} 
      onBack={() => router.back()} 
      onVideoClick={(v) => router.push(`/watch?v=${v.id}`)}
    />
  );
}

export default function WatchPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-yt-red border-t-transparent"></div>
      </div>
    }>
      <WatchContent />
    </Suspense>
  );
}
