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
          <p className="text-[#EF4444] text-sm font-medium uppercase tracking-widest mb-2">{t("serviceLabel")}</p>
          <h2 className="font-heading text-3xl font-bold text-[var(--ui-text)]">{t("popularRepair")}</h2>
        </div>
        <Link
          href="/service"
          className="text-sm text-[var(--ui-text-3)] hover:text-[#EF4444] transition-colors duration-150 cursor-pointer hidden sm:block"
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
              className="group relative bg-[var(--ui-surface)] border border-[var(--ui-border)] rounded-xl p-6 hover:border-[#DC2626]/40 transition-all duration-200 cursor-default overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#DC2626]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl" />

              <div className="w-12 h-12 bg-[#DC2626]/15 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#DC2626]/25 transition-colors duration-200">
                <Icon className="w-6 h-6 text-[#EF4444]" />
              </div>

              <h3 className="font-heading font-semibold text-[var(--ui-text)] text-lg mb-2">{service.title}</h3>
              <p className="text-sm text-[var(--ui-text-3)] leading-relaxed mb-4">{service.desc}</p>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-[var(--ui-text-4)]">{t("from").toLowerCase()}</div>
                  <div className="text-xl font-bold font-heading text-[#EF4444]">
                    {formatPrice(service.priceFrom)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[var(--ui-text-4)]">{t("termLabel")}</div>
                  <div className="text-sm font-medium text-[var(--ui-text-2)]">{service.duration}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href="/service"
          className="inline-flex items-center gap-2 px-10 h-12 text-base font-semibold text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-lg cursor-pointer transition-colors duration-200 shadow-lg shadow-[#DC2626]/20"
        >
          {t("calcRepairCost")}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
