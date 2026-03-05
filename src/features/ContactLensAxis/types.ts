import type { BaseFilterParams } from "@/shared/types";

export interface ContactLensAxis {
  id: string;
  contact_lens_spec_id: string;
  axis_value: number;
  status: string;
}

export interface ContactLensSpecDetail {
  id: string;
  product_id: string;
  base_curve: number;
  diameter: number;
  min_sphere: number;
  max_sphere: number;
  min_cylinder: number;
  max_cylinder: number;
  status: string;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  product_type: string;
  description: string;
  create_at: string;
  update_at: string | null;
  status: string;
  brand_id: string;
}

export interface ContactLensAxisResponse {
  id: string;
  contact_lens_spec_id: string;
  axis_value: number;
  status: string;
  contactLensSpec: ContactLensSpecDetail;
  product: Product;
}

export interface CreateContactLensAxisDto {
  contact_lens_spec_id: string;
  axis_value: number;
  status?: string;
}

export interface UpdateContactLensAxisDto {
  contact_lens_spec_id?: string;
  axis_value?: number;
  status?: string;
}

export interface ContactLensAxisFilterParams extends BaseFilterParams {
  search?: string;
  status?: string;
  contact_lens_spec_id?: string;
}
