"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/lib/auth-client";

const statusStyles = {
  upcoming: "bg-[#DBEAFE] text-[#1D4ED8]",
  completed: "bg-[#DCFCE7] text-[#15803D]",
  cancelled: "bg-[#FEE2E2] text-[#DC2626]",
};

const mapStatus = (status) => {
  if (status === "pending" || status === "accepted") return "upcoming";
  if (status === "completed") return "completed";
  if (status === "cancelled" || status === "rejected") return "cancelled";
  return status;
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

export default function AdminManageAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    document.title = "Manage Appointments | MediCare";
  }, []);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const { data: tokenData } = await authClient.token();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments`,
        { headers: { authorization: `Bearer ${tokenData?.token}` } }
      );

      if (!res.ok) {
        throw new Error("Failed to load appointments");
      }

      const data = await res.json();

      const mapped = (Array.isArray(data) ? data : []).map((apt) => ({
        id: apt._id,
        patient: apt.patient?.name || "Unknown Patient",
        doctor: apt.doctor?.name || "Unknown Doctor",
        photo: apt.doctor?.photoUrl || "/default-doctor.png",
        date: apt.appointmentDay || "—",
        time: apt.appointmentStartTime || "",
        status: mapStatus(apt.status),
      }));

      setAppointments(mapped);
    } catch (error) {
      console.error("Failed to load appointments:", error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time) => {
    if (!time) return "";
    return new Date(`1970-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const filtered = appointments.filter((apt) => {
    const matchesStatus = filter === "all" || apt.status === filter;
    const matchesSearch =
      apt.patient.toLowerCase().includes(search.toLowerCase()) ||
      apt.doctor.toLowerCase().includes(search.toLowerCase()) ||
      String(apt.id).includes(search);
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="py-24 text-center text-lg font-semibold text-[#334155]">
        Loading appointments...
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
        <h1 className="text-2xl font-extrabold text-[#0F172A] sm:text-3xl">
          Manage Appointments
        </h1>
        <p className="mt-1 text-sm text-[#64748B]">
          Monitor every appointment across the platform.
        </p>
      </motion.div>

      <motion.div
        className="flex flex-col gap-3 sm:flex-row sm:items-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
      >
        <div className="relative flex-1">
          <svg
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
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
      </motion.div>

      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border border-dashed border-[#CBD5E1] bg-white p-16 text-center"
          >
            <h2 className="text-lg font-semibold text-[#0F172A]">
              No Appointments Found
            </h2>
            <p className="mt-2 text-sm text-[#94A3B8]">
              Try a different filter or search term.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={`results-${filter}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
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
                <motion.tbody
                  className="divide-y divide-[#E2E8F0]"
                  initial="hidden"
                  animate="show"
                  variants={containerVariants}
                >
                  {filtered.map((apt) => (
                    <motion.tr key={apt.id} variants={rowVariants}>
                      <td className="px-6 py-4 font-mono text-xs text-[#64748B]">
                        #{String(apt.id).slice(-6)}
                      </td>
                      <td className="px-6 py-4 font-semibold text-[#0F172A]">
                        {apt.patient}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
                            <Image
                              src={apt.photo}
                              alt={apt.doctor}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="text-[#334155]">{apt.doctor}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#334155]">
                        {apt.date} · {formatTime(apt.time)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[apt.status]}`}
                        >
                          {apt.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            </div>

            <motion.div
              className="flex flex-col gap-4 md:hidden"
              initial="hidden"
              animate="show"
              variants={containerVariants}
            >
              {filtered.map((apt) => (
                <motion.div
                  key={apt.id}
                  variants={rowVariants}
                  className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-xs text-[#94A3B8]">
                      #{String(apt.id).slice(-6)}
                    </p>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[apt.status]}`}
                    >
                      {apt.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-bold text-[#0F172A]">
                    {apt.patient}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full">
                      <Image
                        src={apt.photo}
                        alt={apt.doctor}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-xs text-[#64748B]">{apt.doctor}</p>
                  </div>
                  <p className="mt-2 text-xs text-[#94A3B8]">
                    {apt.date} · {formatTime(apt.time)}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}