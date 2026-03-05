import { createBaseService } from "@/shared/services/BaseService";
import type {
  CreateContactLensAxisDto,
  UpdateContactLensAxisDto,
  ContactLensAxisFilterParams,
  ContactLensAxisResponse,
} from "./types";
import { API_ENDPOINTS } from "@/shared/constants";
import apiClient from "@/lib/axios";

export const contactLensAxisService = createBaseService<
  ContactLensAxisResponse,
  CreateContactLensAxisDto,
  UpdateContactLensAxisDto,
  ContactLensAxisFilterParams
>({
  endpoint: API_ENDPOINTS.CONTACT_LENS_AXIS.BASE,
  remove: async (id) => {
    await apiClient.delete(`${API_ENDPOINTS.CONTACT_LENS_AXIS.BASE}/${id}`);
  },
});

export const adminContactLensAxisService = {
  getById: async (id: string | number): Promise<ContactLensAxisResponse> => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.CONTACT_LENS_AXIS.BASE}/${id}`,
    );
    return response as unknown as ContactLensAxisResponse;
  },
  create: async (
    data: CreateContactLensAxisDto,
  ): Promise<ContactLensAxisResponse> => {
    const response = await apiClient.post(
      API_ENDPOINTS.CONTACT_LENS_AXIS.BASE,
      data,
    );
    return response as unknown as ContactLensAxisResponse;
  },
  update: async (
    id: string | number,
    data: UpdateContactLensAxisDto,
  ): Promise<ContactLensAxisResponse> => {
    const response = await apiClient.patch(
      `${API_ENDPOINTS.CONTACT_LENS_AXIS.BASE}/${id}`,
      data,
    );
    return response as unknown as ContactLensAxisResponse;
  },
  remove: async (id: string | number): Promise<void> => {
    await apiClient.delete(`${API_ENDPOINTS.CONTACT_LENS_AXIS.BASE}/${id}`);
  },
};
