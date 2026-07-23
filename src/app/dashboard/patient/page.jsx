"use client";

import NextLink from "next/link";
import Image from "next/image";

const stats = [
  {
    label: "Upcoming Appointments",
    value: "3",
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
    value: "12",
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
    value: "৳18,500",
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
  {
    label: "Favorite Doctors",
    value: "5",
    bg: "bg-[#FEE2E2]",
    iconColor: "text-[#DC2626]",
    icon: (
      <path d="M12.1 8.64 12 8.75l-.1-.11C10.14 6.6 6.9 6.6 5.06 8.44a4.5 4.5 0 0 0 0 6.36L12 21.66l6.94-6.86a4.5 4.5 0 0 0 0-6.36c-1.84-1.84-5.08-1.84-6.94 0Z" />
    ),
  },
];

const upcomingAppointments = [
  {
    id: "1",
    doctor: "Dr. Amanda Ross",
    specialization: "Cardiology",
    date: "July 28, 2026",
    time: "10:30 AM",
    photo: "https://i.pravatar.cc/150?img=44",
  },
  {
    id: "2",
    doctor: "Dr. Michael Chen",
    specialization: "Neurology",
    date: "Aug 2, 2026",
    time: "2:00 PM",
    photo: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: "3",
    doctor: "Dr. Amara Rahman",
    specialization: "Pediatrics",
    date: "Aug 9, 2026",
    time: "11:15 AM",
    photo: "https://i.pravatar.cc/150?img=32",
  },
];

const favoriteDoctors = [
  { name: "Dr. Amanda Ross", specialization: "Cardiology", photo: "https://i.pravatar.cc/150?img=44" },
  { name: "Dr. James Wilson", specialization: "Orthopedics", photo: "https://i.pravatar.cc/150?img=53" },
  { name: "Dr. Amara Rahman", specialization: "Pediatrics", photo: "https://i.pravatar.cc/150?img=32" },
];

export default function DashboardOverview() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F172A] sm:text-3xl">
          Welcome back, Sarah 👋
        </h1>
        <p className="mt-1 text-sm text-[#64748B]">
          Here&apos;s what&apos;s happening with your health, at a glance.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm"
          >
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Upcoming appointments */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#0F172A]">Upcoming Appointments</h2>
            <NextLink href="/dashboard/patient/appointments" className="text-xs font-semibold text-[#2563EB]">
              View all
            </NextLink>
          </div>

          <div className="mt-5 flex flex-col divide-y divide-[#E2E8F0]">
            {upcomingAppointments.map((apt) => (
              <div key={apt.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
                  <Image src={apt.photo} alt={apt.doctor} fill className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-[#0F172A]">{apt.doctor}</p>
                  <p className="text-xs text-[#94A3B8]">{apt.specialization}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-[#0F172A]">{apt.date}</p>
                  <p className="text-xs text-[#94A3B8]">{apt.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Favorite doctors */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-[#0F172A]">Favorite Doctors</h2>
          <div className="mt-5 flex flex-col gap-4">
            {favoriteDoctors.map((doc) => (
              <div key={doc.name} className="flex items-center gap-3">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                  <Image src={doc.photo} alt={doc.name} fill className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#0F172A]">{doc.name}</p>
                  <p className="text-xs text-[#94A3B8]">{doc.specialization}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}