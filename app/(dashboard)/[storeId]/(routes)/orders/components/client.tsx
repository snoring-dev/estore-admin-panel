"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { OrderColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

interface Props {
  data: OrderColumn[];
}

function OrderClient({ data = [] }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Orders (${data.length})`}
          description="Manage orders for your store"
        />
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchBy="products" />
    </>
  );
}

export default OrderClient;
