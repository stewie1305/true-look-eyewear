import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";
import type { SendMessageDto, SupportMessage, SupportTicket } from "./types";

function normalizeMessagesResponse(payload: unknown): SupportMessage[] {
  if (!payload) return [];

  if (Array.isArray(payload)) {
    return payload as SupportMessage[];
  }

  if (typeof payload === "object") {
    const obj = payload as {
      data?: unknown;
      messages?: unknown;
      ticket?: { messages?: unknown };
    };

    if (Array.isArray(obj.data)) {
      return obj.data as SupportMessage[];
    }

    if (obj.data && typeof obj.data === "object") {
      const dataObj = obj.data as {
        messages?: unknown;
        ticket?: { messages?: unknown };
        data?: unknown;
      };

      if (Array.isArray(dataObj.messages)) {
        return dataObj.messages as SupportMessage[];
      }

      if (Array.isArray(dataObj.ticket?.messages)) {
        return dataObj.ticket.messages as SupportMessage[];
      }

      if (Array.isArray(dataObj.data)) {
        return dataObj.data as SupportMessage[];
      }
    }

    if (Array.isArray(obj.messages)) {
      return obj.messages as SupportMessage[];
    }

    if (Array.isArray(obj.ticket?.messages)) {
      return obj.ticket.messages as SupportMessage[];
    }
  }

  return [];
}

export const supportService = {
  /**
   * GET /support/tickets/{orderId}/{customerId}
   * Lấy hoặc tạo Ticket cho một đơn hàng
   */
  getOrCreateTicket: async (
    orderId: string,
    customerId: string,
  ): Promise<SupportTicket> => {
    const response = await apiClient.get(
      API_ENDPOINTS.SUPPORT.TICKET(orderId, customerId),
    );
    return response as unknown as SupportTicket;
  },

  /**
   * GET /support
   * Lấy tất cả tickets (dành cho staff/admin)
   */
  getAllTickets: async (): Promise<SupportTicket[]> => {
    const response = await apiClient.get(API_ENDPOINTS.SUPPORT.TICKETS);
    return response as unknown as SupportTicket[];
  },

  /**
   * GET /support/messages/{ticketId}
   * Lấy toàn bộ lịch sử chat của một Ticket
   */
  getMessages: async (ticketId: string | number): Promise<SupportMessage[]> => {
    const response = await apiClient.get(
      API_ENDPOINTS.SUPPORT.MESSAGES(ticketId),
      {
        params: {
          _ts: Date.now(),
        },
        headers: {
          "Cache-Control": "no-cache, no-store, max-age=0",
          Pragma: "no-cache",
        },
      },
    );

    return normalizeMessagesResponse(response);
  },

  /**
   * POST /support/messages
   * Gửi tin nhắn vào một Ticket
   */
  sendMessage: async (dto: SendMessageDto): Promise<SupportMessage> => {
    const response = await apiClient.post(
      API_ENDPOINTS.SUPPORT.SEND_MESSAGE,
      dto,
    );
    return response as unknown as SupportMessage;
  },
};
