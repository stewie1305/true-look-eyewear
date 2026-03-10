import { z } from "zod";

/**
 * Schema validation cho Rx Lens Spec
 */
export const rxLensSpecSchema = z
  .object({
    product_id: z.string().min(1, "Product ID không được để trống"),
    type: z.string().min(1, "Loại tròng không được để trống"),
    material: z.string().min(1, "Chất liệu không được để trống"),
    lens_width: z.number().min(0, "Chiều rộng tròng phải >= 0"),
    min_sphere: z.number(),
    max_sphere: z.number(),
    min_cylinder: z.number(),
    max_cylinder: z.number(),
    status: z.enum(["active", "inactive"]),
  })
  .refine((data) => data.max_sphere >= data.min_sphere, {
    message: "Max sphere phải lớn hơn hoặc bằng min sphere",
    path: ["max_sphere"],
  })
  .refine((data) => data.max_cylinder >= data.min_cylinder, {
    message: "Max cylinder phải lớn hơn hoặc bằng min cylinder",
    path: ["max_cylinder"],
  });

export type RxLensSpecFormData = z.infer<typeof rxLensSpecSchema>;
