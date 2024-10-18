"use client";

import React, { useEffect, useState } from "react";
import MaxWidthWrapper from "../MaxWidthWrapper";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";

const AdminOrderDetail = () => {
  const searchParam = useSearchParams();
  const orderId = searchParam.get("id");
  const [isMounted, setisMounted] = useState<boolean>(false);
  const orderDetail = api.order.getOrderById.useQuery({
    id: orderId || "",
  });
  const router = useRouter();
  const [orderStatus, setOrderStatus] = useState<string>(
    orderDetail?.data?.status || "",
  );
  useEffect(() => {
    setOrderStatus(orderDetail.data?.status || "");
  }, [orderDetail.data]);

  const updateOrderStatus = api.order.changeOrderStatus.useMutation({
    onError: () => {
      toast("Order status update fail");
    },
    onSuccess: () => {
      toast("Order status updated successfully");
    },
  });

  const onSubmitStatus = (event: any) => {
    event.preventDefault();
    updateOrderStatus.mutate({
      orderId: orderId || "",
      status: orderStatus,
    });
  };

  return (
    <MaxWidthWrapper>
      <div className="flex w-full flex-col items-center">
        <div className="mx-auto  w-full px-4 pb-24 pt-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Order Detail
          </h1>
          <div className="mt-12 flex flex-col sm:flex-row lg:items-start lg:gap-x-12 xl:gap-x-16">
            <div className="flex w-full flex-col">
              <span className="text-[30px]">Order ID:</span>
              <span className="text-[25px] text-gray-500">#{orderId}</span>
              <div className="mt-[20px] flex w-full flex-col">
                {orderDetail.data?.products.map(
                  (orderItem: any, index: number) => {
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
                              <span className="text-[12px] text-gray-500">
                                &nbsp;{"/per-item"}
                              </span>
                            </div>
                            <span className="">
                              Quantity:&nbsp;{orderItem?.quantity}
                            </span>

                            {/* <div className="absolute bottom-2">
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
                            </div> */}
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
                  <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <div className="flex flex-col items-start justify-between gap-y-1">
                      <p className="text-sm text-gray-800">Order Status</p>
                      <Select
                        onValueChange={(value) => setOrderStatus(value)}
                        value={orderStatus}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="set status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Status</SelectLabel>
                            <SelectItem value="processing">
                              Processing
                            </SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center justify-between  border-gray-200 pt-4">
                    <div className="flex w-full flex-col items-center justify-center">
                      <button
                        className="flex h-[40px] w-[100px] items-center justify-center rounded-[5px] bg-black p-[7px] text-[12px] text-white"
                        type="button"
                        onClick={onSubmitStatus}
                      >
                        {updateOrderStatus?.isLoading ? (
                          <>
                            <div role="status">
                              <svg
                                aria-hidden="true"
                                className="size-4 animate-spin fill-green-600 text-gray-200 dark:text-gray-600"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                  fill="currentColor"
                                />
                                <path
                                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                  fill="currentFill"
                                />
                              </svg>
                              <span className="sr-only">Loading...</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <span>Save Changes</span>
                          </>
                        )}
                      </button>
                      <button
                        className="underline"
                        onClick={() => router.push("/dashboard/order/list")}
                        type="button"
                      >
                        back
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default AdminOrderDetail;
