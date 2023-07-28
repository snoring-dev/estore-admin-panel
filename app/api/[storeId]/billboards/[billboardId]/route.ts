import prismadb from "@/lib/prisma.db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { billboardId: string } }
) {
  try {
    if (!params.billboardId) {
      return new NextResponse("StoreId is required", { status: 401 });
    }

    const billboard = await prismadb.billboard.findFirst({
      where: {
        id: params.billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (e: any) {
    console.log("[BILLBOARD_GET]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { billboardId: string; storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.storeId || !params.billboardId) {
      return new NextResponse("StoreId & BillboardId are required", {
        status: 401,
      });
    }

    if (!body.label) {
      return new NextResponse("Missing field 'label' for billboard creation", {
        status: 400,
      });
    }

    if (!body.imageUrl) {
      return new NextResponse(
        "Missing field 'imageUrl' for billboard creation",
        {
          status: 400,
        }
      );
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

    const billboard = await prismadb.billboard.updateMany({
      data: {
        label: body.label,
        imageUrl: body.imageUrl,
      },
      where: {
        id: params.billboardId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboard);
  } catch (e: any) {
    console.log("[BILLBOARD_PATCH]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { billboardId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.storeId || !params.billboardId) {
      return new NextResponse("StoreId & BillboardId are required", {
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

    const billboard = await prismadb.billboard.deleteMany({
      where: {
        id: params.billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (e: any) {
    console.log("[BILLBOARD_DELETE]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
