import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";
import type { Image, CreateImagePayload } from "./types";

export const imageService = {
  getAll: async (): Promise<Image[]> => {
    const response = await apiClient.get(API_ENDPOINTS.IMAGES.BASE);
    return response as unknown as Image[];
  },

  getById: async (id: string | number): Promise<Image> => {
    const response = await apiClient.get(`${API_ENDPOINTS.IMAGES.BASE}/${id}`);
    return response as unknown as Image;
  },

  getBlobById: async (id: string | number): Promise<Blob> => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.IMAGES.BASE}/${id}`,
      {
        responseType: "blob",
        headers: { Accept: "image/*" },
        skipToast: true,
      } as any,
    );
    return response as unknown as Blob;
  },
};

export const adminImageService = {
  create: async (data: CreateImagePayload): Promise<Image> => {
    const formData = new FormData();
    if (data.variant_id) {
      formData.append("variant_id", String(data.variant_id));
    }
    formData.append("file", data.file);

    const response = await apiClient.post(
      API_ENDPOINTS.IMAGES.UPLOAD,
      formData,
    );
    return response as unknown as Image;
  },

  remove: async (id: string | number): Promise<void> => {
    await apiClient.delete(`${API_ENDPOINTS.IMAGES.BASE}/${id}`);
  },
};
