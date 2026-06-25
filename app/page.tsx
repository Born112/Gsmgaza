import { HeroSection } from "@/components/home/HeroSection";
import { BrandGrid } from "@/components/home/BrandGrid";
import { RepairServices } from "@/components/home/RepairServices";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <BrandGrid />
      <div className="h-px bg-white/5 max-w-7xl mx-auto" />
      <RepairServices />
    </main>
  );
}
