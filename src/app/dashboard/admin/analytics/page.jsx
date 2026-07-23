"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";

const summaryStats = [
  {
    label: "Total Patients",
    value: "24,180",
    bg: "bg-[#DBEAFE]",
    iconColor: "text-[#1D4ED8]",
    icon: (
      <>
        <circle cx="9" cy="8" r="3.5" />
        <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
        <circle cx="17.5" cy="9.5" r="2.8" />
        <path d="M15 20a5 5 0 0 1 7.5-4.33" />
      </>
    ),
  },
  {
    label: "Total Doctors",
    value: "512",
    bg: "bg-[#DCFCE7]",
    iconColor: "text-[#15803D]",
    icon: (
      <>
        <path d="M12 2 4 5v6c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V5l-8-3Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
  {
    label: "Total Appointments",
    value: "58,940",
    bg: "bg-[#EDE9FE]",
    iconColor: "text-[#7E22CE]",
    icon: (
      <>
        <rect x="3" y="4.5" width="18" height="16" rx="2" />
        <path d="M16 2.5v4" />
        <path d="M8 2.5v4" />
        <path d="M3 9.5h18" />
      </>
    ),
  },
];

const doctorPerformance = [
  { name: "Dr. Ross", rating: 4.9 },
  { name: "Dr. Wilson", rating: 4.8 },
  { name: "Dr. Chen", rating: 4.7 },
  { name: "Dr. Rahman", rating: 4.6 },
  { name: "Dr. Jahan", rating: 4.5 },
  { name: "Dr. Hasan", rating: 4.2 },
];

const monthlyTrend = [
  { month: "Feb", patients: 1200, appointments: 2100 },
  { month: "Mar", patients: 1850, appointments: 3400 },
  { month: "Apr", patients: 2400, appointments: 4600 },
  { month: "May", patients: 3100, appointments: 5900 },
  { month: "Jun", patients: 3800, appointments: 7200 },
  { month: "Jul", patients: 4600, appointments: 8800 },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 shadow-lg">
      <p className="text-xs font-semibold text-[#0F172A]">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="text-xs" style={{ color: entry.color }}>
          {entry.name}: {entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

export default function Analytics() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F172A] sm:text-3xl">Analytics</h1>
        <p className="mt-1 text-sm text-[#64748B]">
          Platform-wide performance and growth trends.
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {summaryStats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
              <svg className={`h-5 w-5 ${stat.iconColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {stat.icon}
              </svg>
            </span>
            <p className="mt-4 text-2xl font-extrabold text-[#0F172A]">{stat.value}</p>
            <p className="mt-1 text-xs font-medium text-[#64748B]">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Doctor performance (rating based) */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-[#0F172A]">Doctor Performance (by Rating)</h2>
        <p className="mt-1 text-xs text-[#64748B]">Average patient rating for the top-performing doctors.</p>

        <div className="mt-6 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={doctorPerformance} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748B" }} axisLine={{ stroke: "#E2E8F0" }} tickLine={false} />
              <YAxis domain={[0, 5]} tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F1F5F9" }} />
              <Bar dataKey="rating" name="Rating" fill="#2563EB" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Growth trend */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-[#0F172A]">Growth Trend</h2>
        <p className="mt-1 text-xs text-[#64748B]">Total patients and appointments over the last 6 months.</p>

        <div className="mt-6 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyTrend} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748B" }} axisLine={{ stroke: "#E2E8F0" }} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="patients" name="Patients" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="appointments" name="Appointments" stroke="#10B981" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}