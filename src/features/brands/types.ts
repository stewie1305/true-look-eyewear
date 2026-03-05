import type { BaseFilterParams } from "@/shared/types";

export interface Brand {
  id: string;
  name: string;
  status: string;
}

export interface CreateBrandDto {
  name: string;
  status?: string;
}

export interface UpdateBrandDto {
  name?: string;
  status?: string;
}

export interface BrandFilterParams extends BaseFilterParams {
  search?: string;
  status?: string;
}
