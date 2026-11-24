import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertTriangle, GitCompareArrows, FileBarChart } from "lucide-react";
import { assessments, candidates, currentUser, assessmentById, band, type Candidate } from "../data";
import { Button, DecisionTag, EmptyState, PageHeader, Panel, Skeleton, StatusTag, Tabs } from "../components/ui";

type ReportTab = "All" | "Ready" | "In review" | "Decided";
const branchIds = new Set(assessments.filter((a) => a.branchId === currentUser.branchId).map((a) => a.id));
const eligible = candidates.filter((c) => branchIds.has(c.assessmentId) && (c.score !== undefined || c.status === "Completed"));
const tabFor = (c: Candidate): ReportTab | "Generating" => c.status === "Report ready" ? "Ready" : c.status === "Reviewed" ? "In review" : c.status === "Decided" ? "Decided" : "Generating";

export default function Reports() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<ReportTab>("All");
  const [loading, setLoading] = useState(true);
  useEffect(() => { const timer = window.setTimeout(() => setLoading(false), 600); return () => window.clearTimeout(timer); }, []);
  const counts = useMemo(() => ({ All: eligible.length, Ready: eligible.filter((c) => tabFor(c) === "Ready").length, "In review": eligible.filter((c) => tabFor(c) === "In review").length, Decided: eligible.filter((c) => tabFor(c) === "Decided").length }), []);
  const visible = eligible.filter((c) => tab === "All" || tabFor(c) === tab);
  return <div className="mx-auto max-w-[1280px]">
    <PageHeader title="Reports" meta="Review interview evidence and record hiring decisions" actions={<><Button icon={<GitCompareArrows size={15} />} onClick={() => navigate("/compare")}>Compare</Button></>} />
    <div className="mb-5"><Tabs value={tab} onChange={setTab} items={[{ value: "All", label: "All", count: counts.All }, { value: "Ready", label: "Ready", count: counts.Ready }, { value: "In review", label: "In review", count: counts["In review"] }, { value: "Decided", label: "Decided", count: counts.Decided }]} /></div>
    <Panel className="overflow-hidden">
      {loading ? <div className="px-5"><div className="grid grid-cols-[1.3fr_1.5fr_.65fr_1fr_.8fr_.9fr_auto] gap-4 border-b border-border py-3 text-xs font-semibold text-ink-3"><span>Candidate</span><span>Assessment</span><span>Overall</span><span>Needs review</span><span>Status</span><span>Decision</span><span /></div>{Array.from({ length: 5 }, (_, i) => <div key={i} className="grid grid-cols-[1.3fr_1.5fr_.65fr_1fr_.8fr_.9fr_auto] items-center gap-4 border-b border-border py-4 last:border-0"><Skeleton className="h-10 w-36" /><Skeleton className="h-4 w-40" /><Skeleton className="h-5 w-14" /><Skeleton className="h-4 w-24" /><Skeleton className="h-5 w-20" /><Skeleton className="h-5 w-16" /><Skeleton className="h-8 w-24" /></div>)}</div> : visible.length === 0 ? <EmptyState icon={<FileBarChart size={28} />} title={tab === "All" ? "No reports yet" : `No ${tab.toLowerCase()} reports`} body={tab === "All" ? "Reports appear here about 2 minutes after a candidate finishes" : "Reports in this status will appear here"} action={tab === "All" ? <Link to="/candidates?invite=1"><Button variant="primary">Invite candidates</Button></Link> : undefined} /> : <div className="overflow-x-auto"><table className="w-full min-w-[980px] text-left"><thead><tr className="border-b border-border text-xs font-semibold text-ink-3"><th className="px-5 py-3">Candidate</th><th className="px-3 py-3">Assessment</th><th className="px-3 py-3">Overall</th><th className="px-3 py-3">Needs review</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Decision</th><th className="px-3 py-3">Interviewed on</th><th className="px-4 py-3" /></tr></thead><tbody>{visible.map((c) => {
        const status = tabFor(c); const assessment = assessmentById(c.assessmentId);
        return <tr key={c.id} className="border-b border-border last:border-0 hover:bg-subtle/70"><td className="px-5 py-4"><span className="block text-sm font-semibold text-ink">{c.name}</span><span className="block text-xs text-ink-3">{c.email}</span></td><td className="max-w-[220px] px-3 py-4 text-caption text-ink-2"><span className="block truncate">{assessment.position}</span></td><td className="px-3 py-4">{c.score === undefined ? <span className="text-caption text-ink-3">—</span> : <span><span className="font-bold tabular-nums text-ink">{c.score}</span><span className="ml-1 text-xs text-ink-3">{band(c.score)}</span></span>}</td><td className="px-3 py-4">{c.lowConfidence ? <span className="inline-flex items-center gap-1.5 text-caption font-medium text-warning"><AlertTriangle size={14} />{c.lowConfidence} {c.lowConfidence === 1 ? "answer" : "answers"}</span> : <span className="text-caption text-ink-3">—</span>}</td><td className="px-3 py-4">{status === "Generating" ? <StatusTag status="Generating" /> : <StatusTag status={c.status} />}</td><td className="px-3 py-4">{c.decision ? <DecisionTag decision={c.decision} /> : <span className="text-caption text-ink-3">—</span>}</td><td className="px-3 py-4 text-caption text-ink-2">{c.interviewedOn ?? "—"}</td><td className="px-4 py-4">{status === "Generating" ? <span className="text-xs text-ink-3">Generating</span> : <Link to={`/reports/${c.id}`} className="inline-flex h-8 items-center rounded-btn-sm px-3 text-caption font-semibold text-primary hover:bg-primary-softer">Open report</Link>}</td></tr>;
      })}</tbody></table></div>}
    </Panel>
  </div>;
}
