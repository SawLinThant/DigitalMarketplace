"use client";

import { useRouter, useSearchParams } from "next/navigation";

import React, { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import Image from "next/image";
import MaxWidthWrapper from "~/components/MaxWidthWrapper";

const OrderDetailPage = () => {
  const searchParam = useSearchParams();
  const orderId = searchParam.get("id");
  const [isMounted, setisMounted] = useState<boolean>(false);
  const orderDetail = api.order.getOrderById.useQuery({
    id: orderId || "",
  });
  const router = useRouter();

  useEffect(() => {
    setisMounted(true);
  }, []);
  return (
    <MaxWidthWrapper>
      <div className="mx-auto  w-full px-4 pb-24 pt-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Order Detail
        </h1>
        <div className="mt-12 flex flex-col sm:flex-row lg:items-start lg:gap-x-12 xl:gap-x-16">
          <div className="flex w-full flex-col">
            <span className="text-[30px]">Order ID:</span>
            <span className="text-[25px] text-gray-500">#{orderId}</span>
            <span className="text-[15px] text-black">
              Status: {orderDetail.data?.status}
            </span>
            <div className="mt-[20px] flex w-full flex-col gap-y-2">
              {orderDetail.data?.products.map(
                (orderItem, index: number) => {
                  return (
                    <>
                      <div
                        className="flex w-full  rounded-[5px] border-[1px] p-[10px] shadow-lg"
                        key={index}
                      >
                        <div className="flex w-full">
                          <Image
                            src={orderItem.products.images[0]?.imageUrl || ""}
                            alt="product-image"
                            height={256}
                            width={256}
                            className=" rounded-md object-cover object-center sm:h-48 sm:w-48"
                          />
                        </div>
                        <div className="relative flex w-full flex-col">
                          <span className="text-[30px]">
                            {orderItem?.productName}
                          </span>
                          <div className="flex items-center">
                            <span>${orderItem?.productPrice}</span>
                            <span className="text-[12px] text-gray-500">&nbsp;{"/per-item"}</span>
                          </div>
                          <span className="">
                            Quantity:&nbsp;{orderItem?.quantity}
                          </span>
                          <div className="absolute bottom-2">
                            <button
                              className="rounded-[5px] bg-black px-[8px] py-[5px] text-white"
                              onClick={() =>
                                router.push(
                                  `/pages/product/review?id=${orderItem.productId}`,
                                )
                              }
                            >
                              Review Prodcut
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                },
              )}
            </div>
          </div>
          <form className=" flex w-full flex-col gap-x-2 gap-y-4">
            <div className=" rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
              <h2 className="text-lg font-medium text-gray-900">
                Order summary
              </h2>
              <div className="mt-6 space-y-4">
                <div className="flex flex-col items-start justify-between">
                  <p className="text-sm text-gray-800">Billing Address</p>
                  <p className="text-gray-600">
                    {orderDetail.data?.billingInfo?.billingAddress || "--"}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <div className="flex flex-col items-start justify-between">
                    <p className="text-sm text-gray-800">Billing Email</p>
                    <p className="text-gray-600">
                      {orderDetail.data?.billingInfo?.billingEmail || "--"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <div className="flex flex-col items-start justify-between">
                    <p className="text-sm text-gray-800">Billing Phone</p>
                    <p className="text-gray-600">
                      {orderDetail.data?.billingInfo?.billingPhone || "--"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default OrderDetailPage;
