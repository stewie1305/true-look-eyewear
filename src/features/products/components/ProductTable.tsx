import { Link } from "react-router-dom";
import { Pencil, Trash2, Package, Tag } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../shared/components/ui/table";
import type { ProductVariant } from "../types";

interface ProductTableProps {
  products: ProductVariant[];
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

const statusVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  active: "default",
  Active: "default",
  inactive: "secondary",
  Inactive: "secondary",
  out_of_stock: "destructive",
};

export function ProductTable({
  products,
  onDelete,
  isDeleting,
}: ProductTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã SP</TableHead>
            <TableHead>Tên sản phẩm</TableHead>
            <TableHead>Thương hiệu</TableHead>
            <TableHead>Giá</TableHead>
            <TableHead className="text-center">Số lượng</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-mono text-xs">
                {product.code}
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex flex-col gap-1">
                  <span>{product.name}</span>
                  {product.color && (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Tag className="h-3 w-3" />
                      {product.color}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {product.product?.brand?.name ?? "—"}
              </TableCell>
              <TableCell className="font-medium">
                {Number(product.price || 0).toLocaleString("vi-VN")}đ
              </TableCell>
              <TableCell className="text-center">
                <span className="inline-flex items-center gap-1 text-sm">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  {product.quantity}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant={statusVariant[product.status] ?? "outline"}>
                  {product.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/admin/products/${product.id}`}>
                      <Pencil className="mr-1 h-3 w-3" />
                      Sửa
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-destructive/30 text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      if (
                        window.confirm(
                          `Bạn có chắc muốn xoá "${product.name}"?`,
                        )
                      ) {
                        onDelete(product.id);
                      }
                    }}
                    disabled={isDeleting}
                  >
                    <Trash2 className="mr-1 h-3 w-3" />
                    Xoá
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
