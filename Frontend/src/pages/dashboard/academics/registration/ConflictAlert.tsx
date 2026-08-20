import { AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { RegistrationConflict } from "./types";
import { cx } from "./token";

interface ConflictAlertProps {
  conflicts: RegistrationConflict[];
}

export function ConflictAlert({ conflicts }: ConflictAlertProps) {
  if (conflicts.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.2 }}
        className="space-y-2 mb-4 overflow-hidden"
      >
        {conflicts.map((c, i) => (
          <div
            key={`${c.type}-${i}`}
            className={`flex items-start gap-2.5 rounded-xl border px-3.5 py-3 border-[var(--color-accent-danger)]/20 ${cx.dangerChip}`}
          >
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed">{c.message}</p>
          </div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}