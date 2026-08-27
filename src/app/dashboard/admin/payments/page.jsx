"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const statusStyles = {
  paid: "bg-[#DCFCE7] text-[#15803D]",
  refunded: "bg-[#FEF3C7] text-[#B45309]",
  pending: "bg-[#DBEAFE] text-[#1D4ED8]",
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
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

export default function PaymentManagement() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments`
      );

      if (!res.ok) {
        throw new Error("Failed to load transactions");
      }

      const data = await res.json();

      const mapped = (Array.isArray(data) ? data : [])
        .filter(
          (apt) =>
            apt.paymentStatus === "paid" ||
            apt.paymentStatus === "pending" ||
            apt.paymentStatus === "refunded"
        )
        .map((apt) => ({
          id: apt.transactionId || apt._id,
          patient: apt.patient?.name || "Unknown Patient",
          doctor: apt.doctor?.name || "Unknown Doctor",
          date: apt.updatedAt || apt.createdAt,
          amount:
            apt.amountPaid || apt.consultationFee || 0,
          status: apt.paymentStatus,
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      setTransactions(mapped);
    } catch (error) {
      console.error("Failed to load transactions:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-GB");
  };

  const filtered =
    filter === "all"
      ? transactions
      : transactions.filter((t) => t.status === filter);

  const totalRevenue = transactions
    .filter((t) => t.status === "paid")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  if (loading) {
    return (
      <div className="py-24 text-center text-lg font-semibold text-[#334155]">
        Loading payment data...
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
          Payment Management
        </h1>
        <p className="mt-1 text-sm text-[#64748B]">
          A complete record of every payment made on the platform.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        initial="hidden"
        animate="show"
        variants={containerVariants}
      >
        <motion.div variants={cardVariants} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-[#64748B]">Total Revenue</p>
          <p className="mt-1 text-2xl font-extrabold text-[#0F172A]">
            ${totalRevenue.toLocaleString()}
          </p>
        </motion.div>
        <motion.div variants={cardVariants} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-[#64748B]">
            Paid Transactions
          </p>
          <p className="mt-1 text-2xl font-extrabold text-[#0F172A]">
            {transactions.filter((t) => t.status === "paid").length}
          </p>
        </motion.div>
        <motion.div variants={cardVariants} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-[#64748B]">
            Pending / Refunded
          </p>
          <p className="mt-1 text-2xl font-extrabold text-[#0F172A]">
            {transactions.filter((t) => t.status !== "paid").length}
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        className="flex flex-wrap gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
      >
        {["all", "paid", "pending", "refunded"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold capitalize transition-colors ${
              filter === f
                ? "border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]"
                : "border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9]"
            }`}
          >
            {f}
          </button>
        ))}
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
              No Transactions Found
            </h2>
            <p className="mt-2 text-sm text-[#94A3B8]">
              Try a different filter.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={`results-${filter}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm"
          >
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs uppercase tracking-wide text-[#64748B]">
                <tr>
                  <th className="px-6 py-3.5 font-semibold">Transaction</th>
                  <th className="px-6 py-3.5 font-semibold">Patient</th>
                  <th className="px-6 py-3.5 font-semibold">Doctor</th>
                  <th className="px-6 py-3.5 font-semibold">Date</th>
                  <th className="px-6 py-3.5 font-semibold">Amount</th>
                  <th className="px-6 py-3.5 font-semibold">Status</th>
                </tr>
              </thead>
              <motion.tbody
                className="divide-y divide-[#E2E8F0]"
                initial="hidden"
                animate="show"
                variants={containerVariants}
              >
                {filtered.map((txn) => (
                  <motion.tr key={txn.id} variants={rowVariants}>
                    <td className="px-6 py-4 font-mono text-xs text-[#64748B]">
                      {typeof txn.id === "string" ? txn.id.slice(-10) : txn.id}
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#0F172A]">
                      {txn.patient}
                    </td>
                    <td className="px-6 py-4 text-[#334155]">{txn.doctor}</td>
                    <td className="px-6 py-4 text-[#334155]">
                      {formatDate(txn.date)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#0F172A]">
                      ৳{Number(txn.amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[txn.status]}`}
                      >
                        {txn.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}