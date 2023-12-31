import prismadb from "@/lib/prisma.db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse("StoreId is required", { status: 401 });
    }

    const product = await prismadb.product.findFirst({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
        category: true,
        colors: true,
        sizes: true,
        reviews: true,
      },
    });

    return NextResponse.json(product);
  } catch (e: any) {
    console.log("[PRODUCT_GET]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { productId: string; storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const {
      name,
      isFeatured,
      isArchived,
      categoryId,
      sizes,
      colors,
      images,
      price,
      shortDescription,
    } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.storeId || !params.productId) {
      return new NextResponse("StoreId & ProductId are required", {
        status: 401,
      });
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

    const sizesCollection = await prismadb.size.findMany({
      where: {
        id: {
          in: sizes.map((sz: Record<string, string | number>) => sz.value),
        },
      },
    });

    const colorsCollection = await prismadb.color.findMany({
      where: {
        id: {
          in: colors.map((clr: Record<string, string | number>) => clr.value),
        },
      },
    });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        userId,
        id: params.storeId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized Action", { status: 401 });
    }

    await prismadb.product.update({
      data: {
        name,
        price,
        isFeatured,
        isArchived,
        categoryId,
        shortDescription,
        images: {
          deleteMany: {},
        },
      },
      where: {
        id: params.productId,
        storeId: params.storeId,
      },
    });

    const product = await prismadb.product.update({
      data: {
        images: {
          createMany: {
            data: [...images.map((img: { url: string; isMain: boolean }) => img)],
          },
        },
        colors: {
          connect: colorsCollection,
        },
        sizes: {
          connect: sizesCollection,
        },
      },
      where: {
        id: params.productId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(product);
  } catch (e: any) {
    console.log("[PRODUCT_PATCH]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { productId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.storeId || !params.productId) {
      return new NextResponse("StoreId & ProductId are required", {
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

    // delete all related reviews before
    await prismadb.review.deleteMany({
      where: {
        productId: params.productId,
      },
    });

    const product = await prismadb.product.deleteMany({
      where: {
        id: params.productId,
      },
    });

    return NextResponse.json(product);
  } catch (e: any) {
    console.log("[PRODUCT_DELETE]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
