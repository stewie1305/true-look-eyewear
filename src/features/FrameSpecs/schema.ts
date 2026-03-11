import { z } from "zod";


export const frameSpecSchema = z.object({
  product_id: z.string().min(1, "Product ID không được để trống"),
  type: z.string().min(1, "Loại gọng không được để trống"),
  material: z.string().min(1, "Chất liệu không được để trống"),
  a: z.number().min(0, "Kích thước A phải >= 0"),
  b: z.number().min(0, "Kích thước B phải >= 0"),
  dbl: z.number().min(0, "DBL phải >= 0"),
  shape: z.string().min(1, "Hình dạng không được để trống"),
  weight: z.number().min(0, "Trọng lượng phải >= 0"),
  status: z.enum(["active", "inactive"]),
});

export type FrameSpecFormData = z.infer<typeof frameSpecSchema>;
