"use client";

import clsx from "clsx";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { SearchParamType } from "~/types/global";

const PaginationComponent = ({
  searchQuery,
  path,
  keyWord, //should be 'pageno',
  totalPages,
}: {
  searchQuery: SearchParamType[];
  path: string;
  keyWord: string;
  totalPages: number;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fetchedParams = searchQuery.map((q) => {
    return {
      ParamName: q.ParamName,
      ParamValue:
        searchParams.get(q.ParamName) != null
          ? searchParams.get(q.ParamName)
          : "",
    } as SearchParamType;
  });
  const currentPageNo = parseInt(searchParams.get("pageno") || "1");
  const pagesToBeRendered: number[] =
    currentPageNo === 1
      ? [1, 2, 3]
      : currentPageNo === totalPages
        ? [totalPages - 2, totalPages - 1, totalPages]
        : [currentPageNo - 1, currentPageNo, currentPageNo + 1];
  const onPageSelected = (pageNo: number) => {
    if (pageNo < 1 || pageNo > totalPages) {
      return;
    }
    let temp = fetchedParams;
    let tempParam = [
      ...temp,
      { ParamName: "pageno", ParamValue: pageNo?.toString() },
    ];
    let params: string = "";
    tempParam.map((q) => {
      params += q?.ParamName + "=" + q?.ParamValue + "&";
    });
    router.replace(path + "?" + params);
  };
  return (
    <div className=" mb-5 flex flex-row items-center gap-x-2">
      <button
        className="flex cursor-pointer flex-row items-center gap-1 pl-2.5 text-[18px] font-bold"
        onClick={() => onPageSelected(currentPageNo - 1)}
      >
        <ChevronLeft className="h-5 w-5" />
        <span>Previous</span>
      </button>
      <div className="flex flex-row items-center gap-x-3">
        {pagesToBeRendered?.map((p, index) => (
          <>
            {p <= totalPages && (
              <button
                key={index + p}
                className={clsx("", {
                  "border bg-gray-200 px-2": currentPageNo == p,
                })}
                onClick={() => onPageSelected(p)}
              >
                {p}
              </button>
            )}
          </>
        ))}
        {currentPageNo < totalPages && (
          <div>
            <MoreHorizontal className="h-4 w-4" />
          </div>
        )}
      </div>
      <button
        className="flex cursor-pointer flex-row items-center gap-1 pl-2.5 text-[18px] font-bold"
        onClick={() => onPageSelected(currentPageNo + 1)}
      >
        <span>Next</span>
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};

export default PaginationComponent;
