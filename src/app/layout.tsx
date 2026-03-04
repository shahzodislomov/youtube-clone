import "./globals.css";
import type { Metadata } from "next";
import React from "react";
import { ClerkProvider } from "@clerk/nextjs";

import { AppProvider } from "@/context/AppContext";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "YouTube Reimagined",
  description: "Next.js YouTube Clone with a beautiful design",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="antialiased font-sans">
          <AppProvider>
            <ClientLayout>{children}</ClientLayout>
          </AppProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
