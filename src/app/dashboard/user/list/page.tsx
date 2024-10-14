"use client";

import { useSearchParams } from "next/navigation";
import React from "react";
import PaginationComponent from "~/components/pagination";
import SearchInput from "~/components/search-component/search-input";
import { userColumnDef } from "~/components/user/userColumnDef";
import AdminUserList from "~/components/user/UserList";
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
const UserList = () => {
  const searchParams = useSearchParams();
  const items_per_page = 8;
  const currentPageNo = (searchParams.get("pageno") || 1) as number;
  const skipSize = (currentPageNo - 1) * items_per_page;
  const name = searchParams.get("name");
  const { data: userList, isLoading } = api.user.getUserList.useQuery({
    skip: skipSize,
    take: items_per_page,
    name: name || "",
  });
  console.log(userList);
  const totalPages =
    Math.floor((userList?.count || 0) / items_per_page) +
    ((userList?.count || 0) % items_per_page ? 1 : 0);
  return (
    <div className="flex w-full flex-col items-start justify-start gap-y-5 px-[30px] py-[30px]">
      {/* <div className="flex w-full justify-end ">
      <Link href={`/dashboard/product/productform`}>
        <button className="border-[1px] p-[10px] ">Create New Product</button>
      </Link>
    </div> */}
      <div className="flex items-center">
        <SearchInput
          searchQuery={searchQuery}
          path="/dashboard/user/list"
          keyWord="name"
        />
      </div>
      <div className="flex w-full px-[20px]">
        <AdminUserList data={userList?.list || []} columnDef={userColumnDef} />
      </div>
      <div className="mt-20 flex w-full justify-center">
        <PaginationComponent
          searchQuery={searchQuery}
          path="/dashboard/user/list"
          keyWord="pageno"
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};

export default UserList;
