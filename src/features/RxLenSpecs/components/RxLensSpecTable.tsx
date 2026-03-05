import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import type { RxLensSpec } from "../pages/types";

interface RxLensSpecTableProps {
  rxLensSpecs: RxLensSpec[];
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

export function RxLensSpecTable({
  rxLensSpecs,
  onDelete,
  isDeleting,
}: RxLensSpecTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product ID</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead>Chất liệu</TableHead>
            <TableHead>Lens Width</TableHead>
            <TableHead>Sphere</TableHead>
            <TableHead>Cylinder</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rxLensSpecs.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-mono text-xs">{item.product_id}</TableCell>
              <TableCell className="font-medium">{item.type}</TableCell>
              <TableCell>{item.material}</TableCell>
              <TableCell>{item.lens_width}</TableCell>
              <TableCell>
                {item.min_sphere} đến {item.max_sphere}
              </TableCell>
              <TableCell>
                {item.min_cylinder} đến {item.max_cylinder}
              </TableCell>
              <TableCell>
                <Badge variant={statusVariant[item.status] ?? "outline"}>{item.status}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/admin/rx-lens-specs/${item.id}`}>
                      <Pencil className="mr-1 h-3 w-3" />
                      Sửa
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-destructive/30 text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      if (window.confirm(`Bạn có chắc muốn xoá tròng kính thuốc ${item.id}?`)) {
                        onDelete(item.id);
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
