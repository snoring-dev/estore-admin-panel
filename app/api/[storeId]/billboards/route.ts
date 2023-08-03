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

    const billboard = await prismadb.billboard.create({
      data: {
        label: body.label,
        imageUrl: body.imageUrl,
        textColor: body.textColor || "#000000",
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboard);
  } catch (e: any) {
    console.log("[BILLBOARD_POST]", e);
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

    const billboards = await prismadb.billboard.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboards);
  } catch (e: any) {
    console.log("[BILLBOARD_GET]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
