'use client'

import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";

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
 
  columnHelper.accessor("ia", {
    cell: (info) => (
      <span className="font-sans text-[18px]">
        <Link
        href={`/dashboard/product/detail?id=${info.row.original.id}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
        </Link>
      </span>
    ),
    header: () => <span className="text-[16px]"> </span>,
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
