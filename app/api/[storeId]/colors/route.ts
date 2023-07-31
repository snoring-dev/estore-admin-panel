import prismadb from "@/lib/prisma.db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("StoreId is required", { status: 401 });
    }

    if (!body.name) {
      return new NextResponse("Missing field 'name' for color creation", {
        status: 400,
      });
    }

    if (!body.value) {
      return new NextResponse("Missing field 'value' for color creation", {
        status: 400,
      });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        userId,
        id: params.storeId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized Action", { status: 401 });
    }

    const color = await prismadb.color.create({
      data: {
        name: body.name,
        value: body.value,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(color);
  } catch (e: any) {
    console.log("[COLORS_POST]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("StoreId is required", { status: 401 });
    }

    const colors = await prismadb.color.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(colors);
  } catch (e: any) {
    console.log("[COLORS_GET]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
