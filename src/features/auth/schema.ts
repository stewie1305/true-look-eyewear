import { z } from "zod";
export const registerSchema = z
  .object({
    username: z
      .string()
      .min(1, { message: "Username là bắt buộc" })
      .min(3, { message: "Username phải có ít nhất 3 ký tự" }),
    fullName: z
      .string()
      .min(1, { message: "FullName là bắt buộc" })
      .min(3, { message: "FullName phải có ít nhất 3 ký tự" }),
    email: z
      .email({ message: "Email không đúng định dạng" })
      .min(1, { message: "Email là bắt buộc" }),
    password: z
      .string()
      .min(1, { message: "Password là bắt buộc" })
      .min(8, "Tối thiểu 8 ký tự")
      .refine((val) => /[A-Z]/.test(val), {
        message: "Phải có ít nhất 1 chữ hoa",
      })
      .refine((val) => /[0-9]/.test(val), {
        message: "Phải có ít nhất 1 số",
      })
      .refine((val) => /[!@#$%^&*]/.test(val), {
        message: "Phải có ít nhất 1 ký tự đặc biệt",
      }),
    confirmPassword: z.string(),
    gender: z.enum(["M", "F"], {
      message: "Giới tính là bắt buộc",
    }),
    birthday: z
      .string()
      .min(1, { message: "Ngày sinh là bắt buộc" })
      .refine(
        (val) => {
          const date = new Date(val);
          return !isNaN(date.getTime()) && date <= new Date();
        },
        { message: "Không được chọn ngày tương lai" },
      )
      .refine(
        (val) => {
          const date = new Date(val);
          const today = new Date();
          let age = today.getFullYear() - date.getFullYear();
          const m = today.getMonth() - date.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
            age--;
          }
          return age >= 18;
        },
        { message: "Phải đủ 18 tuổi" },
      ),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    //Custom validation cho ca object
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Nhập lại mật khẩu, không khớp",
        path: ["confirmPassword"], //gan loi vao truong du lieu nay
      });
    }
  });

export const loginSchema = z.object({
  username: z.string().min(1, { message: "Username la bat buoc" }),
  password: z.string().min(6, { message: "Mật khẩu phải ít nhất 6 ký tự" }),
});
export type LoginSchemaType = z.infer<typeof loginSchema>;
export type RegisterFormInput = z.input<typeof registerSchema>;
export type RegisterSchemaType = z.infer<typeof registerSchema>;
