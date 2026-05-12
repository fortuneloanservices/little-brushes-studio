"use client";

import { ReactNode } from "react";
import {
  LayoutDashboard, ClipboardCheck, CalendarOff, Palette, CalendarDays, MessageSquare
} from "lucide-react";
import { RoleLayout, NavItem } from "@/components/layouts/RoleLayout";
import { RequireRole } from "@/components/layouts/RoleLayout";

const seniorNav: NavItem[] = [
  { to: "/senior-teacher", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/senior-teacher/class-approvals", label: "Class Approvals", icon: ClipboardCheck },
  { to: "/senior-teacher/leave-approvals", label: "Leave Approvals", icon: CalendarOff },
  { to: "/senior-teacher/drawing-reviews", label: "Drawing Reviews", icon: Palette },
  { to: "/senior-teacher/classes", label: "My Classes", icon: CalendarDays },
  { to: "/senior-teacher/chat", label: "Chat", icon: MessageSquare },
];

export default function SeniorTeacherLayout({ children }: { children: ReactNode }) {
  return (
    <RequireRole role="senior-teacher">
      <RoleLayout navItems={seniorNav} role="senior-teacher">
        {children}
      </RoleLayout>
    </RequireRole>
  );
}
