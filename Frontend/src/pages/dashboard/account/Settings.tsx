import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  GraduationCap,
  Bell,
  Palette,
  ShieldCheck,
  Upload,
  Check,
} from "lucide-react";

type Tab = "profile" | "academic" | "notifications" | "appearance" | "account";

const tabs: { id: Tab; label: string; icon: typeof User }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "academic", label: "Academic", icon: GraduationCap },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "account", label: "Account & Security", icon: ShieldCheck },
];

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
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
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${checked ? "bg-teal" : "bg-white/10"}`}
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

const themeOptions = [
  { id: "ink", label: "Ink (default)", swatch: "#0A1210" },
  { id: "midnight", label: "Midnight", swatch: "#0b1220" },
  { id: "charcoal", label: "Charcoal", swatch: "#14171a" },
];

export default function Settings() {
  const [tab, setTab] = useState<Tab>("profile");
  const [saved, setSaved] = useState(false);
  const [theme, setTheme] = useState("ink");

  const [notif, setNotif] = useState({
    assignmentDue: true,
    gradePosted: true,
    lowAttendance: true,
    groupMessages: true,
    announcements: true,
    weeklyDigest: false,
    studyReminders: true,
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
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-slate-text mt-1">Manage your profile, academic info, and preferences.</p>
      </div>

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
              <Field label="Photo" hint="Shown across the app and in group chats.">
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
              <Field label="Email" hint="Used for login and notifications.">
                <input type="email" defaultValue="ali@vexez.com" className={inputClass()} />
              </Field>
              <Field label="Bio">
                <textarea
                  defaultValue="BSCS student, interested in agentic AI and full-stack development."
                  rows={3}
                  className={`${inputClass()} resize-none`}
                />
              </Field>
            </div>
          )}

          {tab === "academic" && (
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] px-5">
              <Field label="University">
                <input type="text" defaultValue="University of Management and Technology" className={inputClass()} />
              </Field>
              <Field label="Degree program">
                <input type="text" defaultValue="BSCS" className={inputClass()} />
              </Field>
              <Field label="Current semester">
                <select defaultValue="Fall 2026" className={inputClass()}>
                  <option>Fall 2026</option>
                  <option>Summer 2026</option>
                  <option>Spring 2026</option>
                </select>
              </Field>
              <Field label="Expected graduation">
                <input type="text" defaultValue="2029" className={inputClass()} />
              </Field>
              <Field label="Grading scale" hint="Used to calculate your GPA.">
                <select defaultValue="4.0" className={inputClass()}>
                  <option value="4.0">4.0 scale</option>
                  <option value="5.0">5.0 scale</option>
                  <option value="percentage">Percentage-based</option>
                </select>
              </Field>
            </div>
          )}

          {tab === "notifications" && (
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] px-5">
              <Field label="Assignment due soon" hint="Get notified 24 hours before a deadline.">
                <Toggle checked={notif.assignmentDue} onChange={() => setNotif((n) => ({ ...n, assignmentDue: !n.assignmentDue }))} />
              </Field>
              <Field label="Grade posted" hint="Notify when a new grade is available.">
                <Toggle checked={notif.gradePosted} onChange={() => setNotif((n) => ({ ...n, gradePosted: !n.gradePosted }))} />
              </Field>
              <Field label="Low attendance warning" hint="Alert when a course drops below the minimum threshold.">
                <Toggle checked={notif.lowAttendance} onChange={() => setNotif((n) => ({ ...n, lowAttendance: !n.lowAttendance }))} />
              </Field>
              <Field label="Group messages" hint="Notify on new messages in your groups.">
                <Toggle checked={notif.groupMessages} onChange={() => setNotif((n) => ({ ...n, groupMessages: !n.groupMessages }))} />
              </Field>
              <Field label="Announcements" hint="Course and group announcements.">
                <Toggle checked={notif.announcements} onChange={() => setNotif((n) => ({ ...n, announcements: !n.announcements }))} />
              </Field>
              <Field label="Study reminders" hint="Reminders for scheduled study sessions.">
                <Toggle checked={notif.studyReminders} onChange={() => setNotif((n) => ({ ...n, studyReminders: !n.studyReminders }))} />
              </Field>
              <Field label="Weekly digest" hint="A summary of your week every Sunday evening.">
                <Toggle checked={notif.weeklyDigest} onChange={() => setNotif((n) => ({ ...n, weeklyDigest: !n.weeklyDigest }))} />
              </Field>
            </div>
          )}

          {tab === "appearance" && (
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] px-5">
              <Field label="Theme" hint="Choose your preferred color palette.">
                <div className="flex flex-wrap gap-2">
                  {themeOptions.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs transition-colors ${
                        theme === t.id ? "border-teal/40 bg-teal/[0.06] text-cream" : "border-white/10 text-slate-text hover:text-cream"
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: t.swatch }} />
                      {t.label}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Compact sidebar" hint="Start with the sidebar collapsed by default.">
                <Toggle checked={false} onChange={() => {}} />
              </Field>
              <Field label="Reduce motion" hint="Minimize animations across the app.">
                <Toggle checked={false} onChange={() => {}} />
              </Field>
            </div>
          )}

          {tab === "account" && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/8 bg-white/[0.02] px-5">
                <Field label="Password">
                  <button className="text-sm text-teal hover:text-teal-glow transition-colors">Change password</button>
                </Field>
                <Field label="Two-factor authentication" hint="Add an extra layer of security to your account.">
                  <Toggle checked={false} onChange={() => {}} />
                </Field>
                <Field label="Active sessions" hint="Manage devices currently signed in.">
                  <button className="text-sm text-teal hover:text-teal-glow transition-colors">View sessions</button>
                </Field>
              </div>
              <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.03] p-5">
                <div className="text-sm text-cream mb-1">Delete account</div>
                <p className="text-xs text-slate-text mb-3">
                  Permanently delete your account and all associated data. This cannot be undone.
                </p>
                <button className="text-xs font-medium text-red-400 hover:text-red-300 border border-red-500/25 rounded-full px-3.5 py-1.5 transition-colors">
                  Delete my account
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

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