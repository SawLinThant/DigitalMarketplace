"use client"
import Link from "next/link";
import ProductComponent from "./Product";
import { api } from "~/trpc/react";
import { TQueryValidator } from "~/lib/validators/query-validator";
import { Product } from "~/types/global";

interface ProductReelProps {
  title?: string;
  subtitle?: string;
  href?: string;
  query: TQueryValidator
}

const FALLBACK_LIMIT=4;

const ProductReel = (props: ProductReelProps) => {
  const { title, subtitle, href, query } = props;
  const {data: queryResult, isLoading} = api.product.getProducts.useInfiniteQuery({
    limit: query.limit ?? FALLBACK_LIMIT,
    query,
  },{
    getNextPageParam: (lastPage:any) => lastPage.nextPage
  });

  const products = queryResult?.pages.flatMap((page) => page.products);

  let map: (Product | null)[]=[];
  if (products && products?.length){
    map=products.map((product)=>{return{
      ...product,
       price:product.price?.toString() || ""
    }})
  }else if(isLoading){
    map = new Array<null>(query.limit ?? FALLBACK_LIMIT).fill(null)
  }
 
  return (
    <section className="py-12">
      <div className="mb-4 md:flex md:items-center md:justify-between">
        <div className="max-w-2xl px-4 md:max-w-4xl lg:px-0">
          {title ? (
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {title}
            </h1>
          ) : null}
          {subtitle ? (
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        {href ? (
          <Link href={href} className="hidden text-sm font-medium text-blue-600 hover:text-blue-500 md:block">
            View All Products <span aria-hidden="true">&rarr;</span>
          </Link>
        ) : null}
      </div>
      <div className="relative">
        <div className="mt-6 flex items-center w-full">
            <div className="w-full grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-10 md:gap-x-8">
              {map.map((product,i)=>(
                <ProductComponent key={`product-${i}`} product={product} index={i}/>
              ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default ProductReel;
