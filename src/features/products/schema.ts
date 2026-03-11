import { z } from "zod";


export const productSchema = z.object({
  product_id: z.string().min(1, "Product ID không được để trống"),
  code: z.string().min(1, "Mã sản phẩm không được để trống"),
  name: z.string().min(1, "Tên sản phẩm không được để trống"),
  price: z.number().min(0, "Giá phải lớn hơn hoặc bằng 0"),
  color: z.string().min(1, "Màu sắc không được để trống"),
  quantity: z.number().int().min(0, "Số lượng phải là số nguyên và >= 0"),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"]),
});

export type ProductFormData = z.infer<typeof productSchema>;
