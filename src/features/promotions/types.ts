import type { BaseFilterParams } from "@/shared/types";

export interface Promotion {
  id: string;
  name: string;
  condition: number;
  discount: number;
  start_time: string;
  end_time: string;
  status: string;
}

export interface CreatePromotionDto {
  name: string;
  condition: number;
  discount: number;
  start_time: string;
  end_time: string;
  status?: string;
}

export interface UpdatePromotionDto {
  name?: string;
  condition?: number;
  discount?: number;
  start_time?: string;
  end_time?: string;
  status?: string;
}

export interface PromotionFilterParams extends BaseFilterParams {
  name?: string;
  money?: number;
  status?: string;
}
