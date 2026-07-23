"use client";

import { useState } from "react";

const transactions = [
  { id: "TXN-1029", patient: "Sarah Jenkins", doctor: "Dr. Amanda Ross", date: "2026-06-14", amount: 1500, status: "paid" },
  { id: "TXN-1017", patient: "David Okafor", doctor: "Dr. James Wilson", date: "2026-05-30", amount: 2000, status: "paid" },
  { id: "TXN-0998", patient: "Rafiq Ahmed", doctor: "Dr. Michael Chen", date: "2026-05-02", amount: 1800, status: "paid" },
  { id: "TXN-0971", patient: "Mitu Rahman", doctor: "Dr. Amara Rahman", date: "2026-04-18", amount: 1000, status: "refunded" },
  { id: "TXN-0954", patient: "Fatima Noor", doctor: "Dr. Nusrat Jahan", date: "2026-04-10", amount: 1200, status: "pending" },
];

const statusStyles = {
  paid: "bg-[#DCFCE7] text-[#15803D]",
  refunded: "bg-[#FEF3C7] text-[#B45309]",
  pending: "bg-[#DBEAFE] text-[#1D4ED8]",
};

export default function PaymentManagement() {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? transactions : transactions.filter((t) => t.status === filter);
  const totalRevenue = transactions.filter((t) => t.status === "paid").reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F172A] sm:text-3xl">Payment Management</h1>
        <p className="mt-1 text-sm text-[#64748B]">
          A complete record of every payment made on the platform.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-[#64748B]">Total Revenue</p>
          <p className="mt-1 text-2xl font-extrabold text-[#0F172A]">৳{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-[#64748B]">Paid Transactions</p>
          <p className="mt-1 text-2xl font-extrabold text-[#0F172A]">{transactions.filter((t) => t.status === "paid").length}</p>
        </div>
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-[#64748B]">Pending / Refunded</p>
          <p className="mt-1 text-2xl font-extrabold text-[#0F172A]">
            {transactions.filter((t) => t.status !== "paid").length}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
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
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
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
          <tbody className="divide-y divide-[#E2E8F0]">
            {filtered.map((txn) => (
              <tr key={txn.id}>
                <td className="px-6 py-4 font-mono text-xs text-[#64748B]">{txn.id}</td>
                <td className="px-6 py-4 font-semibold text-[#0F172A]">{txn.patient}</td>
                <td className="px-6 py-4 text-[#334155]">{txn.doctor}</td>
                <td className="px-6 py-4 text-[#334155]">{txn.date}</td>
                <td className="px-6 py-4 font-semibold text-[#0F172A]">৳{txn.amount}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[txn.status]}`}>
                    {txn.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}