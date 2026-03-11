import { z } from "zod";

export const brandSchema = z.object({
  name: z.string().min(1, "Tên thương hiệu không được để trống"),
  status: z.enum(["active", "inactive"]).optional().default("active"),
});

export type BrandFormData = z.infer<typeof brandSchema>;
