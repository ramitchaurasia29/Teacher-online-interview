import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileCheck2, FilePen, Clock3, ArrowUpRight, Plus, Send, CheckCircle2, UserPlus, Megaphone, MessageSquare, AlertTriangle, CircleCheck } from "lucide-react";
import {
  assessments,
  candidates,
  currentUser,
  overviewCounts,
  stageCounts,
  recentActivity,
  competencies,
  reportCompetencyScores,
  band,
  candidatesFor,
} from "../data";
import { Button, Panel, PanelHeader, Avatar, RubricMeter, useToast, EmptyState } from "../components/ui";
import { useScreenInit } from "../useScreenInit";

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

type Action = { id: string; kind: "review" | "publish" | "expiring"; title: string; context: string; cta: string; to?: string; candidateInitials?: string; hue?: number; meta?: string };

const mine = assessments.filter((a) => a.branchId === currentUser.branchId);

const initialActions: Action[] = [
  ...candidates
    .filter((c) => c.status === "Report ready" && mine.some((a) => a.id === c.assessmentId))
    .map((c) => ({
      id: "r-" + c.id,
      kind: "review" as const,
      title: `Review ${c.name}'s report`,
      context: mine.find((a) => a.id === c.assessmentId)!.position,
      meta: `${c.score} / 100` + (c.lowConfidence ? ` · ${c.lowConfidence} ${c.lowConfidence === 1 ? "answer needs" : "answers need"} a human check` : ""),
      cta: "Review",
      to: "/reports/" + c.id,
      candidateInitials: c.initials,
      hue: c.hue,
    })),
  { id: "p-a2", kind: "publish", title: "Publish draft assessment", context: "Mathematics Teacher, middle school", meta: "Kavita Bansal asked you to publish", cta: "Open draft", to: "/assessments/new?step=5" },
  ...candidates
    .filter((c) => c.status === "Invited" && c.expires === "Tomorrow")
    .map((c) => ({ id: "e-" + c.id, kind: "expiring" as const, title: `${c.name}'s invitation expires tomorrow`, context: mine.find((a) => a.id === c.assessmentId)!.position, meta: "Not started", cta: "Resend invite" })),
];

const actIcon = { review: FileCheck2, publish: FilePen, expiring: Clock3 };

const activityIcon = { report: FileCheck2, decision: CheckCircle2, invite: UserPlus, publish: Megaphone, comment: MessageSquare, complete: CircleCheck };

export default function Overview() {
  const init = useScreenInit() as { empty?: boolean };
  const nav = useNavigate();
  const toast = useToast();
  const [actions, setActions] = useState(init.empty ? [] : initialActions);
  const k = overviewCounts();
  const featured = candidates.find((c) => c.id === "c1")!;
  const reviewCount = actions.filter((a) => a.kind === "review").length;
  const expiring = actions.filter((a) => a.kind === "expiring").length;

  if (init.empty) return <FirstRun />;

  const metrics = [
    { label: "Active assessments", value: k.active, to: "/assessments" },
    { label: "Candidates invited", value: k.invited, to: "/candidates" },
    { label: "Interviews completed", value: k.completed, sub: `${k.pending} pending`, to: "/candidates" },
    { label: "Reports ready", value: k.reportsReady, to: "/reports" },
    { label: "Awaiting your review", value: k.awaitingReview, to: "/reports", accent: true },
  ];

  return (
    <div className="mx-auto max-w-[1280px]">
      <header className="flex flex-wrap items-end justify-between gap-4 pb-7">
        <div>
          <h1 className="text-[30px] font-bold leading-tight tracking-tight text-ink">
            {greeting()}, {currentUser.first}
          </h1>
          <p className="mt-1.5 text-[15px] text-ink-2">
            {reviewCount > 0 ? (
              <>
                <span className="font-semibold text-primary">
                  {reviewCount} {reviewCount === 1 ? "report waits" : "reports wait"} for your review
                </span>
                .{" "}
              </>
            ) : (
              "You're all caught up on reports. "
            )}
            {expiring > 0 && <span>1 invitation expires tomorrow.</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button icon={<Send size={16} />} onClick={() => nav("/candidates?invite=1")}>
            Invite candidate
          </Button>
          <Button variant="primary" icon={<Plus size={16} strokeWidth={2.4} />} onClick={() => nav("/assessments/new")}>
            Create assessment
          </Button>
        </div>
      </header>

      {/* Metric strip: one panel, hairline-divided */}
      <Panel className="mb-6 grid grid-cols-5 divide-x divide-border">
        {metrics.map((m) => (
          <Link key={m.label} to={m.to} className="group px-6 py-5 first:rounded-l-card last:rounded-r-card hover:bg-primary-softer">
            <p className="text-caption font-medium text-ink-2">{m.label}</p>
            <p className="mt-2 flex items-baseline gap-2">
              <span className={"text-[32px] font-bold leading-none tracking-tight tabular-nums " + (m.accent ? "text-primary" : "text-ink")}>{m.value}</span>
              {m.sub && <span className="text-caption text-ink-3">{m.sub}</span>}
            </p>
          </Link>
        ))}
      </Panel>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 flex flex-col gap-6">
          <Panel>
            <PanelHeader title="Needs your action" count={actions.length} />
            {actions.length === 0 ? (
              <EmptyState icon={<CheckCircle2 size={28} />} title="Nothing needs you right now" body="New reports and requests from your team will show up here" />
            ) : (
              <ul className="px-3 pb-3">
                {actions.map((a) => {
                  const Icon = actIcon[a.kind];
                  return (
                    <li key={a.id} className="group flex animate-fade-in items-center gap-4 rounded-2xl px-3 py-3 hover:bg-subtle">
                      {a.candidateInitials ? (
                        <Avatar initials={a.candidateInitials} hue={a.hue} />
                      ) : (
                        <span className={"flex h-9 w-9 shrink-0 items-center justify-center rounded-full " + (a.kind === "expiring" ? "bg-warning-soft text-warning" : "bg-subtle text-ink-2")}>
                          <Icon size={17} strokeWidth={1.9} />
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink">{a.title}</p>
                        <p className="mt-0.5 truncate text-caption text-ink-3">
                          {a.context}
                          {a.meta && <span className="text-ink-2"> · {a.meta}</span>}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          if (a.to) nav(a.to);
                          else {
                            setActions((xs) => xs.filter((x) => x.id !== a.id));
                            toast("Invitation resent to Arjun Reddy");
                          }
                        }}
                      >
                        {a.cta}
                      </Button>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>

          <Panel>
            <PanelHeader title="Hiring pipeline" action={<Link to="/assessments" className="text-caption font-semibold text-primary hover:underline">All assessments</Link>} />
            <div className="flex flex-col gap-6 px-6 pb-6">
              {mine
                .filter((a) => a.status === "Published")
                .map((a) => {
                  const counts = stageCounts(a.id);
                  const total = candidatesFor(a.id).length;
                  return (
                    <Link key={a.id} to={"/assessments/" + a.id} className="group block">
                      <div className="mb-2.5 flex items-baseline justify-between gap-3">
                        <p className="text-sm font-semibold text-ink group-hover:text-primary">
                          {a.position} <span className="font-normal text-ink-3">· {a.grade} {a.subject}</span>
                        </p>
                        <p className="text-caption text-ink-3 tabular-nums">
                          {total} candidates · closes {a.deadline}
                        </p>
                      </div>
                      <div className="grid grid-cols-6 gap-1.5">
                        {counts.map((s, i) => (
                          <div key={s.stage}>
                            <div className={"h-2 rounded-full " + (s.count === 0 ? "bg-subtle" : ["bg-primary/20", "bg-primary/35", "bg-primary/50", "bg-primary/70", "bg-primary/85", "bg-primary"][i])} />
                            <p className="mt-2 text-xs text-ink-3">{s.stage}</p>
                            <p className="text-sm font-bold text-ink tabular-nums">{s.count}</p>
                          </div>
                        ))}
                      </div>
                    </Link>
                  );
                })}
            </div>
          </Panel>
        </div>

        <div className="col-span-4 flex flex-col gap-6">
          {/* Featured report, ready for a human decision */}
          <section className="relative overflow-hidden rounded-card bg-gradient-to-br from-primary to-primary-2 p-1.5 text-primary-fg shadow-primary">
            <div className="flex items-center justify-between px-4 pt-3 pb-3">
              <h2 className="text-[15px] font-bold">Ready for your decision</h2>
              <Link to={"/reports/" + featured.id} aria-label="Open report" className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-fg text-primary hover:opacity-90">
                <ArrowUpRight size={16} strokeWidth={2.2} />
              </Link>
            </div>
            <div className="rounded-[16px] bg-surface p-4 text-ink">
              <div className="flex items-center gap-3">
                <Avatar initials={featured.initials} hue={featured.hue} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{featured.name}</p>
                  <p className="truncate text-xs text-ink-3">TGT Mathematics · {featured.experience}</p>
                </div>
                <div className="text-right">
                  <p className="text-[22px] font-bold leading-none tabular-nums">{featured.score}</p>
                  <p className="mt-1 text-xs font-semibold text-success">{band(featured.score!)}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-2.5 border-t border-border pt-4">
                {competencies.slice(0, 3).map((c) => (
                  <div key={c.id} className="flex items-center justify-between gap-3">
                    <span className="truncate text-caption text-ink-2">{c.name}</span>
                    <span className="flex items-center gap-2">
                      <RubricMeter score={reportCompetencyScores[c.id]} size="sm" />
                      <span className="w-7 text-right text-xs font-bold tabular-nums">{reportCompetencyScores[c.id].toFixed(1)}</span>
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-4 flex items-center gap-1.5 text-xs text-warning">
                <AlertTriangle size={13} /> 1 answer needs a human check
              </p>
            </div>
          </section>

          <Panel>
            <PanelHeader title="Recent activity" />
            <ul className="flex flex-col px-6 pb-5">
              {recentActivity.map((a) => {
                const Icon = activityIcon[a.kind];
                return (
                  <li key={a.id} className="flex gap-3 border-b border-border py-3 last:border-0">
                    <Icon size={16} strokeWidth={1.9} className="mt-0.5 shrink-0 text-ink-3" />
                    <div className="min-w-0 flex-1">
                      <p className="text-caption font-medium text-ink">{a.text}</p>
                      {a.detail && <p className="truncate text-xs text-ink-3">{a.detail}</p>}
                    </div>
                    <span className="shrink-0 text-xs text-ink-3">{a.time}</span>
                  </li>
                );
              })}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function FirstRun() {
  const nav = useNavigate();
  const steps = [
    { n: 1, title: "Create your first assessment", body: "Grade 8 Mathematics, CBSE is set up for you. Most schools publish in under 5 minutes.", cta: "Start with template", to: "/assessments/new" },
    { n: 2, title: "Invite candidates", body: "Send each applicant a link. They don't need an account.", cta: null },
    { n: 3, title: "Review the report", body: "Every score links to the candidate's own words. You make the decision.", cta: null },
  ];
  return (
    <div className="mx-auto max-w-[880px] pt-6">
      <h1 className="text-[30px] font-bold tracking-tight">Welcome, {currentUser.first}</h1>
      <p className="mt-1.5 text-[15px] text-ink-2">Set up teacher hiring for {currentUser.school} in 3 steps</p>
      <Panel className="mt-8 p-2">
        {steps.map((s) => (
          <div key={s.n} className={"flex items-start gap-5 rounded-2xl p-5 " + (s.n === 1 ? "bg-primary-softer" : "")}>
            <span className={"flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold " + (s.n === 1 ? "bg-primary text-primary-fg" : "bg-subtle text-ink-3")}>{s.n}</span>
            <div className="flex-1">
              <p className={"text-[15px] font-bold " + (s.n === 1 ? "text-ink" : "text-ink-2")}>{s.title}</p>
              <p className="mt-1 text-sm text-ink-2">{s.body}</p>
            </div>
            {s.cta && (
              <Button variant="primary" onClick={() => nav(s.to!)}>
                {s.cta}
              </Button>
            )}
          </div>
        ))}
      </Panel>
    </div>
  );
}
