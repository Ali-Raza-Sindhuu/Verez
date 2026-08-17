import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Store,
  Bell,
  CreditCard,
  Upload,
  Check,
} from "lucide-react";

type Tab = "profile" | "store" | "notifications" | "billing";

const tabs: { id: Tab; label: string; icon: typeof User }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "store", label: "Store", icon: Store },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "billing", label: "Billing", icon: CreditCard },
];

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-2 sm:gap-6 py-5 border-b border-white/5 last:border-0">
      <div>
        <div className="text-sm text-cream">{label}</div>
        {hint && <div className="text-xs text-slate-text mt-1 sm:pr-4">{hint}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}

function inputClass() {
  return "w-full bg-white/5 border border-white/8 rounded-xl px-3.5 py-2.5 text-sm text-cream placeholder:text-slate-text focus:outline-none focus:border-teal/40 transition-colors";
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
        checked ? "bg-teal" : "bg-white/10"
      }`}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-ink"
        style={{ x: checked ? 20 : 0 }}
      />
    </button>
  );
}

export default function Settings() {
  const [tab, setTab] = useState<Tab>("profile");
  const [saved, setSaved] = useState(false);

  const [notif, setNotif] = useState({
    orders: true,
    lowStock: true,
    weeklyDigest: false,
    marketing: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-slate-text mt-1">Manage your account, store, and preferences.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 border-b border-white/8 mb-6 overflow-x-auto">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium shrink-0 transition-colors ${
                active ? "text-cream" : "text-slate-text hover:text-cream"
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
              {active && (
                <motion.span
                  layoutId="settings-tab-underline"
                  className="absolute left-0 right-0 -bottom-px h-0.5 bg-teal rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {tab === "profile" && (
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] px-5">
              <Field label="Photo" hint="Shown across the dashboard and on team invites.">
                <div className="flex items-center gap-4">
                  <span className="w-14 h-14 rounded-full bg-teal/15 border border-teal/30 flex items-center justify-center text-teal text-sm font-semibold shrink-0">
                    AK
                  </span>
                  <button className="inline-flex items-center gap-1.5 text-sm text-slate-text hover:text-cream border border-white/10 rounded-full px-3.5 py-2 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    Upload new
                  </button>
                </div>
              </Field>
              <Field label="Full name">
                <input type="text" defaultValue="Ali Khan" className={inputClass()} />
              </Field>
              <Field label="Email" hint="Used for login and account notifications.">
                <input type="email" defaultValue="ali@vexez.com" className={inputClass()} />
              </Field>
              <Field label="Role">
                <input type="text" defaultValue="Owner" disabled className={`${inputClass()} opacity-60 cursor-not-allowed`} />
              </Field>
            </div>
          )}

          {tab === "store" && (
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] px-5">
              <Field label="Store name">
                <input type="text" defaultValue="Vexez" className={inputClass()} />
              </Field>
              <Field label="Store URL" hint="Your public storefront address.">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-text shrink-0">vexez.com/</span>
                  <input type="text" defaultValue="store" className={inputClass()} />
                </div>
              </Field>
              <Field label="Currency">
                <select defaultValue="USD" className={inputClass()}>
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                  <option>PKR</option>
                </select>
              </Field>
              <Field label="Time zone">
                <select defaultValue="UTC" className={inputClass()}>
                  <option>UTC</option>
                  <option>Asia/Karachi</option>
                  <option>America/New_York</option>
                  <option>Europe/London</option>
                </select>
              </Field>
            </div>
          )}

          {tab === "notifications" && (
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] px-5">
              <Field label="New orders" hint="Get notified when a customer places an order.">
                <Toggle checked={notif.orders} onChange={() => setNotif((n) => ({ ...n, orders: !n.orders }))} />
              </Field>
              <Field label="Low stock alerts" hint="Notify when a product drops below its threshold.">
                <Toggle checked={notif.lowStock} onChange={() => setNotif((n) => ({ ...n, lowStock: !n.lowStock }))} />
              </Field>
              <Field label="Weekly digest" hint="A summary of revenue, orders, and top products.">
                <Toggle
                  checked={notif.weeklyDigest}
                  onChange={() => setNotif((n) => ({ ...n, weeklyDigest: !n.weeklyDigest }))}
                />
              </Field>
              <Field label="Product updates" hint="Occasional emails about new Vexez features.">
                <Toggle checked={notif.marketing} onChange={() => setNotif((n) => ({ ...n, marketing: !n.marketing }))} />
              </Field>
            </div>
          )}

          {tab === "billing" && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-text">Current plan</span>
                  <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border bg-teal/10 text-teal border-teal/20">
                    Active
                  </span>
                </div>
                <div className="font-display text-xl font-semibold mt-1">Growth — $79/mo</div>
                <p className="text-xs text-slate-text mt-1">Renews on Sep 16, 2026.</p>
                <button className="mt-4 text-sm text-teal hover:text-teal-glow transition-colors">
                  Change plan
                </button>
              </div>

              <div className="rounded-2xl border border-white/8 bg-white/[0.02] px-5">
                <Field label="Payment method">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-cream">Visa ending in 4242</span>
                    <button className="text-sm text-teal hover:text-teal-glow transition-colors">Update</button>
                  </div>
                </Field>
                <Field label="Billing email">
                  <input type="email" defaultValue="billing@vexez.com" className={inputClass()} />
                </Field>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Save bar */}
      <div className="flex items-center justify-end gap-3 mt-6">
        <AnimatePresence>
          {saved && (
            <motion.span
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center gap-1.5 text-sm text-teal"
            >
              <Check className="w-4 h-4" />
              Saved
            </motion.span>
          )}
        </AnimatePresence>
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 bg-teal text-ink text-sm font-medium px-5 py-2.5 rounded-full hover:bg-teal-glow transition-colors"
        >
          Save changes
        </button>
      </div>
    </motion.div>
  );
}