import { z } from "zod";

export const createAddressSchema = z.object({
  name_recipient: z.string().min(1, "Tên người nhận là bắt buộc"),
  phone_recipient: z.string().min(1, "Số điện thoại là bắt buộc"),
  city: z.string().min(1, "Tỉnh/Thành phố là bắt buộc"),
  district: z.string().min(1, "Quận/Huyện là bắt buộc"),
  ward: z.string().min(1, "Phường/Xã là bắt buộc"),
  street: z.string().min(1, "Địa chỉ đường là bắt buộc"),
  note: z.string().optional(),
  role: z.string().optional(),
});

export const updateAddressSchema = createAddressSchema.partial();

export type CreateAddressFormData = z.infer<typeof createAddressSchema>;
export type UpdateAddressFormData = z.infer<typeof updateAddressSchema>;
