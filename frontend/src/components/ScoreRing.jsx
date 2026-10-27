export default function ScoreRing({ value = 0, label = "Score" }) {
  const normalized = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div
      className="grid h-36 w-36 place-items-center rounded-full"
      style={{ background: `conic-gradient(#4DE1C1 ${normalized * 3.6}deg, rgba(255,255,255,0.08) 0deg)` }}
    >
      <div className="grid h-28 w-28 place-items-center rounded-full bg-[#0a151c]">
        <div className="text-center">
          <div className="text-3xl font-bold text-white">{normalized}</div>
          <div className="text-xs uppercase tracking-[0.18em] text-white/40">{label}</div>
        </div>
      </div>
    </div>
  );
}
