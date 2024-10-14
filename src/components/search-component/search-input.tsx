"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SearchParamType } from "~/types/global";


const SearchInput = ({
  searchQuery,
  path,
  keyWord,
}: {
  searchQuery: SearchParamType[];
  path: string;
  keyWord: string;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [text, setText] = useState<string>(searchParams.get(keyWord) || "");
  const fetchedParams = searchQuery.map((q) => {
    return {
      ParamName: q.ParamName,
      ParamValue:
        searchParams.get(q.ParamName) != null
          ? searchParams.get(q.ParamName)
          : "",
    } as SearchParamType;
  });

  //console.log(text);

  const searchHandler = (event: any) => {
    event?.preventDefault();
    let temp = fetchedParams.filter((q) => q.ParamName != keyWord);
    let tempParam = [
      ...temp,
      { ParamName: keyWord, ParamValue: text },
      { ParamName: "pageno", ParamValue: "1" },
    ];
    let params: string = "";
    tempParam.map((q) => {
      params += q.ParamName + "=" + q.ParamValue + "&";
    });

    router.replace(path + "?" + params);
  };
  const inputOnChangeHandler = (event: any) => {
    event.preventDefault();
    setText(event?.target?.value);

    if (event.target?.value === "") {
      let temp = fetchedParams.filter((q) => q.ParamName != keyWord);

      const tempParam = [
        ...temp,
        { ParamName: keyWord, ParamValue: "" },
        { ParamName: "pageno", ParamValue: "1" },
      ];
      let params: string = "";
      tempParam.map((q) => {
        params += q.ParamName + "=" + q.ParamValue + "&";
      });
      router.replace(path + "?" + params);
    }
  };
  const enterSearchHandler = (event: any) => {
    if (event.key === "Enter") {
      searchHandler(event);
    }
  };
  return (
    <div className=" flex h-[40px] w-full flex-row items-center gap-x-2 rounded-[6px] border border-black bg-[#F2F2F2] px-2 sm:w-[150px] lg:w-auto">
      <div
        className="flex  cursor-pointer  items-center  "
        onClick={searchHandler}
      >
        <svg
          aria-hidden="true"
          className="h-5 w-5 stroke-[rgb(13,1,1)] text-gray-500 dark:text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </div>
      <div>
        <input
          value={text || ""}
          onChange={inputOnChangeHandler}
          //onChange={searchInputOnChangeHandler}
          className="block w-full border-none bg-transparent  text-[18px]  text-black focus:outline-none  "
          placeholder={"Search " + keyWord}
          required
          onKeyDown={enterSearchHandler}
        />
      </div>
    </div>
  );
};

export default SearchInput;
