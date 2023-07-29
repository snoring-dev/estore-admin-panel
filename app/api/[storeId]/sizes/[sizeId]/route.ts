import prismadb from "@/lib/prisma.db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { sizeId: string } }
) {
  try {
    if (!params.sizeId) {
      return new NextResponse("sizeId is required", { status: 401 });
    }

    const size = await prismadb.size.findFirst({
      where: {
        id: params.sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (e: any) {
    console.log("[SIZE_GET]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { sizeId: string; storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.storeId || !params.sizeId) {
      return new NextResponse("StoreId & SizeId are required", {
        status: 401,
      });
    }

    if (!body.name) {
      return new NextResponse("Missing field 'name' for size creation", {
        status: 400,
      });
    }

    if (!body.value) {
      return new NextResponse("Missing field 'value' for size creation", {
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

    const size = await prismadb.size.updateMany({
      data: {
        name: body.name,
        value: body.value,
      },
      where: {
        id: params.sizeId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(size);
  } catch (e: any) {
    console.log("[SIZE_PATCH]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { sizeId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.storeId || !params.sizeId) {
      return new NextResponse("StoreId & SizeId are required", {
        status: 401,
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

    const size = await prismadb.size.deleteMany({
      where: {
        id: params.sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (e: any) {
    console.log("[SIZE_DELETE]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
