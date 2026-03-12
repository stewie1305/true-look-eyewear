import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";
import type {
  CreatePromotionDto,
  Promotion,
  PromotionFilterParams,
  UpdatePromotionDto,
} from "./types";

export const promotionService = {
  /** Admin xem toàn bộ (kể cả inactive) */
  getAllAdmin: async (params?: PromotionFilterParams): Promise<Promotion[]> => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.PROMOTIONS.BASE}/admin/findAll`,
      { params },
    );
    return response as unknown as Promotion[];
  },

  /** Manager / Customer xem khuyến mãi ACTIVE */
  getAllActive: async (
    params?: PromotionFilterParams,
  ): Promise<Promotion[]> => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.PROMOTIONS.BASE}/findAll`,
      { params },
    );
    return response as unknown as Promotion[];
  },

  getById: async (id: string): Promise<Promotion> => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.PROMOTIONS.BASE}/findOne/${id}`,
    );
    return response as unknown as Promotion;
  },

  create: async (data: CreatePromotionDto): Promise<Promotion> => {
    const response = await apiClient.post(
      `${API_ENDPOINTS.PROMOTIONS.BASE}/create`,
      data,
    );
    return response as unknown as Promotion;
  },

  update: async (id: string, data: UpdatePromotionDto): Promise<Promotion> => {
    const response = await apiClient.patch(
      `${API_ENDPOINTS.PROMOTIONS.BASE}/update/${id}`,
      data,
    );
    return response as unknown as Promotion;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`${API_ENDPOINTS.PROMOTIONS.BASE}/remove/${id}`);
  },
};
