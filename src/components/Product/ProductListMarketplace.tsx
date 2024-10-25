import React from "react";
import { Product } from "~/types/global";
import { Skeleton } from "../ui/skeleton";
import ProductComponent from "../Product";

interface IProductListProp {
  products: Product[];
  isLoading?: boolean;
}

const Productplaceholder = () => {
  return (
    <div className="flex w-full items-center justify-center gap-x-2">
      {Array(4)
        .fill(0)
        .map((_, index) => {
          return (
            <>
              <div className="w-[200px]" key={index}>
                <div className="flex w-full flex-col">
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-100">
                    <Skeleton className="h-full w-full" />
                  </div>
                  <Skeleton className="mt-4 h-4 w-2/3 rounded-lg" />
                  <Skeleton className="mt-4 h-4 w-16 rounded-lg" />
                  <Skeleton className="mt-4 h-4 w-16 rounded-lg" />
                  <Skeleton className="mt-4 h-4 w-12 rounded-lg" />
                </div>
              </div>
            </>
          );
        })}
    </div>
  );
};

const ProductListMarketplace = (props: IProductListProp) => {
  return (
    <div className="mt-[20px] flex w-full gap-x-4 gap-y-4">
      {props.isLoading && <Productplaceholder />}
      {!props.isLoading && (
        <>
          {props.products.map((product, index) => {
            return (
              <div className="w-[200px]">
                <ProductComponent
                  index={index}
                  product={product}
                  key={`product-${index}`}
                />
              </div>
            );
          })}
        </>
      )}
      {!props.isLoading && props.products.length < 1 && (
        <>
          <div className="flex w-full items-center justify-center">
            <span>Currently No products</span>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductListMarketplace;
