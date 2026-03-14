import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { useUserMe } from "@/features/users/hooks/useUsers";
import {
  LoadingSpinner,
  ErrorState,
  EmptyState,
} from "@/shared/components/common";
import SupportChatBox from "../components/SupportChatBox";
import { useAllSupportTickets } from "../hooks/useSupport";

export default function ManageSupportChat() {
  const { ticketId = "" } = useParams();
  const id = Number(ticketId);

  const { data: me, isLoading: isLoadingMe } = useUserMe();
  const {
    data: tickets,
    isLoading: isLoadingTickets,
    error,
    refetch,
  } = useAllSupportTickets();

  const ticket = (Array.isArray(tickets) ? tickets : []).find(
    (item) => item.id === id,
  );

  if (isLoadingMe || isLoadingTickets) {
    return <LoadingSpinner className="py-20" size="lg" />;
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState
          message="Không thể tải hội thoại hỗ trợ."
          onRetry={() => {
            void refetch();
          }}
        />
      </div>
    );
  }

  if (!ticket || !Number.isFinite(id)) {
    return (
      <div className="p-6">
        <EmptyState
          title="Không tìm thấy ticket"
          description="Ticket không tồn tại hoặc đã bị xóa."
        >
          <Button asChild>
            <Link to="/admin/support">Quay lại danh sách ticket</Link>
          </Button>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/admin/support">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại danh sách ticket
        </Link>
      </Button>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageCircle className="h-5 w-5" />
            Ticket #{ticket.id}
          </CardTitle>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <p>
              <span className="text-muted-foreground">Order:</span> #
              {ticket.orderId}
            </p>
            <p>
              <span className="text-muted-foreground">Customer:</span>{" "}
              {ticket.customerId}
            </p>
            <Badge variant="outline">{ticket.status}</Badge>
          </div>
        </CardHeader>
      </Card>

      <Card className="h-130 overflow-hidden">
        <CardContent className="h-full p-0">
          <SupportChatBox ticketId={ticket.id} currentUserId={me?.id ?? ""} />
        </CardContent>
      </Card>
    </div>
  );
}
