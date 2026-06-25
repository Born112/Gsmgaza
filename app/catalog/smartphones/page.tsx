"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, CheckCircle2, XCircle, Info, SlidersHorizontal, X, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PRODUCTS, BRANDS, type Product, type Condition } from "@/lib/data";
import { cn, formatPrice, matchesSearch } from "@/lib/utils";

type SortKey = "default" | "price_asc" | "price_desc";
type ConditionFilter = "all" | "new" | "used";

const PHONES = PRODUCTS.filter(p => p.category === "smartphone");
const PRICE_MIN = 0;
const PRICE_MAX = 20_000_000;

function SmartphonesContent() {
  const searchParams = useSearchParams();

  const [conditionFilter, setConditionFilter] = useState<ConditionFilter>(
    (searchParams.get("condition") as ConditionFilter) ?? "all"
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(() => {
    const b = searchParams.get("brand");
    return b ? [b.toLowerCase()] : [];
  });
  const [priceRange, setPriceRange] = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);
  const [sort, setSort] = useState<SortKey>("default");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const toggleBrand = (id: string) =>
    setSelectedBrands(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);

  const filtered = useMemo(() => {
    let items = PHONES.filter(p => {
      if (conditionFilter !== "all" && p.condition !== conditionFilter) return false;
      if (selectedBrands.length && !selectedBrands.includes(p.brand.toLowerCase())) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      return true;
    });
    if (sort === "price_asc")  items = [...items].sort((a, b) => a.price - b.price);
    if (sort === "price_desc") items = [...items].sort((a, b) => b.price - a.price);
    return items;
  }, [conditionFilter, selectedBrands, priceRange, sort]);

  const newCount  = PHONES.filter(p => p.condition === "new").length;
  const usedCount = PHONES.filter(p => p.condition === "used").length;

  const FilterPanel = () => (
    <div className="space-y-3">
      {/* Brand filter */}
      <div className="bg-[var(--ui-surface)] border border-[var(--ui-border)] rounded-xl p-4">
        <h3 className="text-sm font-semibold text-[var(--ui-text)] mb-3">Бренды</h3>
        <div className="space-y-2">
          {BRANDS.map(b => (
            <label key={b.id} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleBrand(b.id)}>
              <div className={cn(
                "w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all duration-150",
                selectedBrands.includes(b.id)
                  ? "bg-[#DC2626] border-[#DC2626]"
                  : "border-[var(--ui-border-2)] group-hover:border-[var(--ui-border-2)]"
              )}>
                {selectedBrands.includes(b.id) && <div className="w-2 h-2 bg-white rounded-sm" />}
              </div>
              <span className="text-sm text-[var(--ui-text-3)] group-hover:text-[var(--ui-text)] transition-colors">{b.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price filter */}
      <div className="bg-[var(--ui-surface)] border border-[var(--ui-border)] rounded-xl p-4">
        <h3 className="text-sm font-semibold text-[var(--ui-text)] mb-4">Цена</h3>
        <Slider
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={500_000}
          value={priceRange}
          onValueChange={v => setPriceRange(v as [number, number])}
          className="cursor-pointer mb-3"
        />
        <div className="flex justify-between text-sm text-[var(--ui-text-3)]">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>

      {(selectedBrands.length > 0 || priceRange[0] > PRICE_MIN || priceRange[1] < PRICE_MAX) && (
        <button
          onClick={() => { setSelectedBrands([]); setPriceRange([PRICE_MIN, PRICE_MAX]); }}
          className="w-full py-2 text-sm text-[#EF4444] hover:text-[#F87171] transition-colors cursor-pointer"
        >
          Сбросить фильтры
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      {/* Back link */}
      <Link
        href="/catalog"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--ui-text-4)] hover:text-[var(--ui-text-2)] transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Назад к запчастям
      </Link>

      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold text-[var(--ui-text)]">Смартфоны</h1>
        <p className="text-[var(--ui-text-3)] mt-1">Новые и проверенные б/у устройства с гарантией</p>
      </div>

      {/* Condition tabs */}
      <div className="flex gap-2 mb-6">
        {([
          { key: "all",  label: "Все",      count: PHONES.length },
          { key: "new",  label: "Новые",    count: newCount },
          { key: "used", label: "Б/У",      count: usedCount },
        ] as { key: ConditionFilter; label: string; count: number }[]).map(tab => (
          <button
            key={tab.key}
            onClick={() => setConditionFilter(tab.key)}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer border",
              conditionFilter === tab.key
                ? "bg-[#DC2626] border-[#DC2626] text-white"
                : "border-[var(--ui-border)] text-[var(--ui-text-3)] hover:text-[var(--ui-text)] hover:border-[var(--ui-border-2)] bg-[var(--ui-surface)]"
            )}
          >
            {tab.label}
            <span className={cn(
              "text-xs px-1.5 py-0.5 rounded-full font-bold",
              conditionFilter === tab.key ? "bg-[var(--ui-hover-2)] text-[var(--ui-text)]" : "bg-[var(--ui-hover)] text-[var(--ui-text-4)]"
            )}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <FilterPanel />
        </aside>

        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center gap-3 mb-5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden border-[var(--ui-border-2)] text-[var(--ui-text-2)] hover:bg-[var(--ui-hover-2)] cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Фильтры
            </Button>

            {selectedBrands.map(b => (
              <span key={b} className="flex items-center gap-1.5 px-3 py-1 bg-[#DC2626]/15 border border-[#DC2626]/30 rounded-full text-xs text-[#EF4444]">
                {BRANDS.find(x => x.id === b)?.name ?? b}
                <button onClick={() => toggleBrand(b)} className="cursor-pointer hover:text-[var(--ui-text)]" aria-label={`Убрать ${b}`}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            <div className="ml-auto">
              <Select value={sort} onValueChange={(v: string | null) => setSort((v ?? "default") as SortKey)}>
                <SelectTrigger className="w-52 bg-[var(--ui-surface)] border-[var(--ui-border)] text-[var(--ui-text-2)] h-9 text-sm cursor-pointer">
                  <ArrowUpDown className="w-3.5 h-3.5 mr-2 text-[var(--ui-text-4)]" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[var(--ui-surface)] border-[var(--ui-border)]">
                  <SelectItem value="default"    className="text-[var(--ui-text-2)] cursor-pointer">По умолчанию</SelectItem>
                  <SelectItem value="price_asc"  className="text-[var(--ui-text-2)] cursor-pointer">Цена: по возрастанию</SelectItem>
                  <SelectItem value="price_desc" className="text-[var(--ui-text-2)] cursor-pointer">Цена: по убыванию</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <p className="text-[var(--ui-text-4)] text-sm mb-4">Найдено: {filtered.length} устройств</p>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <XCircle className="w-12 h-12 text-[var(--ui-text-5)] mb-4" />
              <p className="text-[var(--ui-text-3)] font-medium">Устройства не найдены</p>
              <button
                onClick={() => { setConditionFilter("all"); setSelectedBrands([]); setPriceRange([PRICE_MIN, PRICE_MAX]); }}
                className="mt-4 text-[#EF4444] text-sm hover:underline cursor-pointer"
              >
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(p => <SmartphoneCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-[var(--ui-bg)] border-l border-[var(--ui-border)] overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading font-semibold text-[var(--ui-text)]">Фильтры</h2>
              <button onClick={() => setIsMobileFilterOpen(false)} className="text-[var(--ui-text-3)] hover:text-[var(--ui-text)] cursor-pointer p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterPanel />
            <Button onClick={() => setIsMobileFilterOpen(false)} className="w-full mt-4 bg-[#DC2626] hover:bg-[#B91C1C] cursor-pointer text-white">
              Применить ({filtered.length})
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function SmartphoneCard({ product }: { product: Product }) {
  const isUsed = product.condition === "used";
  const [showCondition, setShowCondition] = useState(false);

  return (
    <div className="group bg-[var(--ui-surface)] border border-[var(--ui-border)] rounded-xl overflow-hidden hover:border-[#DC2626]/40 transition-all duration-200 flex flex-col">
      {/* Image */}
      <div className="relative h-48 bg-[var(--ui-surface-2)] flex items-center justify-center overflow-hidden">
        <div className="w-16 h-24 bg-[#DC2626]/10 rounded-xl border-2 border-[#DC2626]/20 flex items-center justify-center">
          <ShoppingCart className="w-8 h-8 text-[var(--ui-text-5)]" />
        </div>

        {/* Condition badge */}
        <span className={cn(
          "absolute top-3 left-3 px-2.5 py-0.5 text-xs font-bold rounded-full",
          isUsed
            ? "bg-[#F59E0B] text-black"
            : "bg-[#22C55E] text-black"
        )}>
          {isUsed ? "Б/У" : "Новый"}
        </span>

        <span className="absolute top-3 right-3 px-2 py-0.5 bg-[var(--ui-surface)]/80 backdrop-blur-sm text-[var(--ui-text-3)] text-xs rounded-full border border-[var(--ui-border)]">
          {product.brand}
        </span>

        {product.popular && (
          <span className="absolute bottom-3 left-3 px-2 py-0.5 bg-[#DC2626] text-white text-xs font-semibold rounded-full">
            Хит
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-[10px] text-[var(--ui-text-5)] font-mono mb-1">{product.sku}</p>
        <h3 className="text-sm font-medium text-[var(--ui-text)] leading-snug mb-3 line-clamp-2 group-hover:text-[var(--ui-text)] transition-colors">
          {product.name}
        </h3>

        {/* Visual condition for used phones */}
        {isUsed && product.visualCondition && (
          <div className="mb-3">
            <button
              onClick={() => setShowCondition(!showCondition)}
              className="flex items-center gap-1.5 text-xs text-[#F59E0B] hover:text-[#FCD34D] transition-colors cursor-pointer"
            >
              <Info className="w-3.5 h-3.5" />
              Внешнее состояние {showCondition ? "▲" : "▼"}
            </button>
            {showCondition && (
              <p className="mt-1.5 text-xs text-[var(--ui-text-3)] bg-[var(--ui-surface-2)]/50 rounded-lg p-2.5 leading-relaxed">
                {product.visualCondition}
              </p>
            )}
          </div>
        )}

        <div className="flex items-center gap-1.5 mb-4">
          {product.inStock ? (
            <><CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" /><span className="text-xs text-[#22C55E]">В наличии</span></>
          ) : (
            <><XCircle className="w-3.5 h-3.5 text-[#EF4444]" /><span className="text-xs text-[#EF4444]">Нет в наличии</span></>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="text-lg font-bold font-heading text-[var(--ui-text)]">
            {formatPrice(product.price)}
          </div>
          <Button
            size="sm"
            disabled={!product.inStock}
            className="bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs h-8 px-3 cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
            В корзину
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SmartphonesPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-16 text-[var(--ui-text-3)]">Загрузка…</div>
    }>
      <SmartphonesContent />
    </Suspense>
  );
}
