"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface DayData {
  date: Date;
  count: number;
  dateString: string;
}

interface StreakCalendarProps {
  data: { date: string; count: number }[];
}

const DAYS = ["Mon", "Wed", "Fri"];

function getIntensity(count: number): string {
  if (count === 0) return "bg-[#1a1a1a]";
  if (count <= 2) return "bg-orange-900/60";
  if (count <= 5) return "bg-orange-700/70";
  if (count <= 10) return "bg-orange-500/80";
  return "bg-orange-400";
}

export function StreakCalendar({ data }: StreakCalendarProps) {
  const { weeks, months, dayLabels } = useMemo(() => {
    const lookup = new Map<string, number>();
    data.forEach((d) => lookup.set(d.date, d.count));

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(today);
    start.setDate(start.getDate() - 89);

    const allDays: DayData[] = [];
    const current = new Date(start);
    while (current <= today) {
      const ds = current.toISOString().split("T")[0];
      allDays.push({
        date: new Date(current),
        count: lookup.get(ds) ?? 0,
        dateString: ds,
      });
      current.setDate(current.getDate() + 1);
    }

    const weeks: DayData[][] = [];
    let currentWeek: DayData[] = [];
    const dayOfWeek = allDays[0].date.getDay();
    for (let i = 0; i < dayOfWeek; i++) {
      currentWeek.push(null as unknown as DayData);
    }
    allDays.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null as unknown as DayData);
      }
      weeks.push(currentWeek);
    }

    const months: { label: string; index: number }[] = [];
    weeks.forEach((week, wi) => {
      const firstDay = week.find((d) => d !== null);
      if (firstDay) {
        const m = firstDay.date.toLocaleString("default", { month: "short" });
        if (months.length === 0 || months[months.length - 1].label !== m) {
          months.push({ label: m, index: wi });
        }
      }
    });

    return { weeks, months, dayLabels: DAYS };
  }, [data]);

  if (weeks.length === 0) return null;

  return (
    <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-6">
      <h3 className="text-white font-semibold mb-4">Activity (Last 90 Days)</h3>
      <div className="overflow-x-auto">
        <div className="inline-flex gap-2">
          <div className="flex flex-col gap-1 pt-5">
            {dayLabels.map((d) => (
              <span key={d} className="text-[10px] text-[#71717a] h-[14px] leading-[14px]">
                {d}
              </span>
            ))}
            <span className="text-[10px] text-[#71717a]" />
          </div>
          <div>
            <div className="flex gap-[3px] mb-1 ml-px">
              {months.map((m) => (
                <span
                  key={m.label + m.index}
                  className="text-[10px] text-[#71717a]"
                  style={{ width: `${weeks[m.index]?.length ?? 1} * 15px` }}
                >
                  {m.label}
                </span>
              ))}
            </div>
            <div className="flex gap-[3px]">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[3px]">
                  {week.map((day, di) => {
                    if (!day) {
                      return <div key={di} className="w-[14px] h-[14px]" />;
                    }
                    return (
                      <div
                        key={day.dateString}
                        title={`${day.count} problems solved on ${day.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
                        className={cn(
                          "w-[14px] h-[14px] rounded-sm cursor-default transition-colors",
                          getIntensity(day.count)
                        )}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4 text-xs text-[#71717a]">
        <span>Less</span>
        <div className="w-[14px] h-[14px] rounded-sm bg-[#1a1a1a]" />
        <div className="w-[14px] h-[14px] rounded-sm bg-orange-900/60" />
        <div className="w-[14px] h-[14px] rounded-sm bg-orange-700/70" />
        <div className="w-[14px] h-[14px] rounded-sm bg-orange-500/80" />
        <div className="w-[14px] h-[14px] rounded-sm bg-orange-400" />
        <span>More</span>
      </div>
    </div>
  );
}
