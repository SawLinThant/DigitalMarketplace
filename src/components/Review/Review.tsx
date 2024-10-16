"use client";

import React from "react";
import MaxWidthWrapper from "../MaxWidthWrapper";
import { api } from "~/trpc/react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import TextArea from "../TextArea";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface IReviewProps {
  comment: string;
  // rating:string
}

const Review = () => {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const product = api.product.getproductById.useQuery({
    id: productId || "",
  });

  const setReview = api.product.addReviewForProudct.useMutation({
    onSuccess: () => {
      toast.success("Comment added successfully");
    },
    onError: () => {
      toast.success("Fail to post comment");
    },
  });

  const { register, handleSubmit } = useForm<any>();

  const onSubmit=handleSubmit(async(credentials:IReviewProps)=>{
      setReview.mutate({
        productId:productId || "",
        comment:credentials.comment
      })
  })

  const urls = product.data?.images
    .map(({ imageUrl }) => (typeof imageUrl === "string" ? imageUrl : imageUrl))
    .filter(Boolean) as string[];
  return (
    <MaxWidthWrapper>
      <div className="flex w-full flex-col  gap-x-9">
        <div className="mt-[20px] flex flex-col rounded-lg  sm:flex-row">
          <Image
            src={product?.data?.images[0]?.imageUrl || ""}
            alt="product-image"
            height={256}
            width={256}
            className=" rounded-md object-cover object-center sm:h-60 sm:w-60"
          />
          <div className="flex flex-col">
            <span className="text-[30px]">{product?.data?.name}</span>
            <div>
              <span className="">{"Price: "}</span>
              <span className="">{product?.data?.price}</span>
            </div>
            <div>
              <span className="">{"Category: "}</span>
              <span className="">{product?.data?.category}</span>
            </div>
            <span>Description</span>
            <span>{product.data?.description}</span>
          </div>
        </div>
        <form className="mt-[10px] flex w-full flex-col items-center gap-y-5 sm:mt-[20px]" onSubmit={onSubmit}>
          <textarea
            placeholder="Comment"
            className="flex h-[200px] w-full rounded-[5px] border-[1px] p-[5px]"
            {...register("comment", {})}
          />
          <button
            className="w-full items-center justify-center rounded-[5px] border-[1px] p-[5px] sm:w-[200px]"
            type="submit"
          >
            {setReview.isLoading ? <>{"...Loading"}</> : <>Submit</>}
          </button>
        </form>
      </div>
    </MaxWidthWrapper>
  );
};

export default Review;
