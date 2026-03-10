import { z } from "zod";

export const createUserSchema = z.object({
  status: z.union([z.literal(0), z.literal(1)]),
  roleName: z.string().min(1, "Vai trò là bắt buộc"),
  username: z.string().min(1, "Tên đăng nhập là bắt buộc"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
  fullName: z.string().min(1, "Họ tên là bắt buộc"),
  gender: z.string().min(1, "Giới tính là bắt buộc"),
  email: z.string().email("Email không hợp lệ"),
  birthday: z.string().min(1, "Ngày sinh là bắt buộc"),
});

export const updateUserSchema = createUserSchema.partial().extend({
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự").optional(),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
