export interface SupportMessage {
  id: number;
  ticketId: number;
  senderId: string;
  senderRole: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  ticket?: string;
}

export interface SupportTicket {
  id: number;
  orderId: string;
  customerId: string;
  status: string;
  createdAt: string;
  messages: SupportMessage[];
}

export interface SendMessageDto {
  ticketId: number;
  message: string;
}
