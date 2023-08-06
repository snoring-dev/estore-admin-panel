import prismadb from "@/lib/prisma.db";

export const getTotalRevenue = async (storeId: string) => {
  const orders = await prismadb.order.findMany({
    where: {
      storeId,
      isPaid: true,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  const totalRevenue = orders.reduce((total, order) => {
    const sumOfItems = order.orderItems.reduce((sum, item) => {
      return sum + item.product.price.toNumber();
    }, 0);
    return total + sumOfItems;
  }, 0);

  return totalRevenue;
};
