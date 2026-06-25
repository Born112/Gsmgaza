"use client";

import { useState } from "react";
import { ShoppingCart, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-store";
import { useLang } from "@/lib/i18n";
import type { Product } from "@/lib/data";

interface Props {
  product: Product;
  disabled?: boolean;
}

export function AddToCartButton({ product, disabled }: Props) {
  const { addItem } = useCart();
  const { t } = useLang();
  const [added, setAdded] = useState(false);

  const handle = () => {
    if (disabled) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handle}
      disabled={disabled}
      className={cn(
        "w-full h-12 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer",
        added
          ? "bg-[#22C55E] hover:bg-[#16A34A] text-white"
          : disabled
          ? "bg-[var(--ui-hover-2)] text-[var(--ui-text-5)] cursor-not-allowed"
          : "bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-lg shadow-[#DC2626]/20 hover:shadow-[#DC2626]/30"
      )}
    >
      {added ? (
        <><CheckCircle2 className="w-5 h-5" />{t("added")}</>
      ) : (
        <><ShoppingCart className="w-5 h-5" />{disabled ? t("outOfStock") : t("addToCart")}</>
      )}
    </button>
  );
}
