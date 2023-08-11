import prismadb from "@/lib/prisma.db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(
  _req: Request,
  { params }: { params: { orderId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.storeId || !params.orderId) {
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

    await prismadb.orderItem.deleteMany({
      where: {
        orderId: params.orderId,
      },
    });

    const order = await prismadb.order.deleteMany({
      where: {
        id: params.orderId,
      },
    });

    return NextResponse.json(order);
  } catch (e: any) {
    console.log("[ORDER_DELETE]", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
