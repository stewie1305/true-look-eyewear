import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";
import type { SendMessageDto, SupportMessage, SupportTicket } from "./types";

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
   * GET /support/tickets
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
  getMessages: async (ticketId: number): Promise<SupportMessage[]> => {
    const response = await apiClient.get(
      API_ENDPOINTS.SUPPORT.MESSAGES(ticketId),
    );
    return response as unknown as SupportMessage[];
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
