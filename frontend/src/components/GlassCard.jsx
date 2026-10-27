import { motion } from "framer-motion";
import { cx } from "../utils/formatters.js";

export default function GlassCard({ children, className, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      className={cx("glass rounded-2xl p-5", className)}
    >
      {children}
    </motion.div>
  );
}
