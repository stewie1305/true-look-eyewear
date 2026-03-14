import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { QUERY_KEYS } from "@/shared/constants";
import { supportService } from "../services";
import type { SendMessageDto } from "../types";

/**
 * Hook lấy hoặc tạo ticket hỗ trợ cho một đơn hàng (dành cho user)
 */
export function useSupportTicket(orderId: string, customerId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.SUPPORT_TICKET(orderId, customerId),
    queryFn: () => supportService.getOrCreateTicket(orderId, customerId),
    enabled: Boolean(orderId && customerId),
  });
}

/**
 * Hook lấy toàn bộ tin nhắn của một ticket
 */
export function useSupportMessages(ticketId: number | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.SUPPORT_MESSAGES(ticketId ?? 0),
    queryFn: () => supportService.getMessages(ticketId!),
    enabled: Boolean(ticketId),
    refetchInterval: 4000,
  });
}

/**
 * Hook lấy tất cả tickets (dành cho staff/admin)
 */
export function useAllSupportTickets() {
  return useQuery({
    queryKey: QUERY_KEYS.SUPPORT_TICKETS,
    queryFn: () => supportService.getAllTickets(),
    placeholderData: (prev) => prev,
    refetchInterval: 10000,
  });
}

/**
 * Hook gửi tin nhắn vào một ticket
 */
export function useSendMessage(ticketId: number | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: SendMessageDto) => supportService.sendMessage(dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SUPPORT_MESSAGES(ticketId ?? 0),
      });
    },
    onError: () => {
      toast.error("Gửi tin nhắn thất bại. Vui lòng thử lại.");
    },
  });
}
