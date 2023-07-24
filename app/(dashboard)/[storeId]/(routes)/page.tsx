import prismadb from "@/lib/prisma.db";
import React from "react";

interface Props {
  params: { storeId: string };
}

async function DashboardPage({ params }: Props) {
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
    },
  });

  return <div>Dashboard Page for: {store?.name}</div>;
}

export default DashboardPage;
