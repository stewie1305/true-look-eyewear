import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { ContactLensAxisResponse } from "../types";

interface ContactLensAxisCardProps {
  contactLensAxis: ContactLensAxisResponse;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
}

export function ContactLensAxisCard({
  contactLensAxis,
  onDelete,
  isDeleting = false,
}: ContactLensAxisCardProps) {
  const getStatusColor = (status: string) => {
    return status?.toLowerCase() === "active" ? "bg-green-100" : "bg-red-100";
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">
              Axis: {contactLensAxis.axis_value}°
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Spec ID: {contactLensAxis.contact_lens_spec_id}
            </p>
          </div>
          <Badge className={getStatusColor(contactLensAxis.status)}>
            {contactLensAxis.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-4">
          {contactLensAxis.contactLensSpec && (
            <div className="text-sm">
              <p className="text-muted-foreground">Spec Details:</p>
              <p className="text-xs mt-1">
                Base Curve: {contactLensAxis.contactLensSpec.base_curve} |
                Diameter: {contactLensAxis.contactLensSpec.diameter}
              </p>
            </div>
          )}
          {contactLensAxis.product && (
            <div className="text-sm">
              <p className="text-muted-foreground">Product:</p>
              <p className="text-xs mt-1">{contactLensAxis.product.name}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button variant="outline" size="sm" asChild className="flex-1">
            <Link to={`/admin/contact-lens-axis/${contactLensAxis.id}`}>
              <Edit2 className="w-4 h-4 mr-2" />
              Chỉnh sửa
            </Link>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete?.(contactLensAxis.id)}
            disabled={isDeleting}
            className="flex-1"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Xóa
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
