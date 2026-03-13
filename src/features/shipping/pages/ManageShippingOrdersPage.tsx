import { useMemo, useState } from "react";
import { PackageCheck, RefreshCcw, Truck } from "lucide-react";

import {
  useCreateNhanhOrder,
  useNhanhOrders,
} from "@/features/shipping/hooks/useShippingAdmin";
import { useOrdersAdmin } from "@/features/orders/hooks/useOrders";
import { type CreateNhanhOrderDto } from "@/features/shipping/types";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { EmptyState, LoadingSpinner } from "@/shared/components/common";

const toDateInputValue = (value: Date) => value.toISOString().slice(0, 10);

const today = new Date();
const defaultFromDate = new Date();
defaultFromDate.setDate(today.getDate() - 7);

const EMPTY_FORM: CreateNhanhOrderDto = {
  id: "",
  carrierId: 29,
  carrierName: "SPX Express",
  serviceId: 186,
  serviceName: "Tiêu chuẩn",
  depotId: 230531,
  customerName: "",
  customerMobile: "",
  customerAddress: "",
  customerCityName: "Hồ Chí Minh",
  customerDistrictName: "Quận 1",
  moneyTransfer: 0,
  productList: [
    {
      id: "",
      name: "",
      code: "",
      quantity: 1,
      price: 0,
      weight: 200,
    },
  ],
};

export default function ManageShippingOrdersPage() {
  const [filters, setFilters] = useState({
    fromDate: toDateInputValue(defaultFromDate),
    toDate: toDateInputValue(today),
  });
  const [draftFilters, setDraftFilters] = useState(filters);
  const [form, setForm] = useState<CreateNhanhOrderDto>(EMPTY_FORM);

  const createMutation = useCreateNhanhOrder();
  const ordersQuery = useNhanhOrders(filters);
  const { orders: internalOrders, isLoading: isLoadingInternalOrders } =
    useOrdersAdmin();

  const orders = useMemo(
    () => (Array.isArray(ordersQuery.data) ? ordersQuery.data : []),
    [ordersQuery.data],
  );

  const confirmedOrders = useMemo(
    () =>
      (Array.isArray(internalOrders) ? internalOrders : []).filter(
        (order) => String(order.status).toLowerCase() === "confirm",
      ),
    [internalOrders],
  );

  const applyInternalOrderToForm = (orderId: string) => {
    const picked = confirmedOrders.find((item) => String(item.id) === orderId);
    if (!picked) return;

    const pickedWithCustomer = picked as typeof picked & {
      customer?: {
        fullName?: string;
        addresses?: Array<{
          name_recipient?: string;
          phone_recipient?: string;
          city?: string;
          district?: string;
          ward?: string;
          street?: string;
        }>;
      };
    };

    const selectedAddress = Array.isArray(
      pickedWithCustomer.customer?.addresses,
    )
      ? pickedWithCustomer.customer?.addresses?.[0]
      : undefined;

    const customerStreet = selectedAddress?.street?.trim() || "";
    const customerWard = selectedAddress?.ward?.trim() || "";
    const composedAddress = [customerStreet, customerWard]
      .filter(Boolean)
      .join(", ");

    setForm((prev) => ({
      ...prev,
      id: String(picked.id),
      customerName:
        prev.customerName ||
        selectedAddress?.name_recipient ||
        pickedWithCustomer.customer?.fullName ||
        `Khách #${picked.customer_id}`,
      customerMobile:
        prev.customerMobile || selectedAddress?.phone_recipient || "",
      customerAddress: prev.customerAddress || composedAddress,
      customerCityName:
        prev.customerCityName ||
        selectedAddress?.city ||
        EMPTY_FORM.customerCityName,
      customerDistrictName:
        prev.customerDistrictName ||
        selectedAddress?.district ||
        EMPTY_FORM.customerDistrictName,
      moneyTransfer: Number(picked.total || 0),
      productList: prev.productList.map((product, index) =>
        index === 0
          ? {
              ...product,
              id: product.id || `ITEM_${picked.id}`,
              code: product.code || String(picked.id),
              name: product.name || `Đơn nội bộ #${picked.id}`,
              quantity: product.quantity || 1,
              price: product.price || Number(picked.total || 0),
            }
          : product,
      ),
    }));
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(form, {
      onSuccess: () => {
        setForm({
          ...EMPTY_FORM,
          id: "",
          customerName: "",
          customerMobile: "",
          customerAddress: "",
          customerCityName: "Hồ Chí Minh",
          customerDistrictName: "Quận 1",
          moneyTransfer: 0,
          productList: [
            { id: "", name: "", code: "", quantity: 1, price: 0, weight: 200 },
          ],
        });
      },
    });
  };

  const setProductField = (
    key: keyof CreateNhanhOrderDto["productList"][number],
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      productList: prev.productList.map((item, index) =>
        index === 0
          ? {
              ...item,
              [key]: ["quantity", "price", "weight"].includes(key)
                ? Number(value || 0)
                : value,
            }
          : item,
      ),
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="flex items-center gap-2 text-2xl font-bold">
          <Truck className="h-6 w-6" />
          Quản lý đơn Nhanh.vn
        </h2>
        <p className="text-sm text-muted-foreground">
          Dành cho staff, manager và admin để tạo đơn, tra cứu và cập nhật trạng
          thái giao hàng.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1.8fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PackageCheck className="h-5 w-5" />
              Tạo đơn giao hàng
            </CardTitle>
            <CardDescription>
              Tạo đơn test hoặc đơn thật lên Nhanh.vn theo payload staff API.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleCreateOrder}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="order-id">Mã đơn</Label>
                  <Input
                    id="order-id"
                    value={form.id}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, id: e.target.value }))
                    }
                    placeholder="ORDER_TEST_001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="depot-id">Depot ID</Label>
                  <Input
                    id="depot-id"
                    type="number"
                    value={form.depotId}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        depotId: Number(e.target.value || 0),
                      }))
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="carrier-id">Carrier ID</Label>
                  <Input
                    id="carrier-id"
                    type="number"
                    value={form.carrierId}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        carrierId: Number(e.target.value || 0),
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service-id">Service ID</Label>
                  <Input
                    id="service-id"
                    type="number"
                    value={form.serviceId}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        serviceId: Number(e.target.value || 0),
                      }))
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="carrier-name">Carrier name</Label>
                  <Input
                    id="carrier-name"
                    value={form.carrierName}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        carrierName: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service-name">Service name</Label>
                  <Input
                    id="service-name"
                    value={form.serviceName}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        serviceName: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="customer-name">Tên khách hàng</Label>
                  <Input
                    id="customer-name"
                    value={form.customerName}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        customerName: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-mobile">Số điện thoại</Label>
                  <Input
                    id="customer-mobile"
                    value={form.customerMobile}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        customerMobile: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer-address">Địa chỉ</Label>
                <Input
                  id="customer-address"
                  value={form.customerAddress}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      customerAddress: e.target.value,
                    }))
                  }
                  placeholder="123 Nguyễn Huệ"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="customer-city">Tỉnh/Thành</Label>
                  <Input
                    id="customer-city"
                    value={form.customerCityName}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        customerCityName: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-district">Quận/Huyện</Label>
                  <Input
                    id="customer-district"
                    value={form.customerDistrictName}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        customerDistrictName: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2 rounded-lg border p-4">
                <p className="text-sm font-medium">Sản phẩm đầu tiên</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    value={form.productList[0]?.id || ""}
                    onChange={(e) => setProductField("id", e.target.value)}
                    placeholder="Mã nội bộ"
                  />
                  <Input
                    value={form.productList[0]?.code || ""}
                    onChange={(e) => setProductField("code", e.target.value)}
                    placeholder="SKU / code"
                  />
                  <Input
                    value={form.productList[0]?.name || ""}
                    onChange={(e) => setProductField("name", e.target.value)}
                    placeholder="Tên sản phẩm"
                    className="md:col-span-2"
                  />
                  <Input
                    type="number"
                    value={form.productList[0]?.quantity || 0}
                    onChange={(e) =>
                      setProductField("quantity", e.target.value)
                    }
                    placeholder="Số lượng"
                  />
                  <Input
                    type="number"
                    value={form.productList[0]?.price || 0}
                    onChange={(e) => setProductField("price", e.target.value)}
                    placeholder="Giá"
                  />
                  <Input
                    type="number"
                    value={form.productList[0]?.weight || 0}
                    onChange={(e) => setProductField("weight", e.target.value)}
                    placeholder="Khối lượng (gram)"
                  />
                  <Input
                    type="number"
                    value={form.moneyTransfer}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        moneyTransfer: Number(e.target.value || 0),
                      }))
                    }
                    placeholder="COD / chuyển thu"
                  />
                </div>
              </div>

              <Button
                className="w-full"
                disabled={createMutation.isPending}
                type="submit"
              >
                {createMutation.isPending ? "Đang tạo..." : "Tạo đơn Nhanh"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tra cứu đơn hàng Nhanh.vn</CardTitle>
            <CardDescription>
              Đồng bộ và hiển thị danh sách đơn hàng Nhanh.vn theo khoảng ngày.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <p className="mb-3 text-sm font-medium">
                Đơn đã Confirm (nội bộ)
              </p>

              {isLoadingInternalOrders ? (
                <LoadingSpinner />
              ) : confirmedOrders.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Chưa có đơn nào ở trạng thái Confirm.
                </p>
              ) : (
                <div className="space-y-2">
                  {confirmedOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex flex-col gap-2 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="text-sm">
                        <p className="font-medium">#{order.id}</p>
                        <p className="text-muted-foreground">
                          KH: {order.customer_id} •{" "}
                          {Number(order.total || 0).toLocaleString("vi-VN")}đ
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => applyInternalOrderToForm(order.id)}
                      >
                        Đẩy vào form tạo Nhanh
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
              <div className="space-y-2">
                <Label htmlFor="from-date">Từ ngày</Label>
                <Input
                  id="from-date"
                  type="date"
                  value={draftFilters.fromDate}
                  onChange={(e) =>
                    setDraftFilters((prev) => ({
                      ...prev,
                      fromDate: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="to-date">Đến ngày</Label>
                <Input
                  id="to-date"
                  type="date"
                  value={draftFilters.toDate}
                  onChange={(e) =>
                    setDraftFilters((prev) => ({
                      ...prev,
                      toDate: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setFilters(draftFilters)}
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Tra cứu
                </Button>
              </div>
            </div>

            {ordersQuery.isLoading ? (
              <LoadingSpinner />
            ) : orders.length === 0 ? (
              <EmptyState
                title="Chưa có đơn Nhanh"
                description="Không tìm thấy đơn hàng nào trong khoảng ngày đã chọn."
              />
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-lg border p-4 transition hover:border-primary/40"
                  >
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-1">
                        <p className="font-semibold">{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.customerName || "-"} •{" "}
                          {order.customerMobile || "-"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.customerAddress || "-"},{" "}
                          {order.customerDistrictName || "-"},{" "}
                          {order.customerCityName || "-"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.carrierName || "-"} /{" "}
                          {order.serviceName || "-"}
                          {order.status ? ` • ${order.status}` : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
