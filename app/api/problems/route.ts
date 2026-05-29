import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.get("difficulty");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where: any = {};
    if (difficulty) where.difficulty = difficulty;
    if (category) where.category = category;
    if (search) where.title = { contains: search, mode: "insensitive" };

    const [problems, total] = await Promise.all([
      prisma.problem.findMany({
        where,
        select: {
          id: true, slug: true, title: true, difficulty: true,
          category: true, tags: true, companies: true, order: true,
        },
        orderBy: { order: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.problem.count({ where }),
    ]);

    return NextResponse.json({ problems, total, page, limit });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
