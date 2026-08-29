"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

export default function DashboardOverview() {
  const { data: session } = authClient.useSession();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Dashboard | MediCare";
  }, []);

  useEffect(() => {
    if (!session?.user?.id) return;

    loadAppointments();
  }, [session]);

  const loadAppointments = async () => {
    try {
      const { data:d } = await authClient.token();
      const token = d?.token;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments/patient/${session.user.id}`,
        {
            headers: { authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to load appointments");
      }

      const data = await res.json();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
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

  const upcomingAppointments = appointments
    .filter((apt) => apt.status === "pending" || apt.status === "accepted")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const totalPayments = appointments
    .filter((apt) => apt.paymentStatus === "paid")
    .reduce(
      (sum, apt) =>
        sum + Number(apt.amountPaid || apt.consultationFee || 0),
      0
    );

  const stats = [
    {
      label: "Upcoming Appointments",
      value: String(upcomingAppointments.length),
      bg: "bg-[#DBEAFE]",
      iconColor: "text-[#1D4ED8]",
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
      label: "Appointment History",
      value: String(appointments.length),
      bg: "bg-[#DCFCE7]",
      iconColor: "text-[#15803D]",
      icon: (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 3" />
        </>
      ),
    },
    {
      label: "Total Payments",
      value: `$${totalPayments.toLocaleString()}`,
      bg: "bg-[#FEF3C7]",
      iconColor: "text-[#B45309]",
      icon: (
        <>
          <rect x="2" y="5" width="20" height="14" rx="2.5" />
          <path d="M2 10h20" />
          <path d="M6 15h4" />
        </>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="py-24 text-center text-lg font-semibold text-[#334155]">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F172A] sm:text-3xl">
          Welcome back, {session?.user?.name} 👋
        </h1>
        <p className="mt-1 text-sm text-[#64748B]">
          Here&apos;s what&apos;s happening with your health, at a glance.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
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
            <p className="mt-4 text-2xl font-extrabold text-[#0F172A]">
              {stat.value}
            </p>
            <p className="mt-1 text-xs font-medium text-[#64748B]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Upcoming appointments */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#0F172A]">
            Upcoming Appointments
          </h2>
          <NextLink
            href="/dashboard/patient/appointments"
            className="text-xs font-semibold text-[#2563EB]"
          >
            View all
          </NextLink>
        </div>

        {upcomingAppointments.length === 0 ? (
          <p className="mt-6 text-center text-sm text-[#94A3B8]">
            No upcoming appointments.
          </p>
        ) : (
          <div className="mt-5 flex flex-col divide-y divide-[#E2E8F0]">
            {upcomingAppointments.slice(0, 5).map((apt) => (
              <div
                key={apt._id}
                className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={apt.doctor?.photoUrl || "/default-doctor.png"}
                    alt={apt.doctor?.name || "Doctor"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-[#0F172A]">
                    {apt.doctor?.name || "Unknown Doctor"}
                  </p>
                  <p className="text-xs text-[#94A3B8]">
                    {apt.doctor?.specialty}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-[#0F172A]">
                    {apt.schedule?.day}
                  </p>
                  <p className="text-xs text-[#94A3B8]">
                    {formatTime(apt.schedule?.startTime)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}