"use client";

import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";

const columnHelper = createColumnHelper<any>();
export const orderColumnDef = [
  columnHelper.accessor("buyerId", {
    cell: (info) => (
      <span className="font-sans text-[18px]">{parseInt(info.row.id) + 1}</span>
    ),
    header: () => <span className="text-[16px]">No </span>,
  }),
  columnHelper.accessor("id", {
    cell: (info) => (
      <span className="font-sans text-[18px] text-black">
        #{info.getValue()}
      </span>
    ),
    header: () => <span className="text-[16px]">Order Id </span>,
  }),
  columnHelper.accessor("paidStatus", {
    cell: (info) => (
      <span className="font-sans text-[18px]">{info.getValue()}</span>
    ),
    header: () => <span className="text-[16px]">Paid</span>,
  }),
  columnHelper.accessor("status", {
    cell: (info) => (
      <span className="font-sans text-[18px]">{info.getValue()}</span>
    ),
    header: () => <span className="text-[16px]">Status</span>,
  }),
  columnHelper.accessor("createdDate", {
    cell: (info) => (
      <span className="font-sans text-[18px]">
        {!info.getValue()
          ? ""
          : info.getValue() == ""
            ? ""
            : new Date(info.getValue()).toUTCString()}
      </span>
    ),
    header: () => <span className="text-[16px]">Email </span>,
  }),
  columnHelper.accessor("ia", {
    cell: (info) => (
      <span className="font-sans text-[18px]">
        <Link
        href={`/dashboard/order/detail?id=${info.row.original.id}`}
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
