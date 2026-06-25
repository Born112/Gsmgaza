"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle, Smartphone, Shield, Truck, Info, Battery } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/catalog/AddToCartButton";
import type { Product } from "@/lib/data";

export function SmartphoneDetailContent({ product }: { product: Product }) {
  const { t } = useLang();
  const isUsed = product.condition === "used";

  const gradeLabel = (visualCondition?: string): string => {
    if (!visualCondition) return "";
    if (visualCondition.includes("Grade A")) return t("gradeExcellent");
    if (visualCondition.includes("Grade B")) return t("gradeGood");
    if (visualCondition.includes("Grade C")) return t("gradeFair");
    return "";
  };

  const gradeColor = (visualCondition?: string) => {
    if (!visualCondition) return "";
    if (visualCondition.includes("Grade A")) return "text-[#22C55E] bg-[#22C55E]/10";
    if (visualCondition.includes("Grade B")) return "text-[#EF4444] bg-[#EF4444]/10";
    if (visualCondition.includes("Grade C")) return "text-[#F59E0B] bg-[#F59E0B]/10";
    return "";
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <nav className="flex items-center gap-2 text-sm text-[var(--ui-text-4)] mb-6">
        <Link href="/" className="hover:text-[var(--ui-text-2)] transition-colors cursor-pointer">GSMBaza</Link>
        <span>/</span>
        <Link href="/smartphones" className="hover:text-[var(--ui-text-2)] transition-colors cursor-pointer">{t("smartphones")}</Link>
        {isUsed && (
          <><span>/</span>
          <Link href="/smartphones?condition=used" className="hover:text-[var(--ui-text-2)] transition-colors cursor-pointer">{t("usedBadge")}</Link></>
        )}
        <span>/</span>
        <span className="text-[var(--ui-text-3)] truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10">
        <div>
          <div className="aspect-[3/4] max-h-[520px] bg-[var(--ui-surface)] border border-[var(--ui-border)] rounded-2xl flex items-center justify-center overflow-hidden relative">
            <div className="flex flex-col items-center gap-3 text-[var(--ui-text-5)]">
              <div className="w-20 h-32 bg-[#DC2626]/10 rounded-2xl border-2 border-[#DC2626]/20 flex items-center justify-center">
                <Smartphone className="w-10 h-10 text-[var(--ui-text-5)]" />
              </div>
              <span className="text-xs">{product.sku}</span>
            </div>
            <div className={cn(
              "absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold",
              isUsed ? "bg-[#F59E0B] text-black" : "bg-[#22C55E] text-black"
            )}>
              {isUsed ? t("usedBadge") : t("newBadge")}
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 bg-[#DC2626]/15 border border-[#DC2626]/30 rounded-full text-xs font-semibold text-[#EF4444]">
              {product.brand}
            </span>
            {isUsed && product.visualCondition && (
              <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold", gradeColor(product.visualCondition))}>
                {gradeLabel(product.visualCondition)}
              </span>
            )}
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[var(--ui-text)] leading-tight mb-4">
            {product.name}
          </h1>

          <div className="flex items-end gap-3 mb-5">
            <span className="font-heading text-4xl font-bold text-[var(--ui-text)]">{formatPrice(product.price)}</span>
          </div>

          <div className="flex items-center gap-2 mb-5">
            {product.inStock ? (
              <><CheckCircle2 className="w-4 h-4 text-[#22C55E]" /><span className="text-sm text-[#22C55E] font-medium">{t("inStock")}</span></>
            ) : (
              <><XCircle className="w-4 h-4 text-[#EF4444]" /><span className="text-sm text-[#EF4444] font-medium">{t("outOfStock")}</span></>
            )}
          </div>

          {isUsed && product.visualCondition && (
            <div className="mb-5 p-4 bg-[#F59E0B]/8 border border-[#F59E0B]/25 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-[#F59E0B]" />
                <span className="text-sm font-semibold text-[#F59E0B]">{t("condition")}</span>
              </div>
              <p className="text-sm text-[var(--ui-text-2)] leading-relaxed">{product.visualCondition}</p>
            </div>
          )}

          <AddToCartButton product={product} disabled={!product.inStock} />

          {isUsed && (
            <div className="mt-4 p-3 bg-[var(--ui-hover)] border border-[var(--ui-border)] rounded-xl">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
                <p className="text-xs text-[var(--ui-text-3)]">{t("usedDiagnostic")}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              { icon: Shield,  text: isUsed ? t("warranty30") : t("warrantyYear") },
              { icon: Truck,   text: t("delivery") },
              { icon: Battery, text: isUsed ? t("batteryUsed") : t("batteryNew") },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex flex-col items-center gap-1.5 p-3 bg-[var(--ui-hover)] border border-[var(--ui-border)] rounded-xl text-center">
                <Icon className="w-4 h-4 text-[#EF4444]" />
                <span className="text-[11px] text-[var(--ui-text-3)] whitespace-pre-line leading-snug">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-12">
        <div className="bg-[var(--ui-surface)] border border-[var(--ui-border)] rounded-2xl p-6">
          <h2 className="font-heading font-semibold text-[var(--ui-text)] text-lg mb-3">{t("description")}</h2>
          <p className="text-sm text-[var(--ui-text-3)] leading-relaxed">{product.description}</p>
        </div>
        <div className="bg-[var(--ui-surface)] border border-[var(--ui-border)] rounded-2xl p-6">
          <h2 className="font-heading font-semibold text-[var(--ui-text)] text-lg mb-4">{t("specs")}</h2>
          <dl className="space-y-2.5">
            {Object.entries(product.specs).map(([key, value]) => (
              <div key={key} className="flex items-start justify-between gap-4 text-sm">
                <dt className="text-[var(--ui-text-4)] shrink-0">{key}</dt>
                <dd className="text-[var(--ui-text)] text-right">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mt-10">
        <Link href="/smartphones" className="inline-flex items-center gap-2 text-sm text-[var(--ui-text-4)] hover:text-[var(--ui-text-2)] transition-colors cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
          {t("backToPhones")}
        </Link>
      </div>
    </div>
  );
}
