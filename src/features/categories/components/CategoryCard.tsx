import { Tag } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import type { Category } from "../types";

interface CategoryCardProps {
  category: Category;
  showActions?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
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
 * Card component hiển thị thông tin category.
 */
export function CategoryCard({
  category,
  showActions = true,
  onEdit,
  onDelete,
}: CategoryCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Tag className="h-5 w-5 text-muted-foreground mt-1" />
            <div>
              <CardTitle className="text-lg">{category.name}</CardTitle>
              <CardDescription className="mt-1">ID: {category.id}</CardDescription>
            </div>
          </div>
          <Badge variant={statusVariant[category.status] ?? "outline"}>
            {category.status}
          </Badge>
        </div>
      </CardHeader>

      {showActions && (
        <CardContent className="flex gap-2">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(category.id)}
              asChild
            >
              <Link to={`/admin/categories/${category.id}`}>Chỉnh sửa</Link>
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              className="border-destructive/30 text-destructive hover:bg-destructive/10"
              onClick={() => {
                if (window.confirm(`Bạn có chắc muốn xoá "${category.name}"?`)) {
                  onDelete(category.id);
                }
              }}
            >
              Xoá
            </Button>
          )}
        </CardContent>
      )}
    </Card>
  );
}
