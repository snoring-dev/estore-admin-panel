import prismadb from "@/lib/prisma.db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    if (!params.categoryId) {
      return new NextResponse("CategoryId is required", { status: 401 });
    }

    const category = await prismadb.category.findFirst({
      where: {
        id: params.categoryId,
      },
      include: {
        billboard: true,
      },
    });

    return NextResponse.json(category);
  } catch (e: any) {
    console.log("[CATEGORY_GET]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { categoryId: string; storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.storeId || !params.categoryId) {
      return new NextResponse("StoreId & categoryId are required", {
        status: 401,
      });
    }

    if (!body.name) {
      return new NextResponse("Missing field 'name' for category update", {
        status: 400,
      });
    }

    if (!body.billboardId) {
      return new NextResponse(
        "Missing field 'billboardId' for category update",
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

    const category = await prismadb.category.updateMany({
      data: {
        name: body.name,
        billboardId: body.billboardId,
      },
      where: {
        id: params.categoryId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(category);
  } catch (e: any) {
    console.log("[CATEGORY_PATCH]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { categoryId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.storeId || !params.categoryId) {
      return new NextResponse("StoreId & CategoryId are required", {
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

    const category = await prismadb.category.deleteMany({
      where: {
        id: params.categoryId,
      },
    });

    return NextResponse.json(category);
  } catch (e: any) {
    console.log("[CATEGORY_DELETE]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
