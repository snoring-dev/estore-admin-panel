import React from "react";
import format from "date-fns/format";
import prismadb from "@/lib/prisma.db";
import ProductsClient from "./components/client";
import { priceFormatter } from "@/lib/utils";

interface Props {
  params: { storeId: string };
}

async function ProductsPage({ params }: Props) {
  const products = await prismadb.product.findMany({
    where: { storeId: params.storeId },
    include: {
      category: true,
      sizes: true,
      colors: true,
      images: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductsClient
          data={products.map((p) => ({
            id: p.id,
            name: p.name,
            isFeatured: p.isFeatured,
            isArchived: p.isArchived,
            category: p.category.name,
            size: p.sizes[0]?.name ?? '',
            color: p.colors[0]?.value ?? '',
            createdAt: format(p.createdAt, "MMMM do, yyyy"),
            price: priceFormatter.format(p.price.toNumber()),
            imageUrl: p.images?.[0].url ?? undefined,
            inventory: p?.inventory ?? 0,
          }))}
        />
      </div>
    </div>
  );
}

export default ProductsPage;
