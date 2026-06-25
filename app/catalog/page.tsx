"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  SlidersHorizontal, X, ArrowUpDown, ShoppingCart, CheckCircle2, XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PRODUCTS, BRANDS, PART_CATEGORIES, type Product } from "@/lib/data";
import { cn, formatPrice, matchesSearch } from "@/lib/utils";

type SortKey = "default" | "price_asc" | "price_desc" | "popular";

const PARTS = PRODUCTS.filter(p => p.category === "part");
const PRICE_MIN = 0;
const PRICE_MAX = 2_000_000;

// ─── Inner component that reads searchParams ───────────────────────────────

function CatalogContent() {
  const searchParams = useSearchParams();

  // Seed filters from URL params (?brand=apple&category=displays)
  const [selectedBrands, setSelectedBrands] = useState<string[]>(() => {
    const b = searchParams.get("brand");
    return b ? [b.toLowerCase()] : [];
  });
  const [selectedCats, setSelectedCats] = useState<string[]>(() => {
    const c = searchParams.get("category");
    return c ? [c] : [];
  });
  const [priceRange, setPriceRange] = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);
  const [sort, setSort] = useState<SortKey>("default");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "");

  // Re-read URL params if they change (e.g. browser back/forward)
  useEffect(() => {
    const b = searchParams.get("brand");
    const c = searchParams.get("category");
    const q = searchParams.get("q");
    if (b) setSelectedBrands([b.toLowerCase()]);
    if (c) setSelectedCats([c]);
    if (q) setSearchQuery(q);
  }, [searchParams]);

  const toggleBrand = (id: string) =>
    setSelectedBrands(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  const toggleCat = (id: string) =>
    setSelectedCats(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );

  const filtered = useMemo(() => {
    let items = PARTS.filter(p => {
      // Brand filter: compare lowercase brand name against selected brand IDs
      if (selectedBrands.length && !selectedBrands.includes(p.brand.toLowerCase())) return false;
      // Category filter
      if (selectedCats.length && !selectedCats.includes(p.category ?? "")) return false;
      // Price filter
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      // Multi-field search: name, brand, model, sku
      if (!matchesSearch(searchQuery, p.name, p.brand, p.model, p.sku)) return false;
      return true;
    });
    if (sort === "price_asc")  items = [...items].sort((a, b) => a.price - b.price);
    if (sort === "price_desc") items = [...items].sort((a, b) => b.price - a.price);
    if (sort === "popular")    items = [...items].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    return items;
  }, [selectedBrands, selectedCats, priceRange, sort, searchQuery]);

  const activeTags = [
    ...selectedBrands.map(b => ({ type: "brand", id: b, label: BRANDS.find(x => x.id === b)?.name ?? b })),
    ...selectedCats.map(c => ({ type: "cat", id: c, label: PART_CATEGORIES.find(x => x.id === c)?.name ?? c })),
  ];

  const clearAll = () => {
    setSelectedBrands([]);
    setSelectedCats([]);
    setPriceRange([PRICE_MIN, PRICE_MAX]);
    setSearchQuery("");
  };

  const FilterPanel = () => (
    <div className="space-y-2">
      <Accordion multiple className="space-y-2">
        <AccordionItem value="brands" className="border-white/10 bg-[#1E293B] rounded-xl px-4">
          <AccordionTrigger className="text-sm font-semibold text-white hover:no-underline py-4">
            Бренды
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pb-4">
              {BRANDS.map(b => (
                <label key={b.id} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleBrand(b.id)}>
                  <div className={cn(
                    "w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all duration-150",
                    selectedBrands.includes(b.id)
                      ? "bg-[#2563EB] border-[#2563EB]"
                      : "border-white/20 group-hover:border-white/40"
                  )}>
                    {selectedBrands.includes(b.id) && <div className="w-2 h-2 bg-white rounded-sm" />}
                  </div>
                  <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">{b.name}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="categories" className="border-white/10 bg-[#1E293B] rounded-xl px-4">
          <AccordionTrigger className="text-sm font-semibold text-white hover:no-underline py-4">
            Категории
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pb-4">
              {PART_CATEGORIES.map(c => (
                <label key={c.id} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleCat(c.id)}>
                  <div className={cn(
                    "w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all duration-150",
                    selectedCats.includes(c.id)
                      ? "bg-[#2563EB] border-[#2563EB]"
                      : "border-white/20 group-hover:border-white/40"
                  )}>
                    {selectedCats.includes(c.id) && <div className="w-2 h-2 bg-white rounded-sm" />}
                  </div>
                  <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">{c.name}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price" className="border-white/10 bg-[#1E293B] rounded-xl px-4">
          <AccordionTrigger className="text-sm font-semibold text-white hover:no-underline py-4">
            Цена
          </AccordionTrigger>
          <AccordionContent>
            <div className="pb-4 space-y-4">
              <Slider
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={50_000}
                value={priceRange}
                onValueChange={v => setPriceRange(v as [number, number])}
                className="cursor-pointer"
              />
              <div className="flex justify-between text-sm text-slate-400">
                <span>{formatPrice(priceRange[0])}</span>
                <span>{formatPrice(priceRange[1])}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {activeTags.length > 0 && (
        <button
          onClick={clearAll}
          className="w-full mt-1 py-2 text-sm text-[#EF4444] hover:text-[#F87171] transition-colors cursor-pointer"
        >
          Сбросить все фильтры
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="font-heading text-3xl font-bold text-white">Каталог запчастей</h1>
          <p className="text-slate-400 mt-1">Найдено {filtered.length} товаров</p>
        </div>
        <Link
          href="/catalog/smartphones"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-300 hover:border-[#2563EB]/50 hover:text-[#3B82F6] transition-all duration-200 cursor-pointer"
        >
          Смартфоны (Новые / Б/У) →
        </Link>
      </div>

      <div className="flex gap-6">
        {/* Sidebar desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <FilterPanel />
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            {/* Mobile filter button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden border-white/20 text-slate-300 hover:bg-white/10 cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Фильтры
              {activeTags.length > 0 && (
                <span className="ml-1.5 w-5 h-5 bg-[#2563EB] text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {activeTags.length}
                </span>
              )}
            </Button>

            {/* Active filter tags */}
            {activeTags.map(tag => (
              <span
                key={`${tag.type}-${tag.id}`}
                className="flex items-center gap-1.5 px-3 py-1 bg-[#2563EB]/15 border border-[#2563EB]/30 rounded-full text-xs text-[#3B82F6]"
              >
                {tag.label}
                <button
                  onClick={() => tag.type === "brand" ? toggleBrand(tag.id) : toggleCat(tag.id)}
                  className="cursor-pointer hover:text-white transition-colors"
                  aria-label={`Удалить фильтр ${tag.label}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {/* Sort */}
            <div className="ml-auto">
              <Select value={sort} onValueChange={(v: string | null) => setSort((v ?? "default") as SortKey)}>
                <SelectTrigger className="w-52 bg-[#1E293B] border-white/10 text-slate-300 h-9 text-sm cursor-pointer">
                  <ArrowUpDown className="w-3.5 h-3.5 mr-2 text-slate-500" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1E293B] border-white/10">
                  <SelectItem value="default"    className="text-slate-300 cursor-pointer">По умолчанию</SelectItem>
                  <SelectItem value="price_asc"  className="text-slate-300 cursor-pointer">Цена: по возрастанию</SelectItem>
                  <SelectItem value="price_desc" className="text-slate-300 cursor-pointer">Цена: по убыванию</SelectItem>
                  <SelectItem value="popular"    className="text-slate-300 cursor-pointer">Популярные</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <XCircle className="w-12 h-12 text-slate-600 mb-4" />
              <p className="text-slate-400 text-lg font-medium">Товары не найдены</p>
              <p className="text-slate-600 text-sm mt-1">Попробуйте изменить фильтры или поисковый запрос</p>
              <button onClick={clearAll} className="mt-4 text-[#3B82F6] text-sm hover:underline cursor-pointer">
                Сбросить всё
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(product => (
                <PartCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-[#0F172A] border-l border-white/10 overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading font-semibold text-white">Фильтры</h2>
              <button onClick={() => setIsMobileFilterOpen(false)} className="text-slate-400 hover:text-white cursor-pointer p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterPanel />
            <Button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full mt-4 bg-[#2563EB] hover:bg-[#1D4ED8] cursor-pointer text-white"
            >
              Применить ({filtered.length})
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Product card ─────────────────────────────────────────────────────────────

function PartCard({ product }: { product: Product }) {
  return (
    <div className="group bg-[#1E293B] border border-white/10 rounded-xl overflow-hidden hover:border-[#2563EB]/40 transition-all duration-200 flex flex-col">
      <div className="relative h-44 bg-[#334155] flex items-center justify-center overflow-hidden">
        <div className="w-16 h-16 bg-[#2563EB]/10 rounded-xl flex items-center justify-center">
          <ShoppingCart className="w-8 h-8 text-[#334155]" />
        </div>
        {product.popular && (
          <span className="absolute top-3 left-3 px-2 py-0.5 bg-[#2563EB] text-white text-xs font-semibold rounded-full">
            Популярное
          </span>
        )}
        <span className="absolute top-3 right-3 px-2 py-0.5 bg-[#1E293B]/80 backdrop-blur-sm text-slate-400 text-xs rounded-full border border-white/10">
          {product.brand}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-[10px] text-slate-600 font-mono mb-1">{product.sku}</p>
        <h3 className="text-sm font-medium text-slate-200 leading-snug mb-1 line-clamp-2 group-hover:text-white transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-slate-500 mb-3">Совместим: {product.model}</p>

        <div className="flex items-center gap-1.5 mb-4">
          {product.inStock ? (
            <><CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" /><span className="text-xs text-[#22C55E]">В наличии</span></>
          ) : (
            <><XCircle className="w-3.5 h-3.5 text-[#EF4444]" /><span className="text-xs text-[#EF4444]">Нет в наличии</span></>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="text-lg font-bold font-heading text-white">
            {formatPrice(product.price)}
          </div>
          <Button
            size="sm"
            disabled={!product.inStock}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs h-8 px-3 cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
            В корзину
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Page (Suspense required for useSearchParams in Next.js App Router) ───────

export default function CatalogPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-16 text-slate-400">Загрузка каталога…</div>
    }>
      <CatalogContent />
    </Suspense>
  );
}
