import { createBaseService } from "@/shared/services/BaseService";
import type {
  CreateProductDto,
  ProductVariant,
  UpdateProductDto,
  ProductFilterParams,
} from "./types";
import { API_ENDPOINTS } from "@/shared/constants";
import apiClient from "@/lib/axios";

export const productService = createBaseService<
  ProductVariant,
  CreateProductDto,
  UpdateProductDto,
  ProductFilterParams
>({
  endpoint: API_ENDPOINTS.PRODUCTS.BASE,
  remove: async (id) => {
    await apiClient.delete(`${API_ENDPOINTS.PRODUCTS.BASE}/${id}`);
  },
});

export const adminProductService = {
  getById: async (id: string | number): Promise<ProductVariant> => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.PRODUCTS.BASE}/${id}`,
    );
    return response as unknown as ProductVariant;
  },
  create: async (data: CreateProductDto): Promise<ProductVariant> => {
    const response = await apiClient.post(API_ENDPOINTS.PRODUCTS.BASE, data);
    return response as unknown as ProductVariant;
  },
  update: async (
    id: string | number,
    data: UpdateProductDto,
  ): Promise<ProductVariant> => {
    const response = await apiClient.patch(
      `${API_ENDPOINTS.PRODUCTS.BASE}/${id}`,
      data,
    );
    return response as unknown as ProductVariant;
  },
  remove: async (id: string | number): Promise<void> => {
    await apiClient.delete(`${API_ENDPOINTS.PRODUCTS.BASE}/${id}`);
  },
};
