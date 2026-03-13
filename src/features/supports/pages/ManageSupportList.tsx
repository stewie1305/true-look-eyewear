import { Link } from "react-router-dom";
import { MessageCircle, Search } from "lucide-react";
import { useMemo, useState } from "react";

import {
  LoadingSpinner,
  ErrorState,
  EmptyState,
} from "@/shared/components/common";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { useAllSupportTickets } from "../hooks/useSupport";

export default function ManageSupportList() {
  const [keyword, setKeyword] = useState("");
  const { data, isLoading, error, refetch } = useAllSupportTickets();

  const tickets = Array.isArray(data) ? data : [];

  const filteredTickets = useMemo(() => {
    const needle = keyword.trim().toLowerCase();
    if (!needle) return tickets;

    return tickets.filter((ticket) => {
      return (
        String(ticket.id).toLowerCase().includes(needle) ||
        String(ticket.orderId).toLowerCase().includes(needle) ||
        String(ticket.customerId).toLowerCase().includes(needle) ||
        String(ticket.status).toLowerCase().includes(needle)
      );
    });
  }, [tickets, keyword]);

  if (isLoading) {
    return <LoadingSpinner className="py-20" size="lg" />;
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState
          message="Không thể tải danh sách hỗ trợ. Vui lòng thử lại."
          onRetry={() => {
            void refetch();
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Support Tickets</h1>
      </div>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="pl-9"
          placeholder="Tìm theo ticket, đơn hàng, khách hàng..."
        />
      </div>

      {filteredTickets.length === 0 ? (
        <EmptyState
          title="Chưa có ticket hỗ trợ"
          description="Hiện chưa có cuộc hội thoại hỗ trợ nào."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredTickets.map((ticket) => (
            <Card key={ticket.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center justify-between gap-2">
                  <span>Ticket #{ticket.id}</span>
                  <Badge variant="outline">{ticket.status}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <span className="text-muted-foreground">Order:</span> #
                  {ticket.orderId}
                </p>
                <p>
                  <span className="text-muted-foreground">Customer:</span>{" "}
                  {ticket.customerId}
                </p>
                <p>
                  <span className="text-muted-foreground">Tạo lúc:</span>{" "}
                  {new Date(ticket.createdAt).toLocaleString("vi-VN")}
                </p>
                <Button asChild className="mt-2 w-full">
                  <Link to={`/admin/support/${ticket.id}`}>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Mở hội thoại
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
