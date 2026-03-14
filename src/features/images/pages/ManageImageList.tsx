import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Image as ImageIcon, Plus, Search } from "lucide-react";

import {
  useDeleteImage,
  useImages,
  useImageVariantOptions,
} from "../hooks/useImages";
import { ImageTable } from "../components/ImageTable";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { EmptyState, LoadingSpinner } from "@/shared/components/common";
import { useDebounce } from "@/shared/hooks/useDebounce";

export default function ManageImageList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || "",
  );
  const debouncedSearch = useDebounce(searchInput, 500);

  const { images, isLoading } = useImages();
  const { variants, isLoading: isLoadingVariants } = useImageVariantOptions();
  const deleteMutation = useDeleteImage();

  const updateSearchParam = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      params.set("page", "1");
      setSearchParams(params);
    },
    [searchParams, setSearchParams],
  );

  useEffect(() => {
    if (debouncedSearch !== searchParams.get("search")) {
      updateSearchParam(debouncedSearch);
    }
  }, [debouncedSearch]);

  const handleFilterChange = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    setSearchParams(params);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <ImageIcon className="h-6 w-6" />
            Quản lý ảnh variant
          </h2>
          <p className="text-sm text-muted-foreground">
            Quản lý ảnh gắn với từng variant sản phẩm.
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/images/create">
            <Plus className="mr-2 h-4 w-4" />
            Thêm ảnh
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm theo variant, mã hoặc URL ảnh..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select
          value={searchParams.get("variant_id") || "all"}
          onValueChange={(value) =>
            handleFilterChange(
              "variant_id",
              value === "all" ? undefined : value,
            )
          }
          disabled={isLoadingVariants}
        >
          <SelectTrigger className="w-[260px]">
            <SelectValue
              placeholder={
                isLoadingVariants ? "Đang tải variants..." : "Tất cả variant"
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả variant</SelectItem>
            {variants.map((variant) => (
              <SelectItem key={variant.id} value={variant.id}>
                {variant.code} • {variant.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Badge variant="secondary" className="ml-auto">
          Tổng: {images.length}
        </Badge>
      </div>

      {isLoading ? (
        <LoadingSpinner className="py-16" size="lg" />
      ) : images.length === 0 ? (
        <EmptyState
          title="Chưa có ảnh nào"
          description="Hãy tạo ảnh đầu tiên cho variant sản phẩm"
        >
          <Button asChild>
            <Link to="/admin/images/create">
              <Plus className="mr-2 h-4 w-4" />
              Thêm ảnh
            </Link>
          </Button>
        </EmptyState>
      ) : (
        <ImageTable
          images={images}
          onDelete={(id) => deleteMutation.mutate(id)}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
