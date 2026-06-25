"use client";

import { useState } from "react";
import { User, MapPin, ShoppingBag, Plus, X, CheckCircle2, Truck, Clock, Send } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ORDERS } from "@/lib/data";
import { cn, formatPrice } from "@/lib/utils";
import { useLang, type TKey } from "@/lib/i18n";

type AuthView = "login" | "profile";

const STATUS_CONFIG = {
  "Обработан": { icon: Clock, color: "text-[#F59E0B]", bg: "bg-[#F59E0B]/10" },
  "В пути": { icon: Truck, color: "text-[#EF4444]", bg: "bg-[#EF4444]/10" },
  "Доставлен": { icon: CheckCircle2, color: "text-[#22C55E]", bg: "bg-[#22C55E]/10" },
} as const;

/** Maps the Russian status value stored in data to a translation key. */
const STATUS_KEY: Record<string, TKey> = {
  "Обработан": "statusProcessed",
  "В пути": "statusInTransit",
  "Доставлен": "statusDelivered",
};

const SAMPLE_ADDRESSES = [
  { id: 1, label: "Дом", address: "г. Москва, ул. Тверская, д. 15, кв. 42" },
  { id: 2, label: "Работа", address: "г. Москва, ул. Новый Арбат, д. 10, офис 301" },
];

export default function ProfilePage() {
  const { t } = useLang();
  const [view, setView] = useState<AuthView>("login");
  const [addresses, setAddresses] = useState(SAMPLE_ADDRESSES);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [newAddressLabel, setNewAddressLabel] = useState("");
  const [name, setName] = useState("Алексей Петров");
  const [gender, setGender] = useState("Мужской");
  const [age, setAge] = useState("28");
  const [profileSaved, setProfileSaved] = useState(false);

  const handleAddAddress = () => {
    if (!newAddress.trim()) return;
    setAddresses(prev => [...prev, { id: Date.now(), label: newAddressLabel || t("addressDefault"), address: newAddress }]);
    setNewAddress("");
    setNewAddressLabel("");
    setIsAddressModalOpen(false);
  };

  if (view === "login") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#DC2626]/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-[#EF4444]" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-[var(--ui-text)] mb-2">{t("loginTitle")}</h1>
            <p className="text-sm text-[var(--ui-text-3)]">{t("loginSubtitle")}</p>
          </div>

          <div className="bg-[var(--ui-surface)] border border-[var(--ui-border)] rounded-2xl p-6 space-y-3">
            {/* Google */}
            <button
              onClick={() => setView("profile")}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-slate-900 rounded-xl font-medium text-sm hover:bg-slate-100 transition-colors duration-150 cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {t("loginGoogle")}
            </button>

            {/* Telegram */}
            <button
              onClick={() => setView("profile")}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#2AABEE] text-white rounded-xl font-medium text-sm hover:bg-[#1d9bd6] transition-colors duration-150 cursor-pointer"
            >
              <Send className="w-5 h-5" />
              {t("loginTelegram")}
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--ui-border)]" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-[var(--ui-surface)] text-xs text-[var(--ui-text-5)]">{t("orLabel")}</span>
              </div>
            </div>

            <form onSubmit={e => { e.preventDefault(); setView("profile"); }} className="space-y-3">
              <Input
                type="email"
                placeholder={t("emailPlaceholder")}
                required
                className="bg-[var(--ui-hover)] border-[var(--ui-border)] text-[var(--ui-text)] placeholder:text-[var(--ui-text-5)] focus:border-[#DC2626]"
              />
              <Input
                type="password"
                placeholder={t("passwordPlaceholder")}
                required
                className="bg-[var(--ui-hover)] border-[var(--ui-border)] text-[var(--ui-text)] placeholder:text-[var(--ui-text-5)] focus:border-[#DC2626]"
              />
              <Button type="submit" className="w-full bg-[#DC2626] hover:bg-[#B91C1C] text-white cursor-pointer">
                {t("login")}
              </Button>
            </form>
          </div>

          <p className="text-center text-xs text-[var(--ui-text-5)] mt-4">
            {t("loginConsent")}{" "}
            <a href="#" className="text-[#EF4444] hover:underline cursor-pointer">{t("privacy")}</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      {/* Profile header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-[#DC2626] to-[#B91C1C] rounded-2xl flex items-center justify-center text-white font-heading font-bold text-2xl">
          {name.charAt(0)}
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-[var(--ui-text)]">{name}</h1>
          <p className="text-sm text-[var(--ui-text-3)]">alexey@example.com</p>
        </div>
        <button
          onClick={() => setView("login")}
          className="ml-auto text-sm text-[var(--ui-text-4)] hover:text-[#EF4444] transition-colors cursor-pointer"
        >
          {t("logout")}
        </button>
      </div>

      <Tabs defaultValue="data" className="space-y-6">
        <TabsList className="bg-[var(--ui-surface)] border border-[var(--ui-border)] p-1 rounded-xl">
          <TabsTrigger value="data" className="data-[state=active]:bg-[#DC2626] data-[state=active]:text-white text-[var(--ui-text-3)] rounded-lg cursor-pointer transition-all">
            <User className="w-4 h-4 mr-2" />
            {t("tabData")}
          </TabsTrigger>
          <TabsTrigger value="addresses" className="data-[state=active]:bg-[#DC2626] data-[state=active]:text-white text-[var(--ui-text-3)] rounded-lg cursor-pointer transition-all">
            <MapPin className="w-4 h-4 mr-2" />
            {t("tabAddresses")}
          </TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-[#DC2626] data-[state=active]:text-white text-[var(--ui-text-3)] rounded-lg cursor-pointer transition-all">
            <ShoppingBag className="w-4 h-4 mr-2" />
            {t("ordersTab")}
          </TabsTrigger>
        </TabsList>

        {/* Tab: Data */}
        <TabsContent value="data">
          <div className="bg-[var(--ui-surface)] border border-[var(--ui-border)] rounded-2xl p-6">
            <h2 className="font-heading font-semibold text-[var(--ui-text)] text-lg mb-5">{t("personalData")}</h2>
            <form onSubmit={e => { e.preventDefault(); setProfileSaved(true); setTimeout(() => setProfileSaved(false), 2000); }} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm text-[var(--ui-text-3)]" htmlFor="prof-name">{t("nameLabel")}</label>
                <Input id="prof-name" value={name} onChange={e => setName(e.target.value)} className="bg-[var(--ui-hover)] border-[var(--ui-border)] text-[var(--ui-text)] focus:border-[#DC2626]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-[var(--ui-text-3)]" htmlFor="prof-gender">{t("genderLabel")}</label>
                <select
                  id="prof-gender"
                  value={gender}
                  onChange={e => setGender(e.target.value)}
                  className="w-full h-10 rounded-md bg-[var(--ui-hover)] border border-[var(--ui-border)] text-[var(--ui-text)] text-sm px-3 focus:border-[#DC2626] focus:outline-none cursor-pointer"
                >
                  {([["Мужской", "genderMale"], ["Женский", "genderFemale"], ["Не указывать", "genderUnspecified"]] as const).map(([value, key]) => (
                    <option key={value} value={value} className="bg-[var(--ui-surface)]">{t(key)}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-[var(--ui-text-3)]" htmlFor="prof-age">{t("ageLabel")}</label>
                <Input id="prof-age" type="number" min="14" max="120" value={age} onChange={e => setAge(e.target.value)} className="bg-[var(--ui-hover)] border-[var(--ui-border)] text-[var(--ui-text)] focus:border-[#DC2626] w-32" />
              </div>
              <Button type="submit" className={cn("bg-[#DC2626] hover:bg-[#B91C1C] text-white cursor-pointer transition-all", profileSaved && "bg-[#22C55E] hover:bg-[#16A34A]")}>
                {profileSaved ? <><CheckCircle2 className="w-4 h-4 mr-2" />{t("savedShort")}</> : t("saveChanges")}
              </Button>
            </form>
          </div>
        </TabsContent>

        {/* Tab: Addresses */}
        <TabsContent value="addresses">
          <div className="bg-[var(--ui-surface)] border border-[var(--ui-border)] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading font-semibold text-[var(--ui-text)] text-lg">{t("deliveryAddresses")}</h2>
              <Button
                size="sm"
                onClick={() => setIsAddressModalOpen(true)}
                className="bg-[#DC2626] hover:bg-[#B91C1C] text-white cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                {t("addAddress")}
              </Button>
            </div>
            <div className="space-y-3">
              {addresses.map(addr => (
                <div key={addr.id} className="flex items-start gap-3 p-4 bg-[var(--ui-hover)] border border-[var(--ui-border)] rounded-xl group hover:border-[var(--ui-border-2)] transition-colors">
                  <div className="w-9 h-9 bg-[#DC2626]/15 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-[#EF4444]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[var(--ui-text)]">{addr.label}</div>
                    <div className="text-sm text-[var(--ui-text-3)] mt-0.5">{addr.address}</div>
                  </div>
                  <button
                    onClick={() => setAddresses(prev => prev.filter(a => a.id !== addr.id))}
                    className="text-[var(--ui-text-5)] hover:text-[#EF4444] transition-colors cursor-pointer p-1 opacity-0 group-hover:opacity-100"
                    aria-label={t("deleteAddress")}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {addresses.length === 0 && (
                <div className="text-center py-8 text-[var(--ui-text-4)] text-sm">{t("noAddresses")}</div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Tab: Orders */}
        <TabsContent value="orders">
          <div className="bg-[var(--ui-surface)] border border-[var(--ui-border)] rounded-2xl p-6">
            <h2 className="font-heading font-semibold text-[var(--ui-text)] text-lg mb-5">{t("orderHistory")}</h2>
            <div className="space-y-3">
              {ORDERS.map(order => {
                const cfg = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG];
                const Icon = cfg?.icon ?? Clock;
                return (
                  <div key={order.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-[var(--ui-hover)] border border-[var(--ui-border)] rounded-xl hover:border-[var(--ui-border-2)] transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-[var(--ui-text-4)]">{order.id}</span>
                      </div>
                      <div className="text-sm font-medium text-[var(--ui-text)] truncate">{order.product}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-[var(--ui-text)] mb-1">{formatPrice(order.amount)}</div>
                      <span className={cn("inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium", cfg?.color, cfg?.bg)}>
                        <Icon className="w-3 h-3" />
                        {STATUS_KEY[order.status] ? t(STATUS_KEY[order.status]) : order.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Address modal */}
      <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
        <DialogContent className="bg-[var(--ui-surface)] border-[var(--ui-border)] text-[var(--ui-text)] max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-[var(--ui-text)]">{t("newAddressTitle")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-sm text-[var(--ui-text-3)]" htmlFor="addr-label">{t("addrNameLabel")}</label>
              <Input id="addr-label" placeholder={t("addrNamePlaceholder")} value={newAddressLabel} onChange={e => setNewAddressLabel(e.target.value)} className="bg-[var(--ui-hover)] border-[var(--ui-border)] text-[var(--ui-text)] focus:border-[#DC2626]" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-[var(--ui-text-3)]" htmlFor="addr-full">{t("fullAddress")}</label>
              <Input id="addr-full" placeholder={t("fullAddressPlaceholder")} value={newAddress} onChange={e => setNewAddress(e.target.value)} className="bg-[var(--ui-hover)] border-[var(--ui-border)] text-[var(--ui-text)] focus:border-[#DC2626]" />
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setIsAddressModalOpen(false)} className="flex-1 border-[var(--ui-border-2)] text-[var(--ui-text-2)] hover:bg-[var(--ui-hover-2)] cursor-pointer">{t("cancel")}</Button>
              <Button onClick={handleAddAddress} className="flex-1 bg-[#DC2626] hover:bg-[#B91C1C] text-white cursor-pointer">{t("save")}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
