import { useState } from "react";
import { Calendar, ClipboardCheck, Users as UsersIcon, Check, X, Plus, CalendarOff } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { StatusPill } from "@/components/shared/StatusPill";
import { Avatar } from "@/components/shared/Avatar";
import { BirthdayBanner } from "@/components/shared/BirthdayBanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { todaysClasses, slotRequests as initSlots, students, CLASSES, leaveRequests } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
export { ChatPage } from "@/pages/senior-teacher/SeniorTeacherPages";

export function TeacherDashboard() {
  const birthdays = students.filter(s => s.isBirthdayToday).map(s => s.name);
  return (
    <div className="space-y-6">
      <PageHeader title="Hello, Sneha 👋" subtitle="Here's your day at a glance" />
      <BirthdayBanner names={birthdays} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Classes Today" value={todaysClasses.length} icon={Calendar} tone="primary" />
        <StatCard label="Slot Requests" value={3} icon={ClipboardCheck} tone="warning" />
        <StatCard label="My Students" value={42} icon={UsersIcon} tone="info" />
        <StatCard label="Leave Balance" value="9 days" icon={CalendarOff} tone="success" />
      </div>
      <div className="card-soft p-5">
        <h3 className="font-display font-bold text-lg mb-4">Today's timeline</h3>
        <div className="space-y-3">
          {todaysClasses.map((c, i) => (
            <div key={c.id} className="flex gap-4 items-center animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="w-20 text-right text-sm font-bold text-secondary">{c.time}</div>
              <div className="w-3 h-3 rounded-full gradient-primary shrink-0" />
              <div className="flex-1 card-soft p-3"><div className="font-bold">{c.subject}</div><div className="text-xs text-muted-foreground">{c.className} • {c.students} students</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TeacherSlotRequests() {
  const [reqs, setReqs] = useState(initSlots);
  function act(id: string, ok: boolean) {
    setReqs(prev => prev.map(r => r.id === id ? { ...r, status: ok ? "Approved" : "Denied" } : r));
    toast.success(ok ? "Approved" : "Denied");
  }
  return (
    <div className="space-y-6">
      <PageHeader title="Slot Requests" subtitle="Approve student entry requests" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reqs.map(r => (
          <div key={r.id} className="card-soft p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3"><Avatar name={r.student} /><div><div className="font-bold text-sm">{r.student}</div><div className="text-xs text-muted-foreground font-mono">{r.badge}</div></div></div>
              {r.status === "Approved" && <StatusPill status="Entry Allowed" />}
              {r.status === "Denied"   && <StatusPill status="Denied" />}
              {r.status === "Pending"  && <StatusPill status="Pending" />}
            </div>
            <div className="text-sm"><div><span className="text-muted-foreground">Class:</span> <span className="font-semibold">{r.class}</span></div><div><span className="text-muted-foreground">Time:</span> <span className="font-semibold">{r.time}</span></div></div>
            {r.status === "Pending" && (
              <div className="flex gap-2 pt-2 border-t border-border/60">
                <Button variant="outline" className="flex-1 rounded-lg" onClick={() => act(r.id, false)}><X className="w-4 h-4 mr-1" />Deny</Button>
                <Button className="flex-1 rounded-lg bg-success text-success-foreground hover:bg-success/90" onClick={() => act(r.id, true)}><Check className="w-4 h-4 mr-1" />Approve</Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function TeacherAttendance() {
  const [marks, setMarks] = useState<Record<string, "Present"|"Absent"|"Late">>(() => Object.fromEntries(students.slice(0, 10).map(s => [s.id, "Present"])));
  return (
    <div className="space-y-6">
      <PageHeader title="Mark Attendance" subtitle="Today's class roster" action={
        <Select defaultValue={CLASSES[0]}><SelectTrigger className="rounded-xl w-48"><SelectValue /></SelectTrigger>
          <SelectContent>{CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
        </Select>
      } />
      <div className="card-soft divide-y divide-border/60">
        {students.slice(0, 10).map(s => (
          <div key={s.id} className="p-3 flex items-center gap-4">
            <Avatar name={s.name} />
            <div className="flex-1 min-w-0"><div className="font-bold truncate">{s.name}</div><div className="text-xs text-muted-foreground font-mono">{s.badgeId}</div></div>
            <div className="flex gap-1.5">
              {(["Present","Late","Absent"] as const).map(st => (
                <button key={st} onClick={() => setMarks(m => ({...m, [s.id]: st}))} className={cn("text-xs font-bold rounded-lg px-2.5 py-1.5 border",
                  marks[s.id] === st
                    ? st === "Present" ? "bg-success text-success-foreground border-transparent"
                    : st === "Late" ? "bg-warning text-warning-foreground border-transparent"
                    : "bg-destructive text-destructive-foreground border-transparent"
                    : "bg-card border-border text-muted-foreground hover:bg-muted"
                )}>{st}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end"><Button className="rounded-xl gradient-primary text-white border-0 shadow-pop" onClick={() => toast.success("Submitted!")}>Submit attendance</Button></div>
    </div>
  );
}

export function TeacherLeave() {
  return (
    <div className="space-y-6">
      <PageHeader title="My Leaves" subtitle="Apply and track" />
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="space-y-3">
          <div className="card-soft p-5">
            <div className="text-sm font-semibold text-muted-foreground mb-2">Leave balance</div>
            <div className="space-y-2">
              {[{k:"Casual", v:6, c:"text-info"},{k:"Sick", v:8, c:"text-success"},{k:"Personal", v:3, c:"text-secondary"}].map(b => (
                <div key={b.k} className="flex items-center justify-between p-2 rounded-lg bg-muted/40"><span className="font-semibold text-sm">{b.k}</span><span className={`font-display font-bold text-xl ${b.c}`}>{b.v}</span></div>
              ))}
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 card-soft p-5">
          <h3 className="font-display font-bold mb-3">Apply for leave</h3>
          <form className="space-y-3" onSubmit={e => { e.preventDefault(); toast.success("Leave request submitted!"); }}>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select defaultValue="Casual"><SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Casual">Casual</SelectItem><SelectItem value="Sick">Sick</SelectItem><SelectItem value="Personal">Personal</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>From</Label><Input type="date" className="rounded-xl" /></div>
              <div className="space-y-1.5"><Label>To</Label><Input type="date" className="rounded-xl" /></div>
            </div>
            <div className="space-y-1.5"><Label>Reason</Label><Textarea rows={3} className="rounded-xl" /></div>
            <Button type="submit" className="w-full rounded-xl gradient-primary text-white border-0"><Plus className="w-4 h-4 mr-1" />Submit</Button>
          </form>
        </div>
      </div>
      <div>
        <h3 className="font-display font-bold text-lg mb-3">Leave history</h3>
        <div className="card-soft overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted"><tr><th className="px-3 py-2 text-left">Type</th><th className="px-3 py-2 text-left">From</th><th className="px-3 py-2 text-left">To</th><th className="px-3 py-2 text-left">Reason</th><th className="px-3 py-2 text-left">Status</th></tr></thead>
            <tbody>
              {leaveRequests.map(l => <tr key={l.id} className="border-t border-border/60"><td className="px-3 py-2">{l.type}</td><td className="px-3 py-2">{l.from}</td><td className="px-3 py-2">{l.to}</td><td className="px-3 py-2">{l.reason}</td><td className="px-3 py-2"><StatusPill status={l.status} /></td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function TeacherMyClasses() {
  return (
    <div className="space-y-6">
      <PageHeader title="My Classes" subtitle="Your teaching schedule" />
      <div className="card-soft divide-y divide-border/60">
        {todaysClasses.map(c => (
          <div key={c.id} className="p-4 flex items-center gap-4">
            <div className="rounded-lg gradient-primary text-white px-3 py-2 font-bold text-sm">{c.time}</div>
            <div className="flex-1"><div className="font-bold">{c.subject}</div><div className="text-xs text-muted-foreground">{c.className}</div></div>
            <span className="text-sm font-semibold text-muted-foreground">{c.students} students</span>
          </div>
        ))}
      </div>
    </div>
  );
}
