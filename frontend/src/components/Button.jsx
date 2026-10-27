import { Loader2 } from "lucide-react";
import { cx } from "../utils/formatters.js";

const variants = {
  primary: "bg-mint text-ink shadow-glow hover:bg-[#78ecd5]",
  secondary: "bg-white/10 text-white hover:bg-white/20 border border-white/10",
  danger: "bg-coral text-white hover:bg-[#ff8d8a]"
};

export default function Button({
  children,
  className,
  variant = "primary",
  loading = false,
  icon: Icon,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : Icon ? <Icon className="h-4 w-4" /> : null}
      {children}
    </button>
  );
}
