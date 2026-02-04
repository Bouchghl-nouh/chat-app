import { z } from "zod";
export const changePasswordSchema = z
  .object({ 
    oldPassword : z.string().min(2,{error:"Old Password should be at least 2 characters"}),
    password: z
      .string()
      .min(4, { error: "Password should be at least 4 characters" }),
    confirmPassword: z
      .string()
      .min(4, { error: "Confirm Password should be at least 4 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    error: "Passwords do not match",
  });
export type updatePasswordSchema = z.infer<typeof changePasswordSchema>;
export type updatePasswordRequest = Omit<updatePasswordSchema, 'confirmPassword'>;