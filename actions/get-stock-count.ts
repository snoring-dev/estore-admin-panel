import prismadb from "@/lib/prisma.db";

export const getStockCount = async (storeId: string) => {
  const productsCount = await prismadb.product.count({
    where: {
      storeId,
      isArchived: false,
    }
  });

  return productsCount;
};
