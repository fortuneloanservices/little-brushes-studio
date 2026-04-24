import { useState } from "react";
import { Plus, Eye } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { StatusPill } from "@/components/shared/StatusPill";
import { Avatar } from "@/components/shared/Avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { students, CLASSES, makeAttendance, certificates, payments } from "@/data/mockData";
import { toast } from "sonner";

export default function Students() {
  const [selected, setSelected] = useState<typeof students[number] | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        subtitle={`${students.length} kids learning art with us`}
        action={
          <Sheet open={addOpen} onOpenChange={setAddOpen}>
            <SheetTrigger asChild>
              <Button className="rounded-xl gradient-primary text-white border-0 shadow-pop"><Plus className="w-4 h-4 mr-1" />Add Student</Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md">
              <SheetHeader><SheetTitle>Add new student</SheetTitle></SheetHeader>
              <form className="space-y-4 mt-6" onSubmit={e => { e.preventDefault(); toast.success("Student added!"); setAddOpen(false); }}>
                <div className="space-y-1.5"><Label>Full name</Label><Input placeholder="e.g. Aarav Sharma" required /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label>Age</Label><Input type="number" placeholder="8" required /></div>
                  <div className="space-y-1.5">
                    <Label>Class</Label>
                    <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5"><Label>Parent's name</Label><Input placeholder="Parent name" /></div>
                <div className="space-y-1.5"><Label>Phone</Label><Input placeholder="+91 ..." /></div>
                <div className="space-y-1.5"><Label>Date of birth</Label><Input type="date" /></div>
                <Button type="submit" className="w-full rounded-xl gradient-primary text-white border-0">Add Student</Button>
              </form>
            </SheetContent>
          </Sheet>
        }
      />

      <DataTable
        columns={[
          { key: "name", header: "Student", render: r => (
            <button onClick={() => setSelected(r)} className="flex items-center gap-3 text-left">
              <Avatar name={r.name} />
              <div>
                <div className="font-bold">{r.name}</div>
                <div className="text-xs text-muted-foreground">{r.email}</div>
              </div>
            </button>
          )},
          { key: "badgeId", header: "Badge ID", render: r => <span className="font-mono text-xs font-bold bg-muted px-2 py-1 rounded">{r.badgeId}</span> },
          { key: "class", header: "Class" },
          { key: "parent", header: "Parent" },
          { key: "feeStatus", header: "Fee", render: r => <StatusPill status={r.feeStatus} /> },
          { key: "x", header: "", render: r => <Button variant="ghost" size="sm" onClick={() => setSelected(r)}><Eye className="w-4 h-4" /></Button> },
        ]}
        rows={students}
        searchKeys={["name", "badgeId", "parent"]}
      />

      <Dialog open={!!selected} onOpenChange={o => !o && setSelected(null)}>
        <DialogContent className="max-w-3xl">
          {selected && <StudentProfile s={selected} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StudentProfile({ s }: { s: typeof students[number] }) {
  const att = makeAttendance(0);
  const present = att.filter(a => a.status === "Present").length;
  const studentCerts = certificates.filter(c => c.studentId === s.id);
  const studentPays = payments.filter(p => p.student === s.name);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3">
          <Avatar name={s.name} size={48} />
          <div>
            <div className="font-display text-xl">{s.name}</div>
            <div className="text-xs text-muted-foreground font-normal">{s.badgeId} • {s.class}</div>
          </div>
        </DialogTitle>
      </DialogHeader>
      <Tabs defaultValue="profile" className="mt-2">
        <TabsList className="grid grid-cols-5 w-full rounded-xl">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="att">Attendance</TabsTrigger>
          <TabsTrigger value="fees">Fees</TabsTrigger>
          <TabsTrigger value="certs">Certificates</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-4">
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <Field k="Parent" v={s.parent} />
            <Field k="Phone" v={s.phone} />
            <Field k="Email" v={s.email} />
            <Field k="Date of birth" v={s.dob} />
            <Field k="Enrolled" v={s.enrolled} />
            <Field k="Status" v={s.status} />
          </div>
        </TabsContent>
        <TabsContent value="att" className="mt-4">
          <div className="card-soft p-4 mb-3 flex gap-6">
            <div><div className="text-xs text-muted-foreground">Attendance</div><div className="font-display text-2xl font-bold text-success">{Math.round(present / att.length * 100)}%</div></div>
            <div><div className="text-xs text-muted-foreground">Present days</div><div className="font-display text-2xl font-bold">{present}</div></div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {att.map(a => (
              <div key={a.date} title={`${a.date}: ${a.status}`} className={`aspect-square rounded ${
                a.status === "Present" ? "bg-success/80" : a.status === "Late" ? "bg-warning/80" : "bg-destructive/70"
              }`} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="fees" className="mt-4 space-y-3">
          <div className="grid sm:grid-cols-3 gap-3">
            <Field k="Total" v={`₹${s.totalFee.toLocaleString()}`} />
            <Field k="Paid" v={`₹${s.paidFee.toLocaleString()}`} />
            <Field k="Balance" v={`₹${(s.totalFee - s.paidFee).toLocaleString()}`} />
          </div>
          <div className="card-soft overflow-hidden">
            <table className="w-full text-sm"><thead className="bg-muted"><tr>
              <th className="px-3 py-2 text-left">Date</th><th className="px-3 py-2 text-left">Amount</th><th className="px-3 py-2 text-left">Mode</th>
            </tr></thead><tbody>
              {studentPays.length === 0 && <tr><td colSpan={3} className="text-center py-6 text-muted-foreground">No payments yet</td></tr>}
              {studentPays.map(p => <tr key={p.id} className="border-t border-border/60"><td className="px-3 py-2">{p.date}</td><td className="px-3 py-2">₹{p.amount.toLocaleString()}</td><td className="px-3 py-2">{p.mode}</td></tr>)}
            </tbody></table>
          </div>
        </TabsContent>
        <TabsContent value="certs" className="mt-4 grid sm:grid-cols-3 gap-3">
          {studentCerts.map(c => (
            <div key={c.id} className="card-soft p-4">
              <div className="font-bold">{c.type}</div>
              <div className="text-xs text-muted-foreground">{c.course}</div>
              <div className="text-[10px] text-muted-foreground mt-1">Issued {c.issued}</div>
            </div>
          ))}
        </TabsContent>
        <TabsContent value="chat" className="mt-4">
          <div className="card-soft p-4 text-sm text-muted-foreground text-center py-10">Chat with parent — open the Chat module.</div>
        </TabsContent>
      </Tabs>
    </>
  );
}

function Field({ k, v }: { k: string; v: string }) {
  return <div className="card-soft p-3"><div className="text-xs text-muted-foreground">{k}</div><div className="font-bold mt-0.5">{v}</div></div>;
}
