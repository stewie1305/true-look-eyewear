import { z } from "zod";

export const syncUserRolesSchema = z.object({
  roleIds: z
    .array(z.string().min(1, "Mã quyền không hợp lệ"))
    .min(1, "Vui lòng chọn ít nhất 1 quyền"),
});

export type SyncUserRolesFormData = z.infer<typeof syncUserRolesSchema>;
