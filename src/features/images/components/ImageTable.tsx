import { Link } from "react-router-dom";
import { Eye, Image as ImageIcon, Trash2 } from "lucide-react";

import type { Image } from "@/features/images/types";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

interface ImageTableProps {
  images: Image[];
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export function ImageTable({ images, onDelete, isDeleting }: ImageTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ảnh</TableHead>
            <TableHead>Variant</TableHead>
            <TableHead>Đường dẫn</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {images.map((image) => (
            <TableRow key={image.id}>
              <TableCell>
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-md border bg-muted">
                  {image.path ? (
                    <img
                      src={image.path}
                      alt={image.variant?.name || image.id}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <p className="font-medium">
                    {image.variant?.name || image.variant_id}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {image.variant?.code || "Không có mã variant"}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <p className="max-w-md truncate text-sm text-muted-foreground">
                  {image.path}
                </p>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/admin/images/${image.id}`}>
                      <Eye className="mr-1 h-3 w-3" />
                      Xem
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-destructive/30 text-destructive hover:bg-destructive/10"
                    disabled={isDeleting}
                    onClick={() => {
                      if (window.confirm("Bạn có chắc muốn xóa ảnh này?")) {
                        onDelete(image.id);
                      }
                    }}
                  >
                    <Trash2 className="mr-1 h-3 w-3" />
                    Xóa
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
