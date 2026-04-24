// Mock data for Little Brushes Art Academy
import { format, addDays, subDays } from "date-fns";

const today = new Date();
const todayMonthDay = format(today, "MM-dd");

export const INSTITUTE = {
  name: "Little Brushes Art Academy",
  tagline: "Where every child paints their world",
  city: "Bengaluru",
  email: "hello@littlebrushes.in",
  phone: "+91 98450 12345",
  address: "12/A, Indiranagar 1st Stage, Bengaluru 560038",
  principal: "Ms. Anjali Verma",
};

export const SPECIALIZATIONS = ["Watercolor", "Sketching", "Clay Art", "Pottery", "Acrylic"] as const;
export const CLASSES = ["Tiny Tots (4-6)", "Junior (7-9)", "Intermediate (10-12)", "Senior (13-16)"] as const;

export type Role = "super-admin" | "admin" | "senior-teacher" | "teacher" | "student";

export const ROLE_LABELS: Record<Role, string> = {
  "super-admin": "Super Admin",
  "admin": "Admin",
  "senior-teacher": "Senior Teacher",
  "teacher": "Teacher",
  "student": "Student",
};

// ---------- Students ----------
const studentNames = [
  "Aarav Sharma","Diya Patel","Vihaan Reddy","Anaya Iyer","Kabir Mehta",
  "Myra Singh","Aryan Kapoor","Saanvi Joshi","Reyansh Nair","Ira Bansal",
  "Vivaan Khanna","Aadhya Rao","Arjun Pillai","Kiara Desai","Ishaan Gupta",
];

export const students = studentNames.map((name, i) => {
  // Make 2nd and 5th students have today's birthday
  const isBirthdayToday = i === 1 || i === 4;
  const dob = isBirthdayToday
    ? `2015-${todayMonthDay}`
    : format(subDays(today, 365 * (5 + (i % 8)) + i * 13), "yyyy-MM-dd");
  return {
    id: `STU${String(1001 + i).padStart(4, "0")}`,
    badgeId: `LBA-${String(1001 + i).padStart(4, "0")}`,
    name,
    age: 5 + (i % 10),
    class: CLASSES[i % CLASSES.length],
    parent: ["Rohit","Priya","Suresh","Meera","Vikram"][i % 5] + " " + name.split(" ")[1],
    phone: `+91 9${String(800000000 + i * 12345).slice(0, 9)}`,
    email: name.toLowerCase().replace(" ", ".") + "@kid.in",
    dob,
    enrolled: format(subDays(today, 30 + i * 25), "yyyy-MM-dd"),
    feeStatus: (i % 4 === 0 ? "Pending" : i % 7 === 0 ? "Overdue" : "Paid") as "Paid" | "Pending" | "Overdue",
    totalFee: 18000,
    paidFee: i % 4 === 0 ? 9000 : i % 7 === 0 ? 0 : 18000,
    status: "Active" as const,
    isBirthdayToday,
  };
});

// ---------- Teachers ----------
const teacherNames = [
  "Anjali Verma","Rahul Desai","Sneha Kulkarni","Mohit Bansal",
  "Pooja Nair","Karan Singh","Riya Malhotra","Amit Joshi",
];
export const teachers = teacherNames.map((name, i) => ({
  id: `TCH${String(2001 + i).padStart(4, "0")}`,
  name,
  specialization: SPECIALIZATIONS[i % SPECIALIZATIONS.length],
  email: name.toLowerCase().replace(" ", ".") + "@littlebrushes.in",
  phone: `+91 9${String(811000000 + i * 7777).slice(0, 9)}`,
  experience: 2 + (i % 8),
  status: "Active" as const,
  classes: [CLASSES[i % CLASSES.length], CLASSES[(i + 1) % CLASSES.length]],
  isSenior: i === 0 || i === 1,
}));

// ---------- Inventory ----------
export const inventoryItems = [
  { id: "INV001", name: "Apron - Small",     category: "Uniform",    stock: 8,  reorder: 10 },
  { id: "INV002", name: "Apron - Medium",    category: "Uniform",    stock: 24, reorder: 10 },
  { id: "INV003", name: "Apron - Large",     category: "Uniform",    stock: 18, reorder: 10 },
  { id: "INV004", name: "Sketch Book A4",    category: "Book Kit",   stock: 45, reorder: 20 },
  { id: "INV005", name: "Watercolor Set 12", category: "Art Supply", stock: 6,  reorder: 15 },
  { id: "INV006", name: "Acrylic Paint Set", category: "Art Supply", stock: 22, reorder: 12 },
  { id: "INV007", name: "Canvas Board 12x16",category: "Art Supply", stock: 30, reorder: 15 },
  { id: "INV008", name: "Clay Kit 1kg",      category: "Art Supply", stock: 4,  reorder: 10 },
  { id: "INV009", name: "Paint Brushes Set", category: "Equipment",  stock: 38, reorder: 20 },
  { id: "INV010", name: "Drawing Pencils HB",category: "Equipment",  stock: 60, reorder: 25 },
].map(it => ({ ...it, status: it.stock <= it.reorder ? "Low Stock" : "In Stock" }));

export const recentIssues = [
  { date: format(today, "yyyy-MM-dd"),         student: students[0].name, item: "Apron - Medium",    qty: 1 },
  { date: format(subDays(today,1),"yyyy-MM-dd"),student: students[3].name, item: "Watercolor Set 12", qty: 1 },
  { date: format(subDays(today,2),"yyyy-MM-dd"),student: students[5].name, item: "Sketch Book A4",    qty: 2 },
  { date: format(subDays(today,3),"yyyy-MM-dd"),student: students[7].name, item: "Clay Kit 1kg",      qty: 1 },
  { date: format(subDays(today,4),"yyyy-MM-dd"),student: students[2].name, item: "Paint Brushes Set", qty: 1 },
];

// ---------- CRM Leads ----------
export const leadStages = ["New Enquiry", "Follow-up", "Visit Scheduled", "Enrolled"] as const;
export const leads = [
  { id: "LD001", child: "Naina Roy",   parent: "Sushma Roy",    phone: "+91 9876512300", source: "Instagram", counselor: "Pooja Nair",     stage: "New Enquiry" as const },
  { id: "LD002", child: "Dev Verma",   parent: "Manoj Verma",   phone: "+91 9876512301", source: "Walk-in",   counselor: "Riya Malhotra",  stage: "New Enquiry" as const },
  { id: "LD003", child: "Tara Shah",   parent: "Neha Shah",     phone: "+91 9876512302", source: "Referral",  counselor: "Pooja Nair",     stage: "Follow-up" as const },
  { id: "LD004", child: "Yash Mishra", parent: "Ankit Mishra",  phone: "+91 9876512303", source: "Google Ad", counselor: "Riya Malhotra",  stage: "Visit Scheduled" as const },
  { id: "LD005", child: "Avni Bhat",   parent: "Sweta Bhat",    phone: "+91 9876512304", source: "Referral",  counselor: "Pooja Nair",     stage: "Enrolled" as const },
];

// ---------- Slot requests ----------
export const slotRequests = [
  { id: "SR001", studentId: students[0].id, student: students[0].name, badge: students[0].badgeId, class: "Watercolor Basics",  time: "4:00 PM", date: format(today,"yyyy-MM-dd"),       status: "Pending" as const },
  { id: "SR002", studentId: students[2].id, student: students[2].name, badge: students[2].badgeId, class: "Clay Sculpting",     time: "5:00 PM", date: format(today,"yyyy-MM-dd"),       status: "Pending" as const },
  { id: "SR003", studentId: students[4].id, student: students[4].name, badge: students[4].badgeId, class: "Sketching",          time: "5:30 PM", date: format(today,"yyyy-MM-dd"),       status: "Pending" as const },
  { id: "SR004", studentId: students[1].id, student: students[1].name, badge: students[1].badgeId, class: "Acrylic Painting",   time: "4:30 PM", date: format(addDays(today,1),"yyyy-MM-dd"), status: "Approved" as const },
  { id: "SR005", studentId: students[6].id, student: students[6].name, badge: students[6].badgeId, class: "Pottery",            time: "6:00 PM", date: format(addDays(today,1),"yyyy-MM-dd"), status: "Approved" as const },
  { id: "SR006", studentId: students[8].id, student: students[8].name, badge: students[8].badgeId, class: "Watercolor Basics",  time: "4:00 PM", date: format(subDays(today,1),"yyyy-MM-dd"), status: "Denied"  as const },
];

// ---------- Leaves ----------
export type LeaveStatus = "Pending" | "Approved" | "Rejected";
export type LeaveRequest = { id: string; staff: string; type: string; from: string; to: string; reason: string; status: LeaveStatus };
export const leaveRequests: LeaveRequest[] = [
  { id: "LV001", staff: "Sneha Kulkarni", type: "Casual",   from: format(addDays(today,2),"yyyy-MM-dd"), to: format(addDays(today,3),"yyyy-MM-dd"), reason: "Family function",  status: "Pending"  },
  { id: "LV002", staff: "Mohit Bansal",   type: "Sick",     from: format(today,"yyyy-MM-dd"),            to: format(today,"yyyy-MM-dd"),             reason: "Fever",             status: "Pending"  },
  { id: "LV003", staff: "Karan Singh",    type: "Personal", from: format(subDays(today,5),"yyyy-MM-dd"), to: format(subDays(today,4),"yyyy-MM-dd"), reason: "Personal work",     status: "Approved" },
];

// ---------- Salary ----------
export const salaries = teachers.map((t, i) => {
  const basic = 25000 + i * 1500;
  const hra = Math.round(basic * 0.4);
  const da = Math.round(basic * 0.1);
  const gross = basic + hra + da;
  const pf = Math.round(basic * 0.12);
  const tds = Math.round(gross * 0.05);
  const net = gross - pf - tds;
  return { id: t.id, staff: t.name, role: t.isSenior ? "Senior Teacher" : "Teacher", basic, hra, da, pf, tds, gross, net };
});

// ---------- Payments ----------
export const payments = [
  { id: "PAY001", date: format(today,"yyyy-MM-dd"),          student: students[0].name, amount: 9000,  mode: "Online" as const, status: "Success" as const },
  { id: "PAY002", date: format(subDays(today,1),"yyyy-MM-dd"),student: students[1].name, amount: 18000, mode: "Cash"   as const, status: "Success" as const },
  { id: "PAY003", date: format(subDays(today,2),"yyyy-MM-dd"),student: students[3].name, amount: 6000,  mode: "Online" as const, status: "Success" as const },
  { id: "PAY004", date: format(subDays(today,3),"yyyy-MM-dd"),student: students[5].name, amount: 18000, mode: "Online" as const, status: "Success" as const },
  { id: "PAY005", date: format(subDays(today,5),"yyyy-MM-dd"),student: students[7].name, amount: 12000, mode: "Cash"   as const, status: "Success" as const },
];

// ---------- Attendance (last 30 days for first student) ----------
export function makeAttendance(studentIndex = 0) {
  return Array.from({ length: 30 }, (_, i) => {
    const d = subDays(today, 29 - i);
    const day = d.getDay();
    let status: "Present" | "Absent" | "Late" = "Present";
    if (day === 0) status = "Absent"; // sunday off
    else if (i % 11 === 0) status = "Absent";
    else if (i % 7 === 0) status = "Late";
    return { date: format(d, "yyyy-MM-dd"), status };
  });
}

// ---------- Certificates ----------
export const certificateTypes = ["Bonafide", "Completion", "Merit", "Participation"] as const;
export const certificates = students.flatMap((s, i) => [
  { id: `CRT${i}1`, studentId: s.id, student: s.name, type: "Participation" as const, course: "Watercolor Basics",  issued: format(subDays(today, 60+i*3), "yyyy-MM-dd") },
  { id: `CRT${i}2`, studentId: s.id, student: s.name, type: "Merit" as const,         course: "Sketching",          issued: format(subDays(today, 30+i*3), "yyyy-MM-dd") },
  { id: `CRT${i}3`, studentId: s.id, student: s.name, type: "Bonafide" as const,      course: "General",            issued: format(subDays(today, 10+i),    "yyyy-MM-dd") },
]);

// ---------- Institutions (super admin) ----------
export const institutions = [
  { id: "INST01", name: "Little Brushes Art Academy",    city: "Bengaluru", plan: "Pro",        students: 156, status: "Active"  as const },
  { id: "INST02", name: "Tiny Strokes Studio",            city: "Mumbai",    plan: "Basic",      students: 64,  status: "Active"  as const },
  { id: "INST03", name: "Color Crayons Academy",          city: "Pune",      plan: "Enterprise", students: 410, status: "Active"  as const },
  { id: "INST04", name: "Rainbow Palette School",         city: "Delhi",     plan: "Pro",        students: 188, status: "Trial"   as const },
  { id: "INST05", name: "Brushwood Kids",                 city: "Chennai",   plan: "Basic",      students: 42,  status: "Inactive" as const },
];

export const pricingPlans = [
  { name: "Basic",      price: 2999,  features: ["Up to 100 students","Basic dashboards","Email support"] },
  { name: "Pro",        price: 6999,  features: ["Up to 500 students","All modules","WhatsApp + SMS","Priority support"] },
  { name: "Enterprise", price: 14999, features: ["Unlimited students","Multi-branch","API access","Dedicated manager"] },
];

// ---------- Notifications ----------
export const notifications = [
  { id: 1, title: "Fee due reminder",     desc: "5 students have pending fees this week.",   time: "10m ago", icon: "bell"  as const },
  { id: 2, title: "Birthday today!",      desc: "2 students have birthdays today.",          time: "1h ago",  icon: "cake"  as const },
  { id: 3, title: "Inventory low",        desc: "Watercolor Set 12 is running low.",         time: "3h ago",  icon: "box"   as const },
];

export const notificationLog = [
  { id: 1, target: "All Parents",  channel: "WhatsApp", message: "Holiday on Friday for Diwali.", sent: format(subDays(today,1),"yyyy-MM-dd HH:mm") },
  { id: 2, target: "Class: Junior",channel: "SMS",      message: "Bring sketch books tomorrow.",  sent: format(subDays(today,2),"yyyy-MM-dd HH:mm") },
  { id: 3, target: "Staff",        channel: "Email",    message: "Monthly review on Saturday.",   sent: format(subDays(today,3),"yyyy-MM-dd HH:mm") },
];

// ---------- Today's classes ----------
export const todaysClasses = [
  { id: "CL1", time: "3:30 PM", subject: "Watercolor Basics", className: "Tiny Tots (4-6)",        students: 8 },
  { id: "CL2", time: "4:30 PM", subject: "Sketching",         className: "Junior (7-9)",           students: 12 },
  { id: "CL3", time: "5:30 PM", subject: "Clay Sculpting",    className: "Intermediate (10-12)",   students: 10 },
  { id: "CL4", time: "6:30 PM", subject: "Acrylic Painting",  className: "Senior (13-16)",         students: 9 },
];

// ---------- Chat ----------
export const chatThreads = [
  { id: "T1", name: "Aarav Sharma", role: "Student", last: "Thank you ma'am!", unread: 2 },
  { id: "T2", name: "Diya's Mom",   role: "Parent",  last: "Will she be at class today?", unread: 1 },
  { id: "T3", name: "Anjali Verma", role: "Senior Teacher", last: "Approved your request.", unread: 0 },
  { id: "T4", name: "Rahul Desai",  role: "Teacher", last: "Please share the schedule.", unread: 0 },
];

export const chatMessages = [
  { id: 1, from: "them", text: "Hi! When is the next watercolor class?", time: "10:02 AM" },
  { id: 2, from: "me",   text: "Tomorrow at 4 PM, in studio 2 🎨",        time: "10:04 AM" },
  { id: 3, from: "them", text: "Should I bring anything special?",        time: "10:05 AM" },
  { id: 4, from: "me",   text: "Just your apron and a smile! 😊",          time: "10:06 AM" },
  { id: 5, from: "them", text: "Thank you ma'am!",                        time: "10:07 AM" },
];

export const feeStructure = CLASSES.map((c, i) => ({
  className: c,
  monthly: 1500 + i * 250,
  quarterly: (1500 + i * 250) * 3 - 200,
  yearly: (1500 + i * 250) * 12 - 1500,
}));

export const dashboardStats = {
  superAdmin: {
    institutes: institutions.length,
    students: institutions.reduce((s, i) => s + i.students, 0),
    revenue: 1240000,
    tickets: 7,
  },
  admin: {
    students: students.length,
    teachers: teachers.length,
    feeCollected: payments.reduce((s, p) => s + p.amount, 0),
    pendingDues: students.filter(s => s.feeStatus !== "Paid").reduce((s,x)=>s + (x.totalFee - x.paidFee), 0),
    openLeads: leads.filter(l => l.stage !== "Enrolled").length,
    lowStock: inventoryItems.filter(i => i.status === "Low Stock").length,
    pendingLeaves: leaveRequests.filter(l => l.status === "Pending").length,
  },
};
