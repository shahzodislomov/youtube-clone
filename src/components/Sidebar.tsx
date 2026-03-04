"use client";

import {
  Home,
  Flame,
  PlaySquare,
  Clock,
  ThumbsUp,
  ListVideo,
  Folder,
  History,
  Film,
  Gamepad2,
  Newspaper,
  Trophy,
  Lightbulb,
  Shirt,
  Music2,
  Radio,
  Settings,
  Flag,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppContext } from "@/context/AppContext";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  id: string;
  isCompact?: boolean;
}

const SidebarItem = ({ icon, label, id, isCompact }: SidebarItemProps) => {
  const pathname = usePathname();
  const href = id === "home" ? "/" : id === "settings" ? "/settings" : `/feed/${id}`;
  const isActive =
    pathname === href ||
    (id === "home" && pathname === "") ||
    (pathname.startsWith(`/feed/${id}`));

  return (
    <Link
      href={href}
      className={cn(
        "flex w-full items-center gap-5 rounded-lg px-3 py-2.5 text-sm transition-colors",
        isActive ? "bg-yt-hover font-medium" : "hover:bg-yt-hover",
        isCompact && "flex-col gap-1 px-1 py-4 text-[10px]"
      )}
    >
      {icon}
      <span className={cn(isCompact && "text-center")}>{label}</span>
    </Link>
  );
};

const Sidebar = () => {
  const { isSidebarOpen } = useAppContext();

  const mainItems = [
    { icon: <Home className="h-5 w-5" />, label: "Home", id: "home" },
    { icon: <Flame className="h-5 w-5" />, label: "Trending", id: "trending" },
    { icon: <PlaySquare className="h-5 w-5" />, label: "Subscriptions", id: "subscriptions" },
  ];

  const libraryItems = [
    { icon: <History className="h-5 w-5" />, label: "History", id: "history" },
    { icon: <ListVideo className="h-5 w-5" />, label: "Playlists", id: "playlists" },
    { icon: <Clock className="h-5 w-5" />, label: "Watch later", id: "watch-later" },
    { icon: <ThumbsUp className="h-5 w-5" />, label: "Liked videos", id: "liked" },
    { icon: <Folder className="h-5 w-5" />, label: "Downloads", id: "downloads" },
  ];

  const exploreItems = [
    { icon: <Flame className="h-5 w-5" />, label: "Trending", id: "trending" },
    { icon: <Music2 className="h-5 w-5" />, label: "Music", id: "music" },
    { icon: <Film className="h-5 w-5" />, label: "Movies", id: "movies" },
    { icon: <Radio className="h-5 w-5" />, label: "Live", id: "live" },
    { icon: <Gamepad2 className="h-5 w-5" />, label: "Gaming", id: "gaming" },
    { icon: <Newspaper className="h-5 w-5" />, label: "News", id: "news" },
    { icon: <Trophy className="h-5 w-5" />, label: "Sports", id: "sports" },
    { icon: <Lightbulb className="h-5 w-5" />, label: "Learning", id: "learning" },
    { icon: <Shirt className="h-5 w-5" />, label: "Fashion", id: "fashion" },
  ];

  const settingsItems = [
    { icon: <Settings className="h-5 w-5" />, label: "Settings", id: "settings" },
    { icon: <Flag className="h-5 w-5" />, label: "Report", id: "report" },
    { icon: <HelpCircle className="h-5 w-5" />, label: "Help", id: "help" },
  ];

  if (!isSidebarOpen) {
    return (
      <aside className="fixed left-0 top-14 z-40 hidden h-[calc(100vh-3.5rem)] w-[72px] flex-col overflow-y-auto bg-background px-1 py-1 md:flex">
        {mainItems.map((item) => (
          <SidebarItem
            key={item.id}
            {...item}
            isCompact
          />
        ))}
      </aside>
    );
  }

  return (
    <aside className="fixed left-0 top-14 z-40 h-[calc(100vh-3.5rem)] w-60 flex-col overflow-y-auto bg-background px-2 py-3 md:flex scrollbar-thin">
      <div className="space-y-1">
        {mainItems.map((item) => (
          <SidebarItem key={item.id} {...item} />
        ))}
      </div>

      <div className="my-3 border-t border-border" />

      <div className="space-y-1">
        <h3 className="mb-2 px-3 text-sm font-medium text-muted-foreground">Library</h3>
        {libraryItems.map((item) => (
          <SidebarItem key={item.id} {...item} />
        ))}
      </div>

      <div className="my-3 border-t border-border" />

      <div className="space-y-1">
        <h3 className="mb-2 px-3 text-sm font-medium text-muted-foreground">Explore</h3>
        {exploreItems.map((item) => (
          <SidebarItem key={item.id} {...item} />
        ))}
      </div>

      <div className="my-3 border-t border-border" />

      <div className="space-y-1">
        {settingsItems.map((item) => (
          <SidebarItem key={item.id} {...item} />
        ))}
      </div>

      <div className="mt-4 px-3 text-xs text-muted-foreground">
        <p>© 2024 YouTube Clone</p>
        <p className="mt-1">Migrated to Next.js securely.</p>
      </div>
    </aside>
  );
};

export default Sidebar;
