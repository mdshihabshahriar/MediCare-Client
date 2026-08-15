import "server-only";

import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id) {
    throw new Error("Please provide a valid session_id");
  }

  let appointmentDetails = null;
  let errorMessage = null;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    console.log("Stripe Session:", session);

    if (session.payment_status !== "paid") {
      return redirect("/");
    }

    const { appointmentId, patientId } = session.metadata || {};

    console.log("Stripe Metadata:", { appointmentId, patientId });

    if (!appointmentId || !patientId) {
      throw new Error("Appointment information is missing from Stripe.");
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const appointmentRes = await fetch(
      `${apiUrl}/appointments/${appointmentId}`,
      { cache: "no-store" },
    );

    if (!appointmentRes.ok) {
      throw new Error("Appointment not found");
    }

    const appointment = await appointmentRes.json();

    console.log("Existing Appointment:", appointment);

    if (String(appointment.patientId) !== String(patientId)) {
      throw new Error("You are not authorized to update this appointment");
    }

    if (appointment.paymentStatus !== "paid") {
      const updateRes = await fetch(
        `${apiUrl}/appointments/${appointmentId}/payment`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transactionId: session.payment_intent
              ? String(session.payment_intent)
              : session.id,
            paymentSessionId: session.id,
            amountPaid: session.amount_total
              ? session.amount_total / 100
              : 0,
          }),
        }
      );

      const updateResult = await updateRes.json();

      console.log("Update Payment Result:", updateResult);

      if (!updateRes.ok) {
        throw new Error(
          updateResult.message || "Failed to update appointment"
        );
      }

      appointmentDetails = {
        sessionId: session.id,
        appointmentDay: appointment.appointmentDay,
        appointmentStartTime: appointment.appointmentStartTime,
        appointmentEndTime: appointment.appointmentEndTime,
        consultationFee: appointment.consultationFee,
      };
    } else {
      appointmentDetails = {
        sessionId: session.id,
        appointmentDay: appointment.appointmentDay,
        appointmentStartTime: appointment.appointmentStartTime,
        appointmentEndTime: appointment.appointmentEndTime,
        consultationFee: appointment.consultationFee,
      };
    }
  } catch (error) {
    console.error("Success Page Error:", error);
    errorMessage = error.message;
  }

  if (errorMessage) {
    return (
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-rose-50 via-[#F8FAFC] to-orange-50 px-4">
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-rose-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />

        <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/60 bg-white/90 p-10 text-center shadow-[0_20px_60px_-15px_rgba(244,63,94,0.35)] backdrop-blur-sm">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-rose-400 to-red-500">
            <svg
              className="h-10 w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-red-600">
            Something went wrong
          </h1>

          <p className="mt-3 text-sm text-gray-600">{errorMessage}</p>

          <Link
            href="/"
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-[#0F172A] transition hover:bg-slate-50"
          >
            Back to Home
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-emerald-50 via-[#F8FAFC] to-sky-50 px-4 py-12">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 right-10 h-40 w-40 rounded-full bg-teal-200/30 blur-2xl" />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/60 bg-white/90 p-10 text-center shadow-[0_20px_60px_-15px_rgba(16,185,129,0.35)] backdrop-blur-sm animate-[fadeInUp_0.5s_ease-out]">
        <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/40" />
          <span className="absolute inline-flex h-full w-full rounded-full bg-linear-to-br from-emerald-400 to-teal-500 opacity-90" />
          <svg
            className="relative h-10 w-10 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
          Payment Confirmed
        </span>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#0F172A]">
          Payment Successful!
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-[#64748B]">
          Your appointment request has been sent to the doctor. You&apos;ll get
          a confirmation once it&apos;s approved.
        </p>

        <div className="mt-6 space-y-2 rounded-2xl bg-linear-to-br from-slate-50 to-emerald-50/50 p-4 text-left text-sm">
          <div className="flex items-center justify-between">
            <span className="text-[#64748B]">Date</span>
            <span className="font-semibold text-[#0F172A]">
              {appointmentDetails.appointmentDay}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#64748B]">Time</span>
            <span className="font-semibold text-[#0F172A]">
              {appointmentDetails.appointmentStartTime} -{" "}
              {appointmentDetails.appointmentEndTime}
            </span>
          </div>
          {appointmentDetails.consultationFee ? (
            <div className="flex items-center justify-between border-t border-slate-200 pt-2">
              <span className="text-[#64748B]">Fee Paid</span>
              <span className="font-semibold text-emerald-600">
                ${Number(appointmentDetails.consultationFee).toFixed(2)}
              </span>
            </div>
          ) : null}
        </div>

        <Link
          href="/dashboard/patient/appointments"
          className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:shadow-xl hover:shadow-emerald-500/40 active:scale-[0.98]"
        >
          View My Appointments
        </Link>

        <p className="mt-4 text-xs text-[#94A3B8]">
          Payment ID: {appointmentDetails.sessionId}
        </p>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
