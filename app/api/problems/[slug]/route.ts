import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const problem = await prisma.problem.findUnique({
      where: { slug: params.slug },
      include: {
        testCases: {
          where: { isHidden: false },
          select: { input: true, output: true },
        },
      },
    });

    if (!problem) {
      return NextResponse.json(
        { error: "Problem not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...problem,
      examples: problem.examples,
      starterCode: problem.starterCode,
      testCases: problem.testCases,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
