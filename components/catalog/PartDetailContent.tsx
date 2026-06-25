"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle, Package, Shield, Truck } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/catalog/AddToCartButton";
import type { Product } from "@/lib/data";

export function PartDetailContent({ product }: { product: Product }) {
  const { t } = useLang();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-slate-300 transition-colors cursor-pointer">GSMBaza</Link>
        <span>/</span>
        <Link href="/parts" className="hover:text-slate-300 transition-colors cursor-pointer">{t("parts")}</Link>
        <span>/</span>
        <span className="text-slate-400 truncate max-w-[220px]">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10">
        <div>
          <div className="aspect-square bg-[#141414] border border-white/10 rounded-2xl flex items-center justify-center overflow-hidden">
            <div className="flex flex-col items-center gap-3 text-slate-600">
              <div className="w-24 h-24 bg-[#DC2626]/10 rounded-2xl flex items-center justify-center">
                <Package className="w-12 h-12 text-[#1C1C1C]" />
              </div>
              <span className="text-xs">{product.sku}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 bg-[#DC2626]/15 border border-[#DC2626]/30 rounded-full text-xs font-semibold text-[#EF4444]">
              {product.brand}
            </span>
            <span className="text-xs text-slate-600 font-mono">{product.sku}</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white leading-tight mb-2">
            {product.name}
          </h1>

          <p className="text-sm text-slate-400 mb-5">
            {t("compatibleWith")} <span className="text-slate-200 font-medium">{product.model}</span>
          </p>

          <div className="flex items-end gap-4 mb-5">
            <span className="font-heading text-4xl font-bold text-white">{formatPrice(product.price)}</span>
          </div>

          <div className="flex items-center gap-2 mb-6">
            {product.inStock ? (
              <><CheckCircle2 className="w-4 h-4 text-[#22C55E]" /><span className="text-sm text-[#22C55E] font-medium">{t("inStockReady")}</span></>
            ) : (
              <><XCircle className="w-4 h-4 text-[#EF4444]" /><span className="text-sm text-[#EF4444] font-medium">{t("outOfStock")}</span></>
            )}
          </div>

          <AddToCartButton product={product} disabled={!product.inStock} />

          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { icon: Shield,  text: t("warranty6m") },
              { icon: Truck,   text: t("delivery") },
              { icon: Package, text: t("packaging") },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex flex-col items-center gap-1.5 p-3 bg-white/5 border border-white/10 rounded-xl text-center">
                <Icon className="w-4 h-4 text-[#EF4444]" />
                <span className="text-[11px] text-slate-400 whitespace-pre-line leading-snug">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-12">
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-6">
          <h2 className="font-heading font-semibold text-white text-lg mb-3">{t("description")}</h2>
          <p className="text-sm text-slate-400 leading-relaxed">{product.description}</p>
        </div>
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-6">
          <h2 className="font-heading font-semibold text-white text-lg mb-4">{t("specs")}</h2>
          <dl className="space-y-2.5">
            {Object.entries(product.specs).map(([key, value]) => (
              <div key={key} className="flex items-start justify-between gap-4 text-sm">
                <dt className="text-slate-500 shrink-0">{key}</dt>
                <dd className="text-slate-200 text-right">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mt-10">
        <Link href="/parts" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
          {t("backToParts")}
        </Link>
      </div>
    </div>
  );
}
