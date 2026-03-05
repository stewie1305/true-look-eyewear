import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { ContactLensAxisResponse } from "../types";

interface ContactLensAxisTableProps {
  data: ContactLensAxisResponse[];
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
}

export function ContactLensAxisTable({
  data,
  onDelete,
  isDeleting = false,
}: ContactLensAxisTableProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Không có dữ liệu</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Spec ID</TableHead>
          <TableHead>Axis Value</TableHead>
          <TableHead className="w-[180px] text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id} className="hover:bg-muted/50">
            <TableCell className="font-mono text-sm align-middle">
              {item.contact_lens_spec_id}
            </TableCell>

            <TableCell className="font-semibold align-middle">
              {item.axis_value}°
            </TableCell>

            <TableCell className="align-middle">
              <div className="flex items-center justify-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/admin/contact-lens-axis/${item.id}`}>
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
  );
}
