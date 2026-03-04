"use client";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center bg-background/95">
      <SignUp />
    </div>
  );
}
