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
import { useLang, type TKey } from "@/lib/i18n";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const PARTS_MENU: { icon: typeof Monitor; labelKey: TKey; href: string }[] = [
  { icon: Monitor,    labelKey: "displays",   href: "/parts?subCategory=displays" },
  { icon: Battery,    labelKey: "batteries",  href: "/parts?subCategory=batteries" },
  { icon: Cable,      labelKey: "cables",     href: "/parts?subCategory=cables" },
  { icon: Camera,     labelKey: "cameras",    href: "/parts?subCategory=cameras" },
  { icon: Package,    labelKey: "cases",      href: "/parts?subCategory=cases" },
  { icon: Cpu,        labelKey: "charging",   href: "/parts?subCategory=charging" },
];

const PHONES_MENU: { icon: typeof Monitor; labelKey: TKey; href: string; badge: "new" | "used" | null }[] = [
  { icon: Star,       labelKey: "newPhones",  href: "/smartphones?condition=new",  badge: "new"  },
  { icon: RotateCcw,  labelKey: "usedPhones", href: "/smartphones?condition=used", badge: "used" },
  { icon: Smartphone, labelKey: "allPhones",  href: "/smartphones",                badge: null   },
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
        ? "bg-[var(--ui-bg)]/95 backdrop-blur-xl border-b border-[var(--ui-border)] shadow-lg shadow-black/20"
        : "bg-[var(--ui-bg)]/80 backdrop-blur-sm"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-3">

          {/* ── Logo ────────────────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-8 h-8 bg-[#DC2626] rounded-lg flex items-center justify-center group-hover:bg-[#B91C1C] transition-colors duration-200 shadow-md shadow-[#DC2626]/30">
              <Smartphone className="w-4 h-4 text-[var(--ui-text)]" aria-hidden />
            </div>
            <span className="font-heading font-bold text-[var(--ui-text)] text-xl tracking-tight">
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
                    : "text-[var(--ui-text-2)] hover:text-[var(--ui-text)] hover:bg-[var(--ui-hover-2)]"
                )}
                aria-expanded={openDropdown === "parts"}
              >
                <Package className="w-4 h-4" />
                {t("parts")}
                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", openDropdown === "parts" && "rotate-180")} />
              </button>

              {openDropdown === "parts" && (
                <div className="absolute top-full left-0 mt-2 w-[540px] bg-[var(--ui-surface)] border border-[var(--ui-border)] rounded-xl shadow-2xl shadow-black/40 p-4 animate-in fade-in slide-in-from-top-2 duration-150">
                  <p className="text-xs text-[var(--ui-text-4)] uppercase tracking-widest mb-3 px-1">{t("partsCats")}</p>
                  <div className="grid grid-cols-2 gap-1 mb-4">
                    {PARTS_MENU.map(({ icon: Icon, labelKey, href }) => (
                      <Link key={href} href={href} onClick={() => setOpenDropdown(null)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--ui-hover-2)] transition-colors duration-150 group cursor-pointer">
                        <div className="w-8 h-8 bg-[#DC2626]/15 rounded-lg flex items-center justify-center group-hover:bg-[#DC2626]/25 transition-colors shrink-0">
                          <Icon className="w-4 h-4 text-[#EF4444]" />
                        </div>
                        <span className="text-sm text-[var(--ui-text-2)] group-hover:text-[var(--ui-text)] transition-colors">{t(labelKey)}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-[var(--ui-border)] pt-3">
                    <p className="text-xs text-[var(--ui-text-4)] mb-2 px-1">{t("byBrand")}</p>
                    <div className="flex flex-wrap gap-2">
                      {BRANDS.map(b => (
                        <Link key={b.id} href={`/parts?brand=${b.id}`} onClick={() => setOpenDropdown(null)}
                          className="px-3 py-1 bg-[var(--ui-hover)] hover:bg-[#DC2626]/20 hover:text-[#EF4444] rounded-full text-xs text-[var(--ui-text-3)] transition-all duration-150 cursor-pointer">
                          {b.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-[var(--ui-border)]">
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
                    : "text-[var(--ui-text-2)] hover:text-[var(--ui-text)] hover:bg-[var(--ui-hover-2)]"
                )}
                aria-expanded={openDropdown === "phones"}
              >
                <Smartphone className="w-4 h-4" />
                {t("smartphones")}
                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", openDropdown === "phones" && "rotate-180")} />
              </button>

              {openDropdown === "phones" && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-[var(--ui-surface)] border border-[var(--ui-border)] rounded-xl shadow-2xl shadow-black/40 p-3 animate-in fade-in slide-in-from-top-2 duration-150">
                  <p className="text-xs text-[var(--ui-text-4)] uppercase tracking-widest mb-2 px-1">{t("section")}</p>
                  {PHONES_MENU.map(({ icon: Icon, labelKey, href, badge }) => (
                    <Link key={href} href={href} onClick={() => setOpenDropdown(null)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--ui-hover-2)] transition-colors duration-150 group cursor-pointer">
                      <div className="w-8 h-8 bg-[#DC2626]/15 rounded-lg flex items-center justify-center group-hover:bg-[#DC2626]/25 transition-colors shrink-0">
                        <Icon className="w-4 h-4 text-[#EF4444]" />
                      </div>
                      <span className="text-sm text-[var(--ui-text-2)] group-hover:text-[var(--ui-text)] transition-colors flex-1">{t(labelKey)}</span>
                      {badge && (
                        <span className={cn(
                          "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                          badge === "new" ? "bg-[#22C55E]/20 text-[#22C55E]" : "bg-[#F59E0B]/20 text-[#F59E0B]"
                        )}>
                          {badge === "new" ? t("newCond") : t("usedBadge")}
                        </span>
                      )}
                    </Link>
                  ))}
                  <div className="mt-2 pt-2 border-t border-[var(--ui-border)]">
                    <p className="text-xs text-[var(--ui-text-4)] mb-2 px-1">{t("byBrand")}</p>
                    <div className="flex flex-wrap gap-1.5 px-1">
                      {BRANDS.map(b => (
                        <Link key={b.id} href={`/smartphones?brand=${b.id}`} onClick={() => setOpenDropdown(null)}
                          className="px-2.5 py-0.5 bg-[var(--ui-hover)] hover:bg-[#DC2626]/20 hover:text-[#EF4444] rounded-full text-xs text-[var(--ui-text-3)] transition-all duration-150 cursor-pointer">
                          {b.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link href="/service"
              className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--ui-text-2)] hover:text-[var(--ui-text)] hover:bg-[var(--ui-hover-2)] transition-all duration-200">
              {t("service")}
            </Link>
          </nav>

          {/* ── Live Search ──────────────────────────────────────────── */}
          <div ref={searchRef} className="flex-1 max-w-md mx-3 relative hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ui-text-4)] pointer-events-none" />
              <Input
                type="search"
                placeholder={t("search")}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="pl-9 bg-[var(--ui-hover)] border-[var(--ui-border)] text-[var(--ui-text)] placeholder:text-[var(--ui-text-4)] focus:border-[#DC2626] focus:bg-[var(--ui-hover-2)] h-9 text-sm transition-all duration-200"
                aria-label="Поиск"
              />
            </div>

            {isSearchFocused && searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-[var(--ui-surface)] border border-[var(--ui-border)] rounded-xl shadow-2xl shadow-black/40 overflow-hidden z-50">
                {searchResults.length > 0 ? (
                  <>
                    {searchResults.map(p => {
                      const href = p.category === "part"
                        ? `/parts/${p.id}`
                        : `/smartphones/${p.id}`;
                      return (
                        <Link key={p.id} href={href}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--ui-hover-2)] transition-colors cursor-pointer group"
                          onClick={() => { setSearchQuery(""); setIsSearchFocused(false); }}>
                          <div className="w-8 h-8 bg-[var(--ui-surface-2)] rounded-lg flex items-center justify-center shrink-0">
                            {p.category === "smartphone"
                              ? <Smartphone className="w-4 h-4 text-[var(--ui-text-3)]" />
                              : <Package className="w-4 h-4 text-[var(--ui-text-3)]" />}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm text-[var(--ui-text)] group-hover:text-[var(--ui-text)] truncate">{p.name}</p>
                            <p className="text-xs text-[var(--ui-text-4)]">
                              {p.brand} · {p.category === "smartphone" ? (p.condition === "used" ? t("usedBadge") : t("newBadge")) : t("parts")} · {formatPrice(p.price)}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                    <div className="border-t border-[var(--ui-border)]">
                      <Link
                        href={`/parts?q=${encodeURIComponent(searchQuery)}`}
                        className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs text-[#EF4444] hover:bg-[var(--ui-hover)] transition-colors cursor-pointer"
                        onClick={() => setIsSearchFocused(false)}>
                        <Search className="w-3.5 h-3.5" />
                        {t("showAllResults")}
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="px-4 py-4 text-center text-sm text-[var(--ui-text-4)]">{t("nothingFound")}</div>
                )}
              </div>
            )}
          </div>

          {/* ── Right actions ────────────────────────────────────────── */}
          <div className="flex items-center gap-2 ml-auto">
            <Link href="/cart"
              className="relative p-2 text-[var(--ui-text-3)] hover:text-[var(--ui-text)] transition-colors duration-200 rounded-lg hover:bg-[var(--ui-hover-2)] cursor-pointer"
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
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--ui-hover)] hover:bg-[var(--ui-hover-2)] transition-colors duration-200 cursor-pointer">
                <div className="w-6 h-6 bg-[#DC2626] rounded-full flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-[var(--ui-text)]" />
                </div>
                <span className="text-sm text-[var(--ui-text-2)] hidden sm:block">{t("profile")}</span>
              </Link>
            ) : (
              <Link href="/profile"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 h-8 text-sm font-medium text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-lg cursor-pointer transition-colors duration-200">
                <User className="w-4 h-4" />
                {t("login")}
              </Link>
            )}

            {/* Theme toggle */}
            <ThemeToggle />

            {/* Language switcher */}
            <div className="flex items-center bg-[var(--ui-hover)] border border-[var(--ui-border)] rounded-lg overflow-hidden">
              {(["ru", "uz"] as const).map(l => (
                <button key={l} onClick={() => setLang(l)}
                  className={cn(
                    "px-2.5 py-1 text-xs font-semibold uppercase transition-all duration-150 cursor-pointer",
                    lang === l
                      ? "bg-[#DC2626] text-white"
                      : "text-[var(--ui-text-4)] hover:text-[var(--ui-text-2)]"
                  )}>
                  {l}
                </button>
              ))}
            </div>

            <button
              className="lg:hidden p-2 text-[var(--ui-text-3)] hover:text-[var(--ui-text)] transition-colors rounded-lg hover:bg-[var(--ui-hover-2)] cursor-pointer"
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ui-text-4)] pointer-events-none" />
            <Input type="search" placeholder={t("searchShort")}
              className="pl-9 bg-[var(--ui-hover)] border-[var(--ui-border)] text-[var(--ui-text)] placeholder:text-[var(--ui-text-4)] focus:border-[#DC2626] h-9 text-sm w-full"
              aria-label="Поиск" />
          </div>
        </div>
      </div>

      {/* ── Mobile drawer ────────────────────────────────────────────── */}
      {isMobileOpen && (
        <div className="lg:hidden border-t border-[var(--ui-border)] bg-[var(--ui-bg)]/98 backdrop-blur-xl">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-0.5">
            <p className="text-xs text-[var(--ui-text-4)] uppercase tracking-widest px-3 pb-2">{t("parts")}</p>
            {PARTS_MENU.map(({ icon: Icon, labelKey, href }) => (
              <Link key={href} href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[var(--ui-text-2)] hover:text-[var(--ui-text)] hover:bg-[var(--ui-hover-2)] transition-colors cursor-pointer">
                <Icon className="w-4 h-4 text-[#EF4444]" />
                {t(labelKey)}
              </Link>
            ))}
            <div className="border-t border-[var(--ui-border)] pt-3 mt-2">
              <p className="text-xs text-[var(--ui-text-4)] uppercase tracking-widest px-3 pb-2">{t("smartphones")}</p>
              {PHONES_MENU.map(({ icon: Icon, labelKey, href }) => (
                <Link key={href} href={href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[var(--ui-text-2)] hover:text-[var(--ui-text)] hover:bg-[var(--ui-hover-2)] transition-colors cursor-pointer">
                  <Icon className="w-4 h-4 text-[#EF4444]" />
                  {t(labelKey)}
                </Link>
              ))}
            </div>
            <div className="border-t border-[var(--ui-border)] pt-3 mt-2">
              <Link href="/service"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[var(--ui-text-2)] hover:text-[var(--ui-text)] hover:bg-[var(--ui-hover-2)] transition-colors cursor-pointer">
                <Wrench className="w-4 h-4 text-[#EF4444]" />
                {t("service")}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
