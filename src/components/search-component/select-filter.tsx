"use client";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { SearchParamType } from "~/types/global";


const SelectFilter = ({
  searchQuery,
  path,
  keyWord,
  selectProps,
}: {
  searchQuery: SearchParamType[];
  path: string;
  keyWord: string;
  selectProps: { key: string; value: string }[];
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defautValue = searchParams.get(keyWord);
  const fetchedParams = searchQuery.map((q) => {
    return {
      ParamName: q.ParamName,
      ParamValue:
        searchParams.get(q.ParamName) != null
          ? searchParams.get(q.ParamName)
          : "",
    } as SearchParamType;
  });

  const onSelect = (value: string) => {
    let temp = fetchedParams.filter((q) => q.ParamName != keyWord);
    let tempParam = [
      ...temp,
      { ParamName: keyWord, ParamValue: value },
      ,
      { ParamName: "pageno", ParamValue: "1" },
    ];
    let params: string = "";
    tempParam.map((q) => {
      params += q?.ParamName + "=" + q?.ParamValue + "&";
    });
    router.replace(path + "?" + params);
  };

  return (
    <div className="flex w-full items-center">
      <Select onValueChange={onSelect} defaultValue={defautValue || ""}>
        <SelectTrigger className="flex w-full justify-start gap-x-2 border border-black  bg-gray-800 text-white focus:outline-none outline-none">
          <SelectValue placeholder="Filter Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Category</SelectLabel>
            {selectProps.map((s) => (
              <SelectItem value={s.value}>{s.key}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectFilter;
