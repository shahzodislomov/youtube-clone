import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const channelId = searchParams.get("channelId");
  const { userId } = await auth();

  
  if (!channelId || !userId) {
    return NextResponse.json({ isSubscribed: false });
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    });
    
    if (!dbUser) return NextResponse.json({ isSubscribed: false });
    const subscription = await prisma.subscription.findUnique({
      where: {
        subscriberId_channelId: {
          subscriberId: dbUser.id,
          channelId: channelId,
        }
      }
    });

    return NextResponse.json({ isSubscribed: !!subscription });
  } catch (error) {
    console.error("Error checking subscription:", error);
    return NextResponse.json({ isSubscribed: false });
  }
}

export async function POST(request: Request) {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { channelId } = await request.json();

    if (!channelId) {
      return NextResponse.json({ error: "Missing channelId" }, { status: 400 });
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



    // Check existing subscription
    const existing = await prisma.subscription.findUnique({
      where: {
        subscriberId_channelId: {
          subscriberId: dbUser.id,
          channelId: channelId,
        }
      }
    });

    if (existing) {
      await prisma.subscription.delete({
        where: { id: existing.id }
      });
      return NextResponse.json({ isSubscribed: false });
    } else {
      await prisma.subscription.create({
        data: {
          subscriberId: dbUser.id,
          channelId: channelId,
        }
      });
      return NextResponse.json({ isSubscribed: true });
    }
  } catch (error) {
    console.error("Error toggling subscription:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
