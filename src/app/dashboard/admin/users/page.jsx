"use client";

import { useState } from "react";
import Image from "next/image";

const initialUsers = [
  { id: "1", name: "Sarah Jenkins", email: "sarah.jenkins@example.com", role: "patient", status: "active", photo: "https://i.pravatar.cc/150?img=47", joined: "2026-01-14" },
  { id: "2", name: "Rafiq Ahmed", email: "rafiq.ahmed@example.com", role: "patient", status: "active", photo: "https://i.pravatar.cc/150?img=12", joined: "2026-02-02" },
  { id: "3", name: "Dr. Amanda Ross", email: "amanda.ross@example.com", role: "doctor", status: "active", photo: "https://i.pravatar.cc/150?img=44", joined: "2025-11-20" },
  { id: "4", name: "David Okafor", email: "david.okafor@example.com", role: "patient", status: "suspended", photo: "https://i.pravatar.cc/150?img=15", joined: "2026-03-08" },
  { id: "5", name: "Dr. Omar Siddique", email: "omar.siddique@example.com", role: "doctor", status: "suspended", photo: "https://i.pravatar.cc/150?img=59", joined: "2025-09-30" },
];

const roleStyles = {
  patient: "bg-[#DBEAFE] text-[#1D4ED8]",
  doctor: "bg-[#DCFCE7] text-[#15803D]",
  admin: "bg-[#EDE9FE] text-[#7E22CE]",
};

const statusStyles = {
  active: "bg-[#DCFCE7] text-[#15803D]",
  suspended: "bg-[#FEE2E2] text-[#DC2626]",
};

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#0F172A]">{title}</h3>
          <button type="button" onClick={onClose} className="rounded-full p-1.5 text-[#94A3B8] hover:bg-[#F1F5F9] hover:text-[#0F172A]" aria-label="Close">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}

export default function ManageUsers() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [viewTarget, setViewTarget] = useState(null);
  const [suspendTarget, setSuspendTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleToggleSuspend = () => {
    // TODO: PATCH user status on your API.
    setUsers((prev) =>
      prev.map((u) =>
        u.id === suspendTarget.id
          ? { ...u, status: u.status === "active" ? "suspended" : "active" }
          : u
      )
    );
    setSuspendTarget(null);
  };

  const handleDelete = () => {
    // TODO: DELETE the user on your API.
    setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F172A] sm:text-3xl">Manage Users</h1>
        <p className="mt-1 text-sm text-[#64748B]">
          View, suspend, or remove patient and doctor accounts.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <svg className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full rounded-xl border border-[#E2E8F0] bg-white py-2.5 pl-10 pr-4 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
          />
        </div>
        <div className="flex gap-2">
          {["all", "patient", "doctor"].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold capitalize transition-colors ${
                roleFilter === r
                  ? "border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]"
                  : "border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9]"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="hidden overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs uppercase tracking-wide text-[#64748B]">
            <tr>
              <th className="px-6 py-3.5 font-semibold">User</th>
              <th className="px-6 py-3.5 font-semibold">Role</th>
              <th className="px-6 py-3.5 font-semibold">Joined</th>
              <th className="px-6 py-3.5 font-semibold">Status</th>
              <th className="px-6 py-3.5 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {filtered.map((u) => (
              <tr key={u.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
                      <Image src={u.photo} alt={u.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#0F172A]">{u.name}</p>
                      <p className="text-xs text-[#94A3B8]">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${roleStyles[u.role]}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-[#334155]">{u.joined}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[u.status]}`}>
                    {u.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setViewTarget(u)} className="rounded-lg border border-[#E2E8F0] px-3 py-1.5 text-xs font-semibold text-[#334155] hover:bg-[#F1F5F9]">
                      View
                    </button>
                    <button
                      onClick={() => setSuspendTarget(u)}
                      className="rounded-lg border border-[#F59E0B] px-3 py-1.5 text-xs font-semibold text-[#B45309] hover:bg-[#FFFBEB]"
                    >
                      {u.status === "active" ? "Suspend" : "Reactivate"}
                    </button>
                    <button onClick={() => setDeleteTarget(u)} className="rounded-lg border border-[#EF4444] px-3 py-1.5 text-xs font-semibold text-[#EF4444] hover:bg-[#FEF2F2]">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards (mobile) */}
      <div className="flex flex-col gap-4 md:hidden">
        {filtered.map((u) => (
          <div key={u.id} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
                <Image src={u.photo} alt={u.name} fill className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-[#0F172A]">{u.name}</p>
                <p className="truncate text-xs text-[#94A3B8]">{u.email}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${roleStyles[u.role]}`}>{u.role}</span>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[u.status]}`}>{u.status}</span>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setViewTarget(u)} className="flex-1 rounded-lg border border-[#E2E8F0] py-1.5 text-xs font-semibold text-[#334155]">View</button>
              <button onClick={() => setSuspendTarget(u)} className="flex-1 rounded-lg border border-[#F59E0B] py-1.5 text-xs font-semibold text-[#B45309]">
                {u.status === "active" ? "Suspend" : "Reactivate"}
              </button>
              <button onClick={() => setDeleteTarget(u)} className="flex-1 rounded-lg border border-[#EF4444] py-1.5 text-xs font-semibold text-[#EF4444]">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {viewTarget && (
        <Modal title="User Details" onClose={() => setViewTarget(null)}>
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
              <Image src={viewTarget.photo} alt={viewTarget.name} fill className="object-cover" />
            </div>
            <div>
              <p className="font-bold text-[#0F172A]">{viewTarget.name}</p>
              <p className="text-xs text-[#94A3B8]">{viewTarget.email}</p>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-3 text-sm">
            <div className="flex justify-between border-b border-[#E2E8F0] pb-3">
              <span className="text-[#64748B]">Role</span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${roleStyles[viewTarget.role]}`}>{viewTarget.role}</span>
            </div>
            <div className="flex justify-between border-b border-[#E2E8F0] pb-3">
              <span className="text-[#64748B]">Joined</span>
              <span className="font-semibold text-[#0F172A]">{viewTarget.joined}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Status</span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyles[viewTarget.status]}`}>{viewTarget.status}</span>
            </div>
          </div>
        </Modal>
      )}

      {suspendTarget && (
        <Modal title={suspendTarget.status === "active" ? "Suspend User" : "Reactivate User"} onClose={() => setSuspendTarget(null)}>
          <p className="text-sm text-[#64748B]">
            {suspendTarget.status === "active"
              ? <>Suspend <span className="font-semibold text-[#0F172A]">{suspendTarget.name}</span>? They won&apos;t be able to log in until reactivated.</>
              : <>Reactivate <span className="font-semibold text-[#0F172A]">{suspendTarget.name}</span>&apos;s account?</>}
          </p>
          <div className="mt-6 flex gap-3">
            <button type="button" onClick={() => setSuspendTarget(null)} className="flex-1 rounded-full border border-[#E2E8F0] py-2.5 text-sm font-semibold text-[#334155]">Cancel</button>
            <button type="button" onClick={handleToggleSuspend} className="flex-1 rounded-full bg-[#F59E0B] py-2.5 text-sm font-bold text-white hover:bg-[#D97706]">
              {suspendTarget.status === "active" ? "Suspend" : "Reactivate"}
            </button>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <Modal title="Delete User" onClose={() => setDeleteTarget(null)}>
          <p className="text-sm text-[#64748B]">
            Permanently delete <span className="font-semibold text-[#0F172A]">{deleteTarget.name}</span>&apos;s account? This can&apos;t be undone.
          </p>
          <div className="mt-6 flex gap-3">
            <button type="button" onClick={() => setDeleteTarget(null)} className="flex-1 rounded-full border border-[#E2E8F0] py-2.5 text-sm font-semibold text-[#334155]">Keep User</button>
            <button type="button" onClick={handleDelete} className="flex-1 rounded-full bg-[#EF4444] py-2.5 text-sm font-bold text-white hover:bg-[#DC2626]">Yes, Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}