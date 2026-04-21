import { NextResponse } from "next/server";
import Stripe from "stripe";

// Check of de STRIPE_SECRET_KEY is ingesteld in de Vercel Environment Variables
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("STRIPE_SECRET_KEY ontbreekt in Vercel Environment Variables!");
}

// Initialiseer Stripe client
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // Gebruik een recente, stabiele API versie. "2025-02-24.typescript" is een goede optie.
  // Als je problemen blijft houden, kun je experimenteren met andere versies of de default proberen.
  apiVersion: "2025-02-24.typescript", 
});

export async function POST() {
  try {
    // Dit controleert of de sleutel nu wel beschikbaar is tijdens de runtime.
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is nog steeds niet beschikbaar tijdens runtime.");
      return NextResponse.json({ error: "Server configuratiefout: Stripe sleutel ontbreekt." }, { status: 500 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: "Premium Carrière SWOT-Rapport" },
            // Prijs verlaagd naar 99 cent
            unit_amount: 99, 
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
    // Geef een meer specifieke foutmelding als er een probleem is met de API key of de prijs
    if (error instanceof Error && error.message.includes("No such price")) {
      return NextResponse.json({ error: "De prijs voor dit product kon niet gevonden worden. Controleer je Stripe-account en Vercel-instellingen." }, { status: 500 });
    }
    return NextResponse.json({ error: "Betaling mislukt. Controleer je verbinding en probeer het later opnieuw." }, { status: 500 });
  }
}
