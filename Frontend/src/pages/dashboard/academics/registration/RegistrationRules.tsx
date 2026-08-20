import { CircleCheck, CalendarClock, BookMarked, Users, Info } from "lucide-react";
import { cx } from "./token";
import { MIN_CREDITS, MAX_CREDITS } from "./conflicts";

const rules = [
  { icon: BookMarked, text: `Minimum ${MIN_CREDITS} credits required` },
  { icon: CircleCheck, text: `Maximum ${MAX_CREDITS} credits allowed` },
  { icon: CalendarClock, text: "Registration deadline: Aug 28, 2026" },
  { icon: Info, text: "Prerequisite requirements enforced" },
  { icon: Users, text: "Subject to course availability" },
];

export function RegistrationRules() {
  return (
    <div className={`${cx.card} p-5`}>
      <h2 className={`font-display text-sm font-semibold mb-3 ${cx.textPrimary}`}>Registration Info</h2>
      <div className="space-y-2.5">
        {rules.map((r) => {
          const Icon = r.icon;
          return (
            <div key={r.text} className="flex items-center gap-2.5">
              <span className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${cx.accentChip}`}>
                <Icon className="w-3 h-3" />
              </span>
              <span className={`text-xs ${cx.textSecondary}`}>{r.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}