import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { useState } from "react";

import { EmptyState, LoadingSpinner } from "@/shared/components/common";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { useAllSupportTickets } from "../hooks/useSupport";

export default function ManageSupportList() {
  const [ticketInput, setTicketInput] = useState("");
  const navigate = useNavigate();
  const { data: tickets = [], isLoading } = useAllSupportTickets();

  const handleOpenByTicketId = () => {
    const id = ticketInput.trim();
    if (!id) return;
    void navigate(`/admin/support/${id}`);
  };

  if (isLoading) {
    return <LoadingSpinner className="py-20" size="lg" />;
  }

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Support Tickets</h1>
      </div>

      {/* Mở nhanh theo Ticket ID */}
      <div className="flex items-center gap-2 max-w-md">
        <Input
          value={ticketInput}
          onChange={(e) => setTicketInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleOpenByTicketId();
          }}
          placeholder="Nhập Ticket ID để mở chat..."
        />
        <Button onClick={handleOpenByTicketId} disabled={!ticketInput.trim()}>
          <MessageCircle className="mr-2 h-4 w-4" />
          Mở chat
        </Button>
      </div>

      {tickets.length === 0 ? (
        <EmptyState
          title="Chưa có ticket hỗ trợ"
          description="Hiện chưa có ticket nào cần xử lý."
        />
      ) : (
        <div className="grid gap-3">
          {tickets.map((ticket) => (
            <Card key={ticket.id}>
              <CardContent className="flex items-center justify-between gap-3 p-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Ticket #{ticket.id}</p>
                  <p className="text-xs text-muted-foreground">
                    Order: {ticket.orderId} • Customer: {ticket.customerId}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(ticket.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{ticket.status}</Badge>
                  <Button
                    size="sm"
                    onClick={() => {
                      void navigate(`/admin/support/${ticket.id}`);
                    }}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Mở chat
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
