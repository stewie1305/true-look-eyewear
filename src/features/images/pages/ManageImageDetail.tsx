import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  Image as ImageIcon,
  Loader2,
  Package,
} from "lucide-react";

import { useImageDetail } from "../hooks/useImages";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { ImagePreview } from "../components/ImagePreview";
import { getImageUrl } from "@/lib/env";

export default function ManageImageDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: image, isLoading } = useImageDetail(id || "");

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!image) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Không tìm thấy ảnh.</p>
        <Button asChild>
          <Link to="/admin/images">Quay lại danh sách</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/admin/images">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Quay lại danh sách
        </Link>
      </Button>

      <div>
        <h2 className="flex items-center gap-2 text-2xl font-bold">
          <ImageIcon className="h-6 w-6" />
          Chi tiết ảnh variant
        </h2>
        <p className="text-sm text-muted-foreground">
          Xem thông tin ảnh đã lưu trong hệ thống.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Xem trước ảnh</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-lg border bg-muted">
              <ImagePreview
                id={image.id}
                path={image.path}
                alt={image.variant?.name || image.id}
                className="h-full w-full object-contain"
                placeholderClassName="h-10 w-10 text-muted-foreground"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin ảnh</CardTitle>
            <CardDescription>Metadata từ API image</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="text-muted-foreground">Image ID</p>
              <p className="font-medium">{image.id}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Variant ID</p>
              <p className="font-medium">{image.variant_id}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Variant</p>
              <p className="font-medium">{image.variant?.name || "-"}</p>
              <p className="text-xs text-muted-foreground">
                {image.variant?.code || "Không có mã variant"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Sản phẩm</p>
              <p className="flex items-center gap-2 font-medium">
                <Package className="h-4 w-4" />
                {image.variant?.product?.name || "-"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Đường dẫn</p>
              <a
                href={getImageUrl(image.path)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 break-all text-primary hover:underline"
              >
                {image.path}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
