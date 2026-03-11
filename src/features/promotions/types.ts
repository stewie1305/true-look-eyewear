import type { BaseFilterParams } from "@/shared/types";

export type PromotionStatus = "active" | "inactive" | string;

export interface Promotion {
  id: string;
  name: string;
  condition: number;
  discount: number;
  start_time: string;
  end_time: string;
  status: PromotionStatus;
  created_at?: string;
  updated_at?: string | null;
}

export interface CreatePromotionDto {
  name: string;
  condition: number;
  discount: number;
  start_time: string;
  end_time: string;
  status: PromotionStatus;
}

export interface UpdatePromotionDto {
  name?: string;
  condition?: number;
  discount?: number;
  start_time?: string;
  end_time?: string;
  status?: PromotionStatus;
}

export interface PromotionFilterParams extends BaseFilterParams {
  name?: string;
  money?: number;
  status?: string;
}
