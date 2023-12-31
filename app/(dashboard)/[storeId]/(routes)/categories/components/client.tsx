"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CategoryColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import ApiList from "@/components/api-list";

interface Props {
  data: CategoryColumn[];
}

function CategoryClient({ data = [] }: Props) {
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
          title={`Categories (${data.length})`}
          description="Manage billboards for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/categories/new`)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchBy="name"/>
      <Heading title="API" description="Api calls for Categories" />
      <Separator />
      <ApiList entityIdName="categoryId" entityName="categories" />
    </>
  );
}

export default CategoryClient;
