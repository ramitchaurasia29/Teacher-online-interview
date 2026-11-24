import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal, Plus, Search, Copy, X, ArrowUpRight } from "lucide-react";
import { assessments, candidatesFor, type AssessmentStatus } from "../data";
import { Button, Dialog, EmptyState, Panel, StatusTag, Tabs, useToast } from "../components/ui";

const filters = ["All", "Draft", "Published", "Closed"] as const;
type Filter = (typeof filters)[number];

export default function Assessments() {
  const nav = useNavigate();
  const toast = useToast();
  const [filter, setFilter] = useState<Filter>("All");
  const [search, setSearch] = useState("");
  const [menu, setMenu] = useState<string | null>(null);
  const [closeTarget, setCloseTarget] = useState<string | null>(null);
  const [closedIds, setClosedIds] = useState<string[]>([]);
  const list = useMemo(() => assessments.map((a) => closedIds.includes(a.id) ? { ...a, status: "Closed" as AssessmentStatus } : a), [closedIds]);
  const counts = {
    All: list.length,
    Draft: list.filter((a) => a.status === "Draft").length,
    Published: list.filter((a) => a.status === "Published").length,
    Closed: list.filter((a) => a.status === "Closed").length,
  };
  const visible = list.filter((a) => (filter === "All" || a.status === filter) && `${a.position} ${a.subject} ${a.grade} ${a.board}`.toLowerCase().includes(search.toLowerCase().trim()));
  const activeAssessment = list.find((a) => a.id === closeTarget);
  const mainAction = (a: (typeof list)[number]) => {
    if (a.status === "Draft") return <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); nav("/assessments/new"); }}>Continue</Button>;
    if (a.status === "Closed") return <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); nav(`/assessments/${a.id}`); }}>View</Button>;
    return <Button size="sm" variant="ghost" icon={<Copy size={14} />} onClick={(e) => { e.stopPropagation(); toast("Candidate link copied"); }}>Copy link</Button>;
  };

  return (
    <div className="mx-auto max-w-[1280px]">
      <header className="flex flex-wrap items-end justify-between gap-4 pb-6">
        <div><h1 className="text-display font-bold leading-tight tracking-tight text-ink">Assessments</h1><p className="mt-1.5 text-sm text-ink-2">Set up interviews and follow each candidate through the process.</p></div>
        <Button variant="primary" icon={<Plus size={16} strokeWidth={2.4} />} onClick={() => nav("/assessments/new")}>Create assessment</Button>
      </header>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Tabs value={filter} onChange={setFilter} items={filters.map((f) => ({ value: f, label: f, count: counts[f] }))} />
        <label className="relative block w-full sm:w-72"><span className="sr-only">Search assessments</span><Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search assessments" className="h-10 w-full rounded-full border border-border bg-surface pl-10 pr-4 text-sm text-ink placeholder:text-ink-3 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary-soft" /></label>
      </div>

      <Panel className="overflow-hidden">
        {visible.length === 0 ? <EmptyState title={search || filter !== "All" ? "No matching assessments" : "No assessments yet"} body={search || filter !== "All" ? "Try another search or clear your filters." : "Create an assessment to start inviting candidates."} action={<Button size="sm" onClick={() => { setSearch(""); setFilter("All"); }}>Clear filters</Button>} /> : <>
          <div className="max-h-[calc(100vh-290px)] overflow-auto">
            <table className="w-full min-w-[930px] border-collapse text-left">
              <thead className="sticky top-0 z-10 bg-subtle text-xs font-semibold uppercase tracking-wide text-ink-3"><tr><th className="px-6 py-3">Position</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Invited</th><th className="px-4 py-3 text-right">Completed</th><th className="px-4 py-3">Deadline</th><th className="px-6 py-3 text-right">Actions</th></tr></thead>
              <tbody>{visible.map((a) => {
                const people = candidatesFor(a.id);
                const completed = people.filter((c) => ["Completed", "Report ready", "Reviewed", "Decided"].includes(c.status)).length;
                return <tr key={a.id} onClick={() => nav(`/assessments/${a.id}`)} className="cursor-pointer border-t border-border hover:bg-primary-softer/60">
                  <td className="px-6 py-4"><p className="text-sm font-bold text-ink">{a.position}</p><p className="mt-0.5 text-caption text-ink-3">{a.grade} · {a.subject} · {a.board}</p></td>
                  <td className="px-4 py-4"><StatusTag status={a.status} /></td>
                  <td className="px-4 py-4 text-right text-sm font-semibold tabular-nums text-ink">{people.length}</td>
                  <td className="px-4 py-4 text-right text-sm font-semibold tabular-nums text-ink">{completed}</td>
                  <td className="px-4 py-4 text-caption text-ink-2">{a.deadline}</td>
                  <td className="px-6 py-4"><div className="flex items-center justify-end gap-1">{mainAction(a)}<div className="relative"><button aria-label={`More actions for ${a.position}`} onClick={(e) => { e.stopPropagation(); setMenu(menu === a.id ? null : a.id); }} className="inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-3 hover:bg-subtle hover:text-ink"><MoreHorizontal size={18} /></button>
                    {menu === a.id && <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-xl border border-border bg-surface p-1.5 shadow-pop" onClick={(e) => e.stopPropagation()}>
                      <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-caption font-medium text-ink-2 hover:bg-subtle" onClick={() => { setMenu(null); nav("/assessments/new"); }}><Copy size={14} />Duplicate</button>
                      <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-caption font-medium text-ink-2 hover:bg-subtle" onClick={() => { setMenu(null); toast("Candidate link copied"); }}><Copy size={14} />Copy link</button>
                      {a.status === "Published" && <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-caption font-medium text-danger hover:bg-danger-soft" onClick={() => { setMenu(null); setCloseTarget(a.id); }}><X size={14} />Close assessment</button>}
                      {a.status !== "Published" && <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-caption font-medium text-ink-2 hover:bg-subtle" onClick={() => { setMenu(null); nav(`/assessments/${a.id}`); }}><ArrowUpRight size={14} />Open assessment</button>}
                    </div>}
                  </div></div></td>
                </tr>;
              })}</tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-border px-6 py-3 text-caption text-ink-3"><span>1–{visible.length} of {visible.length}</span><span>Showing assessments for Sunrise Public School</span></div>
        </>}
      </Panel>
      <Dialog open={!!closeTarget} onClose={() => setCloseTarget(null)} title={`Close ${activeAssessment?.position ?? "assessment"}?`} footer={<><Button variant="ghost" onClick={() => setCloseTarget(null)}>Cancel</Button><Button variant="danger" onClick={() => { if (closeTarget) setClosedIds((ids) => ids.includes(closeTarget) ? ids : [...ids, closeTarget]); setCloseTarget(null); toast("Assessment closed"); }}>Close assessment</Button></>}>
        <p className="text-sm leading-relaxed text-ink-2">Candidates who haven&apos;t started can&apos;t use their link anymore.</p>
      </Dialog>
    </div>
  );
}
