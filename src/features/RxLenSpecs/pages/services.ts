import { createBaseService } from "@/shared/services/BaseService";
import type {
  CreateRxLensSpecDto,
  RxLensSpec,
  RxLensSpecFilterParams,
  UpdateRxLensSpecDto,
} from "./types";
import { API_ENDPOINTS } from "@/shared/constants";
import apiClient from "@/lib/axios";

export const rxLensSpecService = createBaseService<
  RxLensSpec,
  CreateRxLensSpecDto,
  UpdateRxLensSpecDto,
  RxLensSpecFilterParams
>({
  endpoint: API_ENDPOINTS.RX_LENS_SPECS.BASE,
  remove: async (id) => {
    await apiClient.delete(`${API_ENDPOINTS.RX_LENS_SPECS.BASE}/${id}`);
  },
});

export const adminRxLensSpecService = {
  getById: async (id: string | number): Promise<RxLensSpec> => {
    const response = await apiClient.get(`${API_ENDPOINTS.RX_LENS_SPECS.BASE}/${id}`);
    return response as unknown as RxLensSpec;
  },
  create: async (data: CreateRxLensSpecDto): Promise<RxLensSpec> => {
    const response = await apiClient.post(API_ENDPOINTS.RX_LENS_SPECS.BASE, data);
    return response as unknown as RxLensSpec;
  },
  update: async (id: string | number, data: UpdateRxLensSpecDto): Promise<RxLensSpec> => {
    const response = await apiClient.patch(`${API_ENDPOINTS.RX_LENS_SPECS.BASE}/${id}`, data);
    return response as unknown as RxLensSpec;
  },
  remove: async (id: string | number): Promise<void> => {
    await apiClient.delete(`${API_ENDPOINTS.RX_LENS_SPECS.BASE}/${id}`);
  },
};
