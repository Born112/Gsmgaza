"use client";

import { useState } from "react";
import { ChevronRight, CheckCircle2, Calendar, Phone, User, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { REPAIR_CALCULATOR, REPAIR_SERVICES } from "@/lib/data";
import { cn, formatPrice } from "@/lib/utils";
import { useLang } from "@/lib/i18n";

type Step = 1 | 2 | 3 | 4;

export default function ServicePage() {
  const { t } = useLang();
  const [step, setStep] = useState<Step>(1);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [issue, setIssue] = useState("");
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formTime, setFormTime] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const selectedIssue = REPAIR_CALCULATOR.issues.find(i => i.id === issue);
  const estimatedPrice = selectedIssue
    ? brand === "Apple"
      ? Math.round(selectedIssue.basePrice * 1.3)
      : selectedIssue.basePrice
    : 0;

  const STEPS = [
    { n: 1, labelKey: "stepBrand" as const },
    { n: 2, labelKey: "stepModel" as const },
    { n: 3, labelKey: "stepIssue" as const },
    { n: 4, labelKey: "stepResult" as const },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      {/* Header */}
      <div className="mb-10">
        <p className="text-[#EF4444] text-sm font-medium uppercase tracking-widest mb-2">{t("serviceCenter")}</p>
        <h1 className="font-heading text-4xl font-bold text-white">{t("repairSmartphones")}</h1>
        <p className="text-slate-400 mt-2 max-w-xl">{t("repairDesc")}</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Calculator */}
        <div className="lg:col-span-3">
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-6">
            <h2 className="font-heading text-xl font-semibold text-white mb-6">{t("repairCalc")}</h2>

            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-8">
              {STEPS.map((s, i) => (
                <div key={s.n} className="flex items-center gap-2 flex-1 last:flex-none">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all duration-200",
                    step > s.n ? "bg-[#22C55E] text-white" :
                    step === s.n ? "bg-[#DC2626] text-white" :
                    "bg-white/10 text-slate-500"
                  )}>
                    {step > s.n ? <CheckCircle2 className="w-4 h-4" /> : s.n}
                  </div>
                  <span className={cn(
                    "text-xs font-medium hidden sm:block",
                    step >= s.n ? "text-slate-200" : "text-slate-600"
                  )}>{t(s.labelKey)}</span>
                  {i < STEPS.length - 1 && (
                    <div className={cn("flex-1 h-px mx-2 transition-colors duration-200", step > s.n ? "bg-[#22C55E]/40" : "bg-white/10")} />
                  )}
                </div>
              ))}
            </div>

            {/* Step 1 — Brand */}
            {step === 1 && (
              <div className="space-y-3">
                <p className="text-sm text-slate-400 mb-4">{t("chooseBrand")}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {REPAIR_CALCULATOR.brands.map(b => (
                    <button
                      key={b}
                      onClick={() => { setBrand(b); setModel(""); setIssue(""); setStep(2); }}
                      className={cn(
                        "px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-150 cursor-pointer text-left",
                        brand === b
                          ? "border-[#DC2626] bg-[#DC2626]/15 text-[#EF4444]"
                          : "border-white/10 text-slate-300 hover:border-white/30 hover:bg-white/5"
                      )}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2 — Model */}
            {step === 2 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <button onClick={() => setStep(1)} className="text-xs text-slate-500 hover:text-slate-300 cursor-pointer transition-colors">{t("back")}</button>
                  <span className="text-sm text-slate-400">{t("stepBrand")}: <span className="text-[#EF4444] font-medium">{brand}</span></span>
                </div>
                <p className="text-sm text-slate-400 mb-3">{t("chooseModel")}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                  {(REPAIR_CALCULATOR.models[brand] ?? []).map(m => (
                    <button
                      key={m}
                      onClick={() => { setModel(m); setIssue(""); setStep(3); }}
                      className={cn(
                        "px-4 py-2.5 rounded-lg border text-sm transition-all duration-150 cursor-pointer text-left",
                        model === m
                          ? "border-[#DC2626] bg-[#DC2626]/15 text-[#EF4444]"
                          : "border-white/10 text-slate-300 hover:border-white/30 hover:bg-white/5"
                      )}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3 — Issue */}
            {step === 3 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <button onClick={() => setStep(2)} className="text-xs text-slate-500 hover:text-slate-300 cursor-pointer transition-colors">{t("back")}</button>
                  <span className="text-sm text-slate-400">{brand} <ChevronRight className="inline w-3 h-3 text-slate-600" /> {model}</span>
                </div>
                <p className="text-sm text-slate-400 mb-3">{t("chooseIssue")}</p>
                <div className="space-y-2">
                  {REPAIR_CALCULATOR.issues.map(iss => (
                    <button
                      key={iss.id}
                      onClick={() => { setIssue(iss.id); setStep(4); }}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all duration-150 cursor-pointer",
                        issue === iss.id
                          ? "border-[#DC2626] bg-[#DC2626]/15 text-[#EF4444]"
                          : "border-white/10 text-slate-300 hover:border-white/30 hover:bg-white/5"
                      )}
                    >
                      <span>{iss.name}</span>
                      <span className="text-xs text-slate-500">{t("from").toLowerCase()} {formatPrice(iss.basePrice)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4 — Result */}
            {step === 4 && selectedIssue && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <button onClick={() => setStep(3)} className="text-xs text-slate-500 hover:text-slate-300 cursor-pointer transition-colors">{t("back")}</button>
                </div>
                <div className="bg-gradient-to-br from-[#DC2626]/10 to-[#141414] border border-[#DC2626]/30 rounded-xl p-6 mb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-xs text-slate-500 mb-1">{brand} {model}</div>
                      <div className="font-medium text-white">{selectedIssue.name}</div>
                    </div>
                    <CheckCircle2 className="w-6 h-6 text-[#22C55E] shrink-0 mt-0.5" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    <div>
                      <div className="text-xs text-slate-500 mb-1">{t("costFrom")}</div>
                      <div className="text-3xl font-heading font-bold text-[#EF4444]">
                        {formatPrice(estimatedPrice)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">{t("repairTermLabel")}</div>
                      <div className="text-xl font-heading font-bold text-white">
                        ~{selectedIssue.days} {selectedIssue.days === 1 ? t("dayOne") : t("dayFew")}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-500">{t("exactPrice")}</p>
                <button
                  onClick={() => setStep(1)}
                  className="mt-3 text-sm text-[#EF4444] hover:underline cursor-pointer"
                >
                  {t("recalculate")}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Booking form */}
        <div className="lg:col-span-2" id="booking">
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 sticky top-20">
            <h2 className="font-heading text-xl font-semibold text-white mb-1">{t("bookRepair")}</h2>
            <p className="text-sm text-slate-400 mb-6">{t("bookingDesc")}</p>

            {submitted ? (
              <div className="flex flex-col items-center text-center py-8">
                <div className="w-16 h-16 bg-[#22C55E]/15 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-[#22C55E]" />
                </div>
                <h3 className="font-heading font-semibold text-white text-lg mb-2">{t("submittedTitle")}</h3>
                <p className="text-sm text-slate-400">{t("submittedMsg")}</p>
                <button onClick={() => setSubmitted(false)} className="mt-4 text-sm text-[#EF4444] hover:underline cursor-pointer">
                  {t("newRequest")}
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm text-slate-400" htmlFor="name">{t("yourName")}</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    <Input
                      id="name"
                      required
                      placeholder="Алексей Иванов"
                      value={formName}
                      onChange={e => setFormName(e.target.value)}
                      className="pl-9 bg-white/5 border-white/10 text-slate-200 placeholder:text-slate-600 focus:border-[#DC2626]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-slate-400" htmlFor="phone">{t("phoneNumber")}</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    <Input
                      id="phone"
                      required
                      type="tel"
                      placeholder="+7 (999) 123-45-67"
                      value={formPhone}
                      onChange={e => setFormPhone(e.target.value)}
                      className="pl-9 bg-white/5 border-white/10 text-slate-200 placeholder:text-slate-600 focus:border-[#DC2626]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-sm text-slate-400" htmlFor="date">{t("dateLabel")}</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                      <Input
                        id="date"
                        type="date"
                        required
                        value={formDate}
                        onChange={e => setFormDate(e.target.value)}
                        className="pl-9 bg-white/5 border-white/10 text-slate-200 focus:border-[#DC2626] cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm text-slate-400" htmlFor="time">{t("timeLabel")}</label>
                    <select
                      id="time"
                      required
                      value={formTime}
                      onChange={e => setFormTime(e.target.value)}
                      className="w-full h-10 rounded-md bg-white/5 border border-white/10 text-slate-200 text-sm px-3 focus:border-[#DC2626] focus:outline-none cursor-pointer"
                    >
                      <option value="">{t("chooseTime")}</option>
                      {["10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00"].map(tm => (
                        <option key={tm} value={tm} className="bg-[#141414]">{tm}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {brand && model && issue && (
                  <div className="flex items-center gap-2 p-3 bg-[#DC2626]/10 border border-[#DC2626]/20 rounded-lg">
                    <Wrench className="w-4 h-4 text-[#EF4444] shrink-0" />
                    <span className="text-xs text-slate-300">{brand} {model} — {selectedIssue?.name}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold h-11 cursor-pointer transition-colors duration-200 shadow-lg shadow-[#DC2626]/20"
                >
                  {t("bookBtn")}
                </Button>
                <p className="text-xs text-center text-slate-600">{t("privacyConsent")}</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
