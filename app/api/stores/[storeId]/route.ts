import prismadb from "@/lib/prisma.db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("StoreId is required", { status: 401 });
    }

    const store = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
      },
    });

    return NextResponse.json(store);
  } catch (e: any) {
    console.log("[STORE_GET]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, logoUrl = undefined } = body;

    if (!userId) {
      return new NextResponse("Unauthorized route", { status: 401 });
    }

    if (!name) {
      return new NextResponse("The store name is missing", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("The store id is required", { status: 400 });
    }

    const store = await prismadb.store.updateMany({
      data: { name, logoUrl },
      where: {
        userId,
        id: params.storeId,
      },
    });

    return NextResponse.json(store);
  } catch (e) {
    console.log("[STORE_PATCH]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized route", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("The store id is required", { status: 400 });
    }

    const store = await prismadb.store.deleteMany({
      where: {
        userId,
        id: params.storeId,
      },
    });

    return NextResponse.json(store);
  } catch (e) {
    console.log("[STORE_PATCH]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
