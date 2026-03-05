import { useState, useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, X, Glasses } from "lucide-react";

import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { useDebounce } from "@/shared/hooks/useDebounce";
import {
  LoadingSpinner,
  EmptyState,
  Pagination,
} from "@/shared/components/common";
import { useProducts } from "../hooks/useProducts";
import { ProductCard } from "../components/ProductCard";
import { useBrands } from "@/features/brands/hooks/useBrands";
import { useActiveCategories } from "@/features/categories/hooks/useCategories";

/**
 * Trang danh sách sản phẩm cho User – có search, filter, pagination.
 * Tất cả state lưu trên URL (searchParams) → có thể bookmark/share.
 */
export function ProductsCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Data hooks
  const { products, pagination, isLoading } = useProducts({
    forceActive: true,
  });
  const { categories: activeCategories } = useActiveCategories();

  // Fetch tất cả brands active cho dropdown
  const { brands } = useBrands({ forceActive: true });

  const productTypeOptions = useMemo(() => {
    const set = new Set<string>();
    products?.forEach((item) => {
      const value = item.product?.product_type;
      if (value) set.add(value);
    });
    return Array.from(set);
  }, [products]);

  const categoryNameOptions = useMemo(() => {
    return Array.from(
      new Set(activeCategories.map((category) => category.name).filter(Boolean)),
    );
  }, [activeCategories]);

  /**
   * Local search state + Debounce pattern:
   *
   * FLOW:
   * 1. User gõ chữ → `searchInput` update ngay lập tức (controlled input)
   * 2. `useDebounce` chờ 500ms sau lần gõ cuối → tạo `debouncedSearch`
   * 3. `useEffect` bắt thay đổi của `debouncedSearch` → update URL
   * 4. URL update → trigger `useProducts()` hook → gọi API
   */
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || "",
  );
  const debouncedSearch = useDebounce(searchInput, 500);

  /**
   * useCallback - Memoize function để giữ reference ổn định.
   */
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

  /**
   * Sync debounced search → URL params.
   */
  useEffect(() => {
    if (debouncedSearch !== searchParams.get("search")) {
      updateSearchParam(debouncedSearch);
    }
  }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Filter handlers - Update URL params cho các filter.
   */
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

  /**
   * Clear all filters - Reset về trạng thái ban đầu.
   */
  const clearFilters = () => {
    const params = new URLSearchParams();
    setSearchParams(params);
    setSearchInput("");
  };

  /**
   * Pagination handler - Chỉ update param "page", giữ nguyên filters.
   */
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    setSearchParams(params);
  };

  /**
   * Check có filter nào đang active không?
   */
  const hasActiveFilters =
    !!searchParams.get("product_type") ||
    !!searchParams.get("brand_name") ||
    !!searchParams.get("category_name") ||
    !!searchParams.get("min_price") ||
    !!searchParams.get("max_price") ||
    !!searchParams.get("search");

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 space-y-2">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-primary/25 via-primary/10 to-transparent p-2.5 ring-1 ring-primary/20 shadow-sm">
            <Glasses className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Eyewear Collection
            </h1>
            <p className="mt-0.5 text-muted-foreground">
              Discover premium eyewear products
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="mb-8 space-y-4">
        {/* Search bar */}
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search products by name, code, brand..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10 h-11"
          />
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
            <Filter className="h-4 w-4" />
            Filters:
          </div>

          <select
            value={searchParams.get("product_type") || ""}
            onChange={(e) =>
              handleFilterChange("product_type", e.target.value || undefined)
            }
            className="h-9 w-44 rounded-lg border border-input bg-background px-3 text-sm ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Product type</option>
            {productTypeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            value={searchParams.get("brand_name") || ""}
            onChange={(e) =>
              handleFilterChange("brand_name", e.target.value || undefined)
            }
            className="h-9 w-44 rounded-lg border border-input bg-background px-3 text-sm ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Brand</option>
            {brands?.map((brand) => (
              <option key={brand.id} value={brand.name}>
                {brand.name}
              </option>
            ))}
          </select>

          <select
            value={searchParams.get("category_name") || ""}
            onChange={(e) =>
              handleFilterChange("category_name", e.target.value || undefined)
            }
            className="h-9 w-44 rounded-lg border border-input bg-background px-3 text-sm ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Category</option>
            {categoryNameOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <Input
            type="number"
            min={0}
            value={searchParams.get("min_price") || ""}
            onChange={(e) =>
              handleFilterChange("min_price", e.target.value || undefined)
            }
            placeholder="Min price"
            className="h-9 w-32"
          />

          <Input
            type="number"
            min={0}
            value={searchParams.get("max_price") || ""}
            onChange={(e) =>
              handleFilterChange("max_price", e.target.value || undefined)
            }
            placeholder="Max price"
            className="h-9 w-32"
          />

          {/* Clear filters */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="rounded-lg"
            >
              <X className="mr-1.5 h-3.5 w-3.5" />
              Clear filters
            </Button>
          )}

          {/* Result count */}
          {pagination && (
            <Badge
              variant="secondary"
              className="ml-auto rounded-full px-3 py-1 text-xs font-medium"
            >
              {pagination.totalItems} products
            </Badge>
          )}
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <LoadingSpinner className="py-20" size="lg" />
      ) : !products?.length ? (
        <EmptyState
          title="No products found"
          description="Try changing your search keyword or filters to see more products."
        />
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && (
            <Pagination
              meta={pagination}
              onPageChange={handlePageChange}
              className="mt-10"
            />
          )}
        </>
      )}
    </div>
  );
}
