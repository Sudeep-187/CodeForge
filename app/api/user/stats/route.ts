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

    const userId = session.user.id;

    const problemsSolved = await prisma.submission.groupBy({
      by: ["problemId"],
      where: { userId, status: "ACCEPTED" },
    });

    const totalSubmissions = await prisma.submission.count({
      where: { userId },
    });

    const streak = await prisma.streak.findUnique({
      where: { userId },
    });

    const subjects = await prisma.subject.findMany({
      include: {
        topics: {
          include: {
            progress: {
              where: { userId, type: "THEORY_TOPIC" },
            },
          },
        },
      },
    });

    let subjectsCompleted = 0;
    const subjectProgress = subjects.map((s) => {
      const total = s.topics.length;
      const completed = s.topics.filter(
        (t) => t.progress.length > 0 && t.progress[0].status === "COMPLETED"
      ).length;
      if (total > 0 && completed === total) subjectsCompleted++;
      return {
        name: s.title,
        completed,
        total,
      };
    });

    const last30Days: { day: string; count: number }[] = [];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayLabel = `${days[date.getDay()]} ${date.getDate()}`;
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const count = await prisma.submission.count({
        where: {
          userId,
          createdAt: { gte: dayStart, lte: dayEnd },
          status: "ACCEPTED",
        },
      });
      last30Days.push({ day: dayLabel, count });
    }

    const calendarData: { date: string; count: number }[] = [];
    for (let i = 89; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const count = await prisma.submission.count({
        where: {
          userId,
          createdAt: { gte: dayStart, lte: dayEnd },
          status: "ACCEPTED",
        },
      });
      calendarData.push({
        date: date.toISOString().split("T")[0],
        count,
      });
    }

    const recentSubmissions = await prisma.submission.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { problem: { select: { title: true, slug: true } } },
    });

    return NextResponse.json({
      stats: {
        problemsSolved: problemsSolved.length,
        currentStreak: streak?.current ?? 0,
        subjectsCompleted,
        totalSubmissions,
      },
      chartData: last30Days,
      subjectProgress,
      calendarData,
      submissions: recentSubmissions.map((s) => ({
        id: s.id,
        problemTitle: s.problem.title,
        problemSlug: s.problem.slug,
        status: s.status,
        language: s.language,
        createdAt: s.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
