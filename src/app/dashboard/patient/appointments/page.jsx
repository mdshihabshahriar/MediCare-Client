"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import toast from "react-hot-toast";

export default function MyAppointmentsPage() {
  const { data: session, isPending } = authClient.useSession();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPayment, setLoadingPayment] = useState(false);

  const [cancelAppointment, setCancelAppointment] = useState(null);
  const [reviewAppointment, setReviewAppointment] = useState(null);
  const [rescheduleAppointment, setRescheduleAppointment] = useState(null);

  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState("");

  useEffect(() => {
    if (!session?.user?.id) return;

    loadAppointments();
  }, [session]);

  const loadAppointments = async () => {
    if (!session?.user?.id) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments/patient/${session.user.id}`,
      );

      const data = await res.json();
      setAppointments(data);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (appointment) => {
    try {
      if (!session?.user?.id) {
        toast.error("Please login first.");
        return;
      }

      setLoadingPayment(true);

      const paymentData = {
        appointmentId: String(appointment._id),
        patientId: String(session.user.id),
      };

      console.log("========== PAY NOW ==========");
      console.log("Appointment:", appointment);
      console.log("Payment Data:", paymentData);

      const res = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      const data = await res.json();

      console.log("Payment API Response:", data);

      if (!res.ok) {
        throw new Error(data.message || "Payment session creation failed");
      }

      if (!data.url) {
        throw new Error("Stripe checkout URL not found.");
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("Payment Error:", error);
      toast.error(error.message);
    } finally {
      setLoadingPayment(false);
    }
  };

  const formatTime = (time) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "accepted":
        return "bg-blue-100 text-blue-700";

      case "completed":
        return "bg-green-100 text-green-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleCancel = async () => {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/appointments/${cancelAppointment._id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "cancelled",
        }),
      },
    );

    setCancelAppointment(null);
    loadAppointments();
  };

  const loadSchedules = async (doctorId) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/schedules/${doctorId}`,
    );

    const data = await res.json();
    setSchedules(data);
  };

  const handleReschedule = async () => {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/appointments/${rescheduleAppointment._id}/reschedule`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scheduleId: selectedSchedule,
        }),
      },
    );

    setSelectedSchedule("");
    setRescheduleAppointment(null);
    loadAppointments();
  };

  const handleReview = async () => {
    alert("Review Submitted");

    setReviewAppointment(null);
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-lg font-semibold">
        Loading Appointments...
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-slate-50 py-10">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="mb-8 text-3xl font-bold text-slate-800">
            My Appointments
          </h1>

          {appointments.length === 0 ? (
            <div className="rounded-3xl bg-white p-16 text-center shadow">
              <h2 className="text-xl font-semibold">No Appointments Found</h2>

              <p className="mt-2 text-slate-500">
                Book your first appointment.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {appointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="rounded-3xl bg-white p-6 shadow-xl"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
                    <div className="flex gap-5">
                      <Image
                        src={appointment.doctor.photoUrl}
                        alt={appointment.doctor.name}
                        width={120}
                        height={120}
                        className="h-28 w-28 rounded-2xl object-cover"
                      />

                      <div>
                        <div className="flex items-center gap-3">
                          <h2 className="text-2xl font-bold">
                            {appointment.doctor.name}
                          </h2>

                          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                            {appointment.doctor.specialty}
                          </span>
                        </div>

                        <p className="mt-2 text-slate-600">
                          {appointment.doctor.hospitalName}
                        </p>

                        <div className="mt-5 flex flex-wrap gap-6 text-slate-600">
                          <p>📅 {appointment.schedule?.day}</p>

                          <p>
                            🕒 {formatTime(appointment.schedule?.startTime)} -{" "}
                            {formatTime(appointment.schedule?.endTime)}
                          </p>

                          <p className="font-semibold">
                            💳 ${appointment.doctor.consultationFee}
                          </p>
                        </div>

                        <div className="mt-5 rounded-2xl border bg-slate-50 p-4">
                          <p className="font-semibold">Symptoms</p>

                          <p className="mt-2 text-slate-600">
                            {appointment.symptoms}
                          </p>
                        </div>

                        <p className="mt-4 text-sm text-slate-400">
                          Booked On : {formatDate(appointment.createdAt)}
                        </p>

                        {appointment.transactionId && (
                          <p className="mt-1 text-sm text-slate-400">
                            Stripe ID : {appointment.transactionId}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex min-w-60 flex-col items-end justify-between">
                      <span
                        className={`rounded-full px-5 py-2 text-sm font-semibold capitalize ${getStatusColor(
                          appointment.status,
                        )}`}
                      >
                        {appointment.status}
                      </span>

                      <div className="mt-6 flex flex-col gap-3">
                        {appointment.paymentStatus !== "paid" && (
                          <button
                            onClick={() => handlePayment(appointment)}
                            disabled={loadingPayment}
                            className="rounded-xl bg-green-700 cursor-pointer px-6 py-3 font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {loadingPayment ? "Redirecting..." : "Pay Now"}
                          </button>
                        )}

                        {appointment.status === "pending" && (
                          <>
                            <button
                              onClick={() => {
                                setRescheduleAppointment(appointment);
                                loadSchedules(appointment.doctorId);
                              }}
                              className="rounded-xl border px-6 py-3 font-semibold hover:bg-slate-100"
                            >
                              Reschedule
                            </button>

                            <button
                              onClick={() => setCancelAppointment(appointment)}
                              className="rounded-xl border border-red-500 px-6 py-3 font-semibold text-red-600 hover:bg-red-50"
                            >
                              Cancel
                            </button>
                          </>
                        )}

                        {appointment.status === "completed" &&
                          !appointment.hasReview && (
                            <Link
                              href={`/dashboard/patient/reviews?appointmentId=${appointment._id}`}
                              className="rounded-xl bg-blue-600 px-6 py-3 text-center font-semibold text-white hover:bg-blue-700"
                            >
                              Leave Review
                            </Link>
                          )}

                        {appointment.status === "completed" &&
                          appointment.hasReview && (
                            <span className="rounded-xl bg-green-100 px-6 py-3 text-center font-semibold text-green-700">
                              ✅ Reviewed
                            </span>
                          )}

                        {appointment.status === "cancelled" && (
                          <Link
                            href={`/doctors/${appointment.doctorId}`}
                            className="rounded-xl bg-slate-800 px-6 py-3 font-semibold text-white text-center"
                          >
                            Book Again
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {cancelAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-3xl bg-white p-6">
            <h2 className="text-xl font-bold">Cancel Appointment</h2>

            <p className="mt-4 text-slate-600">
              Are you sure you want to cancel this appointment?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setCancelAppointment(null)}
                className="rounded-xl border px-5 py-2"
              >
                Close
              </button>

              <button
                onClick={handleCancel}
                className="rounded-xl bg-red-600 px-5 py-2 text-white"
              >
                Yes Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {rescheduleAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6">
            <h2 className="text-2xl font-bold">Reschedule Appointment</h2>

            <div className="mt-6 space-y-4">
              {schedules.map((schedule) => (
                <label
                  key={schedule._id}
                  className="flex cursor-pointer items-center justify-between rounded-xl border p-4 hover:border-blue-500"
                >
                  <div>
                    <p className="font-semibold">{schedule.day}</p>

                    <p className="text-slate-500">
                      {formatTime(schedule.startTime)}
                      {" - "}
                      {formatTime(schedule.endTime)}
                    </p>
                  </div>

                  <input
                    type="radio"
                    name="schedule"
                    value={schedule._id}
                    checked={selectedSchedule === schedule._id}
                    onChange={(e) => setSelectedSchedule(e.target.value)}
                  />
                </label>
              ))}
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => setRescheduleAppointment(null)}
                className="rounded-xl border px-5 py-2"
              >
                Close
              </button>

              <button
                onClick={handleReschedule}
                className="rounded-xl bg-blue-600 px-5 py-2 text-white"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {reviewAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6">
            <h2 className="text-2xl font-bold">Leave Review</h2>

            <div className="mt-5">
              <label className="font-medium">Rating</label>

              <select className="mt-2 w-full rounded-xl border p-3">
                <option>⭐⭐⭐⭐⭐ (5)</option>
                <option>⭐⭐⭐⭐ (4)</option>
                <option>⭐⭐⭐ (3)</option>
                <option>⭐⭐ (2)</option>
                <option>⭐ (1)</option>
              </select>
            </div>

            <div className="mt-5">
              <label className="font-medium">Review</label>

              <textarea
                rows={5}
                className="mt-2 w-full rounded-xl border p-3"
                placeholder="Write your experience..."
              />
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => setReviewAppointment(null)}
                className="rounded-xl border px-5 py-2"
              >
                Close
              </button>

              <button
                onClick={handleReview}
                className="rounded-xl bg-green-600 px-5 py-2 text-white"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
