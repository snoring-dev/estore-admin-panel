"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SizeColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import ApiList from "@/components/api-list";

interface Props {
  data: SizeColumn[];
}

function SizeClient({ data = [] }: Props) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const params = useParams();

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
          title={`Sizes (${data.length})`}
          description="Manage sizes for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/sizes/new`)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchBy="name"/>
      <Heading title="API" description="Api calls for Sizes" />
      <Separator />
      <ApiList entityIdName="sizeId" entityName="sizes" />
    </>
  );
}

export default SizeClient;
