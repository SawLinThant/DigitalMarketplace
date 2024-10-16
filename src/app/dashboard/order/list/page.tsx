"use client";

import { useSearchParams } from "next/navigation";
import React from "react";
import MaxWidthWrapper from "~/components/MaxWidthWrapper";
import AdminOrderList from "~/components/Order/AdminOrderList";
import { orderColumnDef } from "~/components/Order/orderColumnDef";
import PaginationComponent from "~/components/pagination";
import SearchInput from "~/components/search-component/search-input";
import { userColumnDef } from "~/components/user/userColumnDef";

import { api } from "~/trpc/react";
import { SearchParamType } from "~/types/global";

const searchQuery: SearchParamType[] = [
  {
    ParamName: "product",
    ParamValue: "",
  },

  {
    ParamName: "category",
    ParamValue: "",
  },
];
const OrderList = () => {
  const searchParams = useSearchParams();
  const items_per_page = 8;
  const currentPageNo = (searchParams.get("pageno") || 1) as number;
  const skipSize = (currentPageNo - 1) * items_per_page;
  const name = searchParams.get("name");
  const { data: orderList, isLoading } = api.order.getAdminOrderList.useQuery({
    skip: skipSize,
    take: items_per_page,
  });
  console.log(orderList);
  const totalPages =
    Math.floor((orderList?.count || 0) / items_per_page) +
    ((orderList?.count || 0) % items_per_page ? 1 : 0);
  return (
    <MaxWidthWrapper>
      <div className="flex w-full flex-col items-start justify-start gap-y-5 py-[30px] sm:px-[30px]">
        {/* <div className="flex w-full justify-end ">
      <Link href={`/dashboard/product/productform`}>
        <button className="border-[1px] p-[10px] ">Create New Product</button>
      </Link>
    </div> */}
        {/* <div className="flex items-center px-[20px] sm:px-[0px]">
          <SearchInput
            searchQuery={searchQuery}
            path="/dashboard/user/list"
            keyWord="name"
          />
        </div> */}
        <div className="flex w-full px-[20px] sm:px-[0px]">
          <AdminOrderList
            data={orderList?.list || []}
            columnDef={orderColumnDef}
          />
        </div>
        <div className="mt-20 flex w-full justify-center">
          <PaginationComponent
            searchQuery={searchQuery}
            path="/dashboard/order/list"
            keyWord="pageno"
            totalPages={totalPages}
          />
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default OrderList;
