import { createBaseService } from "@/shared/services/BaseService";
import type {
  CreateContactLensSpecDto,
  UpdateContactLensSpecDto,
  ContactLensSpecFilterParams,
  ContactLensSpecResponse,
} from "./types";
import { API_ENDPOINTS } from "@/shared/constants";
import apiClient from "@/lib/axios";

/**
 * Service chung cho Contact Lens Specs
 * Sử dụng BaseService pattern để xử lý CRUD operations
 */
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

/**
 * Admin service cho Contact Lens Specs
 * Cung cấp các method CRUD với typing rõ ràng
 */
export const adminContactLensSpecService = {
  /**
   * Lấy chi tiết một Contact Lens Spec theo ID
   * @param id - ID của contact lens spec
   * @returns Contact Lens Spec với thông tin product
   */
  getById: async (id: string | number): Promise<ContactLensSpecResponse> => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.CONTACT_LENS_SPECS.BASE}/${id}`,
    );
    return response as unknown as ContactLensSpecResponse;
  },

  /**
   * Tạo Contact Lens Spec mới
   * axis_min trong data phải là giá trị từ ContactLensAxis có sẵn
   * @param data - Dữ liệu contact lens spec
   * @returns Contact Lens Spec vừa tạo
   */
  create: async (
    data: CreateContactLensSpecDto,
  ): Promise<ContactLensSpecResponse> => {
    const response = await apiClient.post(
      API_ENDPOINTS.CONTACT_LENS_SPECS.BASE,
      data,
    );
    return response as unknown as ContactLensSpecResponse;
  },

  /**
   * Cập nhật Contact Lens Spec
   * @param id - ID của contact lens spec
   * @param data - Dữ liệu cần cập nhật
   * @returns Contact Lens Spec đã cập nhật
   */
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

  /**
   * Xóa Contact Lens Spec
   * @param id - ID của contact lens spec cần xóa
   */
  remove: async (id: string | number): Promise<void> => {
    await apiClient.delete(`${API_ENDPOINTS.CONTACT_LENS_SPECS.BASE}/${id}`);
  },
};
