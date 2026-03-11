import { z } from "zod";

export const roleSchema = z.object({
  name: z.string().min(1, "Tên quyền là bắt buộc"),
});

export type RoleFormData = z.infer<typeof roleSchema>;
