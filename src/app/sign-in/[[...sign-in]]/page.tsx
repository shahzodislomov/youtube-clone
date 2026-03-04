"use client";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center bg-background/95">
      <SignIn />
    </div>
  );
}
