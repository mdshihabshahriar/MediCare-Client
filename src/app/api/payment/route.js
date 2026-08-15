import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";

export async function POST(request) {
  try {
    const { appointmentId, patientId } = await request.json();

    console.log("========== PAYMENT API ==========");
    console.log("appointmentId:", appointmentId);
    console.log("patientId:", patientId);

    if (!appointmentId || !patientId) {
      return NextResponse.json(
        {
          message: "Appointment ID and patient ID are required",
        },
        { status: 400 }
      );
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      return NextResponse.json(
        {
          message: "NEXT_PUBLIC_API_URL is not configured",
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

    const appointment = await appointmentRes.json();

    console.log("Appointment for payment:", appointment);

    if (
      String(appointment.patientId) !==
      String(patientId)
    ) {
      return NextResponse.json(
        {
          message:
            "You are not authorized to pay for this appointment",
        },
        { status: 403 }
      );
    }

    if (appointment.paymentStatus === "paid") {
      return NextResponse.json(
        {
          message: "This appointment is already paid",
        },
        { status: 400 }
      );
    }

    const consultationFee = Number(
      appointment.consultationFee ||
        appointment.doctor?.consultationFee ||
        0
    );

    if (consultationFee <= 0) {
      return NextResponse.json(
        {
          message: "Invalid consultation fee",
        },
        { status: 400 }
      );
    }

    const amountInCents = Math.round(
      consultationFee * 100
    );

    const headersList = await headers();

    const origin =
      headersList.get("origin") ||
      "http://localhost:3000";

    const metadata = {
      appointmentId: String(appointmentId),
      patientId: String(patientId),
    };

    console.log("Metadata BEFORE Stripe:", metadata);

    const stripeSession =
      await stripe.checkout.sessions.create({
        mode: "payment",

        line_items: [
          {
            price_data: {
              currency: "usd",

              product_data: {
                name: "Doctor Consultation",
              },

              unit_amount: amountInCents,
            },

            quantity: 1,
          },
        ],

        metadata,

        success_url:
          `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,

        cancel_url:
          `${origin}/patient/appointments`,
      });

    console.log(
      "Stripe Session ID:",
      stripeSession.id
    );

    console.log(
      "Metadata AFTER Stripe:",
      stripeSession.metadata
    );

    console.log(
      "================================"
    );

    return NextResponse.json({
      success: true,
      url: stripeSession.url,
      sessionId: stripeSession.id,
    });
  } catch (error) {
    console.error("Stripe Error:", error);

    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 500 }
    );
  }
}