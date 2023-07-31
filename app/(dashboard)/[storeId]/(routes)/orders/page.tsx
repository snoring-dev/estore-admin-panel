import React from "react";
import format from "date-fns/format";
import prismadb from "@/lib/prisma.db";
import OrderClient from "./components/client";
import { priceFormatter } from "@/lib/utils";

interface Props {
  params: { storeId: string };
}

async function OrdersPage({ params }: Props) {
  const orders = await prismadb.order.findMany({
    where: { storeId: params.storeId },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient
          data={orders.map((order) => ({
            id: order.id,
            phone: order.phone,
            address: order.address,
            products: order.orderItems
              .map((item) => item.product.name)
              .join(", "),
            totalPrice: priceFormatter.format(
              order.orderItems.reduce(
                (total, item) => total + Number(item.product.price),
                0
              )
            ),
            isPaid: order.isPaid,
            createdAt: format(order.createdAt, "MMMM do, yyyy"),
          }))}
        />
      </div>
    </div>
  );
}

export default OrdersPage;
