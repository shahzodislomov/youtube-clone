"use client";

import { useAppContext } from "@/context/AppContext";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { isSidebarOpen } = useAppContext();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Sidebar />
      <main
        className={cn(
          "pt-14 transition-all duration-200",
          isSidebarOpen ? "md:ml-60" : "md:ml-[72px]"
        )}
      >
        {children}
      </main>
    </div>
  );
}
