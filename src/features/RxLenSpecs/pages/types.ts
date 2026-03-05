import type { BaseFilterParams } from "@/shared/types";

export interface RxLensSpec {
  id: string;
  product_id: string;
  type: string;
  material: string;
  lens_width: number;
  min_sphere: number;
  max_sphere: number;
  min_cylinder: number;
  max_cylinder: number;
  status: string;
  create_at?: string;
  update_at?: string | null;
}

export interface CreateRxLensSpecDto {
  product_id: string;
  type: string;
  material: string;
  lens_width: number;
  min_sphere: number;
  max_sphere: number;
  min_cylinder: number;
  max_cylinder: number;
  status: string;
}

export interface UpdateRxLensSpecDto {
  product_id?: string;
  type?: string;
  material?: string;
  lens_width?: number;
  min_sphere?: number;
  max_sphere?: number;
  min_cylinder?: number;
  max_cylinder?: number;
  status?: string;
}

export interface RxLensSpecFilterParams extends BaseFilterParams {
  search?: string;
  status?: string;
  product_id?: string;
}
