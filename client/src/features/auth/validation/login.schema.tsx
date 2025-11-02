import { z } from "zod";
export const loginSchema = z.object({
  email: z.email({ error: "Invalid email address" }),
  password: z
    .string()
    .min(4, { error: "Password should be at least 4 characters" }),
});
export type LoginFormSchema = z.infer<typeof loginSchema>;
