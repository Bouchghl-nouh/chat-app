import { z } from "zod";

export const profileSchema = z.object({
  username: z.string().min(2, "Name should be at least 2 characters"),
  firstName: z.string().min(2, "First name should be at least 2 characters").optional(),
  lastName: z.string().min(2, "Last name should be at least 2 characters").optional(),
  description: z
    .string()
    .max(500, "Description should be at most 500 characters")
    .optional(),

  avatar: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      "Avatar must be smaller than 5MB",
    )
    .refine(
      (file) =>
        !file || ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Only JPG, PNG, or WEBP images are allowed",
    ),
});

export type ProfileFormSchema = z.infer<typeof profileSchema>;
