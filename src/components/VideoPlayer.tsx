import { Video, mockVideos } from "@/data/mockVideos";
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Download,
  MoreHorizontal,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Link from "next/link";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import VideoCard from "./VideoCard";

interface VideoPlayerProps {
  video: Video;
  relatedVideos: Video[];
  onBack: () => void;
  onVideoClick: (video: Video) => void;
}

const VideoPlayer = ({ video, relatedVideos, onBack, onVideoClick }: VideoPlayerProps) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [liked, setLiked] = useState<"like" | "dislike" | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(true);
  
  const { user } = useUser();

  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(`/api/comments?videoId=${video.id}`);
        const data = await res.json();
        if (data.comments) {
          setComments(data.comments);
        }
      } catch (error) {
        console.error("Failed to fetch comments", error);
      } finally {
        setLoadingComments(false);
      }
    }
    fetchComments();
  }, [video.id]);

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId: video.id, text: newComment }),
      });
      const data = await res.json();
      if (data.comment) {
        setComments([data.comment, ...comments]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Failed to post comment", error);
    }
  };

  useEffect(() => {
    async function checkSubscription() {
      if (!video.channel.id || !user) return;
      try {
        const res = await fetch(`/api/subscriptions?channelId=${video.channel.id}`);
        const data = await res.json();
        setIsSubscribed(data.isSubscribed);
      } catch (error) {
        console.error("Failed to fetch subscription status", error);
      }
    }
    checkSubscription();
  }, [video.channel.id, user]);

  const handleSubscribeToggle = async () => {
    if (!user) {
      alert("Please sign in to subscribe.");
      return;
    }
    if (!video.channel.id) {
       console.error("Channel ID missing on video object");
       return;
    }
    
    // Optimistic UI Update
    setIsSubscribed(!isSubscribed);
    
    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelId: video.channel.id }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setIsSubscribed(data.isSubscribed);
    } catch (error) {
      console.error("Failed to toggle subscription", error);
      setIsSubscribed(isSubscribed); // Revert on failure
    }
  };

  return (
    <div className="mx-auto max-w-[1800px] px-6 py-6">
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Main content */}
        <div className="flex-1">
          {/* Video player */}
          <div className="relative mb-3 aspect-video w-full overflow-hidden rounded-xl bg-black">
            {video.videoUrl ? (
              <iframe
                src={video.videoUrl}
                title={video.title}
                className="h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <>
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="rounded-full bg-yt-red p-4">
                    <svg className="h-8 w-8 fill-white" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Video info */}
          <h1 className="mb-2 text-xl font-semibold">{video.title}</h1>

          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            {/* Channel info */}
            <div className="flex items-center gap-4">
              <Link href={`/channel/${video.channel.id || ''}`}>
                <img
                  src={video.channel.avatar}
                  alt={video.channel.name}
                  className="h-10 w-10 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                />
              </Link>
              <div>
                <Link href={`/channel/${video.channel.id || ''}`}>
                  <div className="flex items-center gap-1 font-medium cursor-pointer hover:text-yt-red transition-colors">
                    {video.channel.name}
                    {video.channel.verified && (
                      <CheckCircle2 className="h-4 w-4 fill-muted-foreground text-background" />
                    )}
                  </div>
                </Link>
                <div className="text-sm text-muted-foreground">1.2M subscribers</div>
              </div>
              <Button
                onClick={handleSubscribeToggle}
                className={`ml-2 rounded-full ${
                  isSubscribed
                    ? "bg-secondary text-secondary-foreground hover:bg-yt-hover"
                    : "bg-foreground text-background hover:bg-foreground/90"
                }`}
              >
                {isSubscribed ? "Subscribed" : "Subscribe"}
              </Button>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex rounded-full bg-secondary">
                <Button
                  variant="ghost"
                  className={`gap-2 rounded-l-full rounded-r-none border-r border-border px-4 hover:bg-yt-hover ${
                    liked === "like" ? "text-foreground" : ""
                  }`}
                  onClick={() => setLiked(liked === "like" ? null : "like")}
                >
                  <ThumbsUp className={`h-5 w-5 ${liked === "like" ? "fill-current" : ""}`} />
                  <span>42K</span>
                </Button>
                <Button
                  variant="ghost"
                  className={`rounded-l-none rounded-r-full px-4 hover:bg-yt-hover ${
                    liked === "dislike" ? "text-foreground" : ""
                  }`}
                  onClick={() => setLiked(liked === "dislike" ? null : "dislike")}
                >
                  <ThumbsDown className={`h-5 w-5 ${liked === "dislike" ? "fill-current" : ""}`} />
                </Button>
              </div>
              <Button
                variant="ghost"
                className="gap-2 rounded-full bg-secondary hover:bg-yt-hover"
              >
                <Share2 className="h-5 w-5" />
                Share
              </Button>
              <Button
                variant="ghost"
                className="gap-2 rounded-full bg-secondary hover:bg-yt-hover"
              >
                <Download className="h-5 w-5" />
                Download
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-secondary hover:bg-yt-hover"
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6 rounded-xl bg-secondary p-3">
            <div className="mb-2 flex gap-2 text-sm font-medium">
              <span>{video.views}</span>
              <span>{video.uploadedAt}</span>
            </div>
            <p className={`text-sm ${!isDescriptionExpanded ? "line-clamp-2" : ""}`}>
              {video.description}
              {isDescriptionExpanded && (
                <>
                  <br /><br />
                  Welcome to this comprehensive tutorial! In this video, we'll cover everything you need to know to get started. Make sure to like and subscribe for more content like this.
                  <br /><br />
                  🔔 Subscribe for more tutorials
                  👍 Like this video if you found it helpful
                  💬 Leave a comment below with your questions
                  <br /><br />
                  Timestamps:
                  <br />
                  0:00 - Introduction
                  <br />
                  2:30 - Getting Started
                  <br />
                  10:15 - Main Content
                  <br />
                  35:00 - Advanced Topics
                  <br />
                  42:00 - Summary
                </>
              )}
            </p>
            <button
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="mt-2 flex items-center gap-1 text-sm font-medium hover:text-foreground"
            >
              {isDescriptionExpanded ? (
                <>
                  Show less <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  Show more <ChevronDown className="h-4 w-4" />
                </>
              )}
            </button>
          </div>

          {/* Comments */}
          <div>
            <h2 className="mb-4 text-lg font-semibold">{comments.length} Comments</h2>
            
            <SignedIn>
              <div className="mb-8 flex gap-4">
                <img src={user?.imageUrl} alt="User Avatar" className="h-10 w-10 rounded-full object-cover" />
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full border-b border-border bg-transparent pb-1 text-sm outline-none transition-colors focus:border-foreground focus:border-b-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handlePostComment();
                    }}
                  />
                  <div className="mt-2 flex justify-end">
                    <Button
                      onClick={handlePostComment}
                      disabled={!newComment.trim()}
                      className="rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      Comment
                    </Button>
                  </div>
                </div>
              </div>
            </SignedIn>
            <SignedOut>
              <div className="mb-8 p-4 bg-secondary rounded-xl text-center">
                <p className="text-sm font-medium">Sign in to leave a comment.</p>
              </div>
            </SignedOut>

            <div className="space-y-4">
              {loadingComments ? (
                <div className="animate-pulse space-y-4">
                   <div className="h-12 w-full bg-secondary rounded-lg"></div>
                   <div className="h-12 w-full bg-secondary rounded-lg"></div>
                </div>
              ) : comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <img
                    src={comment.user?.imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${comment.user?.username}`}
                    alt={comment.user?.username}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-sm font-medium">{comment.user?.username}</span>
                      <span className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="mb-2 text-sm">{comment.text}</p>
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                        <ThumbsUp className="h-4 w-4" />
                        0
                      </button>
                      <button className="text-muted-foreground hover:text-foreground">
                        <ThumbsDown className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related videos */}
        <div className="w-full space-y-3 lg:w-[402px]">
          {relatedVideos.map((v) => (
            <div
              key={v.id}
              className="group flex cursor-pointer gap-2"
              onClick={() => onVideoClick(v)}
            >
              <div className="relative h-24 w-40 shrink-0 overflow-hidden rounded-lg">
                <img
                  src={v.thumbnail}
                  alt={v.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-xs text-white">
                  {v.duration}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="mb-1 line-clamp-2 text-sm font-medium leading-tight">
                  {v.title}
                </h3>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span>{v.channel.name}</span>
                  {v.channel.verified && (
                    <CheckCircle2 className="h-3 w-3 fill-muted-foreground text-background" />
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {v.views} • {v.uploadedAt}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
