import { useEffect, useMemo, useState } from "react";
import { BadgeCheck, BookOpen, Check, Copy, Plus, Search, Trash2 } from "lucide-react";
import { competencies, grade8Chapters, libraryQuestions, rubricScale, type LibraryQuestion, type QuestionSource } from "../data";
import { Button, Dialog, Drawer, EmptyState, Field, inputCls, Panel, PageHeader, useToast } from "../components/ui";

type Question = LibraryQuestion & { outcome?: string; concepts?: string; alternatives?: string; misconceptions?: string; followUp?: string; descriptors?: string[] };
const sources: QuestionSource[] = ["AI-generated", "Edited", "School-approved", "Chain-approved"];
const seed: Question[] = libraryQuestions.map((q) => ({ ...q }));

export default function Library({ scope }: { scope: "branch" | "chain" }) {
  const chain = scope === "chain";
  const title = chain ? "Shared library" : "Question library";
  const toast = useToast();
  const [questions, setQuestions] = useState<Question[]>(seed);
  const [competencyFilter, setCompetencyFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState<QuestionSource[]>([]);
  const [difficulty, setDifficulty] = useState("");
  const [topic, setTopic] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Question | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Question | null>(null);
  const [deleting, setDeleting] = useState<Question | null>(null);
  const filtered = useMemo(() => questions.filter((q) => {
    const text = search.toLowerCase();
    return (!text || q.text.toLowerCase().includes(text) || q.topic.toLowerCase().includes(text)) &&
      (!competencyFilter || q.competencyId === competencyFilter) && (!sourceFilter.length || sourceFilter.includes(q.source)) &&
      (!difficulty || q.difficulty === difficulty) && (!topic || q.topic === topic);
  }), [questions, search, competencyFilter, sourceFilter, difficulty, topic]);
  const sourceToggle = (s: QuestionSource) => setSourceFilter((xs) => xs.includes(s) ? xs.filter((x) => x !== s) : [...xs, s]);
  const approve = (q: Question) => {
    const next: QuestionSource = chain ? "Chain-approved" : "School-approved";
    setQuestions((all) => all.map((x) => x.id === q.id ? { ...x, source: next } : x));
    setSelected({ ...q, source: next });
    toast(`Question marked ${next.toLowerCase()}`);
  };
  const duplicate = (q: Question) => {
    const copy = { ...q, id: `q-${Date.now()}`, source: "Edited" as const, usedIn: 0 };
    setQuestions((all) => [copy, ...all]); setSelected(copy); toast("Question duplicated");
  };
  const saveQuestion = (q: Question) => {
    setQuestions((all) => editing ? all.map((x) => x.id === q.id ? q : x) : [q, ...all]);
    setEditorOpen(false); setEditing(null); setSelected(q); toast(editing ? "Question updated" : "Question added to library");
  };
  const competencyName = (id: string) => competencies.find((c) => c.id === id)?.name ?? "Competency";
  const clear = () => { setCompetencyFilter(""); setSourceFilter([]); setDifficulty(""); setTopic(""); setSearch(""); };

  return <div className="mx-auto max-w-[1280px]">
    <PageHeader title={title} meta={chain ? "Questions approved for use across Sunrise Public Schools" : "Build a question set for your assessments"} actions={<Button variant="primary" icon={<Plus size={16} />} onClick={() => { setEditing(null); setEditorOpen(true); }}>Add question</Button>} />
    <div className="grid grid-cols-[260px_minmax(0,1fr)] items-start gap-6">
      <Panel className="p-5">
        <div className="flex items-center justify-between"><h2 className="text-title font-bold">Filters</h2><button onClick={clear} className="text-xs font-semibold text-primary hover:underline">Reset</button></div>
        <div className="mt-5 border-t border-border pt-4"><p className="mb-2 text-caption font-semibold text-ink">Competency</p>{competencies.map((c) => { const count = questions.filter((q) => q.competencyId === c.id).length; return <label key={c.id} className="flex cursor-pointer items-center gap-2 py-1.5 text-caption text-ink-2"><input type="radio" name="competency" checked={competencyFilter === c.id} onChange={() => setCompetencyFilter(competencyFilter === c.id ? "" : c.id)} /> <span className="min-w-0 flex-1 truncate">{c.name}</span><span className="text-xs tabular-nums text-ink-3">{count}</span></label>; })}</div>
        <div className="mt-4 border-t border-border pt-4"><p className="mb-2 text-caption font-semibold text-ink">Source</p>{sources.map((s) => <label key={s} className="flex cursor-pointer items-center gap-2 py-1.5 text-caption text-ink-2"><input type="checkbox" checked={sourceFilter.includes(s)} onChange={() => sourceToggle(s)} />{s}</label>)}</div>
        <div className="mt-4 border-t border-border pt-4"><label className="mb-4 block"><span className="mb-1.5 block text-caption font-semibold text-ink">Difficulty</span><select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className={inputCls}><option value="">All levels</option>{["Basic", "Standard", "Advanced"].map((x) => <option key={x}>{x}</option>)}</select></label><label className="block"><span className="mb-1.5 block text-caption font-semibold text-ink">Topic</span><select value={topic} onChange={(e) => setTopic(e.target.value)} className={inputCls}><option value="">All topics</option>{grade8Chapters.map((x) => <option key={x}>{x}</option>)}</select></label></div>
      </Panel>
      <div className="min-w-0">
        <label className="relative mb-4 block"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search questions or topics" className={inputCls + " pl-9"} /></label>
        <Panel className="overflow-hidden"><div className="flex items-center justify-between px-6 py-4"><h2 className="text-title font-bold">Questions <span className="ml-1 text-caption font-medium text-ink-3 tabular-nums">{filtered.length}</span></h2><span className="text-xs text-ink-3">Select a question for details</span></div>
          {filtered.length === 0 ? <EmptyState title="No questions found" body="Try changing your search or filters" action={<Button onClick={clear}>Clear filters</Button>} /> : <ul className="px-3 pb-2">{filtered.map((q) => <li key={q.id} className="border-t border-border first:border-0"><button onClick={() => setSelected(q)} className="flex w-full items-start gap-4 rounded-xl px-3 py-4 text-left hover:bg-subtle"><span className="min-w-0 flex-1"><span className="line-clamp-2 block text-sm font-semibold leading-snug text-ink">{q.text}</span><span className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-3">{competencyName(q.competencyId)} <span>·</span> {q.topic} <span>·</span> {q.difficulty} <span>·</span> Used in {q.usedIn} {q.usedIn === 1 ? "assessment" : "assessments"}</span></span><span className="mt-0.5 inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-ink-3">{(q.source === "School-approved" || q.source === "Chain-approved") && <BadgeCheck size={14} className="text-success" />}{q.source}</span></button></li>)}</ul>}
        </Panel>
      </div>
    </div>

    <Drawer open={!!selected} onClose={() => setSelected(null)} title="Question details" footer={selected ? <><Button variant="ghost" icon={<Copy size={14} />} onClick={() => duplicate(selected)}>Duplicate</Button><Button variant="ghost" onClick={() => { setEditing(selected); setSelected(null); setEditorOpen(true); }}>Edit</Button><Button variant="ghost" className="text-danger" icon={<Trash2 size={14} />} onClick={() => setDeleting(selected)}>Delete</Button><Button variant="primary" onClick={() => approve(selected!)}>Mark {chain ? "chain" : "school"}-approved</Button></> : undefined}>
      {selected && <div className="space-y-5"><div><span className="text-xs font-semibold text-primary">{competencyName(selected.competencyId)}</span><h3 className="mt-2 text-[17px] font-bold leading-snug text-ink">{selected.text}</h3><p className="mt-2 text-caption text-ink-3">{selected.topic} · {selected.difficulty} · {selected.source}</p></div>
        <Detail title="Expected learning outcome">{selected.outcome ?? `The candidate explains ${selected.topic.toLowerCase()} clearly, accurately, and at the appropriate grade level.`}</Detail>
        <Detail title="Key concepts">{selected.concepts ?? `${selected.topic}; clear examples; checking for understanding`}</Detail>
        <Detail title="Acceptable alternative explanations">{selected.alternatives ?? "A valid visual, concrete, or pattern-based explanation that reaches the same correct understanding."}</Detail>
        <Detail title="Misconceptions to listen for">{selected.misconceptions ?? "An unsupported rule, an inaccurate example, or a missed opportunity to identify student misunderstanding."}</Detail>
        <div><h4 className="mb-2 text-caption font-bold text-ink">Rubric descriptors</h4><ol className="space-y-2">{rubricScale.map((r) => <li key={r.level} className="flex gap-3 rounded-xl bg-subtle px-3 py-2.5"><span className="text-caption font-bold tabular-nums text-primary">{r.level}</span><span><span className="block text-caption font-semibold text-ink">{r.label}</span><span className="text-xs leading-relaxed text-ink-2">{selected.descriptors?.[r.level] ?? r.shows}</span></span></li>)}</ol></div>
        <Detail title="Follow-up guidance">{selected.followUp ?? "Ask the candidate to give a student-facing example and describe how they would check understanding."}</Detail>
      </div>}
    </Drawer>
    <QuestionForm open={editorOpen} question={editing} onClose={() => { setEditorOpen(false); setEditing(null); }} onSave={saveQuestion} />
    <Dialog open={!!deleting} onClose={() => setDeleting(null)} title="Delete question?" footer={<><Button variant="ghost" onClick={() => setDeleting(null)}>Cancel</Button><Button variant="danger" onClick={() => { if (deleting) setQuestions((all) => all.filter((q) => q.id !== deleting.id)); setSelected(null); setDeleting(null); toast("Question deleted"); }}>Delete question</Button></>}><p className="text-sm text-ink-2">This question will be removed from the library. Existing assessments will not change.</p></Dialog>
  </div>;
}

function Detail({ title, children }: { title: string; children: string }) { return <div><h4 className="mb-1 text-caption font-bold text-ink">{title}</h4><p className="text-caption leading-relaxed text-ink-2">{children}</p></div>; }

function QuestionForm({ open, question, onClose, onSave }: { open: boolean; question: Question | null; onClose: () => void; onSave: (q: Question) => void }) {
  const [text, setText] = useState(""); const [competency, setCompetency] = useState(competencies[0].id); const [topic, setTopic] = useState(grade8Chapters[0]); const [difficulty, setDifficulty] = useState<Question["difficulty"]>("Standard"); const [descriptors, setDescriptors] = useState<string[]>(rubricScale.map((r) => r.shows));
  useEffect(() => { if (open) { setText(question?.text ?? ""); setCompetency(question?.competencyId ?? competencies[0].id); setTopic(question?.topic ?? grade8Chapters[0]); setDifficulty(question?.difficulty ?? "Standard"); setDescriptors(question?.descriptors ?? rubricScale.map((r) => r.shows)); } }, [open, question]);
  return <Drawer open={open} onClose={onClose} title={question ? "Edit question" : "Add question"} footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button variant="primary" disabled={!text.trim()} onClick={() => onSave({ id: question?.id ?? `local-${Date.now()}`, text: text.trim(), competencyId: competency, topic, difficulty, source: "Edited", usedIn: question?.usedIn ?? 0, descriptors })}>{question ? "Save changes" : "Add question"}</Button></>}>
    <div className="space-y-4"><Field label="Question text"><textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-28 w-full rounded-control border border-border-strong bg-surface px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary-soft" placeholder="Write the question candidates will answer" /></Field><Field label="Competency"><select value={competency} onChange={(e) => setCompetency(e.target.value)} className={inputCls}>{competencies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field><Field label="Topic"><select value={topic} onChange={(e) => setTopic(e.target.value)} className={inputCls}>{grade8Chapters.map((t) => <option key={t}>{t}</option>)}</select></Field><Field label="Difficulty"><select value={difficulty} onChange={(e) => setDifficulty(e.target.value as Question["difficulty"])} className={inputCls}>{["Basic", "Standard", "Advanced"].map((x) => <option key={x}>{x}</option>)}</select></Field><div><p className="mb-2 text-caption font-semibold text-ink">Rubric descriptors · 0–4</p>{rubricScale.map((r) => <label key={r.level} className="mb-3 block"><span className="mb-1 block text-xs font-semibold text-ink-2">{r.level} · {r.label}</span><textarea value={descriptors[r.level]} onChange={(e) => setDescriptors((d) => d.map((x, i) => i === r.level ? e.target.value : x))} className="min-h-16 w-full rounded-control border border-border-strong px-3 py-2 text-caption focus:border-primary focus:outline-none" /></label>)}</div></div>
  </Drawer>;
}
