"use client";

import Image from "next/image";

const transactions = [
  {
    id: "TXN-1029",
    doctor: "Dr. Amanda Ross",
    photo: "https://i.pravatar.cc/150?img=44",
    date: "2026-06-14",
    method: "Visa •••• 4242",
    amount: 1500,
    status: "paid",
  },
  {
    id: "TXN-1017",
    doctor: "Dr. James Wilson",
    photo: "https://i.pravatar.cc/150?img=53",
    date: "2026-05-30",
    method: "bKash",
    amount: 2000,
    status: "paid",
  },
  {
    id: "TXN-0998",
    doctor: "Dr. Michael Chen",
    photo: "https://i.pravatar.cc/150?img=12",
    date: "2026-05-02",
    method: "Visa •••• 4242",
    amount: 1800,
    status: "paid",
  },
  {
    id: "TXN-0971",
    doctor: "Dr. Amara Rahman",
    photo: "https://i.pravatar.cc/150?img=32",
    date: "2026-04-18",
    method: "Mastercard •••• 8831",
    amount: 1000,
    status: "refunded",
  },
];

const statusStyles = {
  paid: "bg-[#DCFCE7] text-[#15803D]",
  refunded: "bg-[#FEF3C7] text-[#B45309]",
};

export default function PaymentHistory() {
  const totalPaid = transactions
    .filter((t) => t.status === "paid")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F172A] sm:text-3xl">Payment History</h1>
        <p className="mt-1 text-sm text-[#64748B]">
          A record of every consultation payment you&apos;ve made.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-[#64748B]">Total Paid</p>
          <p className="mt-1 text-2xl font-extrabold text-[#0F172A]">৳{totalPaid.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-[#64748B]">Paid Appointments</p>
          <p className="mt-1 text-2xl font-extrabold text-[#0F172A]">
            {transactions.filter((t) => t.status === "paid").length}
          </p>
        </div>
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-[#64748B]">Refunded</p>
          <p className="mt-1 text-2xl font-extrabold text-[#0F172A]">
            {transactions.filter((t) => t.status === "refunded").length}
          </p>
        </div>
      </div>

      {/* Table (desktop) */}
      <div className="hidden overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs uppercase tracking-wide text-[#64748B]">
            <tr>
              <th className="px-6 py-3.5 font-semibold">Transaction</th>
              <th className="px-6 py-3.5 font-semibold">Doctor</th>
              <th className="px-6 py-3.5 font-semibold">Date</th>
              <th className="px-6 py-3.5 font-semibold">Method</th>
              <th className="px-6 py-3.5 font-semibold">Amount</th>
              <th className="px-6 py-3.5 font-semibold">Status</th>
              <th className="px-6 py-3.5 font-semibold text-right">Invoice</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {transactions.map((txn) => (
              <tr key={txn.id}>
                <td className="px-6 py-4 font-mono text-xs text-[#64748B]">{txn.id}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
                      <Image src={txn.photo} alt={txn.doctor} fill className="object-cover" />
                    </div>
                    <span className="font-semibold text-[#0F172A]">{txn.doctor}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-[#334155]">{txn.date}</td>
                <td className="px-6 py-4 text-[#334155]">{txn.method}</td>
                <td className="px-6 py-4 font-semibold text-[#0F172A]">৳{txn.amount}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[txn.status]}`}>
                    {txn.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="rounded-lg border border-[#E2E8F0] px-3 py-1.5 text-xs font-semibold text-[#334155] hover:bg-[#F1F5F9]">
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards (mobile) */}
      <div className="flex flex-col gap-4 md:hidden">
        {transactions.map((txn) => (
          <div key={txn.id} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                <Image src={txn.photo} alt={txn.doctor} fill className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-[#0F172A]">{txn.doctor}</p>
                <p className="text-xs text-[#94A3B8]">{txn.date} · {txn.method}</p>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[txn.status]}`}>
                {txn.status}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-lg font-extrabold text-[#0F172A]">৳{txn.amount}</p>
              <button className="rounded-lg border border-[#E2E8F0] px-3 py-1.5 text-xs font-semibold text-[#334155]">
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}