import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get("videoId");

  if (!videoId) {
    return NextResponse.json({ error: "Missing videoId" }, { status: 400 });
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { videoId },
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
      },
    });

    return NextResponse.json({ comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { videoId, text } = await request.json();

    if (!videoId || !text) {
      return NextResponse.json({ error: "Missing videoId or text" }, { status: 400 });
    }

    // Sync user to our database (upsert to handle if they change their avatar/name)
    const dbUser = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {
        username: user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : user.username || "Anonymous",
        imageUrl: user.imageUrl,
      },
      create: {
        clerkId: userId,
        username: user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : user.username || "Anonymous",
        imageUrl: user.imageUrl,
      },
    });

    // Create the comment
    const newComment = await prisma.comment.create({
      data: {
        text,
        videoId,
        userId: dbUser.id,
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json({ comment: newComment });
  } catch (error) {
    console.error("Error posting comment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
