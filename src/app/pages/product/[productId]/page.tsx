"use client";
import { product } from "@prisma/client";
import { Check, Shield } from "lucide-react";
import Link from "next/link";
import AddToCartButton from "~/components/AddToCartButton";
import ImageSlider from "~/components/ImageSlider";
import MaxWidthWrapper from "~/components/MaxWidthWrapper";
import ProductReel from "~/components/ProductReel";
import { ProductCategory } from "~/config";
import { priceFormat } from "~/lib/utils";
import { api } from "~/trpc/react";
import { Product } from "~/types/global";

interface PageProps {
  params: {
    productId: string;
  };
}



const BREADCRUMBS = [
  { id: 1, name: "Home", href: "/" },
  { id: 1, name: "Products", href: "/products" },
];

const Page = ({ params }: PageProps) => {
  const { productId } = params;

  const {data:productInfo, isLoading} = api.product.getproductById.useQuery({
    id: productId,
  });

  const transformedProductInfo = (productInfo: any): Product | null => {
    if(!productInfo) return null
    return{
      id: productInfo.id,
      name: productInfo.name,
      category: productInfo.category,
      description: productInfo.description,
      price: productInfo.price,
      sellerName: productInfo.sellerName,
      images: productInfo.images.map((img: any) => ({
        image: img.imageUrl,
        id: img.id,
      })),
    }
  }

  const transformedProduct= transformedProductInfo(productInfo);

  if(!transformedProduct) return <div>Loading</div>

  if(isLoading) return <div>Loading</div>

  const productName = productInfo?.name;
  const price = productInfo?.price;
  const updatedPrice: string = price === undefined ? "" : price;

  const label = ProductCategory.find(
    ({ value }) => value === productInfo?.category,
  )?.label;

  const urls = productInfo?.images.map(({imageUrl})=> typeof imageUrl === 'string'? imageUrl: imageUrl ).filter(Boolean) as string[];
  console.log(urls);

  return (
    <MaxWidthWrapper classname="bg-white">
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          {/* product details */}
          <div className="lg:max-w-lg lg:self-end">
            <ol className="flex items-center space-x-2">
              {BREADCRUMBS.map((breadcrumbs, i) => (
                <li key={breadcrumbs.href}>
                  <div className="flex items-center text-sm">
                    <Link
                      href={breadcrumbs.href}
                      className="text-sm font-medium text-muted-foreground hover:text-gray-900"
                    >
                      {breadcrumbs.name}
                    </Link>
                    {i !== BREADCRUMBS.length - 1 ? (
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        className="ml-2 h-5 w-5 flex-shrink-0 text-gray-300"
                      >
                        <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                      </svg>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-4">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {productName}
              </h1>
            </div>
            <section className="mt-4">
              <div className="flex items-center">
                <p>{priceFormat(parseInt(updatedPrice))}</p>
                <div className="border-1 ml-4 border-gray-300 pl-4 text-muted-foreground">
                  {label}
                </div>
              </div>

              <div className="mt-4 space-y-6">
                <p className="text-base text-muted-foreground">
                  {productInfo?.description}
                </p>
              </div>
              <div className="mt-6 flex items-center">
                <Check
                  aria-hidden="true"
                  className="h-5 w-5 flex-shrink-0 text-green-500"
                />
                <p className="ml-2 text-sm text-muted-foreground">
                  Eligible for instant delivery
                </p>
              </div>
            </section>
          </div>

          {/*product images */}
          <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
            <div className="aspect-square rounded-lg">
                <ImageSlider urls={urls}/>
            </div>
          </div>
          {/*Add to cart */}
          <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
            <div>
              <div className="mt-10">
                <AddToCartButton product={transformedProduct}/>
              </div>
              <div className="mt-6 text-center">
                <div className="group inline-flex text-sm text-medium">
                  <Shield aria-hidden="true" className="mr-2 h-5 w-5 flex-shrink-0 text-gray-400" />
                  <span className="text-muted-foreground hover:text-gray-700">30 Day Return Gurantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProductReel title={`Similar ${label}`} subtitle={`Browse Similar high-quality ${label}`} href="/" query={{category: productInfo?.category, limit:4}} />
    </MaxWidthWrapper>
  );
};
export default Page;
