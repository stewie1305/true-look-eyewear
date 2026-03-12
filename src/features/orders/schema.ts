import { z } from "zod";

export const createOrderSchema = z.object({
  customer_id: z.string().min(1, "Customer id là bắt buộc"),
  extra_fee: z
    .number({ required_error: "Phí phụ thu là bắt buộc" })
    .min(0, "Phí phụ thu không được âm"),
});

export const updateOrderStatusSchema = z.object({
  status: z.string().min(1, "Trạng thái là bắt buộc"),
});

export type CreateOrderFormInput = z.input<typeof createOrderSchema>;
export type CreateOrderFormData = z.output<typeof createOrderSchema>;
export type UpdateOrderStatusFormInput = z.input<
  typeof updateOrderStatusSchema
>;
export type UpdateOrderStatusFormData = z.output<
  typeof updateOrderStatusSchema
>;
