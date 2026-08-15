import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        {
          message: "Session ID is required",
        },
        { status: 400 }
      );
    }

    const session =
      await stripe.checkout.sessions.retrieve(sessionId);

    console.log("Stripe Session:", session);

    if (
      session.status !== "complete" ||
      session.payment_status !== "paid"
    ) {
      return NextResponse.json(
        {
          message: "Payment is not completed",
        },
        { status: 400 }
      );
    }

    const {
      appointmentId,
      patientId,
    } = session.metadata || {};

    console.log(
      "Stripe Metadata:",
      session.metadata
    );

    if (!appointmentId || !patientId) {
      return NextResponse.json(
        {
          message:
            "Appointment information missing from Stripe metadata",
        },
        { status: 400 }
      );
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      return NextResponse.json(
        {
          message:
            "NEXT_PUBLIC_API_URL is not configured",
        },
        { status: 500 }
      );
    }

    const appointmentRes = await fetch(
      `${apiUrl}/appointments/${appointmentId}`,
      {
        cache: "no-store",
      }
    );

    if (!appointmentRes.ok) {
      return NextResponse.json(
        {
          message: "Appointment not found",
        },
        { status: 404 }
      );
    }

    const appointment =
      await appointmentRes.json();

    console.log(
      "Existing Appointment:",
      appointment
    );

    if (
      String(appointment.patientId) !==
      String(patientId)
    ) {
      return NextResponse.json(
        {
          message:
            "You are not authorized to update this appointment",
        },
        { status: 403 }
      );
    }

    if (
      appointment.paymentStatus === "paid"
    ) {
      return NextResponse.json({
        success: true,
        message: "Appointment is already paid",
        appointment,
      });
    }

    const updateRes = await fetch(
      `${apiUrl}/appointments/${appointmentId}`,
      {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          paymentStatus: "paid",

          paymentMethod: "stripe",

          transactionId:
            session.payment_intent
              ? String(session.payment_intent)
              : session.id,

          paymentSessionId: session.id,

          amountPaid:
            session.amount_total
              ? session.amount_total / 100
              : 0,
        }),
      }
    );

    const updatedAppointment =
      await updateRes.json();

    console.log(
      "Updated Appointment:",
      updatedAppointment
    );

    if (!updateRes.ok) {
      return NextResponse.json(
        updatedAppointment,
        {
          status: updateRes.status,
        }
      );
    }

    return NextResponse.json({
      success: true,

      message:
        "Payment successful and appointment updated",

      appointment:
        updatedAppointment,
    });
  } catch (error) {
    console.error(
      "Payment success error:",
      error
    );

    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}