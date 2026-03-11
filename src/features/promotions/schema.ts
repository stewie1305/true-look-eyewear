import { z } from "zod";

export const promotionSchema = z
  .object({
    name: z.string().min(1, "Tên khuyến mãi là bắt buộc"),
    condition: z.number().min(0, "Điều kiện phải >= 0"),
    discount: z.number().min(0, "Giảm giá phải >= 0"),
    start_time: z.string().min(1, "Thời gian bắt đầu là bắt buộc"),
    end_time: z.string().min(1, "Thời gian kết thúc là bắt buộc"),
    status: z.string().min(1, "Trạng thái là bắt buộc"),
  })
  .refine((data) => new Date(data.end_time) >= new Date(data.start_time), {
    message: "Thời gian kết thúc phải sau thời gian bắt đầu",
    path: ["end_time"],
  });

export type PromotionFormData = z.infer<typeof promotionSchema>;
