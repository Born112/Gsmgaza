"use client";

import Link from "next/link";
import { Monitor, BatteryCharging, Cpu, Camera, ArrowRight } from "lucide-react";
import { REPAIR_SERVICES } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { useLang } from "@/lib/i18n";

const ICONS: Record<string, React.ElementType> = {
  monitor: Monitor,
  "battery-charging": BatteryCharging,
  cpu: Cpu,
  camera: Camera,
};

export function RepairServices() {
  const { t } = useLang();

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-[#3B82F6] text-sm font-medium uppercase tracking-widest mb-2">{t("serviceLabel")}</p>
          <h2 className="font-heading text-3xl font-bold text-white">{t("popularRepair")}</h2>
        </div>
        <Link
          href="/service"
          className="text-sm text-slate-400 hover:text-[#3B82F6] transition-colors duration-150 cursor-pointer hidden sm:block"
        >
          {t("allServices")}
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {REPAIR_SERVICES.map(service => {
          const Icon = ICONS[service.icon] ?? Cpu;
          return (
            <div
              key={service.id}
              className="group relative bg-[#1E293B] border border-white/10 rounded-xl p-6 hover:border-[#2563EB]/40 transition-all duration-200 cursor-default overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl" />

              <div className="w-12 h-12 bg-[#2563EB]/15 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#2563EB]/25 transition-colors duration-200">
                <Icon className="w-6 h-6 text-[#3B82F6]" />
              </div>

              <h3 className="font-heading font-semibold text-white text-lg mb-2">{service.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">{service.desc}</p>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500">{t("from").toLowerCase()}</div>
                  <div className="text-xl font-bold font-heading text-[#3B82F6]">
                    {formatPrice(service.priceFrom)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500">{t("termLabel")}</div>
                  <div className="text-sm font-medium text-slate-300">{service.duration}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href="/service"
          className="inline-flex items-center gap-2 px-10 h-12 text-base font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg cursor-pointer transition-colors duration-200 shadow-lg shadow-[#2563EB]/20"
        >
          {t("calcRepairCost")}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
