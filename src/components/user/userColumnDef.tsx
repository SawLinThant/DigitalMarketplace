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

export const sampleSaleReportData = [
  {
    customer: "customer 1",
    product: "product 1",
    quantity: 1,
    amount: 200,
    status: "processing",
    createdDate: new Date().toDateString(),
  },
  {
    customer: "customer 2",
    product: "product 2",
    quantity: 2,
    amount: 200,
    status: "processing",
    createdDate: new Date().toDateString(),
  },
  {
    customer: "customer 3",
    product: "product 3",
    quantity: 1,
    amount: 200,
    status: "processing",
    createdDate: new Date().toDateString(),
  },
  {
    customer: "customer 4",
    product: "product 4",
    quantity: 1,
    amount: 200,
    status: "Delivered",
    createdDate: new Date().toDateString(),
  },
  {
    customer: "customer 5",
    product: "product 5",
    quantity: 1,
    amount: 200,
    status: "Delivered",
    createdDate: new Date().toDateString(),
  },
];
