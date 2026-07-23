"use client";

import { useState } from "react";
import Image from "next/image";

const allAppointments = [
  { id: "5821", patient: "Sarah Jenkins", doctor: "Dr. Amanda Ross", photo: "https://i.pravatar.cc/150?img=44", date: "2026-07-28", time: "10:30 AM", status: "upcoming" },
  { id: "5820", patient: "Rafiq Ahmed", doctor: "Dr. Michael Chen", photo: "https://i.pravatar.cc/150?img=12", date: "2026-07-28", time: "11:30 AM", status: "upcoming" },
  { id: "5799", patient: "David Okafor", doctor: "Dr. James Wilson", photo: "https://i.pravatar.cc/150?img=53", date: "2026-06-14", time: "9:00 AM", status: "completed" },
  { id: "5788", patient: "Mitu Rahman", doctor: "Dr. Nusrat Jahan", photo: "https://i.pravatar.cc/150?img=28", date: "2026-05-30", time: "4:15 PM", status: "cancelled" },
  { id: "5771", patient: "Fatima Noor", doctor: "Dr. Amara Rahman", photo: "https://i.pravatar.cc/150?img=32", date: "2026-05-20", time: "1:00 PM", status: "completed" },
];

const statusStyles = {
  upcoming: "bg-[#DBEAFE] text-[#1D4ED8]",
  completed: "bg-[#DCFCE7] text-[#15803D]",
  cancelled: "bg-[#FEE2E2] text-[#DC2626]",
};

export default function AdminManageAppointments() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = allAppointments.filter((apt) => {
    const matchesStatus = filter === "all" || apt.status === filter;
    const matchesSearch =
      apt.patient.toLowerCase().includes(search.toLowerCase()) ||
      apt.doctor.toLowerCase().includes(search.toLowerCase()) ||
      apt.id.includes(search);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F172A] sm:text-3xl">Manage Appointments</h1>
        <p className="mt-1 text-sm text-[#64748B]">
          Monitor every appointment across the platform.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <svg className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by patient, doctor, or ID..."
            className="w-full rounded-xl border border-[#E2E8F0] bg-white py-2.5 pl-10 pr-4 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {["all", "upcoming", "completed", "cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold capitalize transition-colors ${
                filter === f
                  ? "border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]"
                  : "border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs uppercase tracking-wide text-[#64748B]">
            <tr>
              <th className="px-6 py-3.5 font-semibold">ID</th>
              <th className="px-6 py-3.5 font-semibold">Patient</th>
              <th className="px-6 py-3.5 font-semibold">Doctor</th>
              <th className="px-6 py-3.5 font-semibold">Date &amp; Time</th>
              <th className="px-6 py-3.5 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {filtered.map((apt) => (
              <tr key={apt.id}>
                <td className="px-6 py-4 font-mono text-xs text-[#64748B]">#{apt.id}</td>
                <td className="px-6 py-4 font-semibold text-[#0F172A]">{apt.patient}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2.5">
                    <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
                      <Image src={apt.photo} alt={apt.doctor} fill className="object-cover" />
                    </div>
                    <span className="text-[#334155]">{apt.doctor}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-[#334155]">{apt.date} · {apt.time}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[apt.status]}`}>
                    {apt.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 md:hidden">
        {filtered.map((apt) => (
          <div key={apt.id} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="font-mono text-xs text-[#94A3B8]">#{apt.id}</p>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[apt.status]}`}>{apt.status}</span>
            </div>
            <p className="mt-2 text-sm font-bold text-[#0F172A]">{apt.patient}</p>
            <div className="mt-1 flex items-center gap-2">
              <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full">
                <Image src={apt.photo} alt={apt.doctor} fill className="object-cover" />
              </div>
              <p className="text-xs text-[#64748B]">{apt.doctor}</p>
            </div>
            <p className="mt-2 text-xs text-[#94A3B8]">{apt.date} · {apt.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}