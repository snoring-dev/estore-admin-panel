import prismadb from "@/lib/prisma.db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { colorId: string } }
) {
  try {
    if (!params.colorId) {
      return new NextResponse("colorId is required", { status: 401 });
    }

    const color = await prismadb.color.findFirst({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json(color);
  } catch (e: any) {
    console.log("[COLOR_GET]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { colorId: string; storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.storeId || !params.colorId) {
      return new NextResponse("StoreId & ColorId are required", {
        status: 401,
      });
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

    const color = await prismadb.color.updateMany({
      data: {
        name: body.name,
        value: body.value,
      },
      where: {
        id: params.colorId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(color);
  } catch (e: any) {
    console.log("[COLOR_PATCH]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { colorId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.storeId || !params.colorId) {
      return new NextResponse("StoreId & ColorId are required", {
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

    const color = await prismadb.color.deleteMany({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json(color);
  } catch (e: any) {
    console.log("[COLOR_DELETE]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
