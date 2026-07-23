"use client";

import { useState } from "react";
import NextLink from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
// import { getNavForRole } from "@/lib/dashboard-nav";

// Maps the `icon` string in dashboard-nav.js to an actual SVG path.
const icons = {
  grid: (
    <>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4.5" width="18" height="16" rx="2" />
      <path d="M16 2.5v4" />
      <path d="M8 2.5v4" />
      <path d="M3 9.5h18" />
    </>
  ),
  card: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="2.5" />
      <path d="M2 10h20" />
      <path d="M6 15h4" />
    </>
  ),
  star: <path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5-4.8-4.6 6.6-.9L12 2.5Z" />,
  inbox: (
    <>
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z" />
    </>
  ),
  file: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M9 13h6" />
      <path d="M9 17h6" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <circle cx="17.5" cy="9.5" r="2.8" />
      <path d="M15 20a5 5 0 0 1 7.5-4.33" />
    </>
  ),
  badge: (
    <>
      <path d="M12 2 4 5v6c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V5l-8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  chart: (
    <>
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </>
  ),
};

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Better Auth's client hook — reactive, updates automatically on login/logout.
  const { data: session, isPending } = authClient.useSession();

  // Still loading the session — show a lightweight skeleton instead of
  // flashing the wrong nav or redirecting too early.
  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E2E8F0] border-t-[#2563EB]" />
      </div>
    );
  }

  // No session — bounce to login. (Ideally caught earlier by middleware,
  // this is just a client-side safety net.)
  if (!session) {
    router.replace("/login");
    return null;
  }

  const role = session.user.role; // "patient" | "doctor" | "admin"
  const navItems = getNavForRole(role);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-16">
      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-16 z-40 flex items-center justify-between border-b border-[#E2E8F0] bg-white px-4 py-3 lg:hidden">
        <p className="text-sm font-bold capitalize text-[#0F172A]">{role} Dashboard</p>
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
                <Image
                  src={session.user.photoUrl || session.user.image || "https://i.pravatar.cc/150"}
                  alt={session.user.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-[#0F172A]">{session.user.name}</p>
                <p className="text-xs capitalize text-[#94A3B8]">{role}</p>
              </div>
            </div>

            {/* Nav — filtered by role */}
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
                      {icons[item.icon]}
                    </svg>
                    {item.label}
                  </NextLink>
                );
              })}
            </nav>

            <div className="mt-auto">
              <button
                type="button"
                onClick={async () => {
                  await authClient.signOut();
                  router.push("/login");
                }}
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