import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AlertTriangle, ArrowLeft, Copy, Mail, PencilLine, Send } from "lucide-react";
import { assessmentById, candidatesFor, competencies, pipelineStages, stageCounts } from "../data";
import { Avatar, Button, DecisionTag, Dialog, Field, inputCls, Panel, PanelHeader, StatusTag, useToast } from "../components/ui";
import type { CandidateStatus } from "../data";

export default function AssessmentDetail() {
  const { id = "a1" } = useParams();
  const nav = useNavigate();
  const toast = useToast();
  const assessment = assessmentById(id);
  const people = candidatesFor(assessment.id);
  const counts = stageCounts(assessment.id);
  const [stage, setStage] = useState<CandidateStatus | "All">("All");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [emails, setEmails] = useState("");
  const filtered = useMemo(() => people.filter((c) => stage === "All" || c.status === stage), [people, stage]);
  const parsedEmails = emails.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
  const validEmails = parsedEmails.filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));

  return (
    <div className="mx-auto max-w-[1280px]">
      <header className="flex flex-wrap items-end justify-between gap-4 pb-6">
        <div className="min-w-0">
          <Link to="/assessments" className="mb-3 inline-flex items-center gap-1.5 text-caption font-semibold text-ink-2 hover:text-primary"><ArrowLeft size={15} />Assessments</Link>
          <h1 className="text-display font-bold leading-tight tracking-tight text-ink">{assessment.position}</h1>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-2">{assessment.grade} {assessment.subject}<span className="text-ink-3">·</span>{assessment.board}<span className="text-ink-3">·</span>Version {assessment.version}<span className="text-ink-3">·</span>{assessment.duration} min<span className="text-ink-3">·</span>Closes {assessment.deadline}<span className="ml-1"><StatusTag status={assessment.status} /></span></p>
        </div>
        <div className="flex items-center gap-2"><Button icon={<Copy size={15} />} onClick={() => toast("Candidate link copied")}>Copy candidate link</Button><Button variant="primary" icon={<Send size={15} />} onClick={() => setInviteOpen(true)}>Invite candidates</Button></div>
      </header>

      <Panel className="mb-6 overflow-hidden">
        <PanelHeader title="Candidate pipeline" count={people.length} />
        <div className="grid grid-cols-2 gap-2 px-5 pb-5 sm:grid-cols-3 lg:grid-cols-6">
          {counts.map((item, i) => <button key={item.stage} onClick={() => setStage(stage === item.stage ? "All" : item.stage)} aria-pressed={stage === item.stage} className={`rounded-2xl border px-4 py-3 text-left transition-colors ${stage === item.stage ? "border-primary/20 bg-primary-soft" : "border-border bg-surface hover:bg-subtle"}`}><span className="block text-caption font-semibold text-ink-2">{item.stage}</span><span className={`mt-1 block text-2xl font-bold tabular-nums ${stage === item.stage ? "text-primary" : "text-ink"}`}>{item.count}</span><span className="mt-2 block h-1 rounded-full bg-primary/15"><span className={`block h-full rounded-full ${item.count ? ["bg-primary/35", "bg-primary/45", "bg-primary/55", "bg-primary/70", "bg-primary/85", "bg-primary"][i] : "bg-transparent"}`} style={{ width: `${Math.max(item.count ? 14 : 0, Math.round(item.count / Math.max(people.length, 1) * 100))}%` }} /></span></button>)}
        </div>
      </Panel>

      <div className="grid grid-cols-12 items-start gap-6">
        <Panel className="col-span-12 overflow-hidden lg:col-span-8">
          <PanelHeader title={stage === "All" ? "Candidates" : stage} count={filtered.length} action={stage !== "All" ? <button onClick={() => setStage("All")} className="text-caption font-semibold text-primary hover:underline">Clear filter</button> : undefined} />
          {filtered.length === 0 ? <div className="px-6 pb-6 text-sm text-ink-3">No candidates in this stage yet.</div> : <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead className="bg-subtle text-xs font-semibold uppercase tracking-wide text-ink-3"><tr><th className="px-6 py-3">Candidate</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Score</th><th className="px-4 py-3">Decision</th><th className="px-4 py-3">Invited on</th><th className="px-6 py-3 text-right">Action</th></tr></thead><tbody>{filtered.map((c) => <tr key={c.id} className="border-t border-border hover:bg-primary-softer/50"><td className="px-6 py-3.5"><div className="flex items-center gap-3"><Avatar initials={c.initials} hue={c.hue} size="sm" /><div className="min-w-0"><p className="truncate text-caption font-bold text-ink">{c.name}</p><p className="truncate text-xs text-ink-3">{c.email}</p></div></div></td><td className="px-4 py-3.5"><StatusTag status={c.status} /></td><td className="px-4 py-3.5 text-right text-sm font-bold tabular-nums text-ink">{c.score === undefined ? "—" : <span className="inline-flex items-center justify-end gap-1.5">{c.score}<span className="text-xs font-medium text-ink-3">/100</span>{c.lowConfidence ? <span title={`${c.lowConfidence} answer${c.lowConfidence === 1 ? "" : "s"} need a human check`} aria-label={`${c.lowConfidence} answers need a human check`}><AlertTriangle size={14} className="text-warning" /></span> : null}</span>}</td><td className="px-4 py-3.5">{c.decision ? <DecisionTag decision={c.decision} /> : <span className="text-caption text-ink-3">—</span>}</td><td className="px-4 py-3.5 text-caption text-ink-2">{c.invitedOn}</td><td className="px-6 py-3.5 text-right">{c.score !== undefined ? <Button size="sm" variant="ghost" onClick={() => nav(`/reports/${c.id}`)}>Open report</Button> : c.status === "Invited" ? <Button size="sm" variant="ghost" onClick={() => toast(`Invitation resent to ${c.name}`)}>Resend</Button> : <span className="text-caption text-ink-3">—</span>}</td></tr>)}</tbody></table></div>}
        </Panel>

        <Panel className="col-span-12 lg:col-span-4">
          <PanelHeader title="Assessment setup" action={<Button size="sm" variant="ghost" icon={<PencilLine size={14} />} onClick={() => nav("/assessments/new")}>Edit as new version</Button>} />
          <div className="px-6 pb-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-3">Competencies</p>
            <div className="flex flex-col gap-2">{competencies.map((c) => <div key={c.id} className="flex items-center justify-between gap-3 text-caption"><span className="text-ink-2">{c.name}</span><span className="font-semibold tabular-nums text-ink">{c.weight}%</span></div>)}</div>
            <div className="mt-5 border-t border-border pt-4"><p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-3">Interview settings</p><dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-caption"><dt className="text-ink-3">Mode</dt><dd className="font-medium text-ink">Adaptive</dd><dt className="text-ink-3">Follow-ups</dt><dd className="font-medium text-ink">2 per question</dd><dt className="text-ink-3">Difficulty</dt><dd className="font-medium text-ink">Standard</dd><dt className="text-ink-3">Language</dt><dd className="font-medium text-ink">English</dd><dt className="text-ink-3">Repeat question</dt><dd className="font-medium text-ink">2 times</dd><dt className="text-ink-3">Duration</dt><dd className="font-medium text-ink">{assessment.duration} min</dd></dl></div>
            <div className="mt-5 border-t border-border pt-4"><p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-3">Topics</p><div className="flex flex-wrap gap-1.5">{["Rational Numbers", "Linear Equations", "Squares and Square Roots", "Direct and Inverse Proportions"].map((topic) => <span key={topic} className="rounded-full bg-subtle px-2.5 py-1 text-xs font-medium text-ink-2">{topic}</span>)}</div></div>
            <div className="mt-5 border-t border-border pt-4"><p className="text-caption leading-relaxed text-ink-2">Published versions are locked. Editing creates version 3.</p></div>
          </div>
        </Panel>
      </div>

      <Dialog open={inviteOpen} onClose={() => setInviteOpen(false)} title="Invite candidates" footer={<><Button variant="ghost" onClick={() => setInviteOpen(false)}>Cancel</Button><Button variant="primary" icon={<Send size={15} />} disabled={!validEmails.length || validEmails.length !== parsedEmails.length} onClick={() => { toast(`${validEmails.length} invitation${validEmails.length === 1 ? "" : "s"} sent`); setInviteOpen(false); setEmails(""); }}>Send {validEmails.length || ""} invitations</Button></>}>
        <p className="mb-4 text-sm leading-relaxed text-ink-2">Send each candidate a private interview link. Enter email addresses separated by commas or new lines.</p>
        <Field label="Email addresses" hint={parsedEmails.length > 0 && validEmails.length !== parsedEmails.length ? "Check the email addresses that are marked invalid." : "Candidates can take the interview without creating an account."} error={parsedEmails.length > 0 && validEmails.length !== parsedEmails.length ? `${parsedEmails.length - validEmails.length} invalid email address${parsedEmails.length - validEmails.length === 1 ? "" : "es"}` : undefined}>
          <textarea value={emails} onChange={(e) => setEmails(e.target.value)} rows={5} placeholder="name@example.com, another@example.com" className={`${inputCls} h-auto resize-y py-2.5`} />
        </Field>
        {validEmails.length > 0 && <p className="mt-2 inline-flex items-center gap-1.5 text-caption font-medium text-success"><Mail size={14} />{validEmails.length} valid email{validEmails.length === 1 ? "" : "s"} ready to send</p>}
      </Dialog>
    </div>
  );
}
