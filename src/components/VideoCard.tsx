import { Video } from "@/data/mockVideos";
import { MoreVertical, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import Link from "next/link";

interface VideoCardProps {
  video: Video;
}

const VideoCard = ({ video }: VideoCardProps) => {
  const router = useRouter();

  const handleChannelClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (video.channel.id) {
      router.push(`/channel/${video.channel.id}`);
    }
  };

  return (
    <Link
      href={`/watch?v=${video.id}`}
      className="group block cursor-pointer animate-fade-in"
    >
      {/* Thumbnail */}
      <div className="relative mb-3 overflow-hidden rounded-xl">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="aspect-video w-full object-cover transition-transform duration-200 group-hover:scale-105"
        />
        <div className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
          {video.duration}
        </div>
        {/* Progress bar on hover */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted opacity-0 transition-opacity group-hover:opacity-100">
          <div className="h-full w-1/3 bg-yt-red" />
        </div>
      </div>

      {/* Info */}
      <div className="flex gap-3">
        <img
          src={video.channel.avatar}
          alt={video.channel.name}
          onClick={handleChannelClick}
          className="h-9 w-9 shrink-0 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
        />
        <div className="min-w-0 flex-1">
          <h3 className="mb-1 line-clamp-2 text-sm font-medium leading-tight text-foreground">
            {video.title}
          </h3>
          <div 
            className="flex items-center gap-1 text-sm text-muted-foreground w-fit cursor-pointer group/channel"
            onClick={handleChannelClick}
          >
            <span className="group-hover/channel:text-foreground transition-colors">{video.channel.name}</span>
            {video.channel.verified && (
              <CheckCircle2 className="h-3.5 w-3.5 fill-muted-foreground text-background" />
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {video.views} • {video.uploadedAt}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 rounded-full opacity-0 hover:bg-yt-hover group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
    </Link>
  );
};

export default VideoCard;
