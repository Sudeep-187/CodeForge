import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { progressSchema } from "@/lib/validations";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const progress = await prisma.userProgress.findMany({
      where: { userId: session.user.id },
    });

    return NextResponse.json(progress);
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { problemId, topicId, type, status } = progressSchema.parse(body);

    if (!problemId && !topicId) {
      return NextResponse.json(
        { error: "Either problemId or topicId is required" },
        { status: 400 }
      );
    }

    let progress;
    if (problemId) {
      progress = await prisma.userProgress.upsert({
        where: {
          userId_problemId: {
            userId: session.user.id,
            problemId,
          },
        },
        create: {
          userId: session.user.id,
          problemId,
          type,
          status,
        },
        update: { status },
      });
    } else if (topicId) {
      progress = await prisma.userProgress.upsert({
        where: {
          userId_topicId: {
            userId: session.user.id,
            topicId,
          },
        },
        create: {
          userId: session.user.id,
          topicId,
          type,
          status,
        },
        update: { status },
      });
    }

    return NextResponse.json(progress);
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
