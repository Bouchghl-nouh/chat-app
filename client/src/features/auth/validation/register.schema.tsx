import { z } from "zod";
export const registerSchema = z
  .object({ 
    username: z.string().min(2, { error: "Name should be at least 2 characters" }),
    email: z.email({ error: "Invalid email address" }),
    password: z
      .string()
      .min(4, { error: "Password should be at least 4 characters" }),
    confirmPassword: z
      .string()
      .min(4, { error: "Password should be at least 4 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    error: "Passwords do not match",
  });
export type RegisterFormSchema = z.infer<typeof registerSchema>;