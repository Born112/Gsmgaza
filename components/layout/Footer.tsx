"use client";

import Link from "next/link";
import { Zap, Phone, Mail, MapPin, Clock, Send, Shield, Award, Users, Wrench } from "lucide-react";
import { useLang } from "@/lib/i18n";

export function Footer() {
  const { t } = useLang();

  return (
    <footer className="bg-[#0A1120] border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading font-bold text-white text-xl">
                GSM<span className="text-[#2563EB]">Baza</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t("partsTitle")}. {t("yearsOnMarket")}.
            </p>
            <div className="flex gap-3">
              <a href="#" aria-label="Instagram"
                className="w-9 h-9 bg-white/5 hover:bg-[#2563EB]/20 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#3B82F6] transition-all duration-200 cursor-pointer">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" aria-label="Telegram"
                className="w-9 h-9 bg-white/5 hover:bg-[#2563EB]/20 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#3B82F6] transition-all duration-200 cursor-pointer">
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-widest mb-4">{t("aboutUs")}</h3>
            <ul className="space-y-3 mb-5">
              {[
                { icon: Award,  key: "yearsOnMarket" as const },
                { icon: Shield, key: "guarantee"     as const },
                { icon: Users,  key: "clients"       as const },
                { icon: Wrench, key: "certMasters"   as const },
              ].map(({ icon: Icon, key }) => (
                <li key={key} className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-[#3B82F6] shrink-0" />
                  <span className="text-sm text-slate-400">{t(key)}</span>
                </li>
              ))}
            </ul>
            <div className="space-y-1.5">
              {[
                { labelKey: "parts"    as const, href: "/parts" },
                { labelKey: "smartphones" as const, href: "/smartphones" },
                { labelKey: "service"  as const, href: "/service" },
              ].map(({ labelKey, href }) => (
                <div key={href}>
                  <Link href={href} className="text-sm text-slate-500 hover:text-[#3B82F6] transition-colors cursor-pointer">
                    {t(labelKey)} →
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-widest mb-4">{t("contacts")}</h3>
            <ul className="space-y-3.5">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#3B82F6] shrink-0" />
                <div>
                  <a href="tel:+998901234567" className="text-sm text-slate-300 hover:text-white transition-colors cursor-pointer block">+998 90 123-45-67</a>
                  <a href="tel:+998711234567" className="text-sm text-slate-500 hover:text-white transition-colors cursor-pointer block mt-0.5">+998 71 123-45-67</a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#3B82F6] shrink-0" />
                <a href="mailto:info@gsmbaza.uz" className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer">info@gsmbaza.uz</a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
                <div className="text-sm text-slate-400 leading-relaxed">
                  <div>{t("workdays")}</div>
                  <div>{t("saturday")}</div>
                  <div className="text-slate-600">{t("sunday")}</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
                <span className="text-sm text-slate-400 leading-relaxed whitespace-pre-line">{t("address")}</span>
              </li>
            </ul>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-widest mb-4">{t("location")}</h3>
            <div className="relative w-full h-44 rounded-xl overflow-hidden border border-white/10 bg-[#1E293B]">
              <iframe
                src="https://yandex.uz/map-widget/v1/?ll=69.279737%2C41.299496&z=15&pt=69.279737,41.299496,pm2rdm"
                width="100%" height="100%" frameBorder="0" allowFullScreen title="GSMBaza на карте"
                className="absolute inset-0 w-full h-full"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 pointer-events-none select-none z-[-1]">
                <MapPin className="w-6 h-6 mb-1 text-[#334155]" />
                <span className="text-xs">{t("mapLoading")}</span>
              </div>
            </div>
            <a href="https://yandex.uz/maps/?pt=69.279737,41.299496&z=15&l=map" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 text-xs text-[#3B82F6] hover:text-[#60A5FA] transition-colors cursor-pointer">
              <MapPin className="w-3.5 h-3.5" />
              {t("openMap")}
            </a>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">{t("rights")}</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-slate-600 hover:text-slate-400 transition-colors cursor-pointer">{t("privacy")}</Link>
            <Link href="/terms"   className="text-xs text-slate-600 hover:text-slate-400 transition-colors cursor-pointer">{t("terms")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
