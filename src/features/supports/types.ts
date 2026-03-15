export interface SupportMessage {
  id: string | number;
  ticketId: string | number;
  senderId: string;
  senderRole: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  ticket?: string;
}

export interface SupportTicket {
  id: string | number;
  orderId: string;
  customerId: string;
  status: string;
  createdAt: string;
  messages: SupportMessage[];
}

export interface SendMessageDto {
  ticketId: string | number;
  message: string;
}
