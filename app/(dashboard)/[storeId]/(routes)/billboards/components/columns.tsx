"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./cell-action";

export type BillboardColumn = {
  id: string;
  label: string;
  textColor: string;
  createdAt: string;
};

export const columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: "label",
    header: "Label",
  },
  {
    accessorKey: "textColor",
    header: "Text color",
    cell: ({ row }) => (
      <div className="flex flex-row gap-2 items-center">
        <div
          className={`rounded-full border border-gray-200 w-[40px] h-[38px]`}
          style={{ backgroundColor: row.original.textColor }}
        />
        <div>{row.original.textColor}</div>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction  data={row.original}/>
  }
];
