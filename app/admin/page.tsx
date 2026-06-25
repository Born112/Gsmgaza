"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Package, CheckCircle2, Truck, Clock, X, Upload, BarChart3, ShoppingCart, DollarSign, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ORDERS, BRANDS, CATEGORIES } from "@/lib/data";
import { cn, formatPrice } from "@/lib/utils";
import { useLang, type TKey } from "@/lib/i18n";

type Panel = "orders" | "products";

const STATUS_CONFIG = {
  "Обработан": { icon: Clock, color: "text-[#F59E0B]", bg: "bg-[#F59E0B]/10", border: "border-[#F59E0B]/20" },
  "В пути": { icon: Truck, color: "text-[#EF4444]", bg: "bg-[#EF4444]/10", border: "border-[#EF4444]/20" },
  "Доставлен": { icon: CheckCircle2, color: "text-[#22C55E]", bg: "bg-[#22C55E]/10", border: "border-[#22C55E]/20" },
} as const;

/** Maps the Russian status value stored in data to a translation key. */
const STATUS_KEY: Record<string, TKey> = {
  "Обработан": "statusProcessed",
  "В пути": "statusInTransit",
  "Доставлен": "statusDelivered",
};

const STATS: { icon: typeof DollarSign; labelKey: TKey; value: string; delta: string | null }[] = [
  { icon: DollarSign, labelKey: "statRevenue", value: "39 809 000 сум", delta: "+12%" },
  { icon: ShoppingCart, labelKey: "statOrders", value: "147", delta: "+8%" },
  { icon: Package, labelKey: "statProducts", value: "12 430", delta: null },
  { icon: Users, labelKey: "statClients", value: "1 204", delta: "+3%" },
];

const EMPTY_PRODUCT = { name_ru: "", name_uz: "", brand: "", category: "", price: "", description_ru: "", description_uz: "", specs_ru: "", specs_uz: "" };

export default function AdminPage() {
  const { t } = useLang();
  const [panel, setPanel] = useState<Panel>("orders");
  const [orders, setOrders] = useState(ORDERS.map(o => ({ ...o })));
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<typeof EMPTY_PRODUCT>(EMPTY_PRODUCT);
  const [productSaved, setProductSaved] = useState(false);

  const updateOrderStatus = (id: string, status: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setProductSaved(true);
    setTimeout(() => { setProductSaved(false); setIsProductModalOpen(false); setEditingProduct(EMPTY_PRODUCT); }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-[var(--ui-text)]">{t("adminPanel")}</h1>
          <p className="text-[var(--ui-text-3)] mt-1">{t("adminDesc")}</p>
        </div>
        <Button
          onClick={() => { setEditingProduct(EMPTY_PRODUCT); setIsProductModalOpen(true); }}
          className="bg-[#DC2626] hover:bg-[#B91C1C] text-white cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t("addProduct")}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map(({ icon: Icon, labelKey, value, delta }) => (
          <div key={labelKey} className="bg-[var(--ui-surface)] border border-[var(--ui-border)] rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 bg-[#DC2626]/15 rounded-lg flex items-center justify-center">
                <Icon className="w-5 h-5 text-[#EF4444]" />
              </div>
              {delta && (
                <span className="text-xs font-medium text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded-full">{delta}</span>
              )}
            </div>
            <div className="text-xl font-heading font-bold text-[var(--ui-text)]">{value}</div>
            <div className="text-xs text-[var(--ui-text-4)] mt-0.5">{t(labelKey)}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-[var(--ui-surface)] border border-[var(--ui-border)] rounded-xl p-1 w-fit">
        {(["orders", "products"] as Panel[]).map(p => (
          <button
            key={p}
            onClick={() => setPanel(p)}
            className={cn(
              "px-5 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer",
              panel === p ? "bg-[#DC2626] text-white" : "text-[var(--ui-text-3)] hover:text-[var(--ui-text)] hover:bg-[var(--ui-hover)]"
            )}
          >
            {p === "orders" ? t("ordersTab") : t("productsTab")}
          </button>
        ))}
      </div>

      {/* Orders table */}
      {panel === "orders" && (
        <div className="bg-[var(--ui-surface)] border border-[var(--ui-border)] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--ui-border)]">
                  {["ID", t("clientLabel"), t("phoneNumber"), t("productLabel"), t("amountLabel"), t("statusLabel"), t("actionsLabel")].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-[var(--ui-text-4)] uppercase tracking-wider px-5 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map(order => {
                  const cfg = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG];
                  const Icon = cfg?.icon ?? Clock;
                  return (
                    <tr key={order.id} className="hover:bg-[var(--ui-hover)] transition-colors group">
                      <td className="px-5 py-4 text-xs font-mono text-[var(--ui-text-4)]">{order.id}</td>
                      <td className="px-5 py-4 text-sm font-medium text-[var(--ui-text)]">{order.name}</td>
                      <td className="px-5 py-4 text-sm text-[var(--ui-text-3)]">{order.phone}</td>
                      <td className="px-5 py-4 text-sm text-[var(--ui-text-2)] max-w-[200px] truncate">{order.product}</td>
                      <td className="px-5 py-4 text-sm font-semibold text-[var(--ui-text)]">{formatPrice(order.amount)}</td>
                      <td className="px-5 py-4">
                        <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border", cfg?.color, cfg?.bg, cfg?.border)}>
                          <Icon className="w-3 h-3" />
                          {STATUS_KEY[order.status] ? t(STATUS_KEY[order.status]) : order.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <Select value={order.status} onValueChange={(v: string | null) => updateOrderStatus(order.id, v ?? order.status)}>
                          <SelectTrigger className="w-36 h-7 bg-[var(--ui-hover)] border-[var(--ui-border)] text-[var(--ui-text-3)] text-xs cursor-pointer">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[var(--ui-surface)] border-[var(--ui-border)]">
                            {["Обработан", "В пути", "Доставлен"].map(s => (
                              <SelectItem key={s} value={s} className="text-[var(--ui-text-2)] cursor-pointer text-xs">{STATUS_KEY[s] ? t(STATUS_KEY[s]) : s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Products panel placeholder */}
      {panel === "products" && (
        <div className="bg-[var(--ui-surface)] border border-[var(--ui-border)] rounded-2xl p-8 text-center">
          <Package className="w-12 h-12 text-[var(--ui-text-5)] mx-auto mb-4" />
          <p className="text-[var(--ui-text-3)] font-medium mb-2">{t("productsList")}</p>
          <p className="text-[var(--ui-text-5)] text-sm mb-6">{t("productsListMsg")}</p>
          <Button onClick={() => { setEditingProduct(EMPTY_PRODUCT); setIsProductModalOpen(true); }} className="bg-[#DC2626] hover:bg-[#B91C1C] text-white cursor-pointer">
            <Plus className="w-4 h-4 mr-2" />
            {t("addProduct")}
          </Button>
        </div>
      )}

      {/* Product form modal */}
      <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
        <DialogContent className="bg-[var(--ui-surface)] border-[var(--ui-border)] text-[var(--ui-text)] max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading text-[var(--ui-text)]">{t("addEditProduct")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveProduct} className="space-y-4 pt-2 max-h-[70vh] overflow-y-auto pr-1">
            {/* Bilingual names */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm text-[var(--ui-text-3)]">{t("productNameRu")}</label>
                <Input required placeholder="Дисплей для iPhone 15" value={editingProduct.name_ru} onChange={e => setEditingProduct(p => ({ ...p, name_ru: e.target.value }))} className="bg-[var(--ui-hover)] border-[var(--ui-border)] text-[var(--ui-text)] focus:border-[#DC2626]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-[var(--ui-text-3)]">{t("productNameUz")}</label>
                <Input required placeholder="iPhone 15 uchun displey" value={editingProduct.name_uz} onChange={e => setEditingProduct(p => ({ ...p, name_uz: e.target.value }))} className="bg-[var(--ui-hover)] border-[var(--ui-border)] text-[var(--ui-text)] focus:border-[#DC2626]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm text-[var(--ui-text-3)]">{t("brandLabel")}</label>
                <Select value={editingProduct.brand} onValueChange={(v: string | null) => setEditingProduct(p => ({ ...p, brand: v ?? "" }))}>
                  <SelectTrigger className="bg-[var(--ui-hover)] border-[var(--ui-border)] text-[var(--ui-text-2)] cursor-pointer">
                    <SelectValue placeholder={t("chooseSelect")} />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--ui-surface)] border-[var(--ui-border)]">
                    {BRANDS.map(b => <SelectItem key={b.id} value={b.name} className="text-[var(--ui-text-2)] cursor-pointer">{b.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-[var(--ui-text-3)]">{t("categoryLabel")}</label>
                <Select value={editingProduct.category} onValueChange={(v: string | null) => setEditingProduct(p => ({ ...p, category: v ?? "" }))}>
                  <SelectTrigger className="bg-[var(--ui-hover)] border-[var(--ui-border)] text-[var(--ui-text-2)] cursor-pointer">
                    <SelectValue placeholder={t("chooseSelect")} />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--ui-surface)] border-[var(--ui-border)]">
                    {CATEGORIES.map(c => <SelectItem key={c.id} value={c.id} className="text-[var(--ui-text-2)] cursor-pointer">{t(c.id as Parameters<typeof t>[0]) || c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-[var(--ui-text-3)]">{t("priceSum")}</label>
              <Input required type="number" min="0" placeholder="0" value={editingProduct.price} onChange={e => setEditingProduct(p => ({ ...p, price: e.target.value }))} className="bg-[var(--ui-hover)] border-[var(--ui-border)] text-[var(--ui-text)] focus:border-[#DC2626]" />
            </div>

            {/* Bilingual descriptions */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm text-[var(--ui-text-3)]">{t("descriptionRu")}</label>
                <textarea
                  rows={3}
                  placeholder="Описание товара..."
                  value={editingProduct.description_ru}
                  onChange={e => setEditingProduct(p => ({ ...p, description_ru: e.target.value }))}
                  className="w-full rounded-md bg-[var(--ui-hover)] border border-[var(--ui-border)] text-[var(--ui-text)] text-sm px-3 py-2 focus:border-[#DC2626] focus:outline-none resize-none placeholder:text-[var(--ui-text-5)]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-[var(--ui-text-3)]">{t("descriptionUz")}</label>
                <textarea
                  rows={3}
                  placeholder="Mahsulot tavsifi..."
                  value={editingProduct.description_uz}
                  onChange={e => setEditingProduct(p => ({ ...p, description_uz: e.target.value }))}
                  className="w-full rounded-md bg-[var(--ui-hover)] border border-[var(--ui-border)] text-[var(--ui-text)] text-sm px-3 py-2 focus:border-[#DC2626] focus:outline-none resize-none placeholder:text-[var(--ui-text-5)]"
                />
              </div>
            </div>

            {/* Bilingual specs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm text-[var(--ui-text-3)]">{t("specsRu")}</label>
                <p className="text-[10px] text-[var(--ui-text-5)]">{t("specsHint")}</p>
                <textarea
                  rows={4}
                  placeholder={"Цвет: Чёрный\nТип: OLED\nГарантия: 12 мес."}
                  value={editingProduct.specs_ru}
                  onChange={e => setEditingProduct(p => ({ ...p, specs_ru: e.target.value }))}
                  className="w-full rounded-md bg-[var(--ui-hover)] border border-[var(--ui-border)] text-[var(--ui-text)] text-sm px-3 py-2 focus:border-[#DC2626] focus:outline-none resize-none placeholder:text-[var(--ui-text-5)] font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-[var(--ui-text-3)]">{t("specsUz")}</label>
                <p className="text-[10px] text-[var(--ui-text-5)]">{t("specsHint")}</p>
                <textarea
                  rows={4}
                  placeholder={"Rang: Qora\nTuri: OLED\nKafolat: 12 oy"}
                  value={editingProduct.specs_uz}
                  onChange={e => setEditingProduct(p => ({ ...p, specs_uz: e.target.value }))}
                  className="w-full rounded-md bg-[var(--ui-hover)] border border-[var(--ui-border)] text-[var(--ui-text)] text-sm px-3 py-2 focus:border-[#DC2626] focus:outline-none resize-none placeholder:text-[var(--ui-text-5)] font-mono"
                />
              </div>
            </div>

            {/* Photo upload */}
            <div className="border-2 border-dashed border-[var(--ui-border)] rounded-xl p-6 text-center hover:border-[var(--ui-border-2)] transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-[var(--ui-text-5)] mx-auto mb-2" />
              <p className="text-sm text-[var(--ui-text-4)]">{t("photoUpload")}</p>
              <p className="text-xs text-[var(--ui-text-5)] mt-1">{t("photoHint")}</p>
            </div>

            <div className="flex gap-3 pt-1">
              <Button type="button" variant="outline" onClick={() => setIsProductModalOpen(false)} className="flex-1 border-[var(--ui-border-2)] text-[var(--ui-text-2)] hover:bg-[var(--ui-hover-2)] cursor-pointer">{t("cancel")}</Button>
              <Button type="submit" className={cn("flex-1 text-white cursor-pointer transition-all", productSaved ? "bg-[#22C55E] hover:bg-[#16A34A]" : "bg-[#DC2626] hover:bg-[#B91C1C]")}>
                {productSaved ? <><CheckCircle2 className="w-4 h-4 mr-2" />{t("savedProduct")}</> : t("saveProduct")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
