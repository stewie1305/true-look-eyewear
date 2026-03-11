import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Tên danh mục không được để trống"),
  status: z.enum(["active", "inactive"]).optional().default("active"),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
