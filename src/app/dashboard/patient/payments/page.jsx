"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";

const statusStyles = {
  paid: "bg-[#DCFCE7] text-[#15803D]",
  refunded: "bg-[#FEF3C7] text-[#B45309]",
};

const methodLabels = {
  stripe: "Card (Stripe)",
  pay_later: "Pay Later",
};

export default function PaymentHistory() {
  const { data: session } = authClient.useSession();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Payment History | MediCare";
  }, []);

  useEffect(() => {
    if (!session?.user?.id) return;

    loadTransactions();
  }, [session]);

  const loadTransactions = async () => {
    try {
      const { data: tokenData } = await authClient.token();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments/patient/${session.user.id}`,
        {
            headers: { authorization: `Bearer ${tokenData?.token}` },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to load payment history");
      }

      const data = await res.json();

      const paid = (Array.isArray(data) ? data : [])
        .filter((appt) => appt.paymentStatus === "paid" || appt.paymentStatus === "refunded")
        .map((appt) => ({
          id: appt.transactionId || appt._id,
          doctor: appt.doctor?.name || "Unknown Doctor",
          photo: appt.doctor?.photoUrl || "/default-doctor.png",
          date: appt.updatedAt || appt.createdAt,
          method: methodLabels[appt.paymentMethod] || appt.paymentMethod || "—",
          amount:
            appt.amountPaid ||
            appt.consultationFee ||
            appt.doctor?.consultationFee ||
            0,
          status: appt.paymentStatus,
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      setTransactions(paid);
    } catch (error) {
      console.error("Failed to load payment history:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-GB");
  };

  const totalPaid = transactions
    .filter((t) => t.status === "paid")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0, transition: { duration: 0.25, ease: "easeOut" } },
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-lg font-semibold text-[#334155]">
        Loading payment history...
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-col gap-6"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-extrabold text-[#0F172A] sm:text-3xl">
          Payment History
        </h1>
        <p className="mt-1 text-sm text-[#64748B]">
          A record of every consultation payment you&apos;ve made.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        variants={containerVariants}
      >
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4, boxShadow: "0 8px 20px rgba(15,23,42,0.08)" }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm"
        >
          <p className="text-xs font-medium text-[#64748B]">Total Paid</p>
          <p className="mt-1 text-2xl font-extrabold text-[#0F172A]">
            ${totalPaid.toLocaleString()}
          </p>
        </motion.div>
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4, boxShadow: "0 8px 20px rgba(15,23,42,0.08)" }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm"
        >
          <p className="text-xs font-medium text-[#64748B]">Paid Appointments</p>
          <p className="mt-1 text-2xl font-extrabold text-[#0F172A]">
            {transactions.filter((t) => t.status === "paid").length}
          </p>
        </motion.div>
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4, boxShadow: "0 8px 20px rgba(15,23,42,0.08)" }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm"
        >
          <p className="text-xs font-medium text-[#64748B]">Refunded</p>
          <p className="mt-1 text-2xl font-extrabold text-[#0F172A]">
            {transactions.filter((t) => t.status === "refunded").length}
          </p>
        </motion.div>
      </motion.div>

      {transactions.length === 0 ? (
        <motion.div
          variants={itemVariants}
          className="rounded-2xl border border-dashed border-[#CBD5E1] bg-white p-16 text-center"
        >
          <h2 className="text-lg font-semibold text-[#0F172A]">
            No Payments Yet
          </h2>
          <p className="mt-2 text-sm text-[#94A3B8]">
            Your completed payments will show up here.
          </p>
        </motion.div>
      ) : (
        <>
          {/* Table (desktop) */}
          <motion.div
            variants={itemVariants}
            className="hidden overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm md:block"
          >
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs uppercase tracking-wide text-[#64748B]">
                <tr>
                  <th className="px-6 py-3.5 font-semibold">Transaction</th>
                  <th className="px-6 py-3.5 font-semibold">Doctor</th>
                  <th className="px-6 py-3.5 font-semibold">Date</th>
                  <th className="px-6 py-3.5 font-semibold">Method</th>
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
                {transactions.map((txn) => (
                  <motion.tr key={txn.id} variants={rowVariants}>
                    <td className="px-6 py-4 font-mono text-xs text-[#64748B]">
                      {typeof txn.id === "string" ? txn.id.slice(-10) : txn.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
                          <Image
                            src={txn.photo}
                            alt={txn.doctor}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-semibold text-[#0F172A]">
                          {txn.doctor}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#334155]">
                      {formatDate(txn.date)}
                    </td>
                    <td className="px-6 py-4 text-[#334155]">{txn.method}</td>
                    <td className="px-6 py-4 font-semibold text-[#0F172A]">
                      ${Number(txn.amount).toLocaleString()}
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

          {/* Cards (mobile) */}
          <motion.div
            className="flex flex-col gap-4 md:hidden"
            initial="hidden"
            animate="show"
            variants={containerVariants}
          >
            {transactions.map((txn) => (
              <motion.div
                key={txn.id}
                variants={itemVariants}
                className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={txn.photo}
                      alt={txn.doctor}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-[#0F172A]">
                      {txn.doctor}
                    </p>
                    <p className="text-xs text-[#94A3B8]">
                      {formatDate(txn.date)} · {txn.method}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[txn.status]}`}
                  >
                    {txn.status}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-lg font-extrabold text-[#0F172A]">
                    ৳{Number(txn.amount).toLocaleString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </>
      )}
    </motion.div>
  );
}