import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";
import type {
  CreateOrderDto,
  Order,
  OrderFilterParams,
  UpdateOrderDto,
  UpdateOrderStatusDto,
} from "./types";

export const orderService = {
  getAll: async (params?: OrderFilterParams): Promise<Order[]> => {
    const response = await apiClient.get(API_ENDPOINTS.ORDERS.BASE, { params });
    return response as unknown as Order[];
  },

  getById: async (id: string): Promise<Order> => {
    const response = await apiClient.get(API_ENDPOINTS.ORDERS.BY_ID(id));
    return response as unknown as Order;
  },

  getByUserId: async (userId: string): Promise<Order[]> => {
    const response = await apiClient.get(API_ENDPOINTS.ORDERS.BY_USER(userId));
    return response as unknown as Order[];
  },

  create: async (data: CreateOrderDto): Promise<Order> => {
    // Chỉ thử 2 format: snake_case và camelCase — cả hai đều giữ promotion
    const payloadAttempts: Array<Record<string, unknown>> = [
      {
        customer_id: data.customer_id,
        extra_fee: data.extra_fee,
        address_id: data.address_id,
        promotion_id: data.promotion_id,
        payment_method: data.payment_method,
      },
      {
        customerId: data.customer_id,
        extraFee: data.extra_fee,
        addressId: data.address_id,
        promotionId: data.promotion_id,
        paymentMethod: data.payment_method,
      },
    ];

    const endpointAttempts = [
      API_ENDPOINTS.ORDERS.BASE,
      `${API_ENDPOINTS.ORDERS.BASE}/create`,
      `${API_ENDPOINTS.ORDERS.BASE}/checkout`,
    ];

    let lastError: unknown = null;

    for (const endpoint of endpointAttempts) {
      for (const payload of payloadAttempts) {
        const cleaned = Object.fromEntries(
          Object.entries(payload).filter(([, value]) => value !== undefined),
        );

        try {
          const response = await apiClient.post(endpoint, cleaned);
          return response as unknown as Order;
        } catch (error: any) {
          lastError = error;
          const status = error?.response?.status;
          if (
            status !== 400 &&
            status !== 403 &&
            status !== 404 &&
            status !== 422
          ) {
            throw error;
          }
        }
      }
    }

    throw lastError;
  },

  update: async (id: string, data: UpdateOrderDto): Promise<Order> => {
    const response = await apiClient.patch(
      API_ENDPOINTS.ORDERS.BY_ID(id),
      data,
    );
    return response as unknown as Order;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.ORDERS.BY_ID(id));
  },

  updateStatus: async (
    id: string,
    data: UpdateOrderStatusDto,
  ): Promise<void> => {
    await apiClient.patch(API_ENDPOINTS.ORDERS.STATUS(id), data);
  },
};
