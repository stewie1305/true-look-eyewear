import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";
import type {
  CancelOrderResponse,
  CreateOrderDto,
  Order,
  UpdateOrderStatusDto,
  UpdateOrderStatusResponse,
} from "./types";

export const orderService = {
  getAll: async (): Promise<Order[]> => {
    const response = await apiClient.get(API_ENDPOINTS.ORDERS.BASE);
    return response as unknown as Order[];
  },

  getById: async (id: string): Promise<Order> => {
    const response = await apiClient.get(`${API_ENDPOINTS.ORDERS.BASE}/${id}`);
    return response as unknown as Order;
  },

  getDetails: async (id: string): Promise<Order> => {
    const response = await apiClient.get(API_ENDPOINTS.ORDERS.DETAILS(id));
    return response as unknown as Order;
  },

  create: async (data: CreateOrderDto): Promise<Order> => {
    const response = await apiClient.post(API_ENDPOINTS.ORDERS.BASE, data);
    return response as unknown as Order;
  },

  updateStatus: async (
    id: string,
    data: UpdateOrderStatusDto,
  ): Promise<UpdateOrderStatusResponse> => {
    const response = await apiClient.patch(
      `${API_ENDPOINTS.ORDERS.BASE}/${id}/status`,
      data,
    );
    return response as unknown as UpdateOrderStatusResponse;
  },

  cancel: async (id: string): Promise<CancelOrderResponse> => {
    const response = await apiClient.delete(
      `${API_ENDPOINTS.ORDERS.BASE}/${id}`,
    );
    return response as unknown as CancelOrderResponse;
  },

  getByUser: async (userId: string): Promise<Order[]> => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.ORDERS.BY_USER(userId)}`,
    );
    return response as unknown as Order[];
  },
};
