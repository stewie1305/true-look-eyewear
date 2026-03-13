import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";
import type {
  CreatePaymentDto,
  PaymentCheckoutResponse,
  PaymentWebhookResponse,
} from "./types";

export const paymentService = {
  create: async (data: CreatePaymentDto): Promise<PaymentCheckoutResponse> => {
    const response = await apiClient.post(API_ENDPOINTS.PAYMENTS.BASE, data);
    return response as unknown as PaymentCheckoutResponse;
  },

  webhook: async (data: unknown): Promise<PaymentWebhookResponse> => {
    const response = await apiClient.post(API_ENDPOINTS.PAYMENTS.WEBHOOK, data);
    return response as unknown as PaymentWebhookResponse;
  },
};
