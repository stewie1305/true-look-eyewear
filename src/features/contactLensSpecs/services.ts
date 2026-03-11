import { createBaseService } from "@/shared/services/BaseService";
import type {
  CreateContactLensSpecDto,
  UpdateContactLensSpecDto,
  ContactLensSpecFilterParams,
  ContactLensSpecResponse,
} from "./types";
import { API_ENDPOINTS } from "@/shared/constants";
import apiClient from "@/lib/axios";

export const contactLensSpecService = createBaseService<
  ContactLensSpecResponse,
  CreateContactLensSpecDto,
  UpdateContactLensSpecDto,
  ContactLensSpecFilterParams
>({
  endpoint: API_ENDPOINTS.CONTACT_LENS_SPECS.BASE,
  remove: async (id) => {
    await apiClient.delete(`${API_ENDPOINTS.CONTACT_LENS_SPECS.BASE}/${id}`);
  },
});

export const adminContactLensSpecService = {
  getById: async (id: string | number): Promise<ContactLensSpecResponse> => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.CONTACT_LENS_SPECS.BASE}/${id}`,
    );
    return response as unknown as ContactLensSpecResponse;
  },

  create: async (
    data: CreateContactLensSpecDto,
  ): Promise<ContactLensSpecResponse> => {
    const response = await apiClient.post(
      API_ENDPOINTS.CONTACT_LENS_SPECS.BASE,
      data,
    );
    return response as unknown as ContactLensSpecResponse;
  },

  update: async (
    id: string | number,
    data: UpdateContactLensSpecDto,
  ): Promise<ContactLensSpecResponse> => {
    const response = await apiClient.patch(
      `${API_ENDPOINTS.CONTACT_LENS_SPECS.BASE}/${id}`,
      data,
    );
    return response as unknown as ContactLensSpecResponse;
  },

  remove: async (id: string | number): Promise<void> => {
    await apiClient.delete(`${API_ENDPOINTS.CONTACT_LENS_SPECS.BASE}/${id}`);
  },
};
