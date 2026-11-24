import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Play,
  Pause,
  AlertTriangle,
  Flag,
  MessageSquare,
  PencilLine,
  ChevronDown,
  Info,
  Quote,
  CheckCircle2,
} from "lucide-react";
import {
  candidateById,
  assessmentById,
  competencies,
  reportAnswers,
  reportCompetencyScores,
  reportSummary,
  rubricScale,
  band,
  currentUser,
  type Decision,
  type ReportAnswer,
} from "../data";
import { Avatar, Button, Dialog, Panel, PanelHeader, RubricMeter, DecisionTag, Field, inputCls, useToast } from "../components/ui";
import { useScreenInit } from "../useScreenInit";

type Override = { score: number; reason: string; by: string; when: string };
type Note = { id: string; who: string; initials: string; text: string; when: string; target?: string; kind: "comment" | "override" | "flag" | "decision" };

function Waveform({ seed, playing, progress }: { seed: number; playing: boolean; progress: number }) {
  const bars = useMemo(
    () => Array.from({ length: 64 }, (_, i) => 0.25 + Math.abs(Math.sin(i * 0.55 + seed) * 0.55 + Math.sin(i * 1.7 + seed * 2) * 0.25)),
    [seed],
  );
  return (
    <div className="flex h-12 min-w-0 flex-1 items-center gap-[2px]" aria-hidden="true">
      {bars.map((h, i) => {
        const done = i / bars.length <= progress;
        return <span key={i} className={"min-w-0 flex-1 rounded-full " + (done ? "bg-primary" : playing ? "bg-primary/30" : "bg-primary/20")} style={{ height: Math.min(1, h) * 100 + "%" }} />;
      })}
    </div>
  );
}

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

export default function Report() {
  const { id = "c1" } = useParams();
  const init = useScreenInit() as { selected?: string; override?: boolean; decision?: boolean; generating?: boolean };
  const toast = useToast();
  const cand = candidateById(id);
  const asmt = assessmentById(cand.assessmentId);
  const factor = (cand.score ?? 82) / 81.5;

  const compScores = useMemo(() => Object.fromEntries(competencies.map((c) => [c.id, Math.min(4, reportCompetencyScores[c.id] * factor)])), [factor]);
  const answers: ReportAnswer[] = useMemo(() => reportAnswers.map((a) => ({ ...a, score: Math.max(0, Math.min(4, Math.round(a.score * factor))) })), [factor]);

  const [selectedId, setSelectedId] = useState(init.selected ?? "q1");
  const [overrides, setOverrides] = useState<Record<string, Override>>({});
  const [decision, setDecision] = useState<Decision | undefined>(cand.decision);
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [openComp, setOpenComp] = useState<Record<string, boolean>>(() => Object.fromEntries(competencies.map((c) => [c.id, true])));
  const [showOverride, setShowOverride] = useState(!!init.override);
  const [showDecision, setShowDecision] = useState(!!init.decision);
  const [showComment, setShowComment] = useState(false);
  const [notes, setNotes] = useState<Note[]>([
    { id: "n1", who: "Kavita Bansal", initials: "KB", text: "Strong on concepts. Worth asking about her Class 8 board results at the previous school.", when: "20 min ago", kind: "comment" },
  ]);
  const [generating, setGenerating] = useState(!!init.generating);

  useEffect(() => {
    if (!generating) return;
    const t = window.setTimeout(() => setGenerating(false), 2600);
    return () => window.clearTimeout(t);
  }, [generating]);

  const selected = answers.find((a) => a.id === selectedId) ?? answers[0];
  const selComp = competencies.find((c) => c.id === selected.competencyId)!;
  const effective = (a: ReportAnswer) => overrides[a.id]?.score ?? a.score;
  const lowConf = answers.filter((a) => a.lowConfidence);
  const status = decision ? "Decided" : notes.length > 1 || Object.keys(overrides).length ? "In review" : "Ready";

  if (generating) return <Generating name={cand.name} />;

  return (
    <div className="mx-auto max-w-[1320px]">
      <Link to="/reports" className="mb-4 inline-flex items-center gap-1.5 text-caption font-semibold text-ink-2 hover:text-primary">
        <ArrowLeft size={15} /> Reports
      </Link>

      <header className="flex flex-wrap items-center justify-between gap-4 pb-6">
        <div className="flex items-center gap-4">
          <Avatar initials={cand.initials} hue={cand.hue} size="lg" />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-display font-bold leading-tight tracking-tight">{cand.name}</h1>
              {decision && <DecisionTag decision={decision} />}
            </div>
            <p className="mt-1 text-sm text-ink-2">
              {asmt.position} · {asmt.grade} {asmt.subject}, {asmt.board} · Interviewed {cand.interviewedOn ?? "today"} · {cand.endedBy ?? "Completed all questions"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button icon={<Download size={16} />} onClick={() => toast("PDF downloaded with AI sections labelled")}>
            Download PDF
          </Button>
          <Button variant="primary" onClick={() => setShowDecision(true)}>
            {decision ? "Change decision" : "Record decision"}
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-12 items-start gap-6">
        {/* LEFT: overview + detail */}
        <div className="col-span-7 flex flex-col gap-6">
          <Panel className="p-6">
            <div className="flex items-start gap-8">
              <div className="shrink-0">
                <p className="text-caption font-medium text-ink-2">Overall score</p>
                <p className="mt-1 flex items-baseline gap-1">
                  <span className="text-[56px] font-bold leading-none tracking-tighter tabular-nums">{cand.score}</span>
                  <span className="text-lg font-semibold text-ink-3">/ 100</span>
                </p>
                <p className="mt-2 inline-flex h-6 items-center rounded-full bg-success-soft px-2.5 text-xs font-bold text-success">{band(cand.score ?? 0)}</p>
              </div>
              <div className="grid flex-1 grid-cols-2 gap-6 border-l border-border pl-8">
                <div>
                  <p className="mb-2 text-caption font-bold text-ink">Strengths</p>
                  <ul className="flex flex-col gap-2">
                    {reportSummary.strengths.map((s) => (
                      <li key={s} className="flex gap-2 text-caption leading-snug text-ink-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-2 text-caption font-bold text-ink">Concerns</p>
                  <ul className="flex flex-col gap-2">
                    {reportSummary.concerns.map((s) => (
                      <li key={s} className="flex gap-2 text-caption leading-snug text-ink-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border pt-4 text-caption text-ink-3">
              <span className="inline-flex items-center gap-1.5">
                <Info size={14} /> AI-generated summary. Scores are decision support, not a hiring decision.
              </span>
              <span>Status: <span className="font-semibold text-ink-2">{status}</span></span>
              {lowConf.length > 0 && (
                <button onClick={() => setSelectedId(lowConf[0].id)} className="inline-flex items-center gap-1.5 font-semibold text-warning hover:underline">
                  <AlertTriangle size={14} /> {lowConf.length} {lowConf.length === 1 ? "answer needs" : "answers need"} human review
                </button>
              )}
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Competencies" action={<span className="text-caption text-ink-3">Select any score to see its evidence</span>} />
            <div className="px-3 pb-3">
              <div className="grid grid-cols-[1fr_64px_120px_64px_28px] items-center gap-3 px-3 pb-2 text-xs font-semibold text-ink-3">
                <span>Competency</span>
                <span className="text-right">Weight</span>
                <span>Rubric</span>
                <span className="text-right">Score</span>
                <span />
              </div>
              {competencies.map((c) => {
                const qs = answers.filter((a) => a.competencyId === c.id);
                const open = openComp[c.id];
                return (
                  <div key={c.id} className="border-t border-border">
                    <button
                      onClick={() => setOpenComp((o) => ({ ...o, [c.id]: !o[c.id] }))}
                      aria-expanded={open}
                      className="grid w-full grid-cols-[1fr_64px_120px_64px_28px] items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-subtle"
                    >
                      <span className="text-sm font-bold text-ink">{c.name}</span>
                      <span className="text-right text-caption text-ink-3 tabular-nums">{c.weight}%</span>
                      <RubricMeter score={compScores[c.id]} />
                      <span className="text-right text-sm font-bold tabular-nums">{compScores[c.id].toFixed(1)}</span>
                      <ChevronDown size={16} className={"text-ink-3 transition-transform duration-200 " + (open ? "rotate-180" : "")} />
                    </button>
                    {open && (
                      <ul className="animate-fade-in pb-2">
                        {qs.map((q) => {
                          const sel = q.id === selected.id;
                          const ov = overrides[q.id];
                          return (
                            <li key={q.id}>
                              <button
                                onClick={() => setSelectedId(q.id)}
                                aria-pressed={sel}
                                className={
                                  "grid w-full grid-cols-[28px_1fr_auto] items-center gap-3 rounded-xl py-2.5 pl-3 pr-3 text-left " +
                                  (sel ? "bg-primary-soft" : "hover:bg-subtle")
                                }
                              >
                                <span className={"text-xs font-bold tabular-nums " + (sel ? "text-primary" : "text-ink-3")}>Q{q.n}</span>
                                <span className="min-w-0">
                                  <span className="block truncate text-caption text-ink">{q.question}</span>
                                  <span className="mt-0.5 flex items-center gap-2 text-xs text-ink-3">
                                    {rubricScale[effective(q)].label} · {q.timestamp}
                                    {q.lowConfidence && (
                                      <span className="inline-flex items-center gap-1 font-semibold text-warning">
                                        <AlertTriangle size={12} /> Low confidence
                                      </span>
                                    )}
                                    {flagged[q.id] && (
                                      <span className="inline-flex items-center gap-1 font-semibold text-ink-2">
                                        <Flag size={12} /> Flagged
                                      </span>
                                    )}
                                  </span>
                                </span>
                                <span className="flex items-center gap-2 text-caption tabular-nums">
                                  {ov && <span className="text-ink-3 line-through">{q.score}</span>}
                                  <span className="font-bold text-ink">{effective(q)}</span>
                                  <span className="text-ink-3">/ 4</span>
                                </span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Ask in the next interview" />
            <ol className="flex flex-col gap-3 px-6 pb-6">
              {reportSummary.nextInterview.map((q, i) => (
                <li key={q} className="flex gap-3 text-sm text-ink-2">
                  <span className="text-caption font-bold text-ink-3 tabular-nums">{i + 1}</span>
                  {q}
                </li>
              ))}
            </ol>
          </Panel>

          <Panel>
            <PanelHeader title="Review notes" count={notes.length} action={<Button size="sm" icon={<MessageSquare size={14} />} onClick={() => setShowComment(true)}>Add comment</Button>} />
            <ul className="flex flex-col px-6 pb-5">
              {notes.map((n) => (
                <li key={n.id} className="flex animate-fade-in gap-3 border-t border-border py-4 first:border-0 first:pt-1">
                  <Avatar initials={n.initials} hue={n.who === currentUser.name ? 5 : 3} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-caption">
                      <span className="font-bold text-ink">{n.who}</span>
                      <span className="text-ink-3">
                        {" "}
                        · {n.when}
                        {n.target && " · " + n.target}
                      </span>
                    </p>
                    <p className="mt-1 text-sm text-ink-2">{n.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        {/* RIGHT: evidence */}
        <aside className="sticky top-6 col-span-5">
          <Panel key={selected.id} className="animate-fade-in overflow-hidden">
            <div className="border-b border-border px-6 pt-5 pb-4">
              <p className="text-caption font-semibold text-primary">
                Evidence · Question {selected.n} · {selComp.name}
              </p>
              <p className="mt-2 text-[15px] font-semibold leading-snug text-ink">{selected.question}</p>
            </div>

            <div className="flex items-center gap-4 px-6 py-4">
              <div>
                <p className="text-[34px] font-bold leading-none tabular-nums">
                  {effective(selected)}
                  <span className="text-base font-semibold text-ink-3"> / 4</span>
                </p>
              </div>
              <div className="min-w-0 flex-1">
                <RubricMeter score={effective(selected)} size="lg" />
                <p className="mt-2 text-caption font-bold text-ink">{rubricScale[effective(selected)].label}</p>
                <p className="text-xs text-ink-3">{rubricScale[effective(selected)].shows}</p>
              </div>
            </div>

            {overrides[selected.id] && (
              <div className="mx-6 mb-4 border-l-2 border-primary pl-3 text-caption">
                <p className="font-semibold text-ink">
                  Overridden by {overrides[selected.id].by} · AI score {selected.score} → {overrides[selected.id].score}
                </p>
                <p className="mt-0.5 text-ink-2">{overrides[selected.id].reason}</p>
              </div>
            )}

            {selected.lowConfidence && (
              <div className="mx-6 mb-4 flex gap-2 rounded-xl bg-warning-soft px-3 py-2.5 text-caption text-warning">
                <AlertTriangle size={15} className="mt-0.5 shrink-0" />
                <span>
                  <span className="font-bold">Low confidence.</span> {selected.lowConfidence}. Check the recording before relying on this score.
                </span>
              </div>
            )}

            <AudioClip answer={selected} />

            <div className="px-6 pb-5">
              <p className="mb-2 text-xs font-semibold text-ink-3">Transcript</p>
              <div className="flex flex-col gap-3">
                {selected.transcript.map((t, i) => (
                  <div key={i} className="grid grid-cols-[44px_1fr] gap-2">
                    <span className="pt-0.5 text-xs text-ink-3 tabular-nums">{t.time}</span>
                    <p className={"text-caption leading-relaxed " + (t.speaker === "AI" ? "text-ink-3" : "text-ink")}>
                      <span className="font-semibold">{t.speaker === "AI" ? "Interviewer" : cand.name.split(" ")[0]}: </span>
                      {t.highlight ? <mark className="rounded bg-primary-soft px-1 py-0.5 text-ink">{t.text}</mark> : t.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border bg-subtle px-6 py-4">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-ink-3">
                <Quote size={12} /> AI reasoning
              </p>
              <p className="mt-1.5 text-caption leading-relaxed text-ink-2">{selected.reasoning}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t border-border px-6 py-4">
              <Button size="sm" icon={<PencilLine size={14} />} onClick={() => setShowOverride(true)}>
                Override score
              </Button>
              <Button size="sm" variant="ghost" icon={<MessageSquare size={14} />} onClick={() => setShowComment(true)}>
                Comment
              </Button>
              <Button
                size="sm"
                variant="ghost"
                icon={<Flag size={14} />}
                onClick={() => {
                  setFlagged((f) => ({ ...f, [selected.id]: !f[selected.id] }));
                  if (!flagged[selected.id]) {
                    setNotes((n) => [...n, { id: "f" + Date.now(), who: currentUser.name, initials: currentUser.initials, text: "Flagged for a second reviewer", when: "Just now", target: "Q" + selected.n, kind: "flag" }]);
                    toast("Q" + selected.n + " flagged for Kavita Bansal");
                  }
                }}
              >
                {flagged[selected.id] ? "Unflag" : "Flag for review"}
              </Button>
            </div>
          </Panel>
        </aside>
      </div>

      <OverrideDialog
        open={showOverride}
        onClose={() => setShowOverride(false)}
        answer={selected}
        onSave={(score, reason) => {
          setOverrides((o) => ({ ...o, [selected.id]: { score, reason, by: currentUser.name, when: "Just now" } }));
          setNotes((n) => [...n, { id: "o" + Date.now(), who: currentUser.name, initials: currentUser.initials, text: `Changed score from ${selected.score} to ${score}. ${reason}`, when: "Just now", target: "Q" + selected.n, kind: "override" }]);
          setShowOverride(false);
          toast("Score override saved and logged");
        }}
      />
      <DecisionDialog
        open={showDecision}
        current={decision}
        name={cand.name}
        onClose={() => setShowDecision(false)}
        onSave={(d, note) => {
          setDecision(d);
          setNotes((n) => [...n, { id: "d" + Date.now(), who: currentUser.name, initials: currentUser.initials, text: `Decision: ${d}${note ? ". " + note : ""}`, when: "Just now", kind: "decision" }]);
          setShowDecision(false);
          toast(`${cand.name} marked as ${d === "Shortlist" ? "shortlisted" : d === "Hold" ? "on hold" : "rejected"}`);
        }}
      />
      <CommentDialog
        open={showComment}
        target={"Q" + selected.n}
        onClose={() => setShowComment(false)}
        onSave={(text) => {
          setNotes((n) => [...n, { id: "c" + Date.now(), who: currentUser.name, initials: currentUser.initials, text, when: "Just now", target: "Q" + selected.n, kind: "comment" }]);
          setShowComment(false);
        }}
      />
    </div>
  );
}

function AudioClip({ answer }: { answer: ReportAnswer }) {
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);
  useEffect(() => {
    setPlaying(false);
    setPos(0);
  }, [answer.id]);
  useEffect(() => {
    if (!playing) return;
    const t = window.setInterval(() => {
      setPos((p) => {
        if (p + 1 >= answer.length) {
          setPlaying(false);
          return answer.length;
        }
        return p + 1;
      });
    }, 120);
    return () => window.clearInterval(t);
  }, [playing, answer.length]);
  return (
    <div className="mx-6 mb-5 flex items-center gap-3 rounded-2xl border border-border px-3 py-2">
      <button
        aria-label={playing ? "Pause recording" : "Play recording"}
        onClick={() => setPlaying((p) => !p)}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-fg hover:bg-primary-hover"
      >
        {playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
      </button>
      <Waveform seed={answer.n} playing={playing} progress={pos / answer.length} />
      <span className="w-[86px] shrink-0 text-right text-xs text-ink-3 tabular-nums">
        {fmt(answer.start + pos)} / {fmt(answer.start + answer.length)}
      </span>
      {answer.audioWarning && <AlertTriangle size={15} className="shrink-0 text-warning" aria-label="Poor audio in this segment" />}
    </div>
  );
}

function OverrideDialog({ open, onClose, answer, onSave }: { open: boolean; onClose: () => void; answer: ReportAnswer; onSave: (score: number, reason: string) => void }) {
  const [score, setScore] = useState(answer.score);
  const [reason, setReason] = useState("");
  const [err, setErr] = useState("");
  useEffect(() => {
    setScore(answer.score);
    setReason("");
    setErr("");
  }, [answer.id, open, answer.score]);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={`Override Q${answer.n} score`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              if (!reason.trim()) return setErr("Add a reason so other reviewers know why the score changed");
              if (score === answer.score) return setErr("Pick a score different from the AI score");
              onSave(score, reason.trim());
            }}
          >
            Save override
          </Button>
        </>
      }
    >
      <p className="text-sm text-ink-2">
        The AI score of <span className="font-bold text-ink">{answer.score} / 4</span> stays visible next to yours. The change is logged with your name and time.
      </p>
      <p className="mt-5 mb-2 text-caption font-semibold">New score</p>
      <div className="grid grid-cols-5 gap-2" role="radiogroup" aria-label="New score">
        {rubricScale.map((r) => (
          <button
            key={r.level}
            role="radio"
            aria-checked={score === r.level}
            onClick={() => setScore(r.level)}
            className={
              "flex flex-col items-start rounded-xl border px-3 py-2.5 text-left " +
              (score === r.level ? "border-primary bg-primary-soft" : "border-border hover:border-border-strong")
            }
          >
            <span className="text-lg font-bold tabular-nums">{r.level}</span>
            <span className="text-[11px] leading-tight text-ink-2">{r.label}</span>
          </button>
        ))}
      </div>
      <div className="mt-5">
        <Field label="Reason" error={err}>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} className={inputCls + " h-auto py-2.5"} />
        </Field>
      </div>
    </Dialog>
  );
}

function DecisionDialog({ open, onClose, onSave, current, name }: { open: boolean; onClose: () => void; onSave: (d: Decision, note: string) => void; current?: Decision; name: string }) {
  const [d, setD] = useState<Decision | undefined>(current);
  const [note, setNote] = useState("");
  const [err, setErr] = useState("");
  const opts: { v: Decision; label: string; body: string }[] = [
    { v: "Shortlist", label: "Shortlist", body: "Move to the next round, like a demo class" },
    { v: "Hold", label: "Hold", body: "Keep for later. Nothing is sent to the candidate" },
    { v: "Reject", label: "Reject", body: "Close this application" },
  ];
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={`Decision for ${name}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => (d ? onSave(d, note.trim()) : setErr("Choose a decision"))}>
            Record decision
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-2" role="radiogroup">
        {opts.map((o) => (
          <button
            key={o.v}
            role="radio"
            aria-checked={d === o.v}
            onClick={() => {
              setD(o.v);
              setErr("");
            }}
            className={"flex items-center gap-3 rounded-2xl border px-4 py-3 text-left " + (d === o.v ? "border-primary bg-primary-softer" : "border-border hover:border-border-strong")}
          >
            <span className={"flex h-5 w-5 items-center justify-center rounded-full border-2 " + (d === o.v ? "border-primary" : "border-border-strong")}>
              {d === o.v && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
            </span>
            <span>
              <span className="block text-sm font-bold">{o.label}</span>
              <span className="block text-caption text-ink-3">{o.body}</span>
            </span>
          </button>
        ))}
      </div>
      {err && <p className="mt-2 text-caption text-danger">{err}</p>}
      <div className="mt-4">
        <Field label="Note for your team" optional>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} className={inputCls + " h-auto py-2.5"} />
        </Field>
      </div>
      <p className="mt-4 flex items-center gap-1.5 text-caption text-ink-3">
        <CheckCircle2 size={14} /> This decision is yours. The AI score doesn't decide it.
      </p>
    </Dialog>
  );
}

function CommentDialog({ open, onClose, onSave, target }: { open: boolean; onClose: () => void; onSave: (t: string) => void; target: string }) {
  const [text, setText] = useState("");
  const [err, setErr] = useState("");
  useEffect(() => {
    setText("");
    setErr("");
  }, [open]);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={`Comment on ${target}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => (text.trim() ? onSave(text.trim()) : setErr("Write a comment first"))}>
            Add comment
          </Button>
        </>
      }
    >
      <Field label="Comment" error={err}>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} className={inputCls + " h-auto py-2.5"} />
      </Field>
    </Dialog>
  );
}

function Generating({ name }: { name: string }) {
  return (
    <div className="mx-auto max-w-[1320px]">
      <Link to="/reports" className="mb-4 inline-flex items-center gap-1.5 text-caption font-semibold text-ink-2 hover:text-primary">
        <ArrowLeft size={15} /> Reports
      </Link>
      <h1 className="text-display font-bold tracking-tight">{name}</h1>
      <p className="mt-1 text-sm text-ink-2">Scoring 6 answers against the rubric…</p>
      <div className="mt-6 grid grid-cols-12 gap-6">
        <div className="col-span-7 flex flex-col gap-6">
          {[180, 320].map((h) => (
            <div key={h} className="animate-pulse rounded-card bg-surface p-6 shadow-card" style={{ height: h }}>
              <span className="block h-4 w-40 rounded bg-border" />
              <span className="mt-4 block h-3 w-3/4 rounded bg-border/70" />
              <span className="mt-3 block h-3 w-2/3 rounded bg-border/70" />
            </div>
          ))}
        </div>
        <div className="col-span-5 h-[520px] animate-pulse rounded-card bg-surface shadow-card" />
      </div>
    </div>
  );
}
