import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { useUserMe } from "@/features/users/hooks/useUsers";
import { LoadingSpinner } from "@/shared/components/common";
import { useAllSupportTickets, useSupportTicket } from "../hooks/useSupport";
import SupportChatBox from "../components/SupportChatBox";

export default function ManageSupportChat() {
  const { ticketId = "" } = useParams();

  const { data: me, isLoading: isLoadingMe } = useUserMe();
  const { data: tickets = [], isLoading: isLoadingTickets } =
    useAllSupportTickets();

  const selectedTicket = tickets.find(
    (ticket) => String(ticket.id) === String(ticketId),
  );

  const { data: canonicalTicket, isLoading: isLoadingCanonicalTicket } =
    useSupportTicket(
      selectedTicket?.orderId ?? "",
      selectedTicket?.customerId ?? "",
    );

  const resolvedTicketId =
    canonicalTicket?.id ??
    selectedTicket?.messages?.[0]?.ticketId ??
    selectedTicket?.id ??
    ticketId;

  const initialMessages = canonicalTicket?.messages?.length
    ? canonicalTicket.messages
    : (selectedTicket?.messages ?? []);

  if (isLoadingMe || isLoadingTickets || isLoadingCanonicalTicket) {
    return <LoadingSpinner className="py-20" size="lg" />;
  }

  if (!ticketId.trim()) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground text-sm">Ticket ID không hợp lệ.</p>
        <Button variant="ghost" size="sm" asChild className="mt-2">
          <Link to="/admin/support">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách ticket
          </Link>
        </Button>
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

      <Card className="border-border/70 bg-card/90 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageCircle className="h-5 w-5" />
            Ticket #{resolvedTicketId}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="h-[68vh] min-h-115 max-h-190 overflow-hidden border-border/70 bg-card/95 shadow-lg">
        <CardContent className="h-full p-0">
          <SupportChatBox
            ticketId={resolvedTicketId}
            currentUserId={me?.id ?? ""}
            initialMessages={initialMessages}
          />
        </CardContent>
      </Card>
    </div>
  );
}
