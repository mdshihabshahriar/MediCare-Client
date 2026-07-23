"use client";

import NextLink from "next/link";
import Image from "next/image";

const stats = [
  {
    label: "Total Patients",
    value: "284",
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
    label: "Today's Appointments",
    value: "6",
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
    label: "Reviews Received",
    value: "132",
    bg: "bg-[#FEF3C7]",
    iconColor: "text-[#B45309]",
    icon: (
      <path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5-4.8-4.6 6.6-.9L12 2.5Z" />
    ),
  },
];

const todaysAppointments = [
  {
    id: "1",
    patient: "Rafiq Ahmed",
    reason: "Follow-up consultation",
    time: "10:00 AM",
    photo: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: "2",
    patient: "Fatima Noor",
    reason: "Chest pain evaluation",
    time: "11:30 AM",
    photo: "https://i.pravatar.cc/150?img=32",
  },
  {
    id: "3",
    patient: "David Okafor",
    reason: "Routine checkup",
    time: "2:15 PM",
    photo: "https://i.pravatar.cc/150?img=15",
  },
];

export default function DoctorOverview() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F172A] sm:text-3xl">
          Welcome back, Dr. Ross 👋
        </h1>
        <p className="mt-1 text-sm text-[#64748B]">
          Here&apos;s an overview of your practice today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
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

      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#0F172A]">Today&apos;s Appointments</h2>
          <NextLink href="/dashboard/doctor/requests" className="text-xs font-semibold text-[#2563EB]">
            View all
          </NextLink>
        </div>

        <div className="mt-5 flex flex-col divide-y divide-[#E2E8F0]">
          {todaysAppointments.map((apt) => (
            <div key={apt.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
                <Image src={apt.photo} alt={apt.patient} fill className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-[#0F172A]">{apt.patient}</p>
                <p className="text-xs text-[#94A3B8]">{apt.reason}</p>
              </div>
              <p className="shrink-0 text-xs font-semibold text-[#0F172A]">{apt.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}