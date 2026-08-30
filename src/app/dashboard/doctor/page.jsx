"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";

const statConfig = [
  {
    key: "totalPatients",
    label: "Total Patients",
    bg: "bg-[#DBEAFE]",
    iconColor: "text-primary/90",
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
    key: "upcomingAppointments",
    label: "Upcoming Appointments",
    bg: "bg-[#DCFCE7]",
    iconColor: "text-[#15803D]",
    icon: (
      <>
        <rect x="3" y="4.5" width="18" height="16" rx="2" />
        <path d="M16 2.5v4" />
        <path d="M8 2.5v4" />
        <path d="M3 9.5h18" />
      </>
    ),
  },
  {
    key: "reviewsReceived",
    label: "Reviews Received",
    bg: "bg-[#FEF3C7]",
    iconColor: "text-[#B45309]",
    icon: (
      <path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5-4.8-4.6 6.6-.9L12 2.5Z" />
    ),
  },
  {
    key: "averageRating",
    label: "Average Rating",
    bg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    icon: (
      <>
        <path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5-4.8-4.6 6.6-.9L12 2.5Z" />
      </>
    ),
  },
];

export default function DoctorOverview() {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    document.title = "Dashboard | MediCare";
  }, []);

  useEffect(() => {
    if (!session?.user?.id) return;

    const loadStats = async () => {
      try {
        const { data: tokenData } = await authClient.token();
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/doctors/${session.user.id}/stats`,
          { headers: { authorization: `Bearer ${tokenData?.token}` } }
        );

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to load doctor stats:", err);
        setStats({
          totalPatients: 0,
          upcomingAppointments: 0,
          reviewsReceived: 0,
        });
      }
    };

    const loadAppointments = async () => {
      try {
        const { data: tokenData } = await authClient.token();
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/appointments/doctor/${session.user.id}`,
          { headers: { authorization: `Bearer ${tokenData?.token}` } }
        );
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        setAppointments(
          list
            .filter((a) => a.status === "accepted")
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5),
        );
      } catch (err) {
        console.error("Failed to load appointments:", err);
        setAppointments([]);
      } finally {
        setLoadingAppointments(false);
      }
    };

    const loadReviews = async () => {
      try {
        const { data: tokenData } = await authClient.token();
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/reviews/doctor/${session.user.id}`,
          { headers: { authorization: `Bearer ${tokenData?.token}` } }
        );

        const data = await res.json();

        setReviews(data);
      } catch (err) {
        console.log(err);
      }
    };

    loadStats();
    loadAppointments();
    loadReviews();
  }, [session]);

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
    hidden: { opacity: 0, x: -12 },
    show: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
  };

  if (isSessionPending) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          className="h-8 w-8 rounded-full border-2 border-base-300 border-t-primary"
        />
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-col gap-8"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-extrabold text-base-content sm:text-3xl">
          Welcome back, {session?.user?.name} 👋
        </h1>
        <p className="mt-1 text-sm text-base-content/60">
          Here&apos;s an overview of your practice today.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-4"
        variants={containerVariants}
      >
        {statConfig.map((stat) => (
          <motion.div
            key={stat.key}
            variants={itemVariants}
            whileHover={{ y: -4, boxShadow: "0 8px 20px rgba(15,23,42,0.08)" }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm"
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
            <p className="mt-4 text-2xl font-extrabold text-base-content">
              {stats === null ? "—" : stats[stat.key]}
            </p>
            <p className="mt-1 text-xs font-medium text-base-content/60">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-base-content">
            Upcoming Appointments
          </h2>
          <Link
            href="/dashboard/doctor/requests"
            className="text-xs font-semibold text-primary"
          >
            View all
          </Link>
        </div>

        <motion.div
          className="mt-5 flex flex-col divide-y divide-base-300"
          initial="hidden"
          animate="show"
          variants={containerVariants}
        >
          {loadingAppointments ? (
            <p className="py-3.5 text-sm text-base-content/50">Loading…</p>
          ) : appointments.length === 0 ? (
            <p className="py-3.5 text-sm text-base-content/50">
              No upcoming appointments right now.
            </p>
          ) : (
            appointments.map((apt) => (
              <motion.div
                key={apt._id}
                variants={rowVariants}
                className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-base-200">
                  <Image
                    src={
                      apt.patient?.photoUrl ||
                      "https://i.pravatar.cc/150?u=" + apt.patientId
                    }
                    alt={apt.patient?.name || "Patient"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-base-content">
                    {apt.patient?.name}
                  </p>
                  <p className="text-xs text-base-content/50">{apt.symptoms}</p>
                </div>
                <span className="shrink-0 rounded-full bg-[#DBEAFE] px-2.5 py-1 text-xs font-semibold text-primary/90">
                  {apt.status}
                </span>
              </motion.div>
            ))
          )}
        </motion.div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm"
      >
        <h2 className="text-lg font-bold mb-5">Recent Reviews</h2>

        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <motion.div initial="hidden" animate="show" variants={containerVariants}>
            {reviews.map((review) => (
              <motion.div
                key={review._id}
                variants={rowVariants}
                className="flex items-start gap-4 border-b py-4 last:border-none"
              >
                <Image
                  src={review.patientPhoto || "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"}
                  alt={review.patientName}
                  width={50}
                  height={50}
                  className="rounded-full"
                />

                <div className="flex-1">
                  <h3 className="font-semibold">{review.patientName}</h3>

                  <p className="text-yellow-500">{"⭐".repeat(review.rating)}</p>

                  <p className="text-gray-600 mt-1">{review.comment}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}