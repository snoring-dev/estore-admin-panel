import React from "react";
import format from "date-fns/format";
import prismadb from "@/lib/prisma.db";
import ColorsClient from "./components/client";

interface Props {
  params: { storeId: string };
}

async function ColorsPage({ params }: Props) {
  const colors = await prismadb.color.findMany({
    where: { storeId: params.storeId },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorsClient
          data={colors.map((s) => ({
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

export default ColorsPage;
