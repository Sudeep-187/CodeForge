import { NextResponse } from "next/server";
import { runCodeSchema } from "@/lib/validations";
import { submitCode } from "@/lib/judge0";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, language, stdin } = runCodeSchema.parse(body);

    const result = await submitCode(code, language, stdin);

    return NextResponse.json({
      stdout: result.stdout || "",
      stderr: result.stderr || "",
      time: result.time || "0",
      memory: result.memory || "0",
      status: result.status,
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
