import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MessageCircle,
  ReceiptText,
  Calendar,
  Hash,
  User,
  CreditCard,
  Package,
} from "lucide-react";

import {
  LoadingSpinner,
  EmptyState,
  ErrorState,
} from "@/shared/components/common";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { useUserMe } from "@/features/users/hooks/useUsers";
import { useOrderDetail } from "../hooks/useOrders";
import { useMyOrders } from "../hooks/useOrders";
import { useImageBlobUrl } from "@/features/images/hooks/useImages";

function OrderItemImage({
  imageId,
  fallbackPath,
  alt,
}: {
  imageId?: string | null;
  fallbackPath?: string | null | undefined;
  alt?: string;
}) {
  const blobUrl = useImageBlobUrl(imageId ?? undefined);
  const serverSrc = fallbackPath
    ? `${import.meta.env.VITE_API_URL}/${String(fallbackPath).replace(/\\/g, "/")}`
    : null;

  const src =
    blobUrl || serverSrc || "https://placehold.co/150x150?text=No+Image";

  return (
    <div className="h-28 w-28 shrink-0 overflow-hidden rounded-xl border bg-white shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:shadow-md mx-auto sm:mx-0">
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover object-center"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src = "https://placehold.co/150x150?text=No+Image";
        }}
      />
    </div>
  );
}

const statusVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  Pending: "secondary",
  Confirm: "default",
  Shipping: "outline",
  Cancel: "destructive",
  Completed: "default",
};

const getDisplayStatus = (status?: string | null) => {
  if (!status) return "Pending";
  if (status === "SHIPPING_FAILED") return "Cancel";
  return status;
};

export default function OrderDetailPage() {
  const { id = "" } = useParams();
  const { data: order, isLoading, error, refetch } = useOrderDetail(id);
  const { data: currentUser, isLoading: isLoadingUser } = useUserMe();
  const { orders, isLoading: isLoadingOrders } = useMyOrders(currentUser?.id);

  const summaryOrder = orders.find((item) => String(item.id) === String(id));
  const displayOrder = {
    id: order?.id || summaryOrder?.id || id,
    customer_id: order?.customer_id || summaryOrder?.customer_id || "",
    total: Number(order?.total || summaryOrder?.total || 0),
    extra_fee: Number(order?.extra_fee || summaryOrder?.extra_fee || 0),
    status: getDisplayStatus(summaryOrder?.status || order?.status),
    create_at: order?.create_at || summaryOrder?.create_at || "",
    update_at: order?.update_at || summaryOrder?.update_at || null,
  };

  if (isLoading || isLoadingUser || isLoadingOrders) {
    return <LoadingSpinner className="py-20" size="lg" />;
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <ErrorState
          message="Không thể tải chi tiết đơn hàng. Vui lòng thử lại."
          onRetry={() => {
            void refetch();
          }}
        />
      </div>
    );
  }

  if (!order && !summaryOrder) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <EmptyState
          title="Không tìm thấy đơn hàng"
          description="Đơn hàng không tồn tại hoặc bạn không có quyền xem."
        >
          <Button asChild>
            <Link to="/orders">Quay lại danh sách đơn hàng</Link>
          </Button>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 space-y-8 animate-in fade-in duration-500">
      <Button
        variant="ghost"
        size="sm"
        asChild
        className="hover:bg-primary/5 hover:text-primary transition-colors"
      >
        <Link to="/orders">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Trở về đơn hàng của tôi
        </Link>
      </Button>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side: Products */}
        <div className="flex-1 space-y-6">
          <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
            <CardHeader className="border-b bg-muted/20 pb-4">
              <CardTitle className="flex items-center gap-3 text-xl font-bold">
                <div className="bg-primary/10 p-2 rounded-full text-primary">
                  <Package className="h-5 w-5" />
                </div>
                Sản phẩm đã mua (Đơn #{displayOrder.id})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {Array.isArray(order?.items) && order.items.length > 0 ? (
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id || `${item.variant_id}-${item.order_id}`}
                      className="group relative flex flex-col sm:flex-row gap-5 w-full rounded-2xl border border-transparent bg-secondary/30 p-5 transition-all duration-300 hover:border-primary/20 hover:bg-secondary/50 hover:shadow-md"
                    >
                      <OrderItemImage
                        imageId={(item as any).image_id}
                        fallbackPath={
                          order?.images?.find(
                            (img: any) =>
                              String(img.variant_id) ===
                              String(item.variant_id),
                          )?.path
                        }
                        alt={item.variant_name}
                      />
                      <div className="flex flex-1 flex-col justify-center">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div>
                            <p className="font-bold text-lg leading-tight transition-colors group-hover:text-primary">
                              {item.variant_name}
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className="text-[10px] font-mono bg-background"
                              >
                                ID: {item.variant_id}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-left sm:text-right mt-2 sm:mt-0">
                            <p className="font-extrabold text-xl text-primary">
                              {(
                                Number(item.price) * Number(item.quantity)
                              ).toLocaleString("vi-VN")}
                              đ
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                          <span className="flex items-center gap-1.5 bg-background/50 px-3 py-1.5 rounded-lg border shadow-sm">
                            <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                              Đơn giá
                            </span>
                            <span className="font-bold">
                              {Number(item.price || 0).toLocaleString("vi-VN")}đ
                            </span>
                          </span>
                          <span className="flex items-center gap-1.5 bg-background/50 px-3 py-1.5 rounded-lg border shadow-sm">
                            <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                              Số lượng
                            </span>
                            <span className="font-bold text-primary">
                              x{item.quantity}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center opacity-70">
                  <Package className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-base text-muted-foreground">
                    Chưa có danh sách sản phẩm trong chi tiết đơn hàng.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Order Info */}
        <div className="w-full lg:w-95 space-y-6 shrink-0">
          <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
            <CardHeader className="border-b bg-muted/20 pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <ReceiptText className="w-5 h-5 text-primary" />
                Thông tin đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between pb-4 border-b border-dashed">
                  <span className="text-sm font-medium text-muted-foreground">
                    Trạng thái
                  </span>
                  <Badge
                    variant={statusVariant[displayOrder.status] ?? "outline"}
                    className="px-3 py-1 text-xs font-bold uppercase tracking-wider"
                  >
                    {displayOrder.status}
                  </Badge>
                </div>

                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2.5 rounded-xl text-primary mt-0.5">
                      <Hash className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Mã đơn
                      </p>
                      <p className="font-bold text-sm mt-0.5">
                        #{displayOrder.id}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2.5 rounded-xl text-primary mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Khách hàng
                      </p>
                      <p className="font-bold text-sm mt-0.5">
                        {displayOrder.customer_id || "Khách vãng lai"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2.5 rounded-xl text-primary mt-0.5">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Ngày tạo
                      </p>
                      <p className="font-bold text-sm mt-0.5">
                        {displayOrder.create_at
                          ? new Date(displayOrder.create_at).toLocaleString(
                              "vi-VN",
                            )
                          : "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2.5 rounded-xl text-primary mt-0.5">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Phí phát sinh
                      </p>
                      <p className="font-bold text-sm mt-0.5">
                        {Number(displayOrder.extra_fee || 0).toLocaleString(
                          "vi-VN",
                        )}
                        đ
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-primary to-primary/80 text-primary-foreground border-none shadow-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:bg-white/30 transition-all duration-500"></div>

            <CardContent className="p-8 relative z-10">
              <p className="text-sm font-semibold opacity-90 uppercase tracking-widest mb-2">
                Tổng thanh toán
              </p>
              <p className="text-4xl font-extrabold tracking-tight drop-shadow-sm">
                {Number(displayOrder.total || 0).toLocaleString("vi-VN")}đ
              </p>
              <Button
                asChild
                className="mt-8 w-full bg-background text-primary hover:bg-background/90 font-bold shadow-md transition-transform hover:scale-[1.02]"
                size="lg"
              >
                <Link to={`/orders/${displayOrder.id}/support`}>
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Liên hệ hỗ trợ ngay
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
