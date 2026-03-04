"use client";
import { UserProfile } from "@clerk/nextjs";

export default function SettingsPage() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center p-6 bg-background">
      <UserProfile 
        appearance={{
          elements: {
            rootBox: "w-full max-w-4xl mx-auto shadow-none",
            cardBox: "shadow-none border border-border bg-card",
            navbarButton: "text-muted-foreground hover:bg-secondary",
            navbarButton__active: "text-foreground bg-secondary",
            headerTitle: "text-foreground",
            headerSubtitle: "text-muted-foreground",
            profileSectionTitle: "text-foreground",
            profileSectionPrimaryButton: "text-blue-500 hover:bg-blue-500/10",
            formFieldLabel: "text-foreground",
            formFieldInput: "bg-background border-border text-foreground focus:ring-yt-red",
            formButtonPrimary: "bg-yt-red hover:bg-yt-red-hover text-white",
            badge: "bg-secondary text-foreground",
            avatarImageActionsUpload: "text-blue-500",
            breadcrumbsItem: "text-muted-foreground hover:text-foreground",
            scrollBox: "bg-card",
            navbar: "bg-card border-r border-border",
          }
        }}
      />
    </div>
  );
}
