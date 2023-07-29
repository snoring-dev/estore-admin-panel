import React from "react";
import format from "date-fns/format";
import prismadb from "@/lib/prisma.db";
import SizeClient from "./components/client";

interface Props {
  params: { storeId: string };
}

async function SizesPage({ params }: Props) {
  const sizes = await prismadb.size.findMany({
    where: { storeId: params.storeId },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeClient
          data={sizes.map((s) => ({
            id: s.id,
            name: s.name,
            value: s.value,
            createdAt: format(s.createdAt, "MMMM do, yyyy"),
          }))}
        />
      </div>
    </div>
  );
}

export default SizesPage;
