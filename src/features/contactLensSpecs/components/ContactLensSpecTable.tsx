import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Edit2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { ContactLensSpecResponse } from "../types";

interface ContactLensSpecTableProps {
  data: ContactLensSpecResponse[];
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
}

export function ContactLensSpecTable({
  data,
  onDelete,
  isDeleting = false,
}: ContactLensSpecTableProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Không có dữ liệu</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px]">Product</TableHead>
            <TableHead className="text-center">BC</TableHead>
            <TableHead className="text-center">DIA</TableHead>
            <TableHead className="text-center">Sphere</TableHead>
            <TableHead className="text-center">Cylinder</TableHead>
            <TableHead className="text-center">Axis Min</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="w-[180px] text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id} className="hover:bg-muted/50">
              <TableCell className="align-middle">
                <div>
                  <p className="font-medium">{item.product?.name || "N/A"}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.product?.code || "N/A"}
                  </p>
                </div>
              </TableCell>

              <TableCell className="text-center align-middle font-mono">
                {item.base_curve.toFixed(1)}
              </TableCell>

              <TableCell className="text-center align-middle font-mono">
                {item.diameter.toFixed(1)}
              </TableCell>

              <TableCell className="text-center align-middle">
                <div className="text-xs">
                  <div>{item.min_sphere.toFixed(2)}</div>
                  <div className="text-muted-foreground">to</div>
                  <div>{item.max_sphere.toFixed(2)}</div>
                </div>
              </TableCell>

              <TableCell className="text-center align-middle">
                <div className="text-xs">
                  <div>{item.min_cylinder.toFixed(2)}</div>
                  <div className="text-muted-foreground">to</div>
                  <div>{item.max_cylinder.toFixed(2)}</div>
                </div>
              </TableCell>

              <TableCell className="text-center align-middle font-semibold">
                {item.axis_min}°
              </TableCell>

              <TableCell className="text-center align-middle">
                <Badge
                  variant={item.status === "active" ? "default" : "secondary"}
                >
                  {item.status === "active" ? "Hoạt động" : "Không hoạt động"}
                </Badge>
              </TableCell>

              <TableCell className="align-middle">
                <div className="flex items-center justify-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/admin/contact-lens-specs/${item.id}`}>
                      <Edit2 className="w-4 h-4 mr-1" />
                      Sửa
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete?.(item.id)}
                    disabled={isDeleting}
                    className="text-destructive hover:text-destructive border-destructive/50 hover:border-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
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
