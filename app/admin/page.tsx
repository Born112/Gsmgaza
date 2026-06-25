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
import { useLang } from "@/lib/i18n";

type Panel = "orders" | "products";

const STATUS_CONFIG = {
  "Обработан": { icon: Clock, color: "text-[#F59E0B]", bg: "bg-[#F59E0B]/10", border: "border-[#F59E0B]/20" },
  "В пути": { icon: Truck, color: "text-[#EF4444]", bg: "bg-[#EF4444]/10", border: "border-[#EF4444]/20" },
  "Доставлен": { icon: CheckCircle2, color: "text-[#22C55E]", bg: "bg-[#22C55E]/10", border: "border-[#22C55E]/20" },
} as const;

const STATS = [
  { icon: DollarSign, label: "Выручка (месяц)", value: "39 809 000 сум", delta: "+12%" },
  { icon: ShoppingCart, label: "Заказов (месяц)", value: "147", delta: "+8%" },
  { icon: Package, label: "Товаров в каталоге", value: "12 430", delta: null },
  { icon: Users, label: "Клиентов", value: "1 204", delta: "+3%" },
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
          <h1 className="font-heading text-3xl font-bold text-white">{t("adminPanel")}</h1>
          <p className="text-slate-400 mt-1">{t("adminDesc")}</p>
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
        {STATS.map(({ icon: Icon, label, value, delta }) => (
          <div key={label} className="bg-[#141414] border border-white/10 rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 bg-[#DC2626]/15 rounded-lg flex items-center justify-center">
                <Icon className="w-5 h-5 text-[#EF4444]" />
              </div>
              {delta && (
                <span className="text-xs font-medium text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded-full">{delta}</span>
              )}
            </div>
            <div className="text-xl font-heading font-bold text-white">{value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-[#141414] border border-white/10 rounded-xl p-1 w-fit">
        {(["orders", "products"] as Panel[]).map(p => (
          <button
            key={p}
            onClick={() => setPanel(p)}
            className={cn(
              "px-5 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer",
              panel === p ? "bg-[#DC2626] text-white" : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
          >
            {p === "orders" ? t("ordersTab") : t("productsTab")}
          </button>
        ))}
      </div>

      {/* Orders table */}
      {panel === "orders" && (
        <div className="bg-[#141414] border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {["ID", t("clientLabel"), t("phoneNumber"), t("productLabel"), t("amountLabel"), t("statusLabel"), t("actionsLabel")].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map(order => {
                  const cfg = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG];
                  const Icon = cfg?.icon ?? Clock;
                  return (
                    <tr key={order.id} className="hover:bg-white/3 transition-colors group">
                      <td className="px-5 py-4 text-xs font-mono text-slate-500">{order.id}</td>
                      <td className="px-5 py-4 text-sm font-medium text-white">{order.name}</td>
                      <td className="px-5 py-4 text-sm text-slate-400">{order.phone}</td>
                      <td className="px-5 py-4 text-sm text-slate-300 max-w-[200px] truncate">{order.product}</td>
                      <td className="px-5 py-4 text-sm font-semibold text-white">{formatPrice(order.amount)}</td>
                      <td className="px-5 py-4">
                        <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border", cfg?.color, cfg?.bg, cfg?.border)}>
                          <Icon className="w-3 h-3" />
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <Select value={order.status} onValueChange={(v: string | null) => updateOrderStatus(order.id, v ?? order.status)}>
                          <SelectTrigger className="w-36 h-7 bg-white/5 border-white/10 text-slate-400 text-xs cursor-pointer">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#141414] border-white/10">
                            {["Обработан", "В пути", "Доставлен"].map(s => (
                              <SelectItem key={s} value={s} className="text-slate-300 cursor-pointer text-xs">{s}</SelectItem>
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
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-8 text-center">
          <Package className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 font-medium mb-2">{t("productsList")}</p>
          <p className="text-slate-600 text-sm mb-6">{t("productsListMsg")}</p>
          <Button onClick={() => { setEditingProduct(EMPTY_PRODUCT); setIsProductModalOpen(true); }} className="bg-[#DC2626] hover:bg-[#B91C1C] text-white cursor-pointer">
            <Plus className="w-4 h-4 mr-2" />
            {t("addProduct")}
          </Button>
        </div>
      )}

      {/* Product form modal */}
      <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
        <DialogContent className="bg-[#141414] border-white/10 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading text-white">{t("addEditProduct")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveProduct} className="space-y-4 pt-2 max-h-[70vh] overflow-y-auto pr-1">
            {/* Bilingual names */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm text-slate-400">{t("productNameRu")}</label>
                <Input required placeholder="Дисплей для iPhone 15" value={editingProduct.name_ru} onChange={e => setEditingProduct(p => ({ ...p, name_ru: e.target.value }))} className="bg-white/5 border-white/10 text-slate-200 focus:border-[#DC2626]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-slate-400">{t("productNameUz")}</label>
                <Input required placeholder="iPhone 15 uchun displey" value={editingProduct.name_uz} onChange={e => setEditingProduct(p => ({ ...p, name_uz: e.target.value }))} className="bg-white/5 border-white/10 text-slate-200 focus:border-[#DC2626]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm text-slate-400">{t("brandLabel")}</label>
                <Select value={editingProduct.brand} onValueChange={(v: string | null) => setEditingProduct(p => ({ ...p, brand: v ?? "" }))}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-slate-300 cursor-pointer">
                    <SelectValue placeholder={t("chooseSelect")} />
                  </SelectTrigger>
                  <SelectContent className="bg-[#141414] border-white/10">
                    {BRANDS.map(b => <SelectItem key={b.id} value={b.name} className="text-slate-300 cursor-pointer">{b.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-slate-400">{t("categoryLabel")}</label>
                <Select value={editingProduct.category} onValueChange={(v: string | null) => setEditingProduct(p => ({ ...p, category: v ?? "" }))}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-slate-300 cursor-pointer">
                    <SelectValue placeholder={t("chooseSelect")} />
                  </SelectTrigger>
                  <SelectContent className="bg-[#141414] border-white/10">
                    {CATEGORIES.map(c => <SelectItem key={c.id} value={c.id} className="text-slate-300 cursor-pointer">{t(c.id as Parameters<typeof t>[0]) || c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-slate-400">{t("priceSum")}</label>
              <Input required type="number" min="0" placeholder="0" value={editingProduct.price} onChange={e => setEditingProduct(p => ({ ...p, price: e.target.value }))} className="bg-white/5 border-white/10 text-slate-200 focus:border-[#DC2626]" />
            </div>

            {/* Bilingual descriptions */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm text-slate-400">{t("descriptionRu")}</label>
                <textarea
                  rows={3}
                  placeholder="Описание товара..."
                  value={editingProduct.description_ru}
                  onChange={e => setEditingProduct(p => ({ ...p, description_ru: e.target.value }))}
                  className="w-full rounded-md bg-white/5 border border-white/10 text-slate-200 text-sm px-3 py-2 focus:border-[#DC2626] focus:outline-none resize-none placeholder:text-slate-600"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-slate-400">{t("descriptionUz")}</label>
                <textarea
                  rows={3}
                  placeholder="Mahsulot tavsifi..."
                  value={editingProduct.description_uz}
                  onChange={e => setEditingProduct(p => ({ ...p, description_uz: e.target.value }))}
                  className="w-full rounded-md bg-white/5 border border-white/10 text-slate-200 text-sm px-3 py-2 focus:border-[#DC2626] focus:outline-none resize-none placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Bilingual specs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm text-slate-400">{t("specsRu")}</label>
                <p className="text-[10px] text-slate-600">{t("specsHint")}</p>
                <textarea
                  rows={4}
                  placeholder={"Цвет: Чёрный\nТип: OLED\nГарантия: 12 мес."}
                  value={editingProduct.specs_ru}
                  onChange={e => setEditingProduct(p => ({ ...p, specs_ru: e.target.value }))}
                  className="w-full rounded-md bg-white/5 border border-white/10 text-slate-200 text-sm px-3 py-2 focus:border-[#DC2626] focus:outline-none resize-none placeholder:text-slate-600 font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-slate-400">{t("specsUz")}</label>
                <p className="text-[10px] text-slate-600">{t("specsHint")}</p>
                <textarea
                  rows={4}
                  placeholder={"Rang: Qora\nTuri: OLED\nKafolat: 12 oy"}
                  value={editingProduct.specs_uz}
                  onChange={e => setEditingProduct(p => ({ ...p, specs_uz: e.target.value }))}
                  className="w-full rounded-md bg-white/5 border border-white/10 text-slate-200 text-sm px-3 py-2 focus:border-[#DC2626] focus:outline-none resize-none placeholder:text-slate-600 font-mono"
                />
              </div>
            </div>

            {/* Photo upload */}
            <div className="border-2 border-dashed border-white/15 rounded-xl p-6 text-center hover:border-white/25 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-500">{t("photoUpload")}</p>
              <p className="text-xs text-slate-600 mt-1">{t("photoHint")}</p>
            </div>

            <div className="flex gap-3 pt-1">
              <Button type="button" variant="outline" onClick={() => setIsProductModalOpen(false)} className="flex-1 border-white/20 text-slate-300 hover:bg-white/10 cursor-pointer">{t("cancel")}</Button>
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
