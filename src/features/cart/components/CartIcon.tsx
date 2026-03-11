import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { useCart } from "../hooks/useCart";

export function CartIcon() {
  const { totalItems, isLoading } = useCart();

  return (
    <Button variant="ghost" size="icon" className="relative" asChild>
      <Link to="/cart">
        <ShoppingCart className="h-5 w-5" />
        {!isLoading && totalItems > 0 && (
          <Badge
            variant="destructive"
            className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
          >
            {totalItems > 99 ? "99+" : totalItems}
          </Badge>
        )}
        <span className="sr-only">Giỏ hàng</span>
      </Link>
    </Button>
  );
}
