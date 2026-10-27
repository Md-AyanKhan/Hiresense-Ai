import { Sparkles } from "lucide-react";

export default function EmptyState({ title, description }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-mint/10 text-mint">
        <Sparkles className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/50">{description}</p>
    </div>
  );
}
