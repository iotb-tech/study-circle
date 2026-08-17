import * as z from "zod";

export const postSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters"),
  body: z.string().min(20, "Body must be at least 20 characters"),
  tags: z.array(z.string()).optional(),
});

export type PostFormData = z.infer<typeof postSchema>;
