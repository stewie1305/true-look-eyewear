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
import SupportChatBox from "../components/SupportChatBox";

export default function ManageSupportChat() {
  const { ticketId = "" } = useParams();
  const id = Number(ticketId);

  const { data: me, isLoading: isLoadingMe } = useUserMe();

  if (isLoadingMe) {
    return <LoadingSpinner className="py-20" size="lg" />;
  }

  if (!Number.isFinite(id) || id <= 0) {
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

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageCircle className="h-5 w-5" />
            Ticket #{id}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="h-130 overflow-hidden">
        <CardContent className="h-full p-0">
          <SupportChatBox ticketId={id} currentUserId={me?.id ?? ""} />
        </CardContent>
      </Card>
    </div>
  );
}
