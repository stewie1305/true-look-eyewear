import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { useState } from "react";

import { EmptyState } from "@/shared/components/common";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";

export default function ManageSupportList() {
  const [ticketInput, setTicketInput] = useState("");
  const navigate = useNavigate();

  const handleOpenByTicketId = () => {
    const id = Number(ticketInput.trim());
    if (!id || !Number.isFinite(id) || id <= 0) return;
    void navigate(`/admin/support/${id}`);
  };

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
          type="number"
          min={1}
        />
        <Button onClick={handleOpenByTicketId} disabled={!ticketInput.trim()}>
          <MessageCircle className="mr-2 h-4 w-4" />
          Mở chat
        </Button>
      </div>

      <EmptyState
        title="Mở hội thoại theo Ticket ID"
        description="Backend hiện chưa có API danh sách ticket (/support/tickets). Hãy nhập Ticket ID để vào khung chat với khách hàng."
      />
    </div>
  );
}
