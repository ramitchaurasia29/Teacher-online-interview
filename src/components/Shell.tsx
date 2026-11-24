import { useEffect, useRef, useState, type ReactNode } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  ClipboardList,
  Users,
  BookOpen,
  FileBarChart,
  UserCog,
  CreditCard,
  Settings,
  Search,
  Bell,
  ChevronsUpDown,
  Building2,
  Layers,
  GitCompareArrows,
  Check,
  HelpCircle,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { branches, currentUser, org, product, candidates, assessments } from "../data";
import { Avatar } from "./ui";

type NavItem = { to: string; label: string; icon: typeof LayoutGrid; end?: boolean; badge?: number };

const awaiting = candidates.filter(
  (c) => c.status === "Report ready" && assessments.find((a) => a.id === c.assessmentId)?.branchId === currentUser.branchId,
).length;

const principalNav: NavItem[] = [
  { to: "/", label: "Overview", icon: LayoutGrid, end: true },
  { to: "/assessments", label: "Assessments", icon: ClipboardList },
  { to: "/candidates", label: "Candidates", icon: Users },
  { to: "/reports", label: "Reports", icon: FileBarChart, badge: awaiting },
  { to: "/library", label: "Question library", icon: BookOpen },
  { to: "/team", label: "Team", icon: UserCog },
  { to: "/billing", label: "Billing", icon: CreditCard },
  { to: "/settings", label: "Settings", icon: Settings },
];

const chainNav: NavItem[] = [
  { to: "/org", label: "Organisation", icon: LayoutGrid, end: true },
  { to: "/org/branches", label: "Branches", icon: Building2 },
  { to: "/org/templates", label: "Templates", icon: Layers },
  { to: "/org/candidates", label: "Candidates & reports", icon: Users },
  { to: "/org/compare", label: "Compare candidates", icon: GitCompareArrows },
  { to: "/org/library", label: "Shared library", icon: BookOpen },
  { to: "/org/users", label: "Users and access", icon: UserCog },
  { to: "/org/billing", label: "Billing", icon: CreditCard },
];

function Logo({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="flex items-center gap-2.5 px-2">
      <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
        <rect width="30" height="30" rx="9" className="fill-primary" />
        {/* lens + check: evidence you can look through */}
        <circle cx="13.5" cy="13.5" r="6.2" fill="none" stroke="white" strokeWidth="2.2" />
        <path d="M18 18 L22.5 22.5" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M10.8 13.6 L12.9 15.6 L16.4 11.6" fill="none" stroke="white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {!collapsed && <span className="text-[19px] font-extrabold tracking-tight text-ink">{product.name}</span>}
    </div>
  );
}

function WorkspaceSwitcher({ isChain, collapsed }: { isChain: boolean; collapsed: boolean }) {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  const myBranch = branches.find((b) => b.id === currentUser.branchId)!;
  const title = isChain ? org.name : "Sunrise Public School";
  const sub = isChain ? "All branches · Chain Head" : `${myBranch.name}, ${myBranch.city}`;
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Switch workspace"
        className={"flex w-full items-center gap-3 rounded-2xl border border-border bg-surface text-left hover:border-border-strong " + (collapsed ? "justify-center p-1.5" : "px-3 py-2.5")}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-[12px] font-extrabold text-primary">SP</span>
        {!collapsed && (
          <>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-caption font-bold text-ink">{title}</span>
              <span className="block truncate text-xs text-ink-3">{sub}</span>
            </span>
            <ChevronsUpDown size={15} className="text-ink-3" />
          </>
        )}
      </button>
      {open && (
        <div className="absolute left-0 top-full z-40 mt-2 w-64 animate-rise rounded-2xl border border-border bg-surface p-1.5 shadow-md">
          <p className="px-3 pt-2 pb-1 text-xs font-semibold text-ink-3">Switch view</p>
          {[
            { label: "Sunrise Public School", sub: "Dwarka · Principal", to: "/", active: !isChain },
            { label: org.name, sub: "All branches · Chain Head", to: "/org", active: isChain },
          ].map((o) => (
            <button
              key={o.to}
              onClick={() => {
                setOpen(false);
                nav(o.to);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-subtle"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-caption font-semibold text-ink">{o.label}</span>
                <span className="block text-xs text-ink-3">{o.sub}</span>
              </span>
              {o.active && <Check size={15} className="text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Shell({ children }: { children: ReactNode }) {
  const loc = useLocation();
  const isChain = loc.pathname.startsWith("/org");
  const items = isChain ? chainNav : principalNav;
  const [collapsed, setCollapsed] = useState(false);
  const user = isChain ? { name: org.chainHead.name, initials: org.chainHead.initials, role: org.chainHead.title } : { name: currentUser.name, initials: currentUser.initials, role: "Principal" };

  return (
    <div className="flex min-h-screen bg-page">
      <div className="shrink-0 border-r border-border/70 bg-surface/70">
      <aside className={"sticky top-0 flex h-screen flex-col gap-5 px-3 py-5 transition-[width] duration-200 ease-out " + (collapsed ? "w-[76px]" : "w-[256px]")}>
        <div className="flex items-center justify-between">
          <Logo collapsed={collapsed} />
          {!collapsed && (
            <button aria-label="Collapse sidebar" title="Collapse sidebar" onClick={() => setCollapsed(true)} className="rounded-lg p-1.5 text-ink-3 hover:bg-subtle hover:text-ink">
              <PanelLeftClose size={17} />
            </button>
          )}
        </div>
        {collapsed && (
          <button aria-label="Expand sidebar" title="Expand sidebar" onClick={() => setCollapsed(false)} className="mx-auto rounded-lg p-1.5 text-ink-3 hover:bg-subtle hover:text-ink">
            <PanelLeftOpen size={17} />
          </button>
        )}

        <WorkspaceSwitcher isChain={isChain} collapsed={collapsed} />

        {!collapsed && (
          <label className="relative block">
            <span className="sr-only">Search</span>
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -mt-2 text-ink-3" />
            <input placeholder="Search candidates, assessments" className="h-10 w-full rounded-full border border-transparent bg-page pl-10 pr-3 text-caption text-ink placeholder:text-ink-3 focus:border-primary focus:bg-surface focus:outline-none" />
          </label>
        )}

        <nav className="flex flex-col gap-1" aria-label="Main">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <NavLink
                key={it.to}
                to={it.to}
                end={it.end}
                title={collapsed ? it.label : undefined}
                className={({ isActive }) =>
                  "group flex h-11 items-center gap-3 rounded-2xl text-sm font-semibold " +
                  (collapsed ? "justify-center px-0 " : "px-2 ") +
                  (isActive ? "bg-primary-soft text-primary" : "text-ink-2 hover:bg-subtle hover:text-ink")
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={"flex h-8 w-8 shrink-0 items-center justify-center rounded-full border " + (isActive ? "border-primary/20 bg-surface" : "border-border bg-surface")}>
                      <Icon size={16} strokeWidth={1.9} />
                    </span>
                    {!collapsed && <span className="flex-1 truncate">{it.label}</span>}
                    {!collapsed && it.badge ? (
                      <span className="mr-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-fg tabular-nums" aria-label={`${it.badge} awaiting review`}>
                        {it.badge}
                      </span>
                    ) : null}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto flex items-center gap-3 border-t border-border pt-4">
          <Avatar initials={user.initials} hue={5} />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-caption font-bold text-ink">{user.name}</p>
              <p className="truncate text-xs text-ink-3">{user.role}</p>
            </div>
          )}
        </div>
      </aside>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex h-16 items-center justify-end gap-1 px-8">
          <button aria-label="Help" title="Help" className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-2 hover:bg-surface">
            <HelpCircle size={18} strokeWidth={1.9} />
          </button>
          <button aria-label="Notifications, 3 new" title="Notifications" className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-2 hover:bg-surface">
            <Bell size={18} strokeWidth={1.9} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger ring-2 ring-page" />
          </button>
        </div>
        <main className="px-8 pb-16">{children}</main>
      </div>
    </div>
  );
}
