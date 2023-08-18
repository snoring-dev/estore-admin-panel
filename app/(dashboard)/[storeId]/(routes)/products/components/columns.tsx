"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./cell-action";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export type ProductColumn = {
  id: string;
  name: string;
  isFeatured: boolean;
  isArchived: boolean;
  category: string;
  size: string;
  color: string;
  createdAt: string;
  price: string;
  imageUrl?: string;
  inventory?: number;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex flex-col gap-2 items-start">
        {row.original.imageUrl && (
          <div className="relative h-24 w-24 rounded-md overflow-hidden">
            <Image
              fill
              src={row.original.imageUrl}
              alt={row.original.name}
              className="object-cover object-center"
            />
          </div>
        )}
        <div className="font-semibold flex space-x-2">
          <span>{row.original.name}</span>
          {row.original.isFeatured && <Badge variant={"outline"}>Featured</Badge>}
        </div>
        <div className="text-xs uppercase">
          Items in stock: {row.original.inventory ?? 0}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => (
      <div className="flex flex-row gap-2 items-center">
        <div
          className={`rounded-full border border-gray-200 w-[40px] h-[38px]`}
          style={{ backgroundColor: row.original.color }}
        />
        <div>{row.original.color}</div>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
