import { Link } from "react-router-dom";
import { Pencil, Trash2, Building2 } from "lucide-react";

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
import type { Brand } from "../types";

interface BrandTableProps {
  brands: Brand[];
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
};

/**
 * Table hiển thị danh sách brands cho admin.
 * Sử dụng shadcn Table + Button + Badge.
 */
export function BrandTable({
  brands,
  onDelete,
  isDeleting,
}: BrandTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên thương hiệu</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {brands.map((brand) => (
            <TableRow key={brand.id}>
              <TableCell className="font-medium">
                <div className="flex flex-col gap-1">
                  <span className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    {brand.name}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={statusVariant[brand.status] ?? "outline"}>
                  {brand.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/admin/brands/${brand.id}`}>
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
                          `Bạn có chắc muốn xoá "${brand.name}"?`,
                        )
                      ) {
                        onDelete(brand.id);
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
