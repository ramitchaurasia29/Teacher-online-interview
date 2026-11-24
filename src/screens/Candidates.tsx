import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertTriangle, Check, Copy, MoreHorizontal, Search, Send, UserPlus, X } from "lucide-react";
import { assessments, candidates as seedCandidates, currentUser, pipelineStages, assessmentById, type Candidate, type CandidateStatus } from "../data";
import { Avatar, Button, DecisionTag, Dialog, Drawer, EmptyState, PageHeader, StatusTag, useToast, inputCls } from "../components/ui";

const branchAssessments = assessments.filter((a) => a.branchId === currentUser.branchId);
const branchIds = new Set(branchAssessments.map((a) => a.id));
const stages: (CandidateStatus | "")[] = ["", ...pipelineStages];

export default function Candidates() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const [rows, setRows] = useState(() => seedCandidates.filter((c) => branchIds.has(c.assessmentId)));
  const [query, setQuery] = useState("");
  const [assessmentFilter, setAssessmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<CandidateStatus | "">("");
  const [selected, setSelected] = useState<string[]>([]);
  const [inviteOpen, setInviteOpen] = useState(new URLSearchParams(location.search).get("invite") === "1");
  const [revoke, setRevoke] = useState<Candidate | null>(null);
  const [menu, setMenu] = useState<string | null>(null);
  const [inviteTab, setInviteTab] = useState<"Email" | "Copy link">("Email");
  const [assessmentId, setAssessmentId] = useState(branchAssessments.find((a) => a.status === "Published")?.id ?? "");
  const [emails, setEmails] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const parsed = emails.split(/[\s,;]+/).map((e) => e.trim()).filter(Boolean);
  const validEmails = parsed.filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
  const published = branchAssessments.filter((a) => a.status === "Published");
  useEffect(() => {
    if (new URLSearchParams(location.search).get("invite") === "1") setInviteOpen(true);
  }, [location.search]);

  const filtered = useMemo(() => rows.filter((c) => {
    const q = query.toLowerCase();
    return (!q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)) &&
      (!assessmentFilter || c.assessmentId === assessmentFilter) && (!statusFilter || c.status === statusFilter);
  }), [rows, query, assessmentFilter, statusFilter]);
  const clearFilters = () => { setQuery(""); setAssessmentFilter(""); setStatusFilter(""); };
  const copy = (text: string) => { void navigator.clipboard?.writeText(text); toast("Invitation link copied"); };
  const toggle = (id: string) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  const revokeCandidate = () => {
    if (!revoke) return;
    const removed = revoke;
    setRows((r) => r.filter((c) => c.id !== removed.id));
    setSelected((s) => s.filter((id) => id !== removed.id));
    setRevoke(null);
    toast(`${removed.name}'s invitation revoked`, { label: "Undo", onClick: () => setRows((r) => [...r, removed]) });
  };
  const resend = (c: Candidate) => toast(`Invitation resent to ${c.name}`);
  const copyCandidate = (c: Candidate) => copy(`https://teachlens.in/interview/${c.id}`);
  const bulkResend = () => { toast(`${selected.length} invitations resent`); setSelected([]); };
  const bulkRevoke = () => {
    const removed = rows.filter((r) => selected.includes(r.id));
    setRows((r) => r.filter((c) => !selected.includes(c.id)));
    setSelected([]);
    toast(`${removed.length} invitations revoked`, { label: "Undo", onClick: () => setRows((r) => [...r, ...removed]) });
  };

  return <div className="mx-auto max-w-[1280px]">
    <PageHeader title="Candidates" meta={`${rows.length} candidates across your branch`} actions={<Button variant="primary" icon={<UserPlus size={16} />} onClick={() => setInviteOpen(true)}>Invite candidates</Button>} />
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      {selected.length ? <div className="flex min-h-10 items-center gap-2 rounded-control bg-primary-soft px-3 text-caption font-semibold text-primary">
        <Check size={15} /> {selected.length} selected <span className="mx-1 h-4 border-l border-primary/20" />
        <button onClick={bulkResend} className="rounded-btn-sm px-2 py-1 hover:bg-surface">Resend invites</button>
        <button onClick={bulkRevoke} className="rounded-btn-sm px-2 py-1 hover:bg-surface">Revoke</button>
        <button onClick={() => setSelected([])} className="rounded-btn-sm px-2 py-1 hover:bg-surface">Clear</button>
      </div> : <div className="flex flex-wrap items-center gap-2">
        <label className="relative block w-64"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name or email" className={inputCls + " pl-9"} /></label>
        <select aria-label="Filter by assessment" value={assessmentFilter} onChange={(e) => setAssessmentFilter(e.target.value)} className={inputCls + " w-auto min-w-48"}><option value="">All assessments</option>{branchAssessments.map((a) => <option key={a.id} value={a.id}>{a.position}</option>)}</select>
        <select aria-label="Filter by status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as CandidateStatus | "")} className={inputCls + " w-auto min-w-36"}><option value="">All statuses</option>{pipelineStages.map((s) => <option key={s}>{s}</option>)}</select>
      </div>}
      <span className="text-caption text-ink-3 tabular-nums">{filtered.length} results</span>
    </div>
    {(query || assessmentFilter || statusFilter) && <div className="mb-3 flex flex-wrap items-center gap-2 text-caption">
      {query && <FilterChip label={`Search: ${query}`} onRemove={() => setQuery("")} />}
      {assessmentFilter && <FilterChip label={assessmentById(assessmentFilter).position} onRemove={() => setAssessmentFilter("")} />}
      {statusFilter && <FilterChip label={statusFilter} onRemove={() => setStatusFilter("")} />}
      <button onClick={clearFilters} className="font-semibold text-primary hover:underline">Clear all</button>
    </div>}
    <section className="overflow-hidden rounded-card bg-surface shadow-card">
      {filtered.length === 0 ? <EmptyState title="No candidates match these filters" body="Clear a filter or try a different search" action={<Button onClick={clearFilters}>Clear filters</Button>} /> : <div className="overflow-x-auto">
        <table className="w-full min-w-[1040px] text-left">
          <thead><tr className="border-b border-border text-xs font-semibold text-ink-3"><th className="w-12 px-5 py-3"><input aria-label="Select all candidates" type="checkbox" checked={filtered.length > 0 && filtered.every((c) => selected.includes(c.id))} onChange={(e) => setSelected(e.target.checked ? filtered.map((c) => c.id) : [])} /></th><th className="px-3 py-3">Candidate</th><th className="px-3 py-3">Assessment</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Score</th><th className="px-3 py-3">Decision</th><th className="px-3 py-3">Invited on</th><th className="px-4 py-3">Actions</th><th /></tr></thead>
          <tbody>{filtered.map((c) => {
            const a = assessmentById(c.assessmentId);
            const action = c.status === "Report ready" || c.status === "Reviewed" || c.status === "Decided" ? "Open report" : c.status === "Invited" ? "Resend invite" : "Copy link";
            return <tr key={c.id} className="border-b border-border last:border-0 hover:bg-subtle/70">
              <td className="px-5 py-4"><input aria-label={`Select ${c.name}`} type="checkbox" checked={selected.includes(c.id)} onChange={() => toggle(c.id)} /></td>
              <td className="px-3 py-4"><div className="flex items-center gap-3"><Avatar initials={c.initials} hue={c.hue} /><span className="min-w-0"><span className="block text-sm font-semibold text-ink">{c.name}</span><span className="block text-xs text-ink-3">{c.email}</span></span></div></td>
              <td className="max-w-[210px] px-3 py-4 text-caption text-ink-2"><span className="block truncate">{a.position}</span></td>
              <td className="px-3 py-4"><StatusTag status={c.status} />{c.expires === "Tomorrow" && <span className="mt-1 block text-xs font-medium text-warning">Expires tomorrow</span>}</td>
              <td className="px-3 py-4"><span className="inline-flex items-center gap-1.5 text-sm font-bold tabular-nums">{c.score ?? "—"}{c.score !== undefined && <span className="text-xs font-normal text-ink-3">/100</span>}{!!c.lowConfidence && <AlertTriangle size={14} className="text-warning" aria-label={`${c.lowConfidence} low-confidence answers`} />}</span></td>
              <td className="px-3 py-4">{c.decision ? <DecisionTag decision={c.decision} /> : <span className="text-caption text-ink-3">—</span>}</td>
              <td className="px-3 py-4 text-caption text-ink-2">{c.invitedOn}</td>
              <td className="px-4 py-4"><Button size="sm" variant="ghost" onClick={() => action === "Open report" ? navigate(`/reports/${c.id}`) : action === "Resend invite" ? resend(c) : copyCandidate(c)}>{action}</Button></td>
              <td className="relative px-3 py-4"><button aria-label={`More actions for ${c.name}`} onClick={() => setMenu(menu === c.id ? null : c.id)} className="rounded-full p-2 text-ink-3 hover:bg-subtle"><MoreHorizontal size={17} /></button>{menu === c.id && <div className="absolute right-3 top-12 z-20 w-44 rounded-xl border border-border bg-surface p-1 shadow-pop"><button onClick={() => { resend(c); setMenu(null); }} className="block w-full rounded-lg px-3 py-2 text-left text-caption hover:bg-subtle">Resend</button><button onClick={() => { copyCandidate(c); setMenu(null); }} className="block w-full rounded-lg px-3 py-2 text-left text-caption hover:bg-subtle">Copy link</button><button onClick={() => { setRevoke(c); setMenu(null); }} className="block w-full rounded-lg px-3 py-2 text-left text-caption text-danger hover:bg-danger-soft">Revoke invitation</button></div>}</td>
            </tr>;
          })}</tbody>
        </table>
      </div>}
    </section>
    <Drawer open={inviteOpen} onClose={() => { setInviteOpen(false); if (new URLSearchParams(location.search).has("invite")) navigate("/candidates", { replace: true }); }} title="Invite candidates" footer={<><Button variant="ghost" onClick={() => setInviteOpen(false)}>Cancel</Button>{inviteTab === "Email" ? <Button variant="primary" icon={<Send size={15} />} disabled={!validEmails.length || !assessmentId} onClick={() => { toast(`${validEmails.length} ${validEmails.length === 1 ? "invitation" : "invitations"} sent`); setInviteOpen(false); setEmails(""); }}>{`Send ${validEmails.length || 1} ${validEmails.length === 1 ? "invitation" : "invitations"}`}</Button> : <Button variant="primary" icon={<Copy size={15} />} onClick={() => { copy(`https://teachlens.in/interview/${assessmentId}`); setCopied(true); }}>Copy link</Button>}</>}>
      <label className="mb-5 block"><span className="mb-1.5 block text-caption font-semibold text-ink">Assessment</span><select value={assessmentId} onChange={(e) => setAssessmentId(e.target.value)} className={inputCls}>{published.map((a) => <option key={a.id} value={a.id}>{a.position}</option>)}</select></label>
      <div className="mb-5 flex gap-1 border-b border-border"><button onClick={() => setInviteTab("Email")} className={`px-3 py-2 text-caption font-semibold ${inviteTab === "Email" ? "border-b-2 border-primary text-primary" : "text-ink-3"}`}>Email</button><button onClick={() => setInviteTab("Copy link")} className={`px-3 py-2 text-caption font-semibold ${inviteTab === "Copy link" ? "border-b-2 border-primary text-primary" : "text-ink-3"}`}>Copy link</button></div>
      {inviteTab === "Email" ? <><label className="block"><span className="mb-1.5 block text-caption font-semibold text-ink">Email addresses</span><textarea value={emails} onChange={(e) => setEmails(e.target.value)} placeholder="Add email addresses, separated by commas or lines" className="min-h-28 w-full rounded-control border border-border-strong bg-surface px-3 py-2.5 text-sm placeholder:text-ink-3 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary-soft" /></label>{parsed.length > 0 && <div className="mt-2 flex flex-wrap gap-1.5">{parsed.map((email, i) => <span key={`${email}-${i}`} className={`rounded-full px-2.5 py-1 text-xs ${/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "bg-primary-soft text-primary" : "bg-danger-soft text-danger"}`}>{email}{!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && " · invalid"}</span>)}</div>}<label className="mt-5 block"><span className="mb-1.5 block text-caption font-semibold text-ink">Message <span className="font-normal text-ink-3">(optional)</span></span><textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Add a note to your invitation" className="min-h-24 w-full rounded-control border border-border-strong bg-surface px-3 py-2.5 text-sm placeholder:text-ink-3 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary-soft" /></label></> : <div className="rounded-control border border-border bg-subtle p-4"><p className="text-caption font-semibold text-ink">Candidate interview link</p><div className="mt-2 flex items-center gap-2"><code className="min-w-0 flex-1 truncate text-caption text-ink-2">https://teachlens.in/interview/{assessmentId || "assessment"}</code><button aria-label="Copy link" onClick={() => { copy(`https://teachlens.in/interview/${assessmentId}`); setCopied(true); }} className="rounded-lg p-2 text-primary hover:bg-primary-soft">{copied ? <Check size={16} /> : <Copy size={16} />}</button></div></div>}
    </Drawer>
    <Dialog open={!!revoke} onClose={() => setRevoke(null)} title={`Revoke ${revoke?.name}'s invitation?`} footer={<><Button variant="ghost" onClick={() => setRevoke(null)}>Cancel</Button><Button variant="danger" onClick={revokeCandidate}>Revoke invitation</Button></>}><p className="text-sm text-ink-2">Their link stops working. You can invite them again later.</p></Dialog>
  </div>;
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 font-medium text-primary">{label}<button aria-label={`Remove ${label} filter`} onClick={onRemove}><X size={13} /></button></span>;
}
