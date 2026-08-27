"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const roleStyles = {
  patient: "bg-[#DBEAFE] text-[#1D4ED8]",
  doctor: "bg-[#DCFCE7] text-[#15803D]",
  admin: "bg-[#EDE9FE] text-[#7E22CE]",
};

const statusStyles = {
  active: "bg-[#DCFCE7] text-[#15803D]",
  suspended: "bg-[#FEE2E2] text-[#DC2626]",
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

function Modal({ title, onClose, children }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
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
      </motion.div>
    </motion.div>
  );
}

export default function ManageUsers() {
  const [users, setUsers] = useState(null); 
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [suspendTarget, setSuspendTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`);
        const data = await res.json();
        setUsers(Array.isArray(data) ? data.filter(Boolean) : []);
      } catch (err) {
        console.error("Failed to load users:", err);
        setUsers([]);
      }
    };
    loadUsers();
  }, []);

  const filtered = (users || []).filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleToggleSuspend = async () => {
    const isSuspended = suspendTarget.status === "suspended";
    const newStatus = isSuspended ? "active" : "suspended";

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${suspendTarget._id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    setUsers((prev) =>
      prev.map((u) => (u._id === suspendTarget._id ? { ...u, status: newStatus } : u))
    );
    setSuspendTarget(null);
  };

  const handleDelete = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${deleteTarget._id}`, {
      method: "DELETE",
    });

    setUsers((prev) => prev.filter((u) => u._id !== deleteTarget._id));
    setDeleteTarget(null);
  };

  if (users === null) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E2E8F0] border-t-[#2563EB]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <h1 className="text-2xl font-extrabold text-[#0F172A] sm:text-3xl">Manage Users</h1>
        <p className="mt-1 text-sm text-[#64748B]">
          View, suspend, or remove patient and doctor accounts.
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="flex flex-col gap-3 sm:flex-row sm:items-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
      >
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
      </motion.div>

      {/* Table */}
      <div className="hidden overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs uppercase tracking-wide text-[#64748B]">
            <tr>
              <th className="px-6 py-3.5 font-semibold">User</th>
              <th className="px-6 py-3.5 font-semibold">Role</th>
              <th className="px-6 py-3.5 font-semibold">Email</th>
              <th className="px-6 py-3.5 font-semibold">Status</th>
              <th className="px-6 py-3.5 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <motion.tbody
            className="divide-y divide-[#E2E8F0]"
            initial="hidden"
            animate="show"
            variants={containerVariants}
          >
            {filtered.map((u) => (
              <motion.tr key={u._id} variants={rowVariants}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-[#F1F5F9]">
                      <Image
                        src={u.photoUrl || "https://i.pravatar.cc/150?u=" + u._id}
                        alt={u.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="font-semibold text-[#0F172A]">{u.name}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${roleStyles[u.role]}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-[#334155]">{u.email}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[u.status] || statusStyles.active}`}>
                    {u.status || "active"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setSuspendTarget(u)}
                      className="rounded-lg border border-[#F59E0B] px-3 py-1.5 text-xs font-semibold text-[#B45309] hover:bg-[#FFFBEB]"
                    >
                      {u.status === "suspended" ? "Reactivate" : "Suspend"}
                    </button>
                    <button onClick={() => setDeleteTarget(u)} className="rounded-lg border border-[#EF4444] px-3 py-1.5 text-xs font-semibold text-[#EF4444] hover:bg-[#FEF2F2]">
                      Delete
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>

      {/* Cards (mobile) */}
      <motion.div
        className="flex flex-col gap-4 md:hidden"
        initial="hidden"
        animate="show"
        variants={containerVariants}
      >
        {filtered.map((u) => (
          <motion.div key={u._id} variants={rowVariants} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-[#F1F5F9]">
                <Image
                  src={u.photoUrl || "https://i.pravatar.cc/150?u=" + u._id}
                  alt={u.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-[#0F172A]">{u.name}</p>
                <p className="truncate text-xs text-[#94A3B8]">{u.email}</p>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${roleStyles[u.role]}`}>
                {u.role}
              </span>
            </div>
            <div className="mt-3">
              <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[u.status] || statusStyles.active}`}>
                {u.status || "active"}
              </span>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setSuspendTarget(u)} className="flex-1 rounded-lg border border-[#F59E0B] py-1.5 text-xs font-semibold text-[#B45309]">
                {u.status === "suspended" ? "Reactivate" : "Suspend"}
              </button>
              <button onClick={() => setDeleteTarget(u)} className="flex-1 rounded-lg border border-[#EF4444] py-1.5 text-xs font-semibold text-[#EF4444]">Delete</button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {suspendTarget && (
          <Modal key="suspend-modal" title={suspendTarget.status === "suspended" ? "Reactivate User" : "Suspend User"} onClose={() => setSuspendTarget(null)}>
            <p className="text-sm text-[#64748B]">
              {suspendTarget.status === "suspended"
                ? <>Reactivate <span className="font-semibold text-[#0F172A]">{suspendTarget.name}</span>&apos;s account? They&apos;ll be able to log in again.</>
                : <>Suspend <span className="font-semibold text-[#0F172A]">{suspendTarget.name}</span>? They won&apos;t be able to log in until reactivated.</>}
            </p>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setSuspendTarget(null)} className="flex-1 rounded-full border border-[#E2E8F0] py-2.5 text-sm font-semibold text-[#334155]">Cancel</button>
              <button type="button" onClick={handleToggleSuspend} className="flex-1 rounded-full bg-[#F59E0B] py-2.5 text-sm font-bold text-white hover:bg-[#D97706]">
                {suspendTarget.status === "suspended" ? "Reactivate" : "Suspend"}
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget && (
          <Modal key="delete-modal" title="Delete User" onClose={() => setDeleteTarget(null)}>
            <p className="text-sm text-[#64748B]">
              Permanently delete <span className="font-semibold text-[#0F172A]">{deleteTarget.name}</span>&apos;s account? This can&apos;t be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setDeleteTarget(null)} className="flex-1 rounded-full border border-[#E2E8F0] py-2.5 text-sm font-semibold text-[#334155]">Keep User</button>
              <button type="button" onClick={handleDelete} className="flex-1 rounded-full bg-[#EF4444] py-2.5 text-sm font-bold text-white hover:bg-[#DC2626]">Yes, Delete</button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}