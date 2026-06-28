"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Building2,
  LayoutDashboard,
  LogOut,
  Settings,
  UserCircle2,
  Users,
} from "lucide-react";
import Logo from "@/components/common/logo";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/offices", label: "Offices", icon: Building2 },
  { href: "/dashboard/employees", label: "Employees", icon: Users },
  { href: "/dashboard/reporting", label: "Reporting", icon: BarChart3 },
];

const bottomItems = [
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/profile", label: "Profile", icon: UserCircle2 },
];

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export default function DashboardSidebar({
  mobileOpen,
  onClose,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-40 flex w-64 flex-col
        bg-[#0d0d0d] border-r border-[#1a1a1a]
        p-4 transition-transform duration-200
        lg:static lg:translate-x-0
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-2 mb-7">
        <Logo mode="light" />
      </div>

      {/* Primary nav */}
      <p className="px-2 mb-2 text-[10px] font-medium uppercase tracking-widest text-zinc-700">
        Workspace
      </p>
      <nav className="flex flex-col gap-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`
                group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                ${
                  active
                    ? "bg-[#161616] text-zinc-200"
                    : "text-zinc-500 hover:bg-[#161616] hover:text-zinc-300"
                }
              `}
            >
              <Icon
                className={`h-4 w-4 shrink-0 transition-colors ${
                  active
                    ? "text-indigo-400"
                    : "text-zinc-600 group-hover:text-zinc-400"
                }`}
              />
              {item.label}
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="my-4 border-t border-[#1a1a1a]" />

      {/* Secondary nav */}
      <p className="px-2 mb-2 text-[10px] font-medium uppercase tracking-widest text-zinc-700">
        Account
      </p>
      <nav className="flex flex-col gap-0.5">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`
                group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                ${
                  active
                    ? "bg-[#161616] text-zinc-200"
                    : "text-zinc-500 hover:bg-[#161616] hover:text-zinc-300"
                }
              `}
            >
              <Icon
                className={`h-4 w-4 shrink-0 ${
                  active
                    ? "text-indigo-400"
                    : "text-zinc-600 group-hover:text-zinc-400"
                }`}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User block + logout */}
      <div className="mt-auto rounded-xl border border-[#1c1c1c] p-3 flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-950 text-[11px] font-medium text-indigo-400">
          TA
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-zinc-300 truncate">Tahir</p>
          <p className="text-[10px] text-zinc-600 truncate">Super admin</p>
        </div>
        <button
          type="button"
          aria-label="Logout"
          onClick={() => router.push("/")}
          className="ml-auto text-zinc-600 transition-colors hover:text-zinc-300"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
