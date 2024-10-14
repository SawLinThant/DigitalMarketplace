'use client'

import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<any>();
export const productColumnDef = [
  columnHelper.accessor("name", {
    cell: (info) => (
      <span className="font-sans text-[18px]">{info.getValue()}</span>
    ),
    header: () => <span className="text-[16px]">Product </span>,
  }),
  columnHelper.accessor("category", {
    cell: (info) => (
      <span className="font-sans text-[18px]">{info.getValue()}</span>
    ),
    header: () => <span className="text-[16px]">Category </span>,
  }),
  columnHelper.accessor("description", {
    cell: (info) => (
      <span className="font-sans text-[18px]">{info.getValue()}</span>
    ),
    header: () => <span className="text-[16px]">Description </span>,
  }),
  columnHelper.accessor("price", {
    cell: (info) => (
      <span className="font-sans text-[18px]">{info.getValue()}</span>
    ),
    header: () => <span className="text-[16px]">Amount </span>,
  }),
 
  columnHelper.accessor("createddate", {
    cell: (info) => (
      <span className="font-sans text-[18px]">{info.getValue()}</span>
    ),
    header: () => <span className="text-[16px]">Created Date </span>,
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
