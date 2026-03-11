import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";
import type {
  Promotion,
  CreatePromotionDto,
  UpdatePromotionDto,
  PromotionFilterParams,
} from "./types";

export const promotionService = {
  // Manager/Customer: only active promotions
  getAllActive: async (params?: PromotionFilterParams) => {
    return apiClient.get(`${API_ENDPOINTS.PROMOTIONS.FIND_ALL}`, {
      params,
    }) as unknown as Promise<any>;
  },
  // Admin: all promotions (active + inactive)
  getAllAdmin: async (params?: PromotionFilterParams) => {
    return apiClient.get(`${API_ENDPOINTS.PROMOTIONS.ADMIN_FIND_ALL}`, {
      params,
    }) as unknown as Promise<any>;
  },
  getById: async (id: string | number): Promise<Promotion> => {
    return apiClient.get(
      `${API_ENDPOINTS.PROMOTIONS.FIND_ONE}/${id}`,
    ) as unknown as Promise<Promotion>;
  },
  create: async (data: CreatePromotionDto): Promise<Promotion> => {
    return apiClient.post(
      `${API_ENDPOINTS.PROMOTIONS.CREATE}`,
      data,
    ) as unknown as Promise<Promotion>;
  },
  update: async (
    id: string | number,
    data: UpdatePromotionDto,
  ): Promise<Promotion> => {
    return apiClient.patch(
      `${API_ENDPOINTS.PROMOTIONS.UPDATE}/${id}`,
      data,
    ) as unknown as Promise<Promotion>;
  },
  remove: async (id: string | number): Promise<void> => {
    await apiClient.delete(`${API_ENDPOINTS.PROMOTIONS.REMOVE}/${id}`);
  },
};
