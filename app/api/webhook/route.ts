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
    // look if we have a client already
    let client = await prismadb.client.findFirst({
      where: {
        email: session.customer_details?.email ?? "",
      },
    });

    // create a new client if not!
    if (!client) {
      client = await prismadb.client.create({
        data: {
          email: session.customer_details?.email ?? "",
          phone: session.customer_details?.phone ?? "",
          name: session.customer_details?.name ?? "",
          address: {
            create: {
              line1: address?.line1 ?? "",
              line2: address?.line2 ?? "",
              city: address?.city ?? "",
              state: address?.state ?? "",
              postalCode: address?.postal_code ?? "",
              country: address?.country ?? "",
            },
          },
        },
      });
    }

    const order = await prismadb.order.update({
      where: { id: session?.metadata?.orderId },
      data: {
        isPaid: true,
        address: addressLine,
        phone: session.customer_details?.phone || "",
        clientId: client.id,
      },
      include: {
        orderItems: true,
      },
    });

    const productsIds = order.orderItems.map((it) => it.productId);

    // update inventory
    await prismadb.product.updateMany({
      where: {
        id: {
          in: productsIds,
        },
      },
      data: {
        inventory: {
          decrement: 1,
        },
      },
    });

    // archive unavailable products
    await prismadb.product.updateMany({
      where: {
        id: {
          in: productsIds,
        },
        inventory: {
          lte: 0,
        },
      },
      data: {
        isArchived: true,
      },
    });
  }

  return new NextResponse(null, { status: 200 });
}
