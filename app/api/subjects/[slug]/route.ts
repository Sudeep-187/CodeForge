import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const subject = await prisma.subject.findUnique({
      where: { slug: params.slug },
      include: {
        topics: {
          include: {
            _count: { select: { quizzes: true } },
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!subject) {
      return NextResponse.json(
        { error: "Subject not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(subject);
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
