import { ShoppingCart } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useAddToCart } from "../hooks/useCart";
import { useState } from "react";
import type { AddToCartButtonProps } from "../types";


export function AddToCartButton({
  variantId,
  size = "default",
  className,
}: AddToCartButtonProps) {
  const [quantity] = useState(1);
  const addToCartMutation = useAddToCart();

  const handleAddToCart = () => {
    addToCartMutation.mutate({
      variant_id: variantId,
      quantity,
    });
  };

  return (
    <Button
      size={size}
      onClick={handleAddToCart}
      disabled={addToCartMutation.isPending}
      className={className}
    >
      <ShoppingCart className="mr-2 h-4 w-4" />
      {addToCartMutation.isPending ? "Đang thêm..." : "Thêm vào giỏ"}
    </Button>
  );
}
