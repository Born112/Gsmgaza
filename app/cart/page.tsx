"use client";

import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft, Package, Smartphone } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { useLang } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalCount, totalPrice } = useCart();
  const { t } = useLang();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-[var(--ui-surface)] border border-[var(--ui-border)] rounded-2xl flex items-center justify-center mb-6">
          <ShoppingCart className="w-10 h-10 text-[var(--ui-text-5)]" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-[var(--ui-text)] mb-2">{t("cartEmpty")}</h1>
        <p className="text-[var(--ui-text-3)] mb-8 max-w-sm">{t("cartEmptyMsg")}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/parts"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold rounded-xl transition-colors cursor-pointer">
            <Package className="w-4 h-4" />
            {t("parts")}
          </Link>
          <Link href="/smartphones"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--ui-hover-2)] hover:bg-[var(--ui-hover-2)] text-[var(--ui-text)] font-semibold rounded-xl border border-[var(--ui-border)] transition-colors cursor-pointer">
            <Smartphone className="w-4 h-4" />
            {t("smartphones")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-[var(--ui-text)]">{t("cartTitle")}</h1>
          <p className="text-[var(--ui-text-3)] mt-1">{totalCount} {t("products")}</p>
        </div>
        <button onClick={clearCart}
          className="text-sm text-[var(--ui-text-4)] hover:text-[#EF4444] transition-colors cursor-pointer flex items-center gap-1.5">
          <Trash2 className="w-4 h-4" />
          {t("clear")}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {items.map(({ product, quantity }) => {
            const href = product.category === "part" ? `/parts/${product.id}` : `/smartphones/${product.id}`;
            return (
              <div key={product.id}
                className="flex gap-4 bg-[var(--ui-surface)] border border-[var(--ui-border)] rounded-xl p-4 hover:border-[var(--ui-border-2)] transition-colors">
                <Link href={href}
                  className="w-20 h-20 shrink-0 bg-[var(--ui-surface-2)] rounded-xl flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
                  {product.category === "smartphone"
                    ? <Smartphone className="w-8 h-8 text-[var(--ui-text-4)]" />
                    : <Package className="w-8 h-8 text-[var(--ui-text-4)]" />}
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-[#EF4444] font-semibold">{product.brand}</span>
                      <Link href={href}
                        className="block text-sm font-medium text-[var(--ui-text)] hover:text-[var(--ui-text)] transition-colors mt-0.5 cursor-pointer line-clamp-2">
                        {product.name}
                      </Link>
                      <p className="text-[11px] text-[var(--ui-text-5)] font-mono mt-0.5">{product.sku}</p>
                    </div>
                    <button onClick={() => removeItem(product.id)}
                      className="text-[var(--ui-text-5)] hover:text-[#EF4444] transition-colors cursor-pointer shrink-0 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1 bg-[var(--ui-bg)] rounded-lg border border-[var(--ui-border)]">
                      <button onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-[var(--ui-text-3)] hover:text-[var(--ui-text)] transition-colors cursor-pointer">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-[var(--ui-text)]">{quantity}</span>
                      <button onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-[var(--ui-text-3)] hover:text-[var(--ui-text)] transition-colors cursor-pointer">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="font-heading font-bold text-[var(--ui-text)] text-base">
                      {formatPrice(product.price * quantity)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-[var(--ui-surface)] border border-[var(--ui-border)] rounded-xl p-5 sticky top-24">
            <h2 className="font-heading font-semibold text-[var(--ui-text)] text-lg mb-4">{t("total")}</h2>
            <div className="space-y-2.5 mb-5">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-sm">
                  <span className="text-[var(--ui-text-3)] truncate mr-3 max-w-[160px]">{product.name}</span>
                  <span className="text-[var(--ui-text-2)] shrink-0">
                    {quantity > 1 && <span className="text-[var(--ui-text-5)] mr-1">×{quantity}</span>}
                    {formatPrice(product.price * quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-[var(--ui-border)] pt-4 mb-5">
              <div className="flex justify-between items-baseline">
                <span className="text-[var(--ui-text-3)]">{t("total")}</span>
                <span className="font-heading font-bold text-xl text-[var(--ui-text)]">{formatPrice(totalPrice)}</span>
              </div>
            </div>
            <button className="w-full h-12 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#DC2626]/20">
              {t("checkout")}
            </button>
            <Link href="/parts"
              className="flex items-center justify-center gap-2 mt-3 text-sm text-[var(--ui-text-4)] hover:text-[var(--ui-text-2)] transition-colors cursor-pointer">
              <ArrowLeft className="w-3.5 h-3.5" />
              {t("continueShopping")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
