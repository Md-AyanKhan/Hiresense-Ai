import { ArrowUpRight } from "lucide-react";
import GlassCard from "./GlassCard.jsx";

export default function MetricCard({ label, value, detail, icon: Icon, tone = "mint" }) {
  const toneMap = {
    mint: "text-mint bg-mint/10",
    coral: "text-coral bg-coral/10",
    amber: "text-amber bg-amber/10",
    sky: "text-sky bg-sky/10"
  };

  return (
    <GlassCard className="min-h-[136px]">
      <div className="flex items-start justify-between">
        <div className={`rounded-xl p-3 ${toneMap[tone]}`}>
          {Icon ? <Icon className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
        </div>
        <ArrowUpRight className="h-4 w-4 text-white/30" />
      </div>
      <p className="mt-5 text-sm text-white/50">{label}</p>
      <div className="mt-1 text-3xl font-bold text-white">{value}</div>
      {detail ? <p className="mt-2 text-xs text-white/40">{detail}</p> : null}
    </GlassCard>
  );
}
