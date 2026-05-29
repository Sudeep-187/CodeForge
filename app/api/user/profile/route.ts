import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const updateProfileSchema = z.object({
  bio: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  college: z.string().optional(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        profile: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { bio, github, linkedin, college } = updateProfileSchema.parse(body);

    const profile = await prisma.profile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        bio: bio || null,
        github: github || null,
        linkedin: linkedin || null,
        college: college || null,
      },
      update: {
        ...(bio !== undefined && { bio: bio || null }),
        ...(github !== undefined && { github: github || null }),
        ...(linkedin !== undefined && { linkedin: linkedin || null }),
        ...(college !== undefined && { college: college || null }),
      },
    });

    return NextResponse.json(profile);
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
