"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { formatTimeAgo } from "@/lib/formatTimeAgo";
import { authClient } from "@/lib/auth-client";

const statConfig = [
  {
    key: "totalUsers",
    label: "Total Users",
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
    key: "totalDoctors",
    label: "Total Doctors",
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
    key: "totalPatients",
    label: "Total Patients",
    bg: "bg-[#EDE9FE]",
    iconColor: "text-[#7E22CE]",
    icon: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
      </>
    ),
  },
  {
    key: "pendingVerifications",
    label: "Pending Verifications",
    bg: "bg-[#FEF3C7]",
    iconColor: "text-[#B45309]",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v4" />
        <path d="M12 16h.01" />
      </>
    ),
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
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

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export default function AdminOverview() {
  const [stats, setStats] = useState(null); 
  const [recentActivity, setRecentActivity] = useState(null); 

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data: tokenData } = await authClient.token();
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/stats`, {
        headers: { authorization: `Bearer ${tokenData?.token}` },
      });
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to load admin stats:", err);
        setStats({ totalUsers: 0, totalDoctors: 0, totalPatients: 0, pendingVerifications: 0 });
      }
    };

    const loadActivity = async () => {
      try {
        const { data: tokenData } = await authClient.token();
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/recent-activity`, {
        headers: { authorization: `Bearer ${tokenData?.token}` },
      });
        const data = await res.json();
        setRecentActivity(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load recent activity:", err);
        setRecentActivity([]);
      }
    };

    loadStats();
    loadActivity();
  }, []);

  return (
    <motion.div
      className="flex flex-col gap-8"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      <motion.div variants={cardVariants}>
        <h1 className="text-2xl font-extrabold text-[#0F172A] sm:text-3xl">Admin Overview</h1>
        <p className="mt-1 text-sm text-[#64748B]">
          A snapshot of everything happening on the platform.
        </p>
      </motion.div>

      <motion.div className="grid grid-cols-2 gap-4 lg:grid-cols-4" variants={containerVariants}>
        {statConfig.map((stat) => (
          <motion.div
            key={stat.key}
            className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm"
            variants={cardVariants}
            whileHover={{ y: -3, boxShadow: "0 8px 20px rgba(15, 23, 42, 0.08)" }}
            transition={{ duration: 0.2 }}
          >
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
              <svg className={`h-5 w-5 ${stat.iconColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {stat.icon}
              </svg>
            </span>
            <motion.p
              key={stats === null ? "loading" : stats[stat.key]}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="mt-4 text-2xl font-extrabold text-[#0F172A]"
            >
              {stats === null ? "—" : stats[stat.key]}
            </motion.p>
            <p className="mt-1 text-xs font-medium text-[#64748B]">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm"
        variants={cardVariants}
      >
        <h2 className="text-base font-bold text-[#0F172A]">Recent Activity</h2>
        <div className="mt-5 flex flex-col divide-y divide-[#E2E8F0]">
          {recentActivity === null ? (
            <p className="py-3.5 text-sm text-[#94A3B8]">Loading…</p>
          ) : recentActivity.length === 0 ? (
            <p className="py-3.5 text-sm text-[#94A3B8]">No recent activity yet.</p>
          ) : (
            <motion.div initial="hidden" animate="show" variants={containerVariants}>
              {recentActivity.map((item, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
                >
                  <p className="text-sm text-[#334155]">{item.text}</p>
                  <p className="shrink-0 text-xs text-[#94A3B8]">{formatTimeAgo(item.createdAt)}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}