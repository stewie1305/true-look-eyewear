import { createBaseService } from "@/shared/services/BaseService";
import type {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryFilterParams,
} from "./types";
import { API_ENDPOINTS } from "@/shared/constants";
import apiClient from "@/lib/axios";

export const categoryService = createBaseService<
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryFilterParams
>({
  endpoint: API_ENDPOINTS.CATEGORIES.BASE,
  getAll: async (params?: CategoryFilterParams) => {
    return apiClient.get(`${API_ENDPOINTS.CATEGORIES.BASE}/findAll`, {
      params,
    }) as unknown as Promise<any>;
  },
  remove: async (id) => {
    await apiClient.delete(`${API_ENDPOINTS.CATEGORIES.BASE}/remove/${id}`);
  },
});

export const adminCategoryService = {
  getById: async (id: string | number): Promise<Category> => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.CATEGORIES.BASE}/findOne/${id}`,
    );
    return response as unknown as Category;
  },
  create: async (data: CreateCategoryDto): Promise<Category> => {
    const response = await apiClient.post(
      `${API_ENDPOINTS.CATEGORIES.BASE}/create`,
      data,
    );
    return response as unknown as Category;
  },
  update: async (
    id: string | number,
    data: UpdateCategoryDto,
  ): Promise<Category> => {
    const response = await apiClient.patch(
      `${API_ENDPOINTS.CATEGORIES.BASE}/update/${id}`,
      data,
    );
    return response as unknown as Category;
  },
  remove: async (id: string | number): Promise<void> => {
    await apiClient.delete(`${API_ENDPOINTS.CATEGORIES.BASE}/remove/${id}`);
  },
};

export const publicCategoryService = {
  getActive: async (): Promise<Category[]> => {
    const response = await apiClient.get(`${API_ENDPOINTS.CATEGORIES.BASE}/active`);
    return response as unknown as Category[];
  },
};
