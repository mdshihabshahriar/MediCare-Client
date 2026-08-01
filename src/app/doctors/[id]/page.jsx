"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

export default function DoctorDetailsPage() {
  const { id } = useParams();

  const [doctor, setDoctor] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const { data: session } = authClient.useSession();

  useEffect(() => {
    loadDoctor();
    loadSchedules();
  }, []);

  const loadDoctor = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/doctors/${id}`
    );

    const data = await res.json();
    setDoctor(data);
  };

  const loadSchedules = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/schedules/${id}`
    );

    const data = await res.json();
    setSchedules(data);
  };

  const formatTime = (time) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleBookAppointment = async () => {
    const appointment = {
      doctorId: id,
      patientId: session.user.id,
      scheduleId: selectedSchedule,
      symptoms,
      status: "pending",
    };

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/appointments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointment),
      }
    );

    alert("Appointment Booked Successfully");
  };

  if (!doctor) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white px-10 py-8 text-center shadow-sm">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[#E2E8F0] border-t-[#2563EB]" />
          <p className="text-sm font-semibold text-[#334155]">
            Loading doctor…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-5">

          <div className="lg:col-span-2">
            <div className="sticky top-24 overflow-hidden rounded-[2rem] border border-[#E2E8F0] bg-white shadow-sm">

              <div className="relative">
                <div className="relative h-72 w-full overflow-hidden bg-[#F1F5F9]">
                  <Image
                    src={doctor.photoUrl}
                    alt={doctor.name || "Doctor"}
                    fill
                    className="object-cover"
                  />

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/40 to-transparent" />
                </div>

                <div className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-bold text-[#2563EB] shadow-sm backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
                  {doctor.specialty}
                </div>
              </div>

              <div className="p-7">
                <h2 className="text-2xl font-extrabold text-[#0F172A]">
                  {doctor.name}
                </h2>
                <p className="mt-1 text-sm text-[#94A3B8]">
                  Experienced Healthcare Professional
                </p>

                <div className="mt-7 flex flex-col gap-3">
                  <div className="flex items-start gap-2.5 rounded-xl bg-[#F8FAFC] p-4">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#2563EB]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 21h18" />
                      <path d="M5 21V7l8-4v18" />
                      <path d="M19 21V11l-6-4" />
                    </svg>
                    <div>
                      <p className="text-xs font-medium text-[#94A3B8]">Hospital</p>
                      <p className="mt-0.5 text-sm font-bold text-[#0F172A]">
                        {doctor.hospitalName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 rounded-xl bg-[#F8FAFC] p-4">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#2563EB]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 3" />
                    </svg>
                    <div>
                      <p className="text-xs font-medium text-[#94A3B8]">Experience</p>
                      <p className="mt-0.5 text-sm font-bold text-[#0F172A]">
                        {doctor.experience} Years
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-[#F8FAFC] p-4">
                    <p className="text-xs font-medium text-[#94A3B8]">Qualification</p>
                    <p className="mt-1 text-sm font-semibold leading-relaxed text-[#0F172A]">
                      {doctor.qualifications}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#2563EB] p-5 text-white">
                    <p className="text-xs font-medium text-white/80">
                      Consultation Fee
                    </p>
                    <p className="mt-1 text-3xl font-extrabold">
                      ৳{doctor.consultationFee}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-[2rem] border border-[#E2E8F0] bg-white p-7 shadow-sm sm:p-8">

              <div className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-1.5 text-xs font-bold tracking-widest text-[#2563EB]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
                BOOK APPOINTMENT
              </div>

              <h2 className="mt-4 text-2xl font-extrabold text-[#0F172A] sm:text-3xl">
                Choose a time that works for you
              </h2>
              <p className="mt-2 text-sm text-[#64748B]">
                Select an available schedule and describe your symptoms so the
                doctor can prepare for your visit.
              </p>

              <div className="mt-8">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-[#334155]">
                  Available Schedule
                </h3>

                {schedules.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-6 text-center text-sm text-[#94A3B8]">
                    No available slots right now.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {schedules.map((slot) => {
                      const isSelected = selectedSchedule === slot._id;
                      return (
                        <label
                          key={slot._id}
                          className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-4 transition-colors ${
                            isSelected
                              ? "border-[#2563EB] bg-[#EFF6FF]"
                              : "border-[#E2E8F0] bg-white hover:border-[#93C5FD] hover:bg-[#F8FAFC]"
                          }`}
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-[#0F172A]">
                              {slot.day}
                            </p>
                            <p className="mt-1 flex items-center gap-1.5 text-xs text-[#64748B]">
                              <svg className="h-3.5 w-3.5 shrink-0 text-[#94A3B8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="9" />
                                <path d="M12 7v5l3 3" />
                              </svg>
                              {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                            </p>
                          </div>

                          <input
                            type="radio"
                            name="schedule"
                            className="h-4 w-4 shrink-0 accent-[#2563EB]"
                            value={slot._id}
                            checked={isSelected}
                            onChange={(e) => setSelectedSchedule(e.target.value)}
                          />
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="mt-8">
                <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-[#334155]">
                  Symptoms
                </label>
                <textarea
                  rows={5}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Describe your symptoms..."
                  className="w-full resize-none rounded-xl border border-[#E2E8F0] bg-white p-4 text-sm text-[#0F172A] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>

              <button
                onClick={handleBookAppointment}
                disabled={!selectedSchedule || !symptoms.trim()}
                className="mt-8 w-full rounded-full bg-[#2563EB] py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Book Appointment
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}