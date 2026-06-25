"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { SlidersHorizontal, X, ArrowUpDown, ShoppingCart, CheckCircle2, XCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PARTS, BRANDS, PART_CATEGORIES, type Product } from "@/lib/data";
import { cn, formatPrice, matchesSearch } from "@/lib/utils";
import { PriceRangeFilter } from "@/components/catalog/PriceRangeFilter";
import { useLang } from "@/lib/i18n";

type SortKey = "default" | "price_asc" | "price_desc" | "popular";
const PRICE_MIN = 0;
const PRICE_MAX = 2_000_000;

function PartsContent() {
  const sp = useSearchParams();
  const { t } = useLang();

  const [selectedBrands, setSelectedBrands] = useState<string[]>(() => {
    const b = sp.get("brand"); return b ? [b.toLowerCase()] : [];
  });
  const [selectedCats, setSelectedCats] = useState<string[]>(() => {
    const c = sp.get("subCategory"); return c ? [c] : [];
  });
  const [priceRange, setPriceRange] = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);
  const [sort, setSort] = useState<SortKey>("default");
  const [searchQ, setSearchQ] = useState(sp.get("q") ?? "");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openPrice, setOpenPrice] = useState(true);

  // Sync filters when URL params change (e.g. clicking header dropdown links)
  useEffect(() => {
    const b = sp.get("brand");
    setSelectedBrands(b ? [b.toLowerCase()] : []);
    const c = sp.get("subCategory");
    setSelectedCats(c ? [c] : []);
    const q = sp.get("q");
    setSearchQ(q ?? "");
  }, [sp]);

  const toggleBrand = (id: string) =>
    setSelectedBrands(p => p.includes(id) ? p.filter(b => b !== id) : [...p, id]);
  const toggleCat = (id: string) =>
    setSelectedCats(p => p.includes(id) ? p.filter(c => c !== id) : [...p, id]);
  const clearAll = () => { setSelectedBrands([]); setSelectedCats([]); setPriceRange([PRICE_MIN, PRICE_MAX]); setSearchQ(""); };

  const filtered = useMemo(() => {
    let items = PARTS.filter(p => {
      if (selectedBrands.length && !selectedBrands.includes(p.brand.toLowerCase())) return false;
      if (selectedCats.length && !selectedCats.includes(p.subCategory ?? "")) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      if (!matchesSearch(searchQ, p.name, p.brand, p.model, p.sku)) return false;
      return true;
    });
    if (sort === "price_asc")  items = [...items].sort((a, b) => a.price - b.price);
    if (sort === "price_desc") items = [...items].sort((a, b) => b.price - a.price);
    if (sort === "popular")    items = [...items].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    return items;
  }, [selectedBrands, selectedCats, priceRange, sort, searchQ]);

  const activeTags = [
    ...selectedBrands.map(b => ({ type: "brand", id: b, label: BRANDS.find(x => x.id === b)?.name ?? b })),
    ...selectedCats.map(c => ({ type: "cat",   id: c, label: t((c as Parameters<typeof t>[0])) || (PART_CATEGORIES.find(x => x.id === c)?.name ?? c) })),
  ];

  const filtersJSX = (
    <div className="space-y-2">
      <Accordion multiple className="space-y-2">
        <AccordionItem value="brands" className="border-[var(--ui-border)] bg-[var(--ui-surface)] rounded-xl px-4">
          <AccordionTrigger className="text-sm font-semibold text-[var(--ui-text)] hover:no-underline py-4">{t("brands")}</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pb-4">
              {BRANDS.map(b => (
                <label key={b.id} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleBrand(b.id)}>
                  <div className={cn("w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all",
                    selectedBrands.includes(b.id) ? "bg-[#DC2626] border-[#DC2626]" : "border-[var(--ui-border-2)] group-hover:border-[var(--ui-border-2)]")}>
                    {selectedBrands.includes(b.id) && <div className="w-2 h-2 bg-white rounded-sm" />}
                  </div>
                  <span className="text-sm text-[var(--ui-text-3)] group-hover:text-[var(--ui-text)] transition-colors">{b.name}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="cats" className="border-[var(--ui-border)] bg-[var(--ui-surface)] rounded-xl px-4">
          <AccordionTrigger className="text-sm font-semibold text-[var(--ui-text)] hover:no-underline py-4">{t("categories")}</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pb-4">
              {PART_CATEGORIES.map(c => (
                <label key={c.id} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleCat(c.id)}>
                  <div className={cn("w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all",
                    selectedCats.includes(c.id) ? "bg-[#DC2626] border-[#DC2626]" : "border-[var(--ui-border-2)] group-hover:border-[var(--ui-border-2)]")}>
                    {selectedCats.includes(c.id) && <div className="w-2 h-2 bg-white rounded-sm" />}
                  </div>
                  <span className="text-sm text-[var(--ui-text-3)] group-hover:text-[var(--ui-text)] transition-colors">{t(c.id as Parameters<typeof t>[0]) || c.name}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="bg-[var(--ui-surface)] rounded-xl px-4">
        <button type="button" onClick={() => setOpenPrice(p => !p)}
          className="w-full flex items-center justify-between py-4 text-sm font-semibold text-[var(--ui-text)] cursor-pointer">
          {t("price")}
          <ChevronDown className={cn("w-4 h-4 text-[var(--ui-text-4)] transition-transform duration-200", openPrice && "rotate-180")} />
        </button>
        {openPrice && (
          <PriceRangeFilter min={PRICE_MIN} max={PRICE_MAX} value={priceRange} onChange={setPriceRange} />
        )}
      </div>

      {activeTags.length > 0 && (
        <button onClick={clearAll} className="w-full mt-1 py-2 text-sm text-[#EF4444] hover:text-[#F87171] transition-colors cursor-pointer">
          {t("resetAll")}
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <div>
          <p className="text-[#EF4444] text-sm font-medium uppercase tracking-widest mb-1">{t("catalog")}</p>
          <h1 className="font-heading text-3xl font-bold text-[var(--ui-text)]">{t("partsTitle")}</h1>
          <p className="text-[var(--ui-text-3)] mt-1">{t("found")} {filtered.length} {t("products")}</p>
        </div>
        <Link href="/smartphones"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--ui-hover)] border border-[var(--ui-border)] rounded-lg text-sm text-[var(--ui-text-2)] hover:border-[#DC2626]/50 hover:text-[#EF4444] transition-all cursor-pointer">
          {t("smartphones")} →
        </Link>
      </div>

      <div className="flex gap-6">
        <aside className="hidden lg:block w-64 shrink-0">{filtersJSX}</aside>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <Button variant="outline" size="sm" onClick={() => setMobileOpen(true)}
              className="lg:hidden border-[var(--ui-border-2)] text-[var(--ui-text-2)] hover:bg-[var(--ui-hover-2)] cursor-pointer">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              {t("filters")} {activeTags.length > 0 && <span className="ml-1 bg-[#DC2626] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{activeTags.length}</span>}
            </Button>

            {activeTags.map(tag => (
              <span key={`${tag.type}-${tag.id}`} className="flex items-center gap-1.5 px-3 py-1 bg-[#DC2626]/15 border border-[#DC2626]/30 rounded-full text-xs text-[#EF4444]">
                {tag.label}
                <button onClick={() => tag.type === "brand" ? toggleBrand(tag.id) : toggleCat(tag.id)} className="cursor-pointer hover:text-[var(--ui-text)]">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            <div className="ml-auto">
              <Select value={sort} onValueChange={(v: string | null) => setSort((v ?? "default") as SortKey)}>
                <SelectTrigger className="w-52 bg-[var(--ui-surface)] border-[var(--ui-border)] text-[var(--ui-text-2)] h-9 text-sm cursor-pointer">
                  <ArrowUpDown className="w-3.5 h-3.5 mr-2 text-[var(--ui-text-4)]" />
                  <span>{{ default: t("sortDefault"), price_asc: t("sortPriceAsc"), price_desc: t("sortPriceDes"), popular: t("sortPopular") }[sort]}</span>
                </SelectTrigger>
                <SelectContent className="bg-[var(--ui-surface)] border-[var(--ui-border)]">
                  <SelectItem value="default"    className="text-[var(--ui-text-2)] cursor-pointer">{t("sortDefault")}</SelectItem>
                  <SelectItem value="price_asc"  className="text-[var(--ui-text-2)] cursor-pointer">{t("sortPriceAsc")}</SelectItem>
                  <SelectItem value="price_desc" className="text-[var(--ui-text-2)] cursor-pointer">{t("sortPriceDes")}</SelectItem>
                  <SelectItem value="popular"    className="text-[var(--ui-text-2)] cursor-pointer">{t("sortPopular")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <XCircle className="w-12 h-12 text-[var(--ui-text-5)] mb-4" />
              <p className="text-[var(--ui-text-3)] font-medium">{t("noProducts")}</p>
              <button onClick={clearAll} className="mt-4 text-[#EF4444] text-sm hover:underline cursor-pointer">{t("resetFilters")}</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(p => <PartCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-[var(--ui-bg)] border-l border-[var(--ui-border)] overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading font-semibold text-[var(--ui-text)]">{t("filters")}</h2>
              <button onClick={() => setMobileOpen(false)} className="text-[var(--ui-text-3)] hover:text-[var(--ui-text)] cursor-pointer p-1"><X className="w-5 h-5" /></button>
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

function PartCard({ product }: { product: Product }) {
  const { t } = useLang();
  return (
    <Link href={`/parts/${product.id}`} className="group bg-[var(--ui-surface)] border border-[var(--ui-border)] rounded-xl overflow-hidden hover:border-[#DC2626]/40 transition-all duration-200 flex flex-col cursor-pointer">
      <div className="relative h-44 bg-[var(--ui-surface-2)] flex items-center justify-center overflow-hidden">
        <div className="w-16 h-16 bg-[#DC2626]/10 rounded-xl flex items-center justify-center">
          <ShoppingCart className="w-8 h-8 text-[var(--ui-text-5)]" />
        </div>
        {product.popular && (
          <span className="absolute top-3 left-3 px-2 py-0.5 bg-[#DC2626] text-white text-xs font-semibold rounded-full">{t("sortPopular")}</span>
        )}
        <span className="absolute top-3 right-3 px-2 py-0.5 bg-[var(--ui-surface)]/80 backdrop-blur-sm text-[var(--ui-text-3)] text-xs rounded-full border border-[var(--ui-border)]">
          {product.brand}
        </span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[10px] text-[var(--ui-text-5)] font-mono mb-1">{product.sku}</p>
        <h3 className="text-sm font-medium text-[var(--ui-text)] leading-snug mb-1 line-clamp-2 group-hover:text-[var(--ui-text)] transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-[var(--ui-text-4)] mb-3 line-clamp-1">{t("compatible")} {product.model}</p>
        <div className="flex items-center gap-1.5 mb-4">
          {product.inStock
            ? <><CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" /><span className="text-xs text-[#22C55E]">{t("inStock")}</span></>
            : <><XCircle className="w-3.5 h-3.5 text-[#EF4444]" /><span className="text-xs text-[#EF4444]">{t("outOfStock")}</span></>}
        </div>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-bold font-heading text-[var(--ui-text)]">{formatPrice(product.price)}</span>
          <span className="inline-flex items-center gap-1.5 text-xs text-[#EF4444] group-hover:text-[#F87171] transition-colors">
            {t("more")}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function PartsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 pt-24 pb-16 text-[var(--ui-text-3)]">Загрузка…</div>}>
      <PartsContent />
    </Suspense>
  );
}
