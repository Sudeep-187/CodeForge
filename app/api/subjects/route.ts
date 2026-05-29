import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const subjects = await prisma.subject.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: { select: { topics: true } },
      },
    });

    return NextResponse.json(subjects);
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
