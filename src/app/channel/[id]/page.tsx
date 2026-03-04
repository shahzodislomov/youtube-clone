"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import VideoCard from "@/components/VideoCard";
import { Video } from "@/data/mockVideos";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInView } from "react-intersection-observer";

export default function ChannelPage() {
  const params = useParams();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const channelId = decodeURIComponent(rawId || "");
  
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  const fetchVideos = useCallback(async (token: string | null = null) => {
    if (!channelId) {
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
      let url = `/api/videos?channelId=${encodeURIComponent(channelId)}`;
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
      console.error("Failed to fetch channel videos", error);
    } finally {
      if (token) setLoadingMore(false);
      else setLoading(false);
    }
  }, [channelId]);

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

  // Fetch subscription status independently
  useEffect(() => {
    async function checkSubscription() {
      if (!channelId) return;
      try {
        const res = await fetch(`/api/subscriptions?channelId=${channelId}`);
        const data = await res.json();
        setIsSubscribed(data.isSubscribed);
      } catch (error) {
        console.error("Failed to fetch subscription status", error);
      }
    }
    checkSubscription();
  }, [channelId]);

  const handleSubscribeToggle = async () => {
    setIsSubscribed(!isSubscribed);
    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelId }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setIsSubscribed(data.isSubscribed);
    } catch (error) {
      console.error("Failed to toggle subscription", error);
      setIsSubscribed(isSubscribed); 
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-yt-red border-t-transparent"></div>
      </div>
    );
  }

  const channelInfo = videos.length > 0 ? videos[0].channel : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Banner Mock */}
      <div className="h-44 w-full sm:h-56 md:h-64 lg:h-72">
        <img 
          src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1920&h=400&fit=crop" 
          alt="Channel Banner" 
          className="h-full w-full object-cover"
        />
      </div>

      <div className="mx-auto max-w-[1280px] px-4 md:px-6">
        {/* Channel Header */}
        <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6 pb-6 border-b border-border">
          <img 
            src={channelInfo?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${channelId}`} 
            alt="Avatar" 
            className="h-20 w-20 rounded-full object-cover sm:h-32 sm:w-32"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold sm:text-3xl text-foreground">
                {channelInfo?.name || "Loading Channel..."}
              </h1>
              {channelInfo?.verified && (
                <CheckCircle2 className="h-5 w-5 fill-muted-foreground text-background" />
              )}
            </div>
            <div className="mt-1 text-sm text-muted-foreground sm:text-base">
              @Channel_{channelId} • 1.2M subscribers • {videos.length || 0} videos
            </div>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground line-clamp-2">
              Welcome to the channel! Here you will find the latest and greatest content uploaded directly to YouTube.
            </p>
            
            <div className="mt-4 flex gap-2">
              <Button
                onClick={handleSubscribeToggle}
                className={`rounded-full ${
                  isSubscribed
                    ? "bg-secondary text-secondary-foreground hover:bg-yt-hover"
                    : "bg-foreground text-background hover:bg-foreground/90"
                }`}
              >
                {isSubscribed ? "Subscribed" : "Subscribe"}
              </Button>
            </div>
          </div>
        </div>

        {/* Video Grid Feed */}
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Videos</h2>
          {videos.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">This channel has no videos or could not be loaded.</div>
          ) : (
            <div className="grid gap-4 pb-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {videos.map((video, index) => (
                <div key={`${video.id}-${index}`} style={{ animationDelay: `${(index % 12) * 50}ms` }}>
                  <VideoCard video={video} />
                </div>
              ))}
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
      </div>
    </div>
  );
}
