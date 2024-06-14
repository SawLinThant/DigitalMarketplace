"use client";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import { notFound, redirect } from "next/navigation";
import { getServerSideProps } from "next/dist/build/templates/pages";
import { ProductCategory } from "~/config";
import { useEffect, useState } from "react";
import useCategories from "~/hooks/useCategories";
import { priceFormat } from "~/lib/utils";
import Link from "next/link";
import PaymentStatus from "~/components/PaymentStatus";

interface PageProps {
  searchParams: {
    [key: string]: string | undefined;
  };
}

type Category = {
  id: string;
  category: string;
};

type ImageUrl = {
  productId: string;
  imageUrl: string;
};

const ThankYou = ({ params }: { params: { id: string } }) => {
  const orderId = params.id || "";
  const session = useSession();
  const { data: order, isLoading } = api.payment.getOrderById.useQuery({
    id: orderId ? orderId : "",
  });
  const [categories, setCategories] = useState<{ [key: string]: Category }>({});
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string[] }>({});

  const productIds = order
    ? order.products.map((product) => product.productId)
    : [];
  const { data: fetchedCategories } = api.product.getCategories.useQuery({
    productIds: productIds,
  });
  const { data: fetchedImageUrls } = api.product.getImage.useQuery({
    productIds: productIds,
  });

  useEffect(() => {
    if (fetchedCategories) {
      const categoryMap = fetchedCategories.reduce(
        (acc: any, category) => {
          acc[category.id] = category;
          return acc;
        },
        {} as { [key: string]: Category },
      );
      setCategories(categoryMap);
    } else {
      setCategories({});
    }
  }, [fetchedCategories]);

  useEffect(() => {
    if (fetchedImageUrls && fetchedImageUrls.imageUrls) {
      const imageUrlMap = fetchedImageUrls.imageUrls.reduce(
        (acc: any, { productId, imageUrl }: ImageUrl) => {
          if (!acc[productId]) {
            acc[productId] = [imageUrl]; // Initialize with the first image URL
          } else {
            acc[productId].push(imageUrl); // Add subsequent image URLs
          }
          return acc;
        },
        {} as { [key: string]: string[] },
      );
      setImageUrls(imageUrlMap);
    } else {
      setImageUrls({});
    }
  }, [fetchedImageUrls]);

  const totalOrderPrice = order?.products.reduce((total,product) => {
    return total + parseInt(product.productPrice)
  },0) 

 // const totalOrderPrice = order?.products.map((product)=> setTotalPrice(totalPrice+ parseInt(product.productPrice)));

  //   const orderUserId = order.data?.buyerId;
  //   if (orderUserId !== session.data?.user.id) {
  //     return redirect(`/pages/login?origin=thank-you?orderId=${orderId}`);
  //   }

  return (
    <main className="relative lg:min-h-full">
      <div className="hidden h-80 overflow-hidden lg:absolute lg:block lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12">
        <Image
          src="/checkout-thank-you.jpg"
          fill
          className="h-full w-full object-cover object-center"
          alt="thank you for your order"
        />
      </div>

      <div>
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:py-32 xl:gap-x-24">
          <div className="lg:col-start-2">
            <h1 className="text-sm font-medium text-blue-600">
              Order Successful
            </h1>
            <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900">
              Thanks for ordering
            </p>
            {order?.paidStatus ? (
              <p className="mt-2 text-base text-muted-foreground">
                Your Order was processed and your products are avaiable to
                download below.We&apos;ve sent your receipt and order details to{" "}
                <span className="font-medium text-gray-900">
                  {session.data?.user.email}
                </span>
              </p>
            ) : (
              <p className="mt-2 text-base text-muted-foreground">
                We appreciate your order, and we&apos;re currently processing
                it. So, we&apos;ll send you confirmation very soon
              </p>
            )}

            <div className="mt-16 text-sm font-medium">
              <div className="text-muted-foreground">Order nr.</div>
              <div className="mt-2 text-gray-900">{orderId}</div>

              <ul className="mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-muted-foreground">
                {order?.products ? (
                  order?.products.map((product) => {
                    // const productDetail = api.product.getproductById.useQuery({id: product.productId})
                    const label = ProductCategory.find(
                      ({ value }) =>
                        value === categories[product.productId]?.category,
                    )?.label;
                    const imageUrl = imageUrls[product.productId]?.[0];
                    return (
                      <li
                        key={product.productId}
                        className="flex space-x-6 py-6"
                      >
                        <div className="relative h-24 w-24">
                          {imageUrls[product.productId] ? (
                            <Image
                              className="flex-none rounded-md bg-gray-100 object-cover object-center"
                              src={imageUrl ? imageUrl : ""}
                              alt={
                                categories[product.productId]?.category ||
                                "Product"
                              }
                              fill
                            />
                          ) : null}
                        </div>
                        <div className="flex flex-auto flex-col justify-between">
                          <div className="space-y-1">
                            <h3 className="text-gray-900">
                              {product.productName}
                            </h3>

                            <p className="my-1">Category: {label}</p>
                          </div>
                          {order.paidStatus ? (
                            <a
                              href=""
                              className="text-blue-600 underline-offset-2 hover:underline"
                              download={product.productName}
                            >
                              Download Product Receipt
                            </a>
                          ) : null}
                        </div>
                        <p className='flex-none font-medium text-gray-900'>
                          {priceFormat(parseInt(product.productPrice))}
                        </p>
                      </li>
                    );
                  })
                ) : (
                  <div>no product</div>
                )}
              </ul>
              <div className="space-y-6 border-t border-gray-200 pt-6 text-sm font-medium">
                <div className="flex justify-between">
                  <p>Subtotal</p>
                  <p className="text-gray-900">{priceFormat(totalOrderPrice? totalOrderPrice: 0)}</p>
                </div>
                <div className="flex justify-between">
                  <p>Transaction Fee</p>
                  <p className="text-gray-900">{priceFormat(1)}</p>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 text-gray-900">
                  <p className="text-base">Total</p>
                  <p className="text-base">{priceFormat(totalOrderPrice? totalOrderPrice+1: 0+1)}</p>
                </div>
              </div>

              <PaymentStatus isPaid={order?.paidStatus? order.paidStatus: false} orderEmail={session.data?.user.email?session.data.user.email: ""} orderId={order?.id?order.id: ""}/>

              <div className="mt-16 border-t border-gray-200 py-6 text-right">
                <Link href='/pages/products' className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Continue Shopping &rarr; </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
export default ThankYou;
