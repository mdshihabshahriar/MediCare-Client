"use client";

import { useState } from "react";
import NextLink from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: (
      <>
        <rect x="3" y="3" width="7" height="9" rx="1.5" />
        <rect x="14" y="3" width="7" height="5" rx="1.5" />
        <rect x="14" y="12" width="7" height="9" rx="1.5" />
        <rect x="3" y="16" width="7" height="5" rx="1.5" />
      </>
    ),
  },
  {
    label: "My Profile",
    href: "/dashboard/profile",
    icon: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
      </>
    ),
  },
  {
    label: "My Appointments",
    href: "/dashboard/appointments",
    icon: (
      <>
        <rect x="3" y="4.5" width="18" height="16" rx="2" />
        <path d="M16 2.5v4" />
        <path d="M8 2.5v4" />
        <path d="M3 9.5h18" />
      </>
    ),
  },
  {
    label: "Payment History",
    href: "/dashboard/payments",
    icon: (
      <>
        <rect x="2" y="5" width="20" height="14" rx="2.5" />
        <path d="M2 10h20" />
        <path d="M6 15h4" />
      </>
    ),
  },
  {
    label: "My Reviews",
    href: "/dashboard/reviews",
    icon: (
      <path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5-4.8-4.6 6.6-.9L12 2.5Z" />
    ),
  },
];

const currentUser = {
  name: "Sarah Jenkins",
  role: "Patient",
  photoUrl: "https://i.pravatar.cc/150?img=47",
};

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-16">
      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-16 z-40 flex items-center justify-between border-b border-[#E2E8F0] bg-white px-4 py-3 lg:hidden">
        <p className="text-sm font-bold text-[#0F172A]">Patient Dashboard</p>
        <button
          type="button"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E2E8F0] text-[#334155]"
          aria-label="Toggle sidebar"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6h16" />
            <path d="M4 12h16" />
            <path d="M4 18h16" />
          </svg>
        </button>
      </div>

      <div className="mx-auto flex max-w-350">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 border-r border-[#E2E8F0] bg-white pt-16 transition-transform lg:sticky lg:top-16 lg:z-0 lg:h-[calc(100vh-4rem)] lg:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col gap-1 overflow-y-auto p-4">
            {/* User card */}
            <div className="mb-4 flex items-center gap-3 rounded-xl bg-[#F8FAFC] p-3">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
                <Image src={currentUser.photoUrl} alt={currentUser.name} fill className="object-cover" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-[#0F172A]">{currentUser.name}</p>
                <p className="text-xs text-[#94A3B8]">{currentUser.role}</p>
              </div>
            </div>

            {/* Nav */}
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <NextLink
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[#EFF6FF] text-[#2563EB]"
                        : "text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
                    }`}
                  >
                    <svg
                      className="h-5 w-5 shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {item.icon}
                    </svg>
                    {item.label}
                  </NextLink>
                );
              })}
            </nav>

            <div className="mt-auto">
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#EF4444] transition-colors hover:bg-[#FEF2F2]"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <path d="M16 17l5-5-5-5" />
                  <path d="M21 12H9" />
                </svg>
                Log Out
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          />
        )}

        {/* Main content */}
        <main className="min-w-0 flex-1 px-4 py-8 pt-20 sm:px-6 lg:px-10 lg:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}