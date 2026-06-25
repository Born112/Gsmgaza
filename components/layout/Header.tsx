"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search, ShoppingCart, User, ChevronDown, X, Wrench,
  Monitor, Battery, Cable, Camera, Package, Cpu,
  Smartphone, Star, RotateCcw, Menu,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn, matchesSearch, formatPrice } from "@/lib/utils";
import { useDebounce } from "@/lib/hooks";
import { BRANDS, PART_CATEGORIES, PRODUCTS } from "@/lib/data";
import { useCart } from "@/lib/cart-store";
import { useLang } from "@/lib/i18n";

const PARTS_MENU = [
  { icon: Monitor,    label: "Дисплеи",           href: "/parts?subCategory=displays" },
  { icon: Battery,    label: "Аккумуляторы",       href: "/parts?subCategory=batteries" },
  { icon: Cable,      label: "Шлейфы",             href: "/parts?subCategory=cables" },
  { icon: Camera,     label: "Камеры",             href: "/parts?subCategory=cameras" },
  { icon: Package,    label: "Корпуса",            href: "/parts?subCategory=cases" },
  { icon: Cpu,        label: "Зарядка / Разъёмы",  href: "/parts?subCategory=charging" },
];

const PHONES_MENU = [
  { icon: Star,       label: "Новые смартфоны",    href: "/smartphones?condition=new",  badge: "New" },
  { icon: RotateCcw,  label: "Б/У смартфоны",      href: "/smartphones?condition=used", badge: "Б/У" },
  { icon: Smartphone, label: "Все смартфоны",       href: "/smartphones",               badge: null  },
];

interface HeaderProps {
  isLoggedIn?: boolean;
}

type DropdownKey = "parts" | "phones" | null;

export function Header({ isLoggedIn = false }: HeaderProps) {
  const { totalCount: cartCount } = useCart();
  const { lang, setLang, t } = useLang();
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof PRODUCTS>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navRef  = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const debouncedQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node))
        setOpenDropdown(null);
      if (searchRef.current && !searchRef.current.contains(e.target as Node))
        setIsSearchFocused(false);
    };
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  useEffect(() => {
    if (!debouncedQuery.trim()) { setSearchResults([]); return; }
    setSearchResults(
      PRODUCTS.filter(p => matchesSearch(debouncedQuery, p.name, p.brand, p.model, p.sku)).slice(0, 6)
    );
  }, [debouncedQuery]);

  useEffect(() => {
    setIsMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  const toggle = (key: DropdownKey) =>
    setOpenDropdown(prev => (prev === key ? null : key));

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled
        ? "bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20"
        : "bg-[#0A0A0A]/80 backdrop-blur-sm"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-3">

          {/* ── Logo ────────────────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-8 h-8 bg-[#DC2626] rounded-lg flex items-center justify-center group-hover:bg-[#B91C1C] transition-colors duration-200 shadow-md shadow-[#DC2626]/30">
              <Smartphone className="w-4 h-4 text-white" aria-hidden />
            </div>
            <span className="font-heading font-bold text-white text-xl tracking-tight">
              GSM<span className="text-[#DC2626]">BAZA</span>
            </span>
          </Link>

          {/* ── Desktop Nav ──────────────────────────────────────────── */}
          <nav ref={navRef} className="hidden lg:flex items-center gap-1 ml-2">

            {/* Запчасти dropdown */}
            <div className="relative">
              <button
                onClick={() => toggle("parts")}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer",
                  openDropdown === "parts"
                    ? "bg-[#DC2626] text-white"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                )}
                aria-expanded={openDropdown === "parts"}
              >
                <Package className="w-4 h-4" />
                {t("parts")}
                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", openDropdown === "parts" && "rotate-180")} />
              </button>

              {openDropdown === "parts" && (
                <div className="absolute top-full left-0 mt-2 w-[540px] bg-[#141414] border border-white/10 rounded-xl shadow-2xl shadow-black/40 p-4 animate-in fade-in slide-in-from-top-2 duration-150">
                  <p className="text-xs text-slate-500 uppercase tracking-widest mb-3 px-1">{t("partsCats")}</p>
                  <div className="grid grid-cols-2 gap-1 mb-4">
                    {PARTS_MENU.map(({ icon: Icon, label, href }) => (
                      <Link key={href} href={href} onClick={() => setOpenDropdown(null)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors duration-150 group cursor-pointer">
                        <div className="w-8 h-8 bg-[#DC2626]/15 rounded-lg flex items-center justify-center group-hover:bg-[#DC2626]/25 transition-colors shrink-0">
                          <Icon className="w-4 h-4 text-[#EF4444]" />
                        </div>
                        <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{label}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-white/10 pt-3">
                    <p className="text-xs text-slate-500 mb-2 px-1">{t("byBrand")}</p>
                    <div className="flex flex-wrap gap-2">
                      {BRANDS.map(b => (
                        <Link key={b.id} href={`/parts?brand=${b.id}`} onClick={() => setOpenDropdown(null)}
                          className="px-3 py-1 bg-white/5 hover:bg-[#DC2626]/20 hover:text-[#EF4444] rounded-full text-xs text-slate-400 transition-all duration-150 cursor-pointer">
                          {b.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <Link href="/parts" onClick={() => setOpenDropdown(null)}
                      className="text-xs text-[#EF4444] hover:text-[#F87171] transition-colors cursor-pointer">
                      {t("allParts")}
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Смартфоны dropdown */}
            <div className="relative">
              <button
                onClick={() => toggle("phones")}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer",
                  openDropdown === "phones"
                    ? "bg-[#DC2626] text-white"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                )}
                aria-expanded={openDropdown === "phones"}
              >
                <Smartphone className="w-4 h-4" />
                {t("smartphones")}
                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", openDropdown === "phones" && "rotate-180")} />
              </button>

              {openDropdown === "phones" && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-[#141414] border border-white/10 rounded-xl shadow-2xl shadow-black/40 p-3 animate-in fade-in slide-in-from-top-2 duration-150">
                  <p className="text-xs text-slate-500 uppercase tracking-widest mb-2 px-1">{t("section")}</p>
                  {PHONES_MENU.map(({ icon: Icon, label, href, badge }) => (
                    <Link key={href} href={href} onClick={() => setOpenDropdown(null)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors duration-150 group cursor-pointer">
                      <div className="w-8 h-8 bg-[#DC2626]/15 rounded-lg flex items-center justify-center group-hover:bg-[#DC2626]/25 transition-colors shrink-0">
                        <Icon className="w-4 h-4 text-[#EF4444]" />
                      </div>
                      <span className="text-sm text-slate-300 group-hover:text-white transition-colors flex-1">{label}</span>
                      {badge && (
                        <span className={cn(
                          "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                          badge === "New" ? "bg-[#22C55E]/20 text-[#22C55E]" : "bg-[#F59E0B]/20 text-[#F59E0B]"
                        )}>
                          {badge}
                        </span>
                      )}
                    </Link>
                  ))}
                  <div className="mt-2 pt-2 border-t border-white/10">
                    <p className="text-xs text-slate-500 mb-2 px-1">{t("byBrand")}</p>
                    <div className="flex flex-wrap gap-1.5 px-1">
                      {BRANDS.map(b => (
                        <Link key={b.id} href={`/smartphones?brand=${b.id}`} onClick={() => setOpenDropdown(null)}
                          className="px-2.5 py-0.5 bg-white/5 hover:bg-[#DC2626]/20 hover:text-[#EF4444] rounded-full text-xs text-slate-400 transition-all duration-150 cursor-pointer">
                          {b.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link href="/service"
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200">
              {t("service")}
            </Link>
          </nav>

          {/* ── Live Search ──────────────────────────────────────────── */}
          <div ref={searchRef} className="flex-1 max-w-md mx-3 relative hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <Input
                type="search"
                placeholder={t("search")}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="pl-9 bg-white/5 border-white/10 text-slate-200 placeholder:text-slate-500 focus:border-[#DC2626] focus:bg-white/10 h-9 text-sm transition-all duration-200"
                aria-label="Поиск"
              />
            </div>

            {isSearchFocused && searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#141414] border border-white/10 rounded-xl shadow-2xl shadow-black/40 overflow-hidden z-50">
                {searchResults.length > 0 ? (
                  <>
                    {searchResults.map(p => {
                      const href = p.category === "part"
                        ? `/parts/${p.id}`
                        : `/smartphones/${p.id}`;
                      return (
                        <Link key={p.id} href={href}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors cursor-pointer group"
                          onClick={() => { setSearchQuery(""); setIsSearchFocused(false); }}>
                          <div className="w-8 h-8 bg-[#1C1C1C] rounded-lg flex items-center justify-center shrink-0">
                            {p.category === "smartphone"
                              ? <Smartphone className="w-4 h-4 text-slate-400" />
                              : <Package className="w-4 h-4 text-slate-400" />}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm text-slate-200 group-hover:text-white truncate">{p.name}</p>
                            <p className="text-xs text-slate-500">
                              {p.brand} · {p.category === "smartphone" ? (p.condition === "used" ? t("usedBadge") : t("newBadge")) : t("parts")} · {formatPrice(p.price)}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                    <div className="border-t border-white/10">
                      <Link
                        href={`/parts?q=${encodeURIComponent(searchQuery)}`}
                        className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs text-[#EF4444] hover:bg-white/5 transition-colors cursor-pointer"
                        onClick={() => setIsSearchFocused(false)}>
                        <Search className="w-3.5 h-3.5" />
                        {t("showAllResults")}
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="px-4 py-4 text-center text-sm text-slate-500">{t("nothingFound")}</div>
                )}
              </div>
            )}
          </div>

          {/* ── Right actions ────────────────────────────────────────── */}
          <div className="flex items-center gap-2 ml-auto">
            <Link href="/cart"
              className="relative p-2 text-slate-400 hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/10 cursor-pointer"
              aria-label="Корзина">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[#DC2626] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {isLoggedIn ? (
              <Link href="/profile"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200 cursor-pointer">
                <div className="w-6 h-6 bg-[#DC2626] rounded-full flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm text-slate-300 hidden sm:block">{t("profile")}</span>
              </Link>
            ) : (
              <Link href="/profile"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 h-8 text-sm font-medium text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-lg cursor-pointer transition-colors duration-200">
                <User className="w-4 h-4" />
                {t("login")}
              </Link>
            )}

            {/* Language switcher */}
            <div className="flex items-center bg-white/5 border border-white/10 rounded-lg overflow-hidden">
              {(["ru", "uz"] as const).map(l => (
                <button key={l} onClick={() => setLang(l)}
                  className={cn(
                    "px-2.5 py-1 text-xs font-semibold uppercase transition-all duration-150 cursor-pointer",
                    lang === l
                      ? "bg-[#DC2626] text-white"
                      : "text-slate-500 hover:text-slate-300"
                  )}>
                  {l}
                </button>
              ))}
            </div>

            <button
              className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/10 cursor-pointer"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-expanded={isMobileOpen}
              aria-label="Меню">
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <Input type="search" placeholder={t("searchShort")}
              className="pl-9 bg-white/5 border-white/10 text-slate-200 placeholder:text-slate-500 focus:border-[#DC2626] h-9 text-sm w-full"
              aria-label="Поиск" />
          </div>
        </div>
      </div>

      {/* ── Mobile drawer ────────────────────────────────────────────── */}
      {isMobileOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#0A0A0A]/98 backdrop-blur-xl">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-0.5">
            <p className="text-xs text-slate-500 uppercase tracking-widest px-3 pb-2">{t("parts")}</p>
            {PARTS_MENU.map(({ icon: Icon, label, href }) => (
              <Link key={href} href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
                <Icon className="w-4 h-4 text-[#EF4444]" />
                {label}
              </Link>
            ))}
            <div className="border-t border-white/10 pt-3 mt-2">
              <p className="text-xs text-slate-500 uppercase tracking-widest px-3 pb-2">{t("smartphones")}</p>
              {PHONES_MENU.map(({ icon: Icon, label, href }) => (
                <Link key={href} href={href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
                  <Icon className="w-4 h-4 text-[#EF4444]" />
                  {label}
                </Link>
              ))}
            </div>
            <div className="border-t border-white/10 pt-3 mt-2">
              <Link href="/service"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
                <Wrench className="w-4 h-4 text-[#EF4444]" />
                Ремонт / Сервис
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
