import type { BaseFilterParams } from "@/shared/types";

export interface Category {
  id: string;
  name: string;
  status: string;
}

export interface CreateCategoryDto {
  name: string;
  status?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  status?: string;
}

export interface CategoryFilterParams extends BaseFilterParams {
  search?: string;
  status?: string;
}
