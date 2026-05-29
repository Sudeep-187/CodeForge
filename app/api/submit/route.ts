import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { submitCodeSchema } from "@/lib/validations";
import { runAgainstTestCases } from "@/lib/judge0";

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
    const { code, language, problemId } = submitCodeSchema.parse(body);

    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      include: {
        testCases: true,
      },
    });

    if (!problem) {
      return NextResponse.json(
        { error: "Problem not found" },
        { status: 404 }
      );
    }

    const testCaseResults = await runAgainstTestCases(code, language, problem.testCases);

    const passedCases = testCaseResults.filter((r) => r.passed).length;
    const totalCases = testCaseResults.length;
    const allPassed = passedCases === totalCases;

    const status = allPassed ? "ACCEPTED" : "WRONG_ANSWER";

    const runtime = Math.max(
      ...testCaseResults.map((r) => parseFloat(r.time || "0") || 0)
    );
    const memory = Math.max(
      ...testCaseResults.map((r) => parseInt(r.memory || "0") || 0)
    );

    const submission = await prisma.submission.create({
      data: {
        userId: session.user.id,
        problemId: problem.id,
        language,
        code,
        status,
        runtime: Math.round(runtime * 1000),
        memory,
      },
    });

    await prisma.userProgress.upsert({
      where: {
        userId_problemId: {
          userId: session.user.id,
          problemId: problem.id,
        },
      },
      create: {
        userId: session.user.id,
        problemId: problem.id,
        type: "DSA_PROBLEM",
        status: allPassed ? "COMPLETED" : "IN_PROGRESS",
      },
      update: {
        status: allPassed ? "COMPLETED" : "IN_PROGRESS",
      },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingStreak = await prisma.streak.findUnique({
      where: { userId: session.user.id },
    });

    const isNewDay = !existingStreak ||
      existingStreak.lastActive.getTime() < today.getTime();

    if (isNewDay) {
      const isConsecutive = existingStreak &&
        existingStreak.lastActive.getTime() >=
          new Date(today.getTime() - 86400000).getTime();

      await prisma.streak.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          current: 1,
          longest: 1,
          lastActive: today,
        },
        update: {
          current: isConsecutive ? { increment: 1 } : 1,
          longest: isConsecutive
            ? undefined
            : undefined,
          lastActive: today,
        },
      });

      if (isConsecutive) {
        const updatedStreak = await prisma.streak.findUnique({
          where: { userId: session.user.id },
        });
        if (updatedStreak && updatedStreak.current > updatedStreak.longest) {
          await prisma.streak.update({
            where: { userId: session.user.id },
            data: { longest: updatedStreak.current },
          });
        }
      }
    }

    return NextResponse.json({
      status,
      passedCases,
      totalCases,
      runtime: Math.round(runtime * 1000),
      memory,
    });
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
