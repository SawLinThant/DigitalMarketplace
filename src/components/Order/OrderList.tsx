"use client";

import React from "react";
import { api } from "~/trpc/react";
import { Skeleton } from "../ui/skeleton";
import MaxWidthWrapper from "../MaxWidthWrapper";
import { useRouter } from "next/navigation";


const OrderList = () => {
  const orderList = api.order.getAllUserOrders.useQuery({});
  const router = useRouter();
  return (
    <div className="mt-[20px] flex w-full flex-col items-start">
      {orderList.isLoading && (
        <>
          <MaxWidthWrapper>
            <div className="flex flex-col gap-y-2">
              <Skeleton className="h-[100px] w-full" />
              <Skeleton className="h-[100px] w-full" />
            </div>
          </MaxWidthWrapper>
        </>
      )}
      {!orderList.isLoading && (
        <>
          <MaxWidthWrapper>
            <div className="flex h-[80vh] flex-col gap-y-2 overflow-y-auto">
              {orderList.data?.map((order, index) => (
                <>
                  <div
                    className="flex w-full flex-col gap-y-2 border-[1px] p-[10px] sm:flex-row"
                    key={index + order?.id}
                  >
                    <div className="flex flex-col">
                      <span>Order ID</span>
                      <span>{order.id}</span>
                    </div>
                    <div className="flex w-full justify-center sm:justify-end">
                      <button
                        className="w-full rounded-[5px] border-[1px] bg-black p-[10px] text-white sm:w-auto"
                        onClick={() =>
                          router.push(`/pages/order/detail?id=${order.id}`)
                        }
                      >
                        View Detail
                      </button>
                    </div>
                  </div>
                </>
              ))}
            </div>
          </MaxWidthWrapper>
        </>
      )}
    </div>
  );
};

export default OrderList;
