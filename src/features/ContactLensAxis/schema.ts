import { z } from "zod";

/**
 * Schema validation cho Contact Lens Axis
 */
export const contactLensAxisSchema = z.object({
  contact_lens_spec_id: z
    .string()
    .min(1, "Contact Lens Spec ID không được để trống"),
  axis_value: z
    .number()
    .min(0, "Axis value phải >= 0")
    .max(180, "Axis value phải <= 180"),
  status: z.enum(["active", "inactive"]).optional().default("active"),
});

export type ContactLensAxisFormData = z.infer<typeof contactLensAxisSchema>;
