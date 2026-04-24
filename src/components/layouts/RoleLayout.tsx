import { ReactNode, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, LogOut, Menu, Palette, X, type LucideIcon } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { Avatar } from "@/components/shared/Avatar";
import { Button } from "@/components/ui/button";
import { useAuth, ROLE_LABELS } from "@/contexts/AuthContext";
import { Role } from "@/data/mockData";
import { notifications } from "@/data/mockData";
import { cn } from "@/lib/utils";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type NavItem = { to: string; label: string; icon: LucideIcon; end?: boolean };

const ROLE_THEME: Record<Role, { hsl: string; gradient: string }> = {
  "super-admin":    { hsl: "287 51% 36%", gradient: "from-secondary to-secondary/70" },
  "admin":          { hsl: "16 100% 60%", gradient: "from-primary to-primary/70" },
  "senior-teacher": { hsl: "49 100% 50%", gradient: "from-accent to-primary" },
  "teacher":        { hsl: "161 95% 42%", gradient: "from-success to-info" },
  "student":        { hsl: "210 90% 55%", gradient: "from-info to-secondary" },
};

export function RoleLayout({ navItems, role }: { navItems: NavItem[]; role: Role }) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = ROLE_THEME[role];

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-40 h-screen w-64 shrink-0 bg-card border-r border-border/60 flex flex-col transition-transform",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="p-4 border-b border-border/60 flex items-center justify-between">
          <Logo />
          <button onClick={() => setOpen(false)} className="lg:hidden p-2 rounded-lg hover:bg-muted">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className={cn("mx-4 mt-4 mb-2 rounded-xl p-3 text-white shadow-soft bg-gradient-to-br", theme.gradient)}>
          <div className="text-[10px] uppercase tracking-widest opacity-80 font-bold">Signed in as</div>
          <div className="font-display font-bold text-base">{ROLE_LABELS[role]}</div>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-foreground/70 hover:bg-muted hover:text-foreground",
              )}
              style={({ isActive }) => isActive ? { background: `hsl(${theme.hsl})`, color: "white" } : undefined}
            >
              <item.icon className="w-4 h-4" strokeWidth={2.4} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-border/60">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 rounded-xl text-destructive hover:bg-destructive-soft hover:text-destructive"
            onClick={() => { logout(); navigate("/login"); }}
          >
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-foreground/40 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur border-b border-border/60">
          <div className="flex items-center justify-between gap-3 px-4 sm:px-6 h-16">
            <button className="lg:hidden p-2 rounded-lg hover:bg-muted" onClick={() => setOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground">
              <Palette className="w-4 h-4 text-primary" />
              <span className="font-semibold">Little Brushes Art Academy ERP</span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <span
                className="hidden sm:inline-flex items-center rounded-full px-3 py-1 text-xs font-bold text-white shadow-soft"
                style={{ background: `hsl(${theme.hsl})` }}
              >
                {ROLE_LABELS[role]}
              </span>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative p-2 rounded-xl hover:bg-muted transition-colors" aria-label="Notifications">
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 grid place-items-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold">3</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.map(n => (
                    <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-0.5 py-2.5">
                      <div className="font-semibold text-sm">{n.title}</div>
                      <div className="text-xs text-muted-foreground">{n.desc}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{n.time}</div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-xl hover:bg-muted p-1 pr-2 transition-colors">
                    <Avatar name={user?.name ?? "User"} size={32} />
                    <span className="hidden sm:block text-sm font-semibold">{user?.name}</span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><Link to="/login">Switch Role</Link></DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { logout(); navigate("/login"); }}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 max-w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function RequireRole({ role, children }: { role: Role; children: ReactNode }) {
  const { user } = useAuth();
  const loc = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: loc.pathname }} />;
  if (user.role !== role) return <Navigate to={`/${user.role}`} />;
  return <>{children}</>;
}

import { Navigate } from "react-router-dom";
