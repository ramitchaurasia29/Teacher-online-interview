import { createContext, useCallback, useContext, useEffect, useState, type ReactNode, type ButtonHTMLAttributes } from "react";
import { X, Check, Lock } from "lucide-react";
import type { CandidateStatus, Decision, AssessmentStatus } from "../data";

/* ---------- Button ---------- */

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

const variantCls: Record<Variant, string> = {
  primary: "bg-primary text-primary-fg hover:bg-primary-hover shadow-primary",
  secondary: "bg-surface text-ink border border-border-strong hover:bg-subtle",
  ghost: "text-ink-2 hover:bg-primary-softer hover:text-primary",
  danger: "bg-danger text-primary-fg hover:opacity-90",
};
const sizeCls: Record<Size, string> = {
  sm: "h-8 px-3 text-caption gap-1.5 rounded-btn-sm",
  md: "h-10 px-4 text-sm gap-2 rounded-control",
};

export function Button({
  variant = "secondary",
  size = "md",
  icon,
  children,
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size; icon?: ReactNode }) {
  return (
    <button
      {...rest}
      className={
        "inline-flex shrink-0 items-center justify-center whitespace-nowrap font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none " +
        variantCls[variant] +
        " " +
        sizeCls[size] +
        " " +
        className
      }
    >
      {icon}
      {children}
    </button>
  );
}

export function IconButton({
  label,
  children,
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      {...rest}
      aria-label={label}
      title={label}
      className={
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-primary-softer hover:text-primary focus-visible:outline-2 focus-visible:outline-primary " +
        className
      }
    >
      {children}
    </button>
  );
}

/* ---------- Surfaces ---------- */

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={"rounded-card bg-surface shadow-card " + className}>{children}</section>;
}

export function PanelHeader({ title, action, count }: { title: string; action?: ReactNode; count?: number }) {
  return (
    <div className="flex items-center justify-between gap-3 px-6 pt-5 pb-3">
      <h2 className="flex items-center gap-2 text-title font-bold tracking-tight text-ink">
        {title}
        {count !== undefined && <span className="text-caption font-semibold text-ink-3 tabular-nums">{count}</span>}
      </h2>
      {action}
    </div>
  );
}

/* ---------- Page header ---------- */

export function PageHeader({ title, back, meta, actions }: { title: ReactNode; back?: ReactNode; meta?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 pb-6">
      <div className="min-w-0">
        {back}
        <h1 className="text-display font-bold leading-tight tracking-tight text-ink">{title}</h1>
        {meta && <div className="mt-1.5 text-sm text-ink-2">{meta}</div>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}

/* ---------- Avatar ---------- */

const hues = [
  "bg-tint-violet text-tint-violet-ink",
  "bg-tint-sky text-tint-sky-ink",
  "bg-tint-rose text-tint-rose-ink",
  "bg-tint-teal text-tint-teal-ink",
  "bg-tint-amber text-tint-amber-ink",
  "bg-primary-soft text-primary",
];

export function Avatar({ initials, hue = 0, size = "md" }: { initials: string; hue?: number; size?: "sm" | "md" | "lg" }) {
  const s = size === "sm" ? "h-7 w-7 text-[11px]" : size === "lg" ? "h-12 w-12 text-base" : "h-9 w-9 text-caption";
  return <span className={"inline-flex shrink-0 items-center justify-center rounded-full font-bold " + s + " " + hues[hue % hues.length]}>{initials}</span>;
}

/* ---------- Status ---------- */

const statusDot: Record<string, string> = {
  Invited: "bg-ink-3",
  Started: "bg-tint-sky-ink",
  Completed: "bg-tint-teal-ink",
  "Report ready": "bg-primary",
  Reviewed: "bg-tint-violet-ink",
  Decided: "bg-ink",
  Draft: "bg-ink-3",
  Published: "bg-success",
  Closed: "bg-border-strong",
  Generating: "bg-tint-sky-ink",
};

export function StatusTag({ status }: { status: CandidateStatus | AssessmentStatus | "Generating" }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-caption font-medium text-ink-2">
      <span className={"h-1.5 w-1.5 rounded-full " + (statusDot[status] ?? "bg-ink-3")} />
      {status}
    </span>
  );
}

const decisionCls: Record<Decision, string> = {
  Shortlist: "bg-success-soft text-success",
  Hold: "bg-warning-soft text-warning",
  Reject: "bg-subtle text-ink-2 border border-border",
};

export function DecisionTag({ decision }: { decision: Decision }) {
  return <span className={"inline-flex h-6 items-center rounded-full px-2.5 text-xs font-semibold " + decisionCls[decision]}>{decision === "Shortlist" ? "Shortlisted" : decision === "Hold" ? "On hold" : "Rejected"}</span>;
}

/* ---------- Rubric meter (signature) ---------- */
// A 0–4 rubric ladder. Fills each step the score reaches; a partial step fills proportionally.

export function RubricMeter({ score, size = "md", tone = "primary" }: { score: number; size?: "sm" | "md" | "lg"; tone?: "primary" | "light" }) {
  const h = size === "sm" ? "h-1.5" : size === "lg" ? "h-3" : "h-2";
  const w = size === "sm" ? "w-4" : size === "lg" ? "w-9" : "w-6";
  const track = tone === "light" ? "bg-primary-fg/25" : "bg-primary-soft";
  const fill = tone === "light" ? "bg-primary-fg" : "bg-primary";
  return (
    <span className="inline-flex items-center gap-[3px]" role="img" aria-label={`${score.toFixed(1)} out of 4`}>
      {[0, 1, 2, 3].map((i) => {
        const pct = Math.max(0, Math.min(1, score - i)) * 100;
        return (
          <span key={i} className={"relative overflow-hidden rounded-full " + h + " " + w + " " + track}>
            <span className={"absolute inset-y-0 left-0 rounded-full " + fill} style={{ width: pct + "%" }} />
          </span>
        );
      })}
    </span>
  );
}

export function ScoreOutOf({ score, className = "" }: { score: number; className?: string }) {
  return (
    <span className={"tabular-nums " + className}>
      <span className="font-bold text-ink">{Number.isInteger(score) ? score : score.toFixed(1)}</span>
      <span className="text-ink-3"> / 4</span>
    </span>
  );
}

/* ---------- Tabs (segmented) ---------- */

export function Tabs<T extends string>({ value, onChange, items }: { value: T; onChange: (v: T) => void; items: { value: T; label: string; count?: number }[] }) {
  return (
    <div role="tablist" className="inline-flex items-center gap-1 rounded-full bg-surface p-1 shadow-card">
      {items.map((it) => {
        const active = it.value === value;
        return (
          <button
            key={it.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(it.value)}
            className={
              "inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 text-caption font-semibold " +
              (active ? "bg-primary text-primary-fg" : "text-ink-2 hover:text-ink")
            }
          >
            {it.label}
            {it.count !== undefined && <span className={"tabular-nums " + (active ? "text-primary-fg/75" : "text-ink-3")}>{it.count}</span>}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Fields ---------- */

export function Field({ label, hint, error, children, optional }: { label: string; hint?: string; error?: string; children: ReactNode; optional?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-caption font-semibold text-ink">
        {label}
        {optional && <span className="font-normal text-ink-3"> (optional)</span>}
      </span>
      {children}
      {error ? <span className="mt-1.5 block text-caption text-danger">{error}</span> : hint ? <span className="mt-1.5 block text-caption text-ink-3">{hint}</span> : null}
    </label>
  );
}

export const inputCls =
  "h-10 w-full rounded-control border border-border-strong bg-surface px-3 text-sm text-ink placeholder:text-ink-3 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary-soft";

export function LockedNote({ by }: { by: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-ink-3">
      <Lock size={12} strokeWidth={2} /> Locked by {by}
    </span>
  );
}

/* ---------- Empty state ---------- */

export function EmptyState({ title, body, action, icon }: { title: string; body: string; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      {icon && <div className="mb-4 text-primary">{icon}</div>}
      <p className="text-title font-bold text-ink">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-ink-2">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* ---------- Dialog ---------- */

export function Dialog({ open, onClose, title, children, footer, width = "max-w-lg" }: { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode; width?: string }) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 animate-fade-in bg-ink/30" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-label={title} className={"relative w-full animate-pop-in rounded-card bg-surface shadow-pop " + width}>
        <div className="flex items-center justify-between px-6 pt-5">
          <h2 className="text-lg font-bold tracking-tight text-ink">{title}</h2>
          <IconButton label="Close" onClick={onClose}>
            <X size={18} strokeWidth={2} />
          </IconButton>
        </div>
        <div className="px-6 pt-3 pb-5">{children}</div>
        {footer && <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}

/* ---------- Drawer ---------- */

export function Drawer({ open, onClose, title, children, footer }: { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 animate-fade-in bg-ink/25" onClick={onClose} />
      <aside role="dialog" aria-label={title} className="absolute inset-y-0 right-0 flex w-[480px] max-w-full animate-slide-in-right flex-col bg-surface shadow-pop">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-bold tracking-tight">{title}</h2>
          <IconButton label="Close" onClick={onClose}>
            <X size={18} strokeWidth={2} />
          </IconButton>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">{footer}</div>}
      </aside>
    </div>
  );
}

/* ---------- Toast ---------- */

type ToastT = { id: number; text: string; action?: { label: string; onClick: () => void } };
const ToastCtx = createContext<(text: string, action?: ToastT["action"]) => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastT | null>(null);
  const show = useCallback((text: string, action?: ToastT["action"]) => {
    const id = Date.now();
    setToast({ id, text, action });
    window.setTimeout(() => setToast((t) => (t && t.id === id ? null : t)), action ? 8000 : 4500);
  }, []);
  return (
    <ToastCtx.Provider value={show}>
      {children}
      {toast && (
        <div key={toast.id} className="fixed bottom-6 left-1/2 z-[60] -ml-[180px] flex w-[360px] animate-rise items-center gap-3 rounded-2xl bg-ink px-4 py-3 text-sm text-primary-fg shadow-pop" role="status">
          <Check size={16} strokeWidth={2.5} className="shrink-0 text-tint-teal" />
          <span className="flex-1">{toast.text}</span>
          {toast.action && (
            <button
              className="font-semibold text-primary-soft hover:underline"
              onClick={() => {
                toast.action?.onClick();
                setToast(null);
              }}
            >
              {toast.action.label}
            </button>
          )}
          <button aria-label="Dismiss" onClick={() => setToast(null)} className="text-primary-fg/60 hover:text-primary-fg">
            <X size={15} />
          </button>
        </div>
      )}
    </ToastCtx.Provider>
  );
}

/* ---------- Skeleton ---------- */
export function Skeleton({ className = "" }: { className?: string }) {
  return <span className={"block rounded-md bg-border/70 " + className} />;
}
