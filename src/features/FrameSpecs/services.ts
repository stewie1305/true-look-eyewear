import { createBaseService } from "@/shared/services/BaseService";
import type {
  CreateFrameSpecDto,
  FrameSpec,
  FrameSpecFilterParams,
  UpdateFrameSpecDto,
} from "./types";
import { API_ENDPOINTS } from "@/shared/constants";
import apiClient from "@/lib/axios";

export const frameSpecService = createBaseService<
  FrameSpec,
  CreateFrameSpecDto,
  UpdateFrameSpecDto,
  FrameSpecFilterParams
>({
  endpoint: API_ENDPOINTS.FRAME_SPECS.BASE,
  remove: async (id) => {
    await apiClient.delete(`${API_ENDPOINTS.FRAME_SPECS.BASE}/${id}`);
  },
});

export const adminFrameSpecService = {
  getById: async (id: string | number): Promise<FrameSpec> => {
    const response = await apiClient.get(`${API_ENDPOINTS.FRAME_SPECS.BASE}/${id}`);
    return response as unknown as FrameSpec;
  },
  create: async (data: CreateFrameSpecDto): Promise<FrameSpec> => {
    const response = await apiClient.post(API_ENDPOINTS.FRAME_SPECS.BASE, data);
    return response as unknown as FrameSpec;
  },
  update: async (id: string | number, data: UpdateFrameSpecDto): Promise<FrameSpec> => {
    const response = await apiClient.patch(`${API_ENDPOINTS.FRAME_SPECS.BASE}/${id}`, data);
    return response as unknown as FrameSpec;
  },
  remove: async (id: string | number): Promise<void> => {
    await apiClient.delete(`${API_ENDPOINTS.FRAME_SPECS.BASE}/${id}`);
  },
};
