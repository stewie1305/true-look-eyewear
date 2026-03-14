import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Image as ImageIcon, Plus, Search } from "lucide-react";

import { useDeleteImage, useImages } from "@/features/images/hooks/useImages";
import { ImageTable } from "@/features/images/components/ImageTable";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { EmptyState, LoadingSpinner } from "@/shared/components/common";
import { useDebounce } from "@/shared/hooks/useDebounce";

export default function ManageImageList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || "",
  );
  const debouncedSearch = useDebounce(searchInput, 400);

  const { images, isLoading } = useImages();
  const deleteMutation = useDeleteImage();

  const updateSearchParam = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      setSearchParams(params);
    },
    [searchParams, setSearchParams],
  );

  useEffect(() => {
    if (debouncedSearch !== (searchParams.get("search") || "")) {
      updateSearchParam(debouncedSearch);
    }
  }, [debouncedSearch, searchParams, updateSearchParam]);

  return (
    <div className="space-y-6">
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

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm theo variant, mã hoặc URL ảnh..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
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
