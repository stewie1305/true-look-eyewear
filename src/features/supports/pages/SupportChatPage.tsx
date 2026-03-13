import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { LoadingSpinner, ErrorState } from "@/shared/components/common";
import { useUserMe } from "@/features/users/hooks/useUsers";
import { useSupportTicket } from "../hooks/useSupport";
import SupportChatBox from "../components/SupportChatBox";

export default function SupportChatPage() {
  const { id: orderId = "" } = useParams();

  const { data: currentUser, isLoading: isLoadingUser } = useUserMe();

  const customerId = currentUser?.id ?? "";

  const {
    data: ticket,
    isLoading: isLoadingTicket,
    error,
    refetch,
  } = useSupportTicket(orderId, customerId);

  if (isLoadingUser || isLoadingTicket) {
    return <LoadingSpinner className="py-20" size="lg" />;
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <ErrorState
          message="Không thể tải hỗ trợ đơn hàng. Vui lòng thử lại."
          onRetry={() => {
            void refetch();
          }}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 space-y-4">
      {/* Back */}
      <Button variant="ghost" size="sm" asChild>
        <Link to={`/orders/${orderId}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại chi tiết đơn hàng
        </Link>
      </Button>

      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageCircle className="h-5 w-5 text-primary" />
            Hỗ trợ đơn hàng #{orderId}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Trạng thái ticket:</span>
            <Badge variant="outline">{ticket?.status ?? "N/A"}</Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Chat box */}
      <Card className="h-130 flex flex-col overflow-hidden">
        <CardContent className="flex-1 p-0 overflow-hidden">
          {ticket ? (
            <SupportChatBox ticketId={ticket.id} currentUserId={customerId} />
          ) : (
            <p className="p-6 text-center text-sm text-muted-foreground">
              Không tìm thấy ticket hỗ trợ.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
