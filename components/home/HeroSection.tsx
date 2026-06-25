"use client";

import Link from "next/link";
import { ArrowRight, Wrench, ShoppingBag, Shield, Zap, Clock } from "lucide-react";
import { useLang } from "@/lib/i18n";

export function HeroSection() {
  const { t } = useLang();

  const STATS = [
    { icon: ShoppingBag, value: "12 000+", labelKey: "statPositions" as const },
    { icon: Shield,      value: "6 мес.",  labelKey: "statGuarantee" as const },
    { icon: Clock,       value: "~1 час",  labelKey: "statRepairTime" as const },
    { icon: Zap,         value: "2015",    labelKey: "statFounded" as const },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right,#1C1C1C 1px,transparent 1px),linear-gradient(to bottom,#1C1C1C 1px,transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%,#000 40%,transparent 100%)",
        }}
      />

      {/* Radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#DC2626]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-[#B91C1C]/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#DC2626]/15 border border-[#DC2626]/30 rounded-full text-sm text-[#EF4444] font-medium mb-6">
            <span className="w-1.5 h-1.5 bg-[#22C55E] rounded-full animate-pulse" />
            {t("heroBadge")}
          </div>

          {/* Heading */}
          <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6">
            {t("heroTitle")}
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 leading-relaxed max-w-2xl mb-8">
            {t("heroSub")}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/parts"
              className="inline-flex items-center justify-center gap-2 px-8 h-12 text-base font-semibold text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-lg cursor-pointer transition-all duration-200 shadow-lg shadow-[#DC2626]/25 hover:shadow-[#DC2626]/40"
            >
              <ShoppingBag className="w-5 h-5" />
              {t("heroBtnParts")}
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/service"
              className="inline-flex items-center justify-center gap-2 px-8 h-12 text-base font-semibold text-white bg-white/5 border border-white/20 hover:bg-white/10 hover:border-white/30 rounded-lg cursor-pointer transition-all duration-200"
            >
              <Wrench className="w-5 h-5" />
              {t("bookRepair")}
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-16">
          {STATS.map(({ icon: Icon, value, labelKey }) => (
            <div
              key={labelKey}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:border-[#DC2626]/40 hover:bg-white/8 transition-all duration-200 cursor-default"
            >
              <div className="w-9 h-9 bg-[#DC2626]/15 rounded-lg flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-[#EF4444]" />
              </div>
              <div className="text-2xl font-heading font-bold text-white mb-0.5">{value}</div>
              <div className="text-sm text-slate-500">{t(labelKey)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
