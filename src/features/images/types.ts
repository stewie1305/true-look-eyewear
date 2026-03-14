import type { BaseFilterParams } from "@/shared/types";
import type { ProductVariant } from "@/features/products/types";

export interface Image {
  id: string;
  variant_id: string;
  path: string;
  variant?: ProductVariant;
}

export interface CreateImagePayload {
  variant_id?: string;
  file: File;
}

export interface ImageFilterParams extends BaseFilterParams {
  search?: string;
  variant_id?: string;
}
