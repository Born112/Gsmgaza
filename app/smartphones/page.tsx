"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { SlidersHorizontal, X, ArrowUpDown, Smartphone, CheckCircle2, XCircle, Star, RotateCcw, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SMARTPHONES, BRANDS, type Product } from "@/lib/data";
import { cn, formatPrice, matchesSearch } from "@/lib/utils";
import { PriceRangeFilter } from "@/components/catalog/PriceRangeFilter";
import { useLang } from "@/lib/i18n";

type Condition = "all" | "new" | "used";
type SortKey = "default" | "price_asc" | "price_desc" | "popular";

const PRICE_MIN = 0;
const PRICE_MAX = 25_000_000;

function SmartphonesContent() {
  const sp = useSearchParams();
  const { t } = useLang();

  const initCondition = (): Condition => {
    const c = sp.get("condition");
    if (c === "new" || c === "used") return c;
    return "all";
  };

  const [condition, setCondition] = useState<Condition>(initCondition);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(() => {
    const b = sp.get("brand"); return b ? [b.toLowerCase()] : [];
  });
  const [priceRange, setPriceRange] = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);
  const [sort, setSort] = useState<SortKey>("default");
  const [searchQ, setSearchQ] = useState(sp.get("q") ?? "");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openPrice, setOpenPrice] = useState(true);

  // Sync filters when URL params change (e.g. clicking header dropdown links)
  useEffect(() => {
    const c = sp.get("condition");
    setCondition(c === "new" || c === "used" ? c : "all");
    const b = sp.get("brand");
    setSelectedBrands(b ? [b.toLowerCase()] : []);
    setSearchQ(sp.get("q") ?? "");
  }, [sp]);

  const toggleBrand = (id: string) =>
    setSelectedBrands(p => p.includes(id) ? p.filter(b => b !== id) : [...p, id]);
  const clearAll = () => { setSelectedBrands([]); setPriceRange([PRICE_MIN, PRICE_MAX]); setCondition("all"); setSearchQ(""); };

  const filtered = useMemo(() => {
    let items = SMARTPHONES.filter(p => {
      if (condition !== "all" && p.condition !== condition) return false;
      if (selectedBrands.length && !selectedBrands.includes(p.brand.toLowerCase())) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      if (!matchesSearch(searchQ, p.name, p.brand, p.model, p.sku)) return false;
      return true;
    });
    if (sort === "price_asc")  items = [...items].sort((a, b) => a.price - b.price);
    if (sort === "price_desc") items = [...items].sort((a, b) => b.price - a.price);
    if (sort === "popular")    items = [...items].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    return items;
  }, [condition, selectedBrands, priceRange, sort, searchQ]);

  const activeBrandTags = selectedBrands.map(b => ({
    id: b, label: BRANDS.find(x => x.id === b)?.name ?? b,
  }));

  const filtersJSX = (
    <div className="space-y-2">
      <Accordion multiple className="space-y-2">
        <AccordionItem value="brands" className="border-white/10 bg-[#141414] rounded-xl px-4">
          <AccordionTrigger className="text-sm font-semibold text-white hover:no-underline py-4">{t("brands")}</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pb-4">
              {BRANDS.map(b => (
                <label key={b.id} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleBrand(b.id)}>
                  <div className={cn("w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all",
                    selectedBrands.includes(b.id) ? "bg-[#DC2626] border-[#DC2626]" : "border-white/20 group-hover:border-white/40")}>
                    {selectedBrands.includes(b.id) && <div className="w-2 h-2 bg-white rounded-sm" />}
                  </div>
                  <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">{b.name}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="bg-[#141414] rounded-xl px-4">
        <button type="button" onClick={() => setOpenPrice(p => !p)}
          className="w-full flex items-center justify-between py-4 text-sm font-semibold text-white cursor-pointer">
          {t("price")}
          <ChevronDown className={cn("w-4 h-4 text-slate-500 transition-transform duration-200", openPrice && "rotate-180")} />
        </button>
        {openPrice && (
          <PriceRangeFilter min={PRICE_MIN} max={PRICE_MAX} value={priceRange} onChange={setPriceRange} />
        )}
      </div>

      {(activeBrandTags.length > 0 || condition !== "all") && (
        <button onClick={clearAll} className="w-full mt-1 py-2 text-sm text-[#EF4444] hover:text-[#F87171] transition-colors cursor-pointer">
          {t("resetAll")}
        </button>
      )}
    </div>
  );

  const conditionTabs: { id: Condition; labelKey: "all"|"newCond"|"usedCond"; icon: typeof Star }[] = [
    { id: "all",  labelKey: "all",     icon: Smartphone },
    { id: "new",  labelKey: "newCond", icon: Star },
    { id: "used", labelKey: "usedCond",icon: RotateCcw },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <div>
          <p className="text-[#EF4444] text-sm font-medium uppercase tracking-widest mb-1">{t("catalog")}</p>
          <h1 className="font-heading text-3xl font-bold text-white">{t("phonesTitle")}</h1>
          <p className="text-slate-400 mt-1">{t("found")} {filtered.length} {t("products")}</p>
        </div>
        <Link href="/parts"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-300 hover:border-[#DC2626]/50 hover:text-[#EF4444] transition-all cursor-pointer">
          {t("parts")} →
        </Link>
      </div>

      {/* Condition tabs */}
      <div className="flex items-center gap-2 mb-7 p-1 bg-[#141414] border border-white/10 rounded-xl w-fit">
        {conditionTabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setCondition(tab.id)}
              className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer",
                condition === tab.id
                  ? "bg-[#DC2626] text-white shadow-lg shadow-[#DC2626]/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5")}>
              <Icon className="w-4 h-4" />
              {t(tab.labelKey)}
              <span className={cn("text-xs px-1.5 py-0.5 rounded-full",
                condition === tab.id ? "bg-white/20 text-white" : "bg-white/10 text-slate-500")}>
                {SMARTPHONES.filter(p => tab.id === "all" || p.condition === tab.id).length}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex gap-6">
        <aside className="hidden lg:block w-64 shrink-0">{filtersJSX}</aside>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <Button variant="outline" size="sm" onClick={() => setMobileOpen(true)}
              className="lg:hidden border-white/20 text-slate-300 hover:bg-white/10 cursor-pointer">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              {t("filters")} {activeBrandTags.length > 0 && (
                <span className="ml-1 bg-[#DC2626] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {activeBrandTags.length}
                </span>
              )}
            </Button>

            {activeBrandTags.map(tag => (
              <span key={tag.id} className="flex items-center gap-1.5 px-3 py-1 bg-[#DC2626]/15 border border-[#DC2626]/30 rounded-full text-xs text-[#EF4444]">
                {tag.label}
                <button onClick={() => toggleBrand(tag.id)} className="cursor-pointer hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            <div className="ml-auto">
              <Select value={sort} onValueChange={(v: string | null) => setSort((v ?? "default") as SortKey)}>
                <SelectTrigger className="w-52 bg-[#141414] border-white/10 text-slate-300 h-9 text-sm cursor-pointer">
                  <ArrowUpDown className="w-3.5 h-3.5 mr-2 text-slate-500" />
                  <span>{{ default: t("sortDefault"), price_asc: t("sortPriceAsc"), price_desc: t("sortPriceDes"), popular: t("sortPopular") }[sort]}</span>
                </SelectTrigger>
                <SelectContent className="bg-[#141414] border-white/10">
                  <SelectItem value="default"    className="text-slate-300 cursor-pointer">{t("sortDefault")}</SelectItem>
                  <SelectItem value="price_asc"  className="text-slate-300 cursor-pointer">{t("sortPriceAsc")}</SelectItem>
                  <SelectItem value="price_desc" className="text-slate-300 cursor-pointer">{t("sortPriceDes")}</SelectItem>
                  <SelectItem value="popular"    className="text-slate-300 cursor-pointer">{t("sortPopular")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <XCircle className="w-12 h-12 text-slate-600 mb-4" />
              <p className="text-slate-400 font-medium">{t("noProducts")}</p>
              <button onClick={clearAll} className="mt-4 text-[#EF4444] text-sm hover:underline cursor-pointer">{t("resetFilters")}</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(p => <SmartphoneCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-[#0A0A0A] border-l border-white/10 overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading font-semibold text-white">{t("filters")}</h2>
              <button onClick={() => setMobileOpen(false)} className="text-slate-400 hover:text-white cursor-pointer p-1"><X className="w-5 h-5" /></button>
            </div>
            {filtersJSX}
            <Button onClick={() => setMobileOpen(false)} className="w-full mt-4 bg-[#DC2626] hover:bg-[#B91C1C] cursor-pointer text-white">
              {t("applyFilters")} ({filtered.length})
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function SmartphoneCard({ product }: { product: Product }) {
  const { t } = useLang();
  const isUsed = product.condition === "used";
  return (
    <Link href={`/smartphones/${product.id}`}
      className="group bg-[#141414] border border-white/10 rounded-xl overflow-hidden hover:border-[#DC2626]/40 transition-all duration-200 flex flex-col cursor-pointer">
      <div className="relative h-52 bg-[#1C1C1C] flex items-center justify-center overflow-hidden">
        <div className="w-16 h-24 bg-[#DC2626]/10 rounded-2xl border-2 border-[#DC2626]/20 flex items-center justify-center">
          <Smartphone className="w-8 h-8 text-[#1C1C1C]" />
        </div>
        <span className={cn("absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-bold",
          isUsed ? "bg-[#F59E0B] text-black" : "bg-[#22C55E] text-black")}>
          {isUsed ? t("usedBadge") : t("newBadge")}
        </span>
        {product.popular && (
          <span className="absolute top-3 right-3 px-2 py-0.5 bg-[#DC2626] text-white text-xs font-semibold rounded-full">{t("sortPopular")}</span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] px-2 py-0.5 bg-[#DC2626]/10 text-[#EF4444] rounded-full font-semibold">{product.brand}</span>
          <span className="text-[10px] text-slate-600 font-mono ml-auto">{product.sku}</span>
        </div>
        <h3 className="text-sm font-medium text-slate-200 leading-snug mb-1 line-clamp-2 group-hover:text-white transition-colors">
          {product.name}
        </h3>
        {isUsed && product.visualCondition && (
          <p className="text-xs text-[#F59E0B] mb-2 line-clamp-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#F59E0B] rounded-full inline-block shrink-0" />
            {product.visualCondition.slice(0, 40)}…
          </p>
        )}
        <div className="flex items-center gap-1.5 mb-4 mt-auto pt-2">
          {product.inStock
            ? <><CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" /><span className="text-xs text-[#22C55E]">{t("inStock")}</span></>
            : <><XCircle className="w-3.5 h-3.5 text-[#EF4444]" /><span className="text-xs text-[#EF4444]">{t("outOfStock")}</span></>}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold font-heading text-white">{formatPrice(product.price)}</span>
          <span className="text-xs text-[#EF4444] group-hover:text-[#F87171] transition-colors">{t("more")}</span>
        </div>
      </div>
    </Link>
  );
}

export default function SmartphonesPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 pt-24 pb-16 text-slate-400">Загрузка…</div>}>
      <SmartphonesContent />
    </Suspense>
  );
}
