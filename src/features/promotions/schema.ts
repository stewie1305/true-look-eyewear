import { z } from "zod";

export const promotionSchema = z
  .object({
    name: z.string().min(1, "Tên khuyến mãi là bắt buộc"),
    condition: z
      .number({ required_error: "Điều kiện đơn tối thiểu là bắt buộc" })
      .min(0, "Không được âm"),
    discount: z
      .number({ required_error: "Giá trị giảm giá là bắt buộc" })
      .min(0, "Không được âm"),
    start_time: z.string().min(1, "Ngày bắt đầu là bắt buộc"),
    end_time: z.string().min(1, "Ngày kết thúc là bắt buộc"),
    status: z.enum(["Active", "Inactive"]).default("Active"),
  })
  .refine((data) => new Date(data.end_time) > new Date(data.start_time), {
    message: "Ngày kết thúc phải sau ngày bắt đầu",
    path: ["end_time"],
  });

export type PromotionFormInput = z.input<typeof promotionSchema>;
export type PromotionFormData = z.output<typeof promotionSchema>;
