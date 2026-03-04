"use client";

import { Menu, Search, Mic, Video, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const Header = () => {
  const { toggleSidebar, searchQuery, setSearchQuery } = useAppContext();
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(`/`);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between gap-4 bg-background px-4">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-yt-hover"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-1">
          <Link href="/" className="flex items-center">
            <svg
              viewBox="0 0 90 20"
              className="h-5 w-auto fill-foreground"
            >
              <path d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z" fill="#FF0000"/>
              <path d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z" fill="white"/>
              <path d="M34.6024 19.4526V1.02539H38.5451V15.6073H46.2167V19.4526H34.6024Z"/>
              <path d="M50.0006 19.4526V1.02539H53.9433V19.4526H50.0006Z"/>
              <path d="M62.2008 19.7482C60.5818 19.7482 59.2166 19.3869 58.1052 18.6643C56.9939 17.9417 56.1551 16.9349 55.5889 15.6439C55.0226 14.3529 54.7395 12.8579 54.7395 11.1589V9.11094C54.7395 7.35195 55.0226 5.8203 55.5889 4.5159C56.1551 3.2115 56.9842 2.20141 58.0762 1.48547C59.1683 0.769535 60.5045 0.411568 62.085 0.411568C63.5866 0.411568 64.8582 0.726302 65.8996 1.35577C66.9409 1.98523 67.7407 2.88792 68.2988 4.06384C68.8569 5.23976 69.1656 6.63895 69.2246 8.2614V10.5693H58.682V11.3618C58.682 12.5671 58.9235 13.5555 59.4066 14.3268C59.8897 15.0982 60.6894 15.4838 61.8058 15.4838C62.7008 15.4838 63.379 15.2714 63.8403 14.8464C64.3016 14.4214 64.6068 13.9279 64.7558 13.3658L68.934 14.0217C68.6949 15.1682 68.2254 16.1761 67.5253 17.0454C66.8253 17.9148 65.9303 18.5892 64.8401 19.0688C63.75 19.5484 62.527 19.7882 61.1713 19.7882L62.2008 19.7482ZM58.682 7.51933H65.2817V7.17199C65.2817 6.01607 65.0146 5.09328 64.4804 4.40358C63.9462 3.71388 63.1534 3.36903 62.1024 3.36903C60.9909 3.36903 60.1455 3.75788 59.5662 4.53559C58.9869 5.3133 58.697 6.35091 58.682 7.64853V7.51933Z" className="fill-foreground"/>
            </svg>
          </Link>
        </div>
      </div>

      {/* Center section - Search */}
      <form onSubmit={handleSearchSubmit} className="flex max-w-2xl flex-1 items-center justify-center gap-2">
        <div className={`flex flex-1 items-center rounded-full border ${isFocused ? 'border-blue-500 shadow-inner shadow-blue-500/20' : 'border-border'}`}>
          <div className={`flex items-center pl-4 ${isFocused ? 'visible' : 'invisible'}`}>
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="flex-1 border-0 bg-transparent px-3 py-2 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="h-10 w-16 rounded-l-none rounded-r-full border-l border-border bg-yt-surface hover:bg-yt-hover"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full bg-yt-surface hover:bg-yt-hover hidden sm:flex"
        >
          <Mic className="h-5 w-5" />
        </Button>
      </form>

      {/* Right section */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-yt-hover hidden sm:flex"
        >
          <Video className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-yt-hover hidden sm:flex mr-2"
        >
          <Bell className="h-5 w-5" />
        </Button>
        
        <SignedIn>
          <UserButton 
            appearance={{
              elements: {
                userButtonAvatarBox: "h-8 w-8",
              }
            }} 
            afterSignOutUrl="/" 
          />
        </SignedIn>
        <SignedOut>
          <div className="ml-2">
            <SignInButton mode="modal">
              <Button variant="outline" className="rounded-full gap-2 border-border text-blue-400 hover:bg-blue-400/10">
                <User className="h-4 w-4" />
                Sign in
              </Button>
            </SignInButton>
          </div>
        </SignedOut>
      </div>
    </header>
  );
};

export default Header;
