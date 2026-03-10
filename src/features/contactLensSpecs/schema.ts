import { z } from "zod";

/**
 * Schema validation cho Contact Lens Spec
 */
export const contactLensSpecSchema = z
  .object({
    product_id: z.string().min(1, "Product ID không được để trống"),
    base_curve: z
      .number()
      .min(0, "Base curve phải >= 0")
      .max(20, "Base curve phải <= 20"),
    diameter: z
      .number()
      .min(0, "Diameter phải >= 0")
      .max(30, "Diameter phải <= 30"),
    min_sphere: z.number(),
    max_sphere: z.number(),
    min_cylinder: z.number(),
    max_cylinder: z.number(),
    axis_min: z
      .number()
      .min(0, "Axis min phải >= 0")
      .max(180, "Axis min phải <= 180"),
    status: z.enum(["active", "inactive"]).optional().default("active"),
  })
  .refine((data) => data.max_sphere >= data.min_sphere, {
    message: "Max sphere phải lớn hơn hoặc bằng min sphere",
    path: ["max_sphere"],
  })
  .refine((data) => data.max_cylinder >= data.min_cylinder, {
    message: "Max cylinder phải lớn hơn hoặc bằng min cylinder",
    path: ["max_cylinder"],
  });

export type ContactLensSpecFormData = z.infer<typeof contactLensSpecSchema>;
