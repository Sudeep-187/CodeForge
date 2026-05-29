import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const runCodeSchema = z.object({
  code: z.string().min(1, "Code is required"),
  language: z.enum(["cpp", "java", "python", "javascript", "go", "rust"]),
  stdin: z.string().optional().default(""),
  problemId: z.string().optional(),
});

export const submitCodeSchema = z.object({
  code: z.string().min(1, "Code is required"),
  language: z.enum(["cpp", "java", "python", "javascript"]),
  problemId: z.string(),
});

export const progressSchema = z.object({
  problemId: z.string().optional(),
  topicId: z.string().optional(),
  type: z.enum(["DSA_PROBLEM", "THEORY_TOPIC"]),
  status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "REVISIT"]),
});
