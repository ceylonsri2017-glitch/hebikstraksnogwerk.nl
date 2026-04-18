import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST() {
  try {
    // Lazy-initialization to prevent build-time crashes if env vars are missing
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-03-25", // Updated to latest stable SDK version
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: "Premium Carrière SWOT-Rapport" },
            unit_amount: 199, // €1,99
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: "Betaling mislukt" }, { status: 500 });
  }
}
