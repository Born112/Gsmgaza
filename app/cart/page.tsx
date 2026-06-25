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
        <div className="w-24 h-24 bg-[#1E293B] border border-white/10 rounded-2xl flex items-center justify-center mb-6">
          <ShoppingCart className="w-10 h-10 text-slate-600" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-white mb-2">{t("cartEmpty")}</h1>
        <p className="text-slate-400 mb-8 max-w-sm">{t("cartEmptyMsg")}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/parts"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl transition-colors cursor-pointer">
            <Package className="w-4 h-4" />
            {t("parts")}
          </Link>
          <Link href="/smartphones"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl border border-white/10 transition-colors cursor-pointer">
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
          <h1 className="font-heading text-3xl font-bold text-white">{t("cartTitle")}</h1>
          <p className="text-slate-400 mt-1">{totalCount} {t("products")}</p>
        </div>
        <button onClick={clearCart}
          className="text-sm text-slate-500 hover:text-[#EF4444] transition-colors cursor-pointer flex items-center gap-1.5">
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
                className="flex gap-4 bg-[#1E293B] border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors">
                <Link href={href}
                  className="w-20 h-20 shrink-0 bg-[#334155] rounded-xl flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
                  {product.category === "smartphone"
                    ? <Smartphone className="w-8 h-8 text-slate-500" />
                    : <Package className="w-8 h-8 text-slate-500" />}
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-[#3B82F6] font-semibold">{product.brand}</span>
                      <Link href={href}
                        className="block text-sm font-medium text-slate-200 hover:text-white transition-colors mt-0.5 cursor-pointer line-clamp-2">
                        {product.name}
                      </Link>
                      <p className="text-[11px] text-slate-600 font-mono mt-0.5">{product.sku}</p>
                    </div>
                    <button onClick={() => removeItem(product.id)}
                      className="text-slate-600 hover:text-[#EF4444] transition-colors cursor-pointer shrink-0 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1 bg-[#0F172A] rounded-lg border border-white/10">
                      <button onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-white">{quantity}</span>
                      <button onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="font-heading font-bold text-white text-base">
                      {formatPrice(product.price * quantity)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-[#1E293B] border border-white/10 rounded-xl p-5 sticky top-24">
            <h2 className="font-heading font-semibold text-white text-lg mb-4">{t("total")}</h2>
            <div className="space-y-2.5 mb-5">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-sm">
                  <span className="text-slate-400 truncate mr-3 max-w-[160px]">{product.name}</span>
                  <span className="text-slate-300 shrink-0">
                    {quantity > 1 && <span className="text-slate-600 mr-1">×{quantity}</span>}
                    {formatPrice(product.price * quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-4 mb-5">
              <div className="flex justify-between items-baseline">
                <span className="text-slate-400">{t("total")}</span>
                <span className="font-heading font-bold text-xl text-white">{formatPrice(totalPrice)}</span>
              </div>
            </div>
            <button className="w-full h-12 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#2563EB]/20">
              {t("checkout")}
            </button>
            <Link href="/parts"
              className="flex items-center justify-center gap-2 mt-3 text-sm text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">
              <ArrowLeft className="w-3.5 h-3.5" />
              {t("continueShopping")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
