"use client";

import { useState, useEffect, useRef } from "react";
import { Slider } from "@/components/ui/slider";
import { useLang } from "@/lib/i18n";

interface Props {
  min: number;
  max: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
}

export function PriceRangeFilter({ min, max, value, onChange }: Props) {
  const { t } = useLang();
  const [fromStr, setFromStr] = useState(String(value[0]));
  const [toStr,   setToStr]   = useState(String(value[1]));

  useEffect(() => {
    setFromStr(String(value[0]));
    setToStr(String(value[1]));
  }, [value[0], value[1]]);

  const clamp = (n: number) => Math.max(min, Math.min(max, n));

  const commitFrom = () => {
    const n = clamp(parseInt(fromStr.replace(/\D/g, ""), 10) || min);
    const newFrom = Math.min(n, value[1]);
    setFromStr(String(newFrom));
    onChange([newFrom, value[1]]);
  };

  const commitTo = () => {
    const n = clamp(parseInt(toStr.replace(/\D/g, ""), 10) || max);
    const newTo = Math.max(n, value[0]);
    setToStr(String(newTo));
    onChange([value[0], newTo]);
  };

  const wrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const stop = (e: MouseEvent) => e.stopPropagation();
    el.addEventListener("mousedown", stop);
    return () => el.removeEventListener("mousedown", stop);
  }, []);

  return (
    <div ref={wrapRef} className="pb-4 space-y-4" onMouseDown={e => e.stopPropagation()}>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <label className="text-[10px] text-slate-600 uppercase tracking-widest block mb-1">{t("from")}</label>
          <input
            type="text"
            inputMode="numeric"
            value={fromStr}
            onChange={e => setFromStr(e.target.value)}
            onBlur={commitFrom}
            onKeyDown={e => e.key === "Enter" && commitFrom()}
            className="w-full h-8 px-2.5 rounded-lg bg-[#0A0A0A] border border-white/10 text-sm text-slate-200 focus:outline-none focus:border-[#DC2626] transition-colors"
          />
        </div>
        <span className="text-slate-600 mt-5">—</span>
        <div className="flex-1">
          <label className="text-[10px] text-slate-600 uppercase tracking-widest block mb-1">{t("to")}</label>
          <input
            type="text"
            inputMode="numeric"
            value={toStr}
            onChange={e => setToStr(e.target.value)}
            onBlur={commitTo}
            onKeyDown={e => e.key === "Enter" && commitTo()}
            className="w-full h-8 px-2.5 rounded-lg bg-[#0A0A0A] border border-white/10 text-sm text-slate-200 focus:outline-none focus:border-[#DC2626] transition-colors"
          />
        </div>
      </div>

      <Slider
        min={min}
        max={max}
        step={1_000}
        value={value}
        onValueChange={v => {
          const [a, b] = v as [number, number];
          setFromStr(String(a));
          setToStr(String(b));
          onChange([a, b]);
        }}
        className="cursor-pointer"
      />

      <div className="flex justify-between text-[11px] text-slate-600">
        <span>{min.toLocaleString("ru-RU")} сум</span>
        <span>{max.toLocaleString("ru-RU")} сум</span>
      </div>
    </div>
  );
}
