import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prisma.db";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_KEY
    );
  } catch (e) {
    return new NextResponse(`Webhook Error: ${e.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const address = session?.customer_details?.address;
  const addressLine = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country,
  ]
    .filter((line) => line !== null && line !== "")
    .join(", ");

  if (event.type === "checkout.session.completed") {
    const order = await prismadb.order.update({
      where: { id: session?.metadata?.orderId },
      data: {
        isPaid: true,
        address: addressLine,
        phone: session.customer_details?.phone || "",
      },
      include: {
        orderItems: true,
      },
    });

    /*
     * @TODO: decrease products quantity/stock using orderItems
     */
  }

  return new NextResponse(null, { status: 200 });
}
