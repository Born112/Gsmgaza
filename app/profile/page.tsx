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

type AuthView = "login" | "profile";

const STATUS_CONFIG = {
  "Обработан": { icon: Clock, color: "text-[#F59E0B]", bg: "bg-[#F59E0B]/10" },
  "В пути": { icon: Truck, color: "text-[#3B82F6]", bg: "bg-[#3B82F6]/10" },
  "Доставлен": { icon: CheckCircle2, color: "text-[#22C55E]", bg: "bg-[#22C55E]/10" },
} as const;

const SAMPLE_ADDRESSES = [
  { id: 1, label: "Дом", address: "г. Москва, ул. Тверская, д. 15, кв. 42" },
  { id: 2, label: "Работа", address: "г. Москва, ул. Новый Арбат, д. 10, офис 301" },
];

export default function ProfilePage() {
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
    setAddresses(prev => [...prev, { id: Date.now(), label: newAddressLabel || "Адрес", address: newAddress }]);
    setNewAddress("");
    setNewAddressLabel("");
    setIsAddressModalOpen(false);
  };

  if (view === "login") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#2563EB]/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-[#3B82F6]" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-white mb-2">Войти в аккаунт</h1>
            <p className="text-sm text-slate-400">Управляйте заказами, адресами и профилем</p>
          </div>

          <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-6 space-y-3">
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
              Войти через Google
            </button>

            {/* Telegram */}
            <button
              onClick={() => setView("profile")}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#2AABEE] text-white rounded-xl font-medium text-sm hover:bg-[#1d9bd6] transition-colors duration-150 cursor-pointer"
            >
              <Send className="w-5 h-5" />
              Войти через Telegram
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-[#1E293B] text-xs text-slate-600">или</span>
              </div>
            </div>

            <form onSubmit={e => { e.preventDefault(); setView("profile"); }} className="space-y-3">
              <Input
                type="email"
                placeholder="Email"
                required
                className="bg-white/5 border-white/10 text-slate-200 placeholder:text-slate-600 focus:border-[#2563EB]"
              />
              <Input
                type="password"
                placeholder="Пароль"
                required
                className="bg-white/5 border-white/10 text-slate-200 placeholder:text-slate-600 focus:border-[#2563EB]"
              />
              <Button type="submit" className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white cursor-pointer">
                Войти
              </Button>
            </form>
          </div>

          <p className="text-center text-xs text-slate-600 mt-4">
            Входя, вы соглашаетесь с{" "}
            <a href="#" className="text-[#3B82F6] hover:underline cursor-pointer">политикой конфиденциальности</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      {/* Profile header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] rounded-2xl flex items-center justify-center text-white font-heading font-bold text-2xl">
          {name.charAt(0)}
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-white">{name}</h1>
          <p className="text-sm text-slate-400">alexey@example.com</p>
        </div>
        <button
          onClick={() => setView("login")}
          className="ml-auto text-sm text-slate-500 hover:text-[#EF4444] transition-colors cursor-pointer"
        >
          Выйти
        </button>
      </div>

      <Tabs defaultValue="data" className="space-y-6">
        <TabsList className="bg-[#1E293B] border border-white/10 p-1 rounded-xl">
          <TabsTrigger value="data" className="data-[state=active]:bg-[#2563EB] data-[state=active]:text-white text-slate-400 rounded-lg cursor-pointer transition-all">
            <User className="w-4 h-4 mr-2" />
            Данные
          </TabsTrigger>
          <TabsTrigger value="addresses" className="data-[state=active]:bg-[#2563EB] data-[state=active]:text-white text-slate-400 rounded-lg cursor-pointer transition-all">
            <MapPin className="w-4 h-4 mr-2" />
            Адреса
          </TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-[#2563EB] data-[state=active]:text-white text-slate-400 rounded-lg cursor-pointer transition-all">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Заказы
          </TabsTrigger>
        </TabsList>

        {/* Tab: Data */}
        <TabsContent value="data">
          <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-6">
            <h2 className="font-heading font-semibold text-white text-lg mb-5">Личные данные</h2>
            <form onSubmit={e => { e.preventDefault(); setProfileSaved(true); setTimeout(() => setProfileSaved(false), 2000); }} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm text-slate-400" htmlFor="prof-name">Имя</label>
                <Input id="prof-name" value={name} onChange={e => setName(e.target.value)} className="bg-white/5 border-white/10 text-slate-200 focus:border-[#2563EB]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-slate-400" htmlFor="prof-gender">Пол</label>
                <select
                  id="prof-gender"
                  value={gender}
                  onChange={e => setGender(e.target.value)}
                  className="w-full h-10 rounded-md bg-white/5 border border-white/10 text-slate-200 text-sm px-3 focus:border-[#2563EB] focus:outline-none cursor-pointer"
                >
                  {["Мужской", "Женский", "Не указывать"].map(g => (
                    <option key={g} value={g} className="bg-[#1E293B]">{g}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-slate-400" htmlFor="prof-age">Возраст</label>
                <Input id="prof-age" type="number" min="14" max="120" value={age} onChange={e => setAge(e.target.value)} className="bg-white/5 border-white/10 text-slate-200 focus:border-[#2563EB] w-32" />
              </div>
              <Button type="submit" className={cn("bg-[#2563EB] hover:bg-[#1D4ED8] text-white cursor-pointer transition-all", profileSaved && "bg-[#22C55E] hover:bg-[#16A34A]")}>
                {profileSaved ? <><CheckCircle2 className="w-4 h-4 mr-2" />Сохранено</> : "Сохранить изменения"}
              </Button>
            </form>
          </div>
        </TabsContent>

        {/* Tab: Addresses */}
        <TabsContent value="addresses">
          <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading font-semibold text-white text-lg">Адреса доставки</h2>
              <Button
                size="sm"
                onClick={() => setIsAddressModalOpen(true)}
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Добавить адрес
              </Button>
            </div>
            <div className="space-y-3">
              {addresses.map(addr => (
                <div key={addr.id} className="flex items-start gap-3 p-4 bg-white/5 border border-white/10 rounded-xl group hover:border-white/20 transition-colors">
                  <div className="w-9 h-9 bg-[#2563EB]/15 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-[#3B82F6]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white">{addr.label}</div>
                    <div className="text-sm text-slate-400 mt-0.5">{addr.address}</div>
                  </div>
                  <button
                    onClick={() => setAddresses(prev => prev.filter(a => a.id !== addr.id))}
                    className="text-slate-600 hover:text-[#EF4444] transition-colors cursor-pointer p-1 opacity-0 group-hover:opacity-100"
                    aria-label="Удалить адрес"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {addresses.length === 0 && (
                <div className="text-center py-8 text-slate-500 text-sm">Нет сохранённых адресов</div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Tab: Orders */}
        <TabsContent value="orders">
          <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-6">
            <h2 className="font-heading font-semibold text-white text-lg mb-5">История заказов</h2>
            <div className="space-y-3">
              {ORDERS.map(order => {
                const cfg = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG];
                const Icon = cfg?.icon ?? Clock;
                return (
                  <div key={order.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-slate-500">{order.id}</span>
                      </div>
                      <div className="text-sm font-medium text-white truncate">{order.product}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-white mb-1">{formatPrice(order.amount)}</div>
                      <span className={cn("inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium", cfg?.color, cfg?.bg)}>
                        <Icon className="w-3 h-3" />
                        {order.status}
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
        <DialogContent className="bg-[#1E293B] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-white">Новый адрес доставки</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-sm text-slate-400" htmlFor="addr-label">Название (Дом, Работа...)</label>
              <Input id="addr-label" placeholder="Например: Дом" value={newAddressLabel} onChange={e => setNewAddressLabel(e.target.value)} className="bg-white/5 border-white/10 text-slate-200 focus:border-[#2563EB]" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-slate-400" htmlFor="addr-full">Полный адрес</label>
              <Input id="addr-full" placeholder="г. Москва, ул. Пушкина, д. 1, кв. 1" value={newAddress} onChange={e => setNewAddress(e.target.value)} className="bg-white/5 border-white/10 text-slate-200 focus:border-[#2563EB]" />
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setIsAddressModalOpen(false)} className="flex-1 border-white/20 text-slate-300 hover:bg-white/10 cursor-pointer">Отмена</Button>
              <Button onClick={handleAddAddress} className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white cursor-pointer">Сохранить</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
