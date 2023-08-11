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
    const {
      name,
      isFeatured,
      isArchived,
      categoryId,
      sizeId,
      colorId,
      images,
      price,
      shortDescription,
      inventory = 0,
    } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("StoreId is required", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Missing field 'name' for product creation", {
        status: 400,
      });
    }

    if (!price) {
      return new NextResponse("Missing field 'price' for product creation", {
        status: 400,
      });
    }

    if (!images || images.length === 0) {
      return new NextResponse("Missing field 'images' for product creation", {
        status: 400,
      });
    }

    if (!categoryId) {
      return new NextResponse(
        "Missing field 'categoryId' for product creation",
        {
          status: 400,
        }
      );
    }

    if (!sizeId) {
      return new NextResponse("Missing field 'sizeId' for product creation", {
        status: 400,
      });
    }

    if (!colorId) {
      return new NextResponse("Missing field 'colorId' for product creation", {
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

    const product = await prismadb.product.create({
      data: {
        name,
        price,
        inventory,
        isFeatured,
        isArchived,
        categoryId,
        colors: {
          connect: [{ id: colorId }],
        },
        sizes: {
          connect: [{ id: sizeId }],
        },
        shortDescription,
        images: {
          createMany: {
            data: [...images.map((img: { url: string }) => img)],
          },
        },
        storeId: params.storeId,
      },
    });

    return NextResponse.json(product);
  } catch (e: any) {
    console.log("[PRODUCTS_POST]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured");
    const excludeId = searchParams.get("excludeId") || undefined;

    if (!params.storeId) {
      return new NextResponse("StoreId is required", { status: 401 });
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colors: {
          some: {
            id: colorId,
          },
        },
        sizes: {
          some: {
            id: sizeId,
          },
        },
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
        id: {
          not: excludeId,
        },
      },
      include: {
        images: true,
        category: true,
        colors: true,
        sizes: true,
        reviews: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (e: any) {
    console.log("[PRODUCTS_GET]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
