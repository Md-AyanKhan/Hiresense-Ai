import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ label = "Loading" }) {
  return (
    <div className="flex items-center gap-3 text-sm text-white/70">
      <Loader2 className="h-5 w-5 animate-spin text-mint" />
      <span>{label}</span>
    </div>
  );
}
