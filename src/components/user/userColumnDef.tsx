'use client'

import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<any>();
export const userColumnDef = [
  columnHelper.accessor("id", {
    cell: (info) => (
      <span className="font-sans text-[18px]">{parseInt(info.row.id)+1}</span>
    ),
    header: () => <span className="text-[16px]">ID </span>,
  }),
  columnHelper.accessor("username", {
    cell: (info) => (
      <span className="font-sans text-[18px] text-black">{info.getValue()}</span>
    ),
    header: () => <span className="text-[16px]">Username </span>,
  }),
  columnHelper.accessor("email", {
    cell: (info) => (
      <span className="font-sans text-[18px]">{info.getValue()}</span>
    ),
    header: () => <span className="text-[16px]">Email </span>,
  }),
  
];


