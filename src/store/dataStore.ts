import { useSyncExternalStore } from "react";
import {
  students as seedStudents,
  teachers as seedTeachers,
  inventoryItems as seedInventory,
  recentIssues as seedIssues,
  leads as seedLeads,
  slotRequests as seedSlots,
  leaveRequests as seedLeaves,
  payments as seedPayments,
  certificates as seedCerts,
  notificationLog as seedNotifLog,
  institutions as seedInstitutions,
  CLASSES,
} from "@/data/mockData";

type Student = typeof seedStudents[number];
type Teacher = typeof seedTeachers[number];
type InventoryItem = typeof seedInventory[number];
type Issue = typeof seedIssues[number];
type Lead = typeof seedLeads[number];
type SlotReq = typeof seedSlots[number];
type Leave = typeof seedLeaves[number];
type Payment = typeof seedPayments[number];
type Certificate = typeof seedCerts[number];
type NotifLog = typeof seedNotifLog[number];
type Institution = typeof seedInstitutions[number];

export type DrawingScore = { duration: number; neatness: number; art: number };
export type DrawingTest = {
  id: string;
  title: string;
  studentId: string;
  studentName: string;
  teacherName: string;
  className: string;
  teacherImage: string; // data URL
  studentImage: string; // data URL
  durationMinutes: number; // time student took
  submittedAt: string;
  status: "Pending Review" | "Scored";
  studentScore?: DrawingScore;
  teacherScore?: DrawingScore;
  reviewerNotes?: string;
  reviewedAt?: string;
};

export type State = {
  students: Student[];
  teachers: Teacher[];
  inventory: InventoryItem[];
  issues: Issue[];
  leads: Lead[];
  slots: SlotReq[];
  leaves: Leave[];
  payments: Payment[];
  certificates: Certificate[];
  notifLog: NotifLog[];
  institutions: Institution[];
  drawingTests: DrawingTest[];
};

let state: State = {
  students: [...seedStudents],
  teachers: [...seedTeachers],
  inventory: [...seedInventory],
  issues: [...seedIssues],
  leads: [...seedLeads],
  slots: [...seedSlots],
  leaves: [...seedLeaves],
  payments: [...seedPayments],
  certificates: [...seedCerts],
  notifLog: [...seedNotifLog],
  institutions: [...seedInstitutions],
  drawingTests: [],
};

const listeners = new Set<() => void>();
const subscribe = (l: () => void) => { listeners.add(l); return () => listeners.delete(l); };
const getSnapshot = () => state;
const set = (patch: Partial<State> | ((s: State) => Partial<State>)) => {
  const p = typeof patch === "function" ? patch(state) : patch;
  state = { ...state, ...p };
  listeners.forEach(l => l());
};

export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(subscribe, () => selector(state), () => selector(state));
}

// ---------- Actions ----------
export const actions = {
  // Students
  addStudent(input: { name: string; age: number; class: string; parent?: string; phone?: string; email?: string; dob?: string }) {
    const id = `STU${String(1000 + state.students.length + 1).padStart(4, "0")}`;
    const badgeId = `LBA-${String(1000 + state.students.length + 1).padStart(4, "0")}`;
    const today = new Date().toISOString().slice(0, 10);
    const s: Student = {
      id, badgeId, name: input.name, age: input.age,
      class: (input.class as Student["class"]) || CLASSES[0],
      parent: input.parent || "—",
      phone: input.phone || "",
      email: input.email || `${input.name.toLowerCase().replace(/\s+/g, ".")}@kid.in`,
      dob: input.dob || today,
      enrolled: today,
      feeStatus: "Pending",
      totalFee: 18000,
      paidFee: 0,
      status: "Active",
      isBirthdayToday: false,
    };
    set(st => ({ students: [s, ...st.students] }));
    return s;
  },
  removeStudent(id: string) {
    set(st => ({ students: st.students.filter(s => s.id !== id) }));
  },

  // Teachers
  addTeacher(input: { name: string; email?: string; phone?: string; specialization: any; experience?: number }) {
    const id = `TCH${String(2000 + state.teachers.length + 1).padStart(4, "0")}`;
    const t: Teacher = {
      id, name: input.name,
      specialization: input.specialization,
      email: input.email || `${input.name.toLowerCase().replace(/\s+/g, ".")}@littlebrushes.in`,
      phone: input.phone || "",
      experience: input.experience || 1,
      status: "Active",
      classes: [CLASSES[0], CLASSES[1]],
      isSenior: false,
    };
    set(st => ({ teachers: [t, ...st.teachers] }));
    return t;
  },

  // Leads
  addLead(input: { child: string; parent?: string; phone?: string; source?: string }) {
    const id = `LD${String(state.leads.length + 1).padStart(3, "0")}`;
    const l: Lead = {
      id, child: input.child,
      parent: input.parent || "—",
      phone: input.phone || "",
      source: input.source || "Walk-in",
      counselor: "Pooja Nair",
      stage: "New Enquiry",
    };
    set(st => ({ leads: [l, ...st.leads] }));
    return l;
  },
  moveLead(id: string, stage: Lead["stage"]) {
    set(st => ({ leads: st.leads.map(l => l.id === id ? { ...l, stage } : l) }));
    // If enrolled, auto-create student
    const lead = state.leads.find(l => l.id === id);
    if (lead && stage === "Enrolled" && !state.students.some(s => s.name === lead.child)) {
      actions.addStudent({ name: lead.child, age: 8, class: CLASSES[1], parent: lead.parent, phone: lead.phone });
    }
  },

  // Slot requests
  addSlotRequest(input: { studentId: string; student: string; badge: string; class: string; time: string; date: string }) {
    const id = `SR${String(state.slots.length + 1).padStart(3, "0")}`;
    const r: SlotReq = { id, ...input, status: "Pending" };
    set(st => ({ slots: [r, ...st.slots] }));
    return r;
  },
  setSlotStatus(id: string, status: SlotReq["status"]) {
    set(st => ({ slots: st.slots.map(r => r.id === id ? { ...r, status } : r) }));
  },

  // Leaves
  addLeave(input: { staff: string; type: string; from: string; to: string; reason: string }) {
    const id = `LV${String(state.leaves.length + 1).padStart(3, "0")}`;
    const l: Leave = { id, ...input, status: "Pending" };
    set(st => ({ leaves: [l, ...st.leaves] }));
    return l;
  },
  setLeaveStatus(id: string, status: Leave["status"]) {
    set(st => ({ leaves: st.leaves.map(l => l.id === id ? { ...l, status } : l) }));
  },

  // Inventory
  issueItem(input: { itemId: string; studentName: string; qty: number }) {
    const item = state.inventory.find(i => i.id === input.itemId);
    if (!item) return;
    const newStock = Math.max(0, item.stock - input.qty);
    set(st => ({
      inventory: st.inventory.map(i => i.id === input.itemId ? { ...i, stock: newStock, status: newStock <= i.reorder ? "Low Stock" : "In Stock" } : i),
      issues: [{ date: new Date().toISOString().slice(0, 10), student: input.studentName, item: item.name, qty: input.qty }, ...st.issues],
    }));
  },

  // Payments
  recordPayment(input: { studentName: string; amount: number; mode: "Online" | "Cash" }) {
    const id = `PAY${String(state.payments.length + 1).padStart(3, "0")}`;
    const p: Payment = { id, date: new Date().toISOString().slice(0, 10), student: input.studentName, amount: input.amount, mode: input.mode, status: "Success" };
    set(st => {
      const students = st.students.map(s => {
        if (s.name !== input.studentName) return s;
        const paidFee = Math.min(s.totalFee, s.paidFee + input.amount);
        const feeStatus: Student["feeStatus"] = paidFee >= s.totalFee ? "Paid" : "Pending";
        return { ...s, paidFee, feeStatus };
      });
      return { payments: [p, ...st.payments], students };
    });
    return p;
  },

  // Certificates
  issueCertificate(input: { studentId: string; student: string; type: any; course: string }) {
    const id = `CRT${Date.now().toString(36)}`;
    const c: Certificate = { id, studentId: input.studentId, student: input.student, type: input.type, course: input.course, issued: new Date().toISOString().slice(0, 10) };
    set(st => ({ certificates: [c, ...st.certificates] }));
    return c;
  },

  // Notifications
  sendNotification(input: { target: string; channel: string; message: string }) {
    const id = state.notifLog.length + 1;
    const sent = new Date().toISOString().slice(0, 16).replace("T", " ");
    set(st => ({ notifLog: [{ id, ...input, sent }, ...st.notifLog] }));
  },

  // Institutions
  addInstitution(input: { name: string; city: string; plan: string; students?: number }) {
    const id = `INST${String(state.institutions.length + 1).padStart(2, "0")}`;
    const i: Institution = { id, name: input.name, city: input.city, plan: input.plan, students: input.students || 0, status: "Trial" };
    set(st => ({ institutions: [i, ...st.institutions] }));
    return i;
  },
};
