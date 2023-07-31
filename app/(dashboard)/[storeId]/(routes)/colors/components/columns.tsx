"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./cell-action";

export type ColorColumn = {
  id: string;
  name: string;
  value: string;
  createdAt: string;
};

export const columns: ColumnDef<ColorColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => (
      <div className="flex flex-row gap-2 items-center">
        <div
          className={`rounded-full border border-gray-200 w-[40px] h-[38px]`}
          style={{ backgroundColor: row.original.value }}
        />
        <div>{row.original.value}</div>
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
