"use client";

import Link from "next/link";
import { BRANDS } from "@/lib/data";
import { useLang } from "@/lib/i18n";

const BRAND_SVG_PATHS: Record<string, string> = {
  apple: "M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z",
  samsung: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z",
  xiaomi: "M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z",
  huawei: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  realme: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z",
  oppo: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z",
};

export function BrandGrid() {
  const { t } = useLang();

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-[#3B82F6] text-sm font-medium uppercase tracking-widest mb-2">{t("popularBrands")}</p>
          <h2 className="font-heading text-3xl font-bold text-white">{t("fastBrandChoice")}</h2>
        </div>
        <Link
          href="/parts"
          className="text-sm text-slate-400 hover:text-[#3B82F6] transition-colors duration-150 cursor-pointer hidden sm:block"
        >
          {t("allGoods")}
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {BRANDS.map(brand => (
          <Link
            key={brand.id}
            href={`/parts?brand=${brand.id}`}
            className="group flex flex-col items-center justify-center gap-3 p-5 bg-[#1E293B] border border-white/10 rounded-xl hover:border-[#2563EB]/50 hover:bg-[#1E293B] transition-all duration-200 cursor-pointer"
          >
            <div className="w-12 h-12 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-8 h-8 fill-slate-400 group-hover:fill-white transition-colors duration-200"
                aria-hidden="true"
              >
                <path d={BRAND_SVG_PATHS[brand.id] ?? BRAND_SVG_PATHS.samsung} />
              </svg>
            </div>
            <span className="text-sm font-medium text-slate-400 group-hover:text-white transition-colors duration-200">
              {brand.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
