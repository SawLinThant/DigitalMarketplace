"use client";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { api } from "~/trpc/react";
import Link from "next/link";
import { cn, priceFormat } from "~/lib/utils";
import { clearTimeout, setTimeout } from "timers";
import { Product } from "~/types/global";
import { ProductCategory } from "~/config";
import ImageSlider from "./ImageSlider";
import { boolean } from "zod";

interface Productprops {
  product: Product | null;
  index: number;
}

const ProductComponent = ({ product, index }: Productprops) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  
  //to show the product one by one withdelay
  useEffect(()=>{
    const timer= setTimeout(()=>{
      setIsVisible(true);
    }, index * 75)

    return ()=> clearTimeout(timer);
  },[index])

  const Productpaceholder = () => {
    return (
      <div className="flex w-full flex-col">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-100">
          <Skeleton className="h-full w-full" />
        </div>
        <Skeleton className="mt-4 h-4 w-2/3 rounded-lg" />
        <Skeleton className="mt-4 h-4 w-16 rounded-lg" />
        <Skeleton className="mt-4 h-4 w-16 rounded-lg" />
        <Skeleton className="mt-4 h-4 w-12 rounded-lg" />
      </div>
    );
  };

  if ( !product || !isVisible) return <Productpaceholder />;
  // if(true) return <Productpaceholder/>
  const validUrls = product.images.map(({image})=> typeof image === 'string' ? image: image.url ).filter(Boolean) as string[]
  // console.log(validUrls.length);
  // console.log(validUrls);
  const label=ProductCategory.find(({value})=> value === product.category)?.label;

  if (isVisible && product)
    return (
      <Link
        className={cn("h-f group/main invisible w-full cursor-pointer", {
          "animated-in visible fade-in-5": isVisible,
        })}
        href={`pages/product/${product.id}`}
      >
        <div className="flex flex-col w-full">
          <ImageSlider urls={validUrls}/>
          <h3 className="mt-4 font-medium text-sm text-gray-700">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{label}</p>
          <p className="mt-1 font-medium text-sm text-gray-900"><span>{priceFormat(product.price)}</span></p>
        </div>
      </Link>
    );
};
export default ProductComponent;
