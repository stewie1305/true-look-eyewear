import { createBaseService } from "@/shared/services/BaseService";
import type {
  Brand,
  CreateBrandDto,
  UpdateBrandDto,
  BrandFilterParams,
} from "./types";
import { API_ENDPOINTS } from "@/shared/constants";
import apiClient from "@/lib/axios";

export const brandService = createBaseService<
  Brand,
  CreateBrandDto,
  UpdateBrandDto,
  BrandFilterParams
>({
  endpoint: API_ENDPOINTS.BRANDS.BASE,
  getAll: async (params?: BrandFilterParams) => {
    return apiClient.get(`${API_ENDPOINTS.BRANDS.BASE}/findAll`, {
      params,
    }) as unknown as Promise<any>;
  },
  remove: async (id) => {
    await apiClient.delete(`${API_ENDPOINTS.BRANDS.BASE}/remove/${id}`);
  },
});

export const adminBrandService = {
  getById: async (id: string | number): Promise<Brand> => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.BRANDS.BASE}/findOne/${id}`,
    );
    return response as unknown as Brand;
  },
  create: async (data: CreateBrandDto): Promise<Brand> => {
    const response = await apiClient.post(
      `${API_ENDPOINTS.BRANDS.BASE}/create`,
      data,
    );
    return response as unknown as Brand;
  },
  update: async (
    id: string | number,
    data: UpdateBrandDto,
  ): Promise<Brand> => {
    const response = await apiClient.patch(
      `${API_ENDPOINTS.BRANDS.BASE}/update/${id}`,
      data,
    );
    return response as unknown as Brand;
  },
  remove: async (id: string | number): Promise<void> => {
    await apiClient.delete(`${API_ENDPOINTS.BRANDS.BASE}/remove/${id}`);
  },
};
