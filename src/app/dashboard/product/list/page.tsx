"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import PaginationComponent from "~/components/pagination";
import AdminProductList from "~/components/Product/AdminProductList";
import { productColumnDef } from "~/components/Product/ProductColumnDef";
import SearchInput from "~/components/search-component/search-input";
import SelectFilter from "~/components/search-component/select-filter";
import { api } from "~/trpc/react";
import { SearchParamType } from "~/types/global";

const selectProps: { key: string; value: string }[] = [
  { key: "All Categories", value: "all" },
  { key: "Bag and Luggage", value: "bag" },
  { key: "Phone", value: "phone" },
  { key: "PC/Laptop", value: "pc_laptop" },
  { key: "Clothing", value: "clothing" },
];
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

const ProductList = () => {
  const searchParams = useSearchParams();
  const items_per_page = 10;
  const currentPageNo = (searchParams.get("pageno") || 1) as number;
  const skipSize = (currentPageNo - 1) * items_per_page;
  const category = searchParams.get("category");
  const product = searchParams.get("product");
  const { data: productList, isLoading } = api.product.getProductList.useQuery({
    skip: skipSize,
    take: items_per_page,
    name: product || "",
    category: category || "",
  });

  const totalPages =
    Math.floor((productList?.count || 0) / items_per_page) +
    ((productList?.count || 0) % items_per_page ? 1 : 0);
  return (
    <div className="flex w-full flex-col items-start justify-start gap-y-5 px-[30px] py-[30px]">
      <div className="flex w-full justify-center gap-x-6">
        <div className="flex w-[200px] items-start gap-1 py-4">
          {/* <ProductComboBox checkBoxHandler={checkBoxHandler} /> */}
          <SelectFilter
            searchQuery={searchQuery}
            path="/dashboard/product/list"
            keyWord="category"
            selectProps={selectProps}
          />
        </div>
        <div className="flex items-center">
          <SearchInput
            searchQuery={searchQuery}
            path="/dashboard/product/list"
            keyWord="product"
          />
        </div>
        <div className="flex w-full justify-end ">
          <Link href={`/dashboard/product/productform`}>
            <button className="border-[1px] p-[10px] ">
              Create New Product
            </button>
          </Link>
        </div>
      </div>

      <div className="flex w-full">
        <AdminProductList
          data={productList?.productList || []}
          columnDef={productColumnDef}
        />
      </div>
      <div className="mt-20">
        <PaginationComponent
          searchQuery={searchQuery}
          path="/dashboard/product/list"
          keyWord="pageno"
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};

export default ProductList;
