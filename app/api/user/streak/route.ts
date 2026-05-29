import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const streak = await prisma.streak.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json({
      current: streak?.current ?? 0,
      longest: streak?.longest ?? 0,
      lastActive: streak?.lastActive ?? null,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
