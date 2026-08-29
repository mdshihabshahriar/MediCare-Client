"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
  LabelList,
} from "recharts";
import { authClient } from "@/lib/auth-client";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 shadow-lg">
      <p className="text-xs font-semibold text-[#0F172A]">{label}</p>
      {payload.map((entry) => (
        <p
          key={entry.dataKey}
          className="text-xs"
          style={{ color: entry.color }}
        >
          {entry.name}: {entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

export default function Analytics() {
  const [stats, setStats] = useState({});
  const [doctorPerformance, setDoctorPerformance] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);

  const summaryStats = [
    {
      label: "Total Patients",
      value: stats.totalPatients,
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
      value: stats.totalDoctors,
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
      value: stats.totalAppointments,
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

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    const { data: tokenData } = await authClient.token();
    const authHeader = { authorization: `Bearer ${tokenData?.token}` };

    const [summary, doctors, trend] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics/summary`, {headers: authHeader,}).then((r) =>
        r.json(),
      ),
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/analytics/doctor-performance`, {
        headers: authHeader,
      }).then((r) => r.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics/monthly-trend`, {
        headers: authHeader,
      }).then((r) => r.json()),
    ]);

    setStats(summary);
    setDoctorPerformance(
    doctors.map((d) => ({
      ...d,
      averageRating: Number(d.averageRating) || 0,
    }))
  );
    setMonthlyTrend(trend);
  };
  

  return (
    <motion.div
      className="flex flex-col gap-6"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      <motion.div variants={cardVariants}>
        <h1 className="text-2xl font-extrabold text-[#0F172A] sm:text-3xl">
          Analytics
        </h1>
        <p className="mt-1 text-sm text-[#64748B]">
          Platform-wide performance and growth trends.
        </p>
      </motion.div>

      <motion.div className="grid grid-cols-1 gap-4 sm:grid-cols-3" variants={containerVariants}>
        {summaryStats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={cardVariants}
            whileHover={{ y: -3, boxShadow: "0 8px 20px rgba(15, 23, 42, 0.08)" }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm"
          >
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}
            >
              <svg
                className={`h-5 w-5 ${stat.iconColor}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {stat.icon}
              </svg>
            </span>
            <motion.p
              key={stat.value}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="mt-4 text-2xl font-extrabold text-[#0F172A]"
            >
              {stat.value}
            </motion.p>
            <p className="mt-1 text-xs font-medium text-[#64748B]">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm"
        variants={cardVariants}
      >
        <h2 className="text-base font-bold text-[#0F172A]">
          Doctor Performance (by Rating)
        </h2>
        <p className="mt-1 text-xs text-[#64748B]">
          Average patient rating for the top-performing doctors.
        </p>

        <div className="mt-6 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={doctorPerformance}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis
                domain={[0, 5]}
                ticks={[1, 2, 3, 4, 5]}
                allowDecimals={false}
              />

              <Tooltip />

              <Bar
                dataKey="averageRating"
                fill="#2563EB"
                radius={[8, 8, 0, 0]}
                animationDuration={900}
                animationEasing="ease-out"
              >
                <LabelList
                  dataKey="averageRating"
                  position="top"
                  formatter={(value) => Number(value).toFixed(1)}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm"
        variants={cardVariants}
      >
        <h2 className="text-base font-bold text-[#0F172A]">Growth Trend</h2>
        <p className="mt-1 text-xs text-[#64748B]">
          Total patients and appointments over the last 6 months.
        </p>

        <div className="mt-6 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={monthlyTrend}
              margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E2E8F0"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#64748B" }}
                axisLine={{ stroke: "#E2E8F0" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#64748B" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="patients"
                name="Patients"
                stroke="#2563EB"
                strokeWidth={2.5}
                dot={{ r: 3 }}
                animationDuration={900}
                animationEasing="ease-out"
              />
              <Line
                type="monotone"
                dataKey="appointments"
                name="Appointments"
                stroke="#10B981"
                strokeWidth={2.5}
                dot={{ r: 3 }}
                animationDuration={900}
                animationEasing="ease-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  );
}