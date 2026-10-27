export default function SkillPill({ children, variant = "default" }) {
  const styles = {
    default: "border-white/10 bg-white/5 text-white/80",
    match: "border-mint/25 bg-mint/10 text-mint",
    missing: "border-coral/25 bg-coral/10 text-coral",
    keyword: "border-amber/25 bg-amber/10 text-amber"
  };

  return <span className={`rounded-full border px-3 py-1 text-xs font-medium ${styles[variant]}`}>{children}</span>;
}
