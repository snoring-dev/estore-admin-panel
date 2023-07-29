import React from "react";
import format from "date-fns/format";
import prismadb from "@/lib/prisma.db";
import CategoryClient from "./components/client";

interface Props {
  params: { storeId: string };
}

async function CategoriesPage({ params }: Props) {
  const categories = await prismadb.category.findMany({
    where: { storeId: params.storeId },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient
          data={categories.map((cat) => ({
            id: cat.id,
            name: cat.name,
            billboardLabel: cat.billboard.label,
            createdAt: format(cat.createdAt, "MMMM do, yyyy"),
          }))}
        />
      </div>
    </div>
  );
}

export default CategoriesPage;
