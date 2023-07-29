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
      return new NextResponse("Missing field 'name' for category creation", {
        status: 400,
      });
    }

    if (!body.billboardId) {
      return new NextResponse(
        "Missing field 'billboardId' for category creation",
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

    const billboardById = await prismadb.billboard.findFirst({
      where: {
        id: body.billboardId,
      },
    });

    if (!storeByUserId || !billboardById) {
      return new NextResponse("Unauthorized Action", { status: 401 });
    }

    const category = await prismadb.category.create({
      data: {
        name: body.name,
        billboardId: body.billboardId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(category);
  } catch (e: any) {
    console.log("[CATEGORIES_POST]", e);
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

    const categories = await prismadb.category.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(categories);
  } catch (e: any) {
    console.log("[CATEGORIES_GET]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
