import GlassCard from "./GlassCard.jsx";

export default function ChartPanel({ title, subtitle, children }) {
  return (
    <GlassCard className="min-h-[320px]">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-white/50">{subtitle}</p> : null}
      </div>
      <div className="h-[240px]">{children}</div>
    </GlassCard>
  );
}
