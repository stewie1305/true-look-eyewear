import { Link } from "react-router-dom";
import { Pencil, Trash2, Ruler } from "lucide-react";

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
import type { FrameSpec } from "../types";

interface FrameSpecTableProps {
  frameSpecs: FrameSpec[];
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

export function FrameSpecTable({
  frameSpecs,
  onDelete,
  isDeleting,
}: FrameSpecTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product ID</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead>Chất liệu</TableHead>
            <TableHead>A x B x DBL</TableHead>
            <TableHead>Dáng kính</TableHead>
            <TableHead>Khối lượng</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {frameSpecs.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-mono text-xs">{item.product_id}</TableCell>
              <TableCell className="font-medium">{item.type}</TableCell>
              <TableCell>{item.material}</TableCell>
              <TableCell>{item.a} x {item.b} x {item.dbl}</TableCell>
              <TableCell>{item.shape}</TableCell>
              <TableCell>{item.weight}g</TableCell>
              <TableCell>
                <Badge variant={statusVariant[item.status] ?? "outline"}>{item.status}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/admin/frame-specs/${item.id}`}>
                      <Pencil className="mr-1 h-3 w-3" />
                      Sửa
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-destructive/30 text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      if (window.confirm(`Bạn có chắc muốn xoá gọng kính ${item.id}?`)) {
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

      {frameSpecs.length === 0 && (
        <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
          <Ruler className="h-5 w-5" />
          <span>Không có gọng kính</span>
        </div>
      )}
    </div>
  );
}
