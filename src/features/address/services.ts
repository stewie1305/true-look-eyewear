import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";
import { createBaseService } from "@/shared/services/BaseService";
import type {
  Address,
  AddressFilterParams,
  CreateAddressDto,
  UpdateAddressDto,
} from "./types";

export const addressService = createBaseService<
  Address,
  CreateAddressDto,
  UpdateAddressDto,
  AddressFilterParams
>({
  endpoint: API_ENDPOINTS.ADDRESSES.BASE,
  update: async (id, data) => {
    const response = await apiClient.patch(
      `${API_ENDPOINTS.ADDRESSES.BASE}/${id}`,
      data,
    );
    return response as unknown as Address;
  },
  remove: async (id) => {
    await apiClient.delete(`${API_ENDPOINTS.ADDRESSES.BASE}/${id}`);
  },
});
