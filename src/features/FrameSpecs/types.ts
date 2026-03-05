import type { BaseFilterParams } from "@/shared/types";

export interface FrameSpec {
  id: string;
  product_id: string;
  type: string;
  material: string;
  a: number;
  b: number;
  dbl: number;
  shape: string;
  weight: number;
  status: string;
  create_at?: string;
  update_at?: string | null;
}

export interface CreateFrameSpecDto {
  product_id: string;
  type: string;
  material: string;
  a: number;
  b: number;
  dbl: number;
  shape: string;
  weight: number;
  status: string;
}

export interface UpdateFrameSpecDto {
  product_id?: string;
  type?: string;
  material?: string;
  a?: number;
  b?: number;
  dbl?: number;
  shape?: string;
  weight?: number;
  status?: string;
}

export interface FrameSpecFilterParams extends BaseFilterParams {
  search?: string;
  status?: string;
  product_id?: string;
}
