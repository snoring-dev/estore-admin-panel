import prismadb from "@/lib/prisma.db";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse("productId is required", { status: 401 });
    }

    const reviews = await prismadb.review.findMany({
      where: {
        productId: params.productId,
      },
      include: {
        product: true,
      },
    });

    return NextResponse.json(reviews);
  } catch (e: any) {
    console.log("[REVIEWS_GET]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { productId: string; storeId: string } }
) {
  try {
    const body = await req.json();
    const { firstName, lastName, message, rating } = body;

    if (!params.storeId || !params.productId) {
      return new NextResponse("StoreId & ProductId are required", {
        status: 401,
      });
    }

    if (!firstName) {
      return new NextResponse(
        "Missing field 'firstName' for product creation",
        {
          status: 400,
        }
      );
    }

    if (!lastName) {
      return new NextResponse("Missing field 'lastName' for product creation", {
        status: 400,
      });
    }

    if (!message) {
      return new NextResponse("Missing field 'message' for product creation", {
        status: 400,
      });
    }

    if (!rating) {
      return new NextResponse("Missing field 'rating' for product creation", {
        status: 400,
      });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized Action", { status: 401 });
    }

    const review = await prismadb.review.create({
      data: {
        firstName,
        lastName,
        message,
        rating,
        productId: params.productId,
      },
    });

    return NextResponse.json(review);
  } catch (e: any) {
    console.log("[REVIEWS_POST]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
