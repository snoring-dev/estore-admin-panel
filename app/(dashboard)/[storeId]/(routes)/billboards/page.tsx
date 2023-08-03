import React from "react";
import format from "date-fns/format";
import prismadb from "@/lib/prisma.db";
import BillboardClient from "./components/client";

interface Props {
  params: { storeId: string };
}

async function BillboardPage({ params }: Props) {
  const billboards = await prismadb.billboard.findMany({
    where: { storeId: params.storeId },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient
          data={billboards.map((bl) => ({
            id: bl.id,
            label: bl.label,
            textColor: bl.textColor,
            createdAt: format(bl.createdAt, "MMMM do, yyyy"),
          }))}
        />
      </div>
    </div>
  );
}

export default BillboardPage;
