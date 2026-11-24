import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { billing, branches } from "../data";
import { Button, Dialog, EmptyState, PageHeader, Panel, PanelHeader, useToast } from "../components/ui";

const usage = [{ id: "b1", used: 9 }, { id: "b2", used: 6 }, { id: "b3", used: 3 }, { id: "b4", used: 0 }];
export default function Billing({ scope }: { scope: "branch" | "chain" }) {
  const toast = useToast();
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const percent = Math.min(100, billing.interviewsUsed / billing.interviewsIncluded * 100);
  return <div className="mx-auto max-w-[1280px]">
    <PageHeader title="Billing" meta="Your plan and interview usage"/>
    {scope === "chain" && <p className="mb-5 text-sm font-semibold text-ink-2">One subscription, shared pool across 4 branches</p>}
    <div className="grid grid-cols-12 items-start gap-6">
      <div className="col-span-7 flex flex-col gap-6">
        <Panel className="p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-caption font-semibold text-ink-3">Current plan</p><h2 className="mt-1 text-title font-bold">{billing.plan}</h2><p className="mt-1 text-caption text-ink-2">Renews {billing.renews}</p></div><Button variant="primary" icon={<ArrowUpRight size={15}/>} onClick={() => setUpgradeOpen(true)}>Upgrade plan</Button></div><div className="mt-6 border-t border-border pt-5"><div className="flex items-baseline justify-between"><p className="text-caption font-semibold text-ink">Interviews used this month</p><p className="text-sm font-bold tabular-nums">{billing.interviewsUsed} <span className="font-medium text-ink-3">of {billing.interviewsIncluded}</span></p></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-primary-soft"><div className="h-full rounded-full bg-primary" style={{width: `${percent}%`}}/></div><p className="mt-2 text-xs text-ink-3">Pilot schools are not billed</p></div></Panel>
        {scope === "chain" && <Panel><PanelHeader title="Usage by branch"/><div className="flex flex-col gap-5 px-6 pb-6">{usage.map((u) => {const branch = branches.find((b) => b.id === u.id)!; return <div key={u.id}><div className="mb-2 flex justify-between text-caption"><span className="font-semibold text-ink">{branch.name}</span><span className="tabular-nums text-ink-2">{u.used} interviews</span></div><div className="h-2 rounded-full bg-primary-soft"><div className="h-2 rounded-full bg-primary" style={{width: `${u.used / billing.interviewsIncluded * 100}%`}}/></div></div>})}</div></Panel>}
      </div>
      <Panel className="col-span-5"><PanelHeader title="Invoices"/>{billing.invoices.length ? <div className="px-6 pb-5">{billing.invoices.map((i) => <div key={i.id} className="flex justify-between border-t border-border py-3 text-caption"><span>{i.date}</span><span>{i.amount}</span><span>{i.status}</span></div>)}</div> : <EmptyState title="No invoices yet" body="Invoices appear here after your pilot ends"/>}</Panel>
    </div>
    <Dialog open={upgradeOpen} onClose={() => setUpgradeOpen(false)} title="Upgrade plan" footer={<Button variant="ghost" onClick={() => setUpgradeOpen(false)}>Close</Button>}><p className="mb-4 text-sm text-ink-2">Choose a plan to discuss with our team. Pricing is tailored to your school.</p><div className="flex flex-col gap-3">{[{name:"School", count:"40 included interviews"},{name:"Multi-school",count:"Shared interview pool"},{name:"Custom",count:"Interview capacity tailored to your needs"}].map((p) => <div key={p.name} className="flex items-center justify-between rounded-control border border-border p-4"><div><p className="font-semibold text-ink">{p.name}</p><p className="mt-1 text-caption text-ink-3">{p.count}</p></div><Button size="sm" onClick={() => {setUpgradeOpen(false);toast("Upgrade request sent. Our team will be in touch.");}}>Request upgrade</Button></div>)}</div><p className="mt-4 text-xs text-ink-3">Talk to us for pricing.</p></Dialog>
  </div>;
}
