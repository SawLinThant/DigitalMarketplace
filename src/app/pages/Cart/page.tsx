"use client";
import { Check, Loader2, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

import { ProductCategory } from "~/config";
import { useCart } from "~/hooks/use-cart";
import { cn, priceFormat } from "~/lib/utils";
import { api } from "~/trpc/react";

interface IBillingProps {
  billingAddress: string;
  billingEmail: string;
  billingPhone: string;
}

const Page = () => {
  const { items, removeItem } = useCart();
  const [isMounted, setisMounted] = useState<boolean>(false);
  const router = useRouter();
  const session = useSession();

  const { mutate: createCheckoutSession, isLoading } =
    api.payment.createSession.useMutation({
      onSuccess: ({ url }) => {
        if (url) {
          router.push(url);
          console.log(url);
        }
      },
      onError: async (error, variable, rollback) => {
        console.log("Error creating in checkout url", error);
      },
    });

  const productId = items.map(({ product }) => product.id);

  useEffect(() => {
    setisMounted(true);
  }, []);
  //console.log(items.length)

  const cartTotal = items.reduce(
    (total, { product }) => total + parseInt(product.price),
    0,
  );

  const { register, handleSubmit } = useForm<IBillingProps>();

  const orderSubmitHandler = handleSubmit(
    async (credentials: IBillingProps) => {
      if (!session?.data?.user) {
        toast.error("Login first to checkout");
      } else {
        createCheckoutSession({
          productId: productId,
          billingAddress: credentials.billingAddress,
          billingEmail: credentials.billingEmail,
          billingPhone: credentials.billingPhone,
        });
      }
    },
  );

  const fee: number = 1;
  return (
    <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Shopping Cart
      </h1>
      <div className="mt-12 flex flex-col sm:flex-row lg:items-start lg:gap-x-12 xl:gap-x-16">
        <div
          className={cn("w-full", {
            "rounded-lg border-2 border-dashed":
              isMounted && items.length === 0,
          })}
        >
          <h2 className="sr-only">Items in your shopping cart</h2>
          {isMounted && items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center space-y-1">
              <div
                aria-hidden="true"
                className="relative mb-4 h-40 w-40 text-muted-foreground"
              >
                <Image
                  src="/hippo-empty-cart.png"
                  fill
                  loading="eager"
                  alt="empty shopping cartd hippo"
                />
              </div>
              <h3 className="text-2xl font-semibold">Your cart is empty</h3>
              <p className="text-center text-muted-foreground">
                Whoops! Nothing to show here yet
              </p>
            </div>
          ) : null}
          <ul
            className={cn("", {
              "divide-y divide-gray-200 border-b border-t border-gray-200":
                isMounted && items.length > 0,
            })}
          >
            {isMounted &&
              items.map(({ product }) => {
                const label = ProductCategory.find(
                  (c) => c.value === product.category,
                )?.label;
                const image = product.images[0]?.image;
                const imageSrc = typeof image === "string" ? image : image?.url;
                //console.log(imageSrc);

                return (
                  <li key={product.id} className="flex py-6 sm:py-10">
                    <div className="flex-shrink-0">
                      <div className="relative h-24 w-24">
                        {imageSrc ? (
                          <div>
                            <Image
                              fill
                              src={imageSrc}
                              alt="product-image"
                              className="h-full w-full rounded-md object-cover object-center sm:h-48 sm:w-48"
                            />
                          </div>
                        ) : (
                          <div>No product</div>
                        )}
                      </div>
                    </div>
                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                      <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-sm">
                              <Link
                                href={`product/${product.id}`}
                                className="font-medium text-gray-700 hover:text-gray-800"
                              >
                                {product.name}
                              </Link>
                            </h3>
                          </div>
                          <div className="mt-1 flex text-sm">
                            <p className="text-muted-foreground">
                              Category: {label}
                            </p>
                          </div>
                          <p className="mt-1 text-sm font-medium text-gray-900">
                            {priceFormat(parseInt(product.price))}
                          </p>
                        </div>
                        <div className="mt-4 w-20 sm:mt-0 sm:pr-9">
                          <div className="absolute right-0 top-0">
                            <Button
                              aria-label="remove product"
                              onClick={() => removeItem(product.id)}
                              variant="ghost"
                            >
                              <X className="h-5 w-5" aria-hidden="true"></X>
                            </Button>
                          </div>
                        </div>
                      </div>
                      <p className="mt-4 flex space-x-2 text-sm text-gray-700">
                        <Check className="h-5 w-5 flex-shrink-0 text-gray-500" />
                        <span>Eligible for instant delivery</span>
                      </p>
                    </div>
                  </li>
                );
              })}
          </ul>
        </div>
        <form className=" flex w-full flex-col gap-x-2 gap-y-4">
          <div className="mt-16 flex w-full flex-col rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:mt-0 lg:p-8">
            <h2 className="text-lg font-medium text-gray-900">Billing Info</h2>
            <div className="mt-6 space-y-4">
              <Input
                placeholder="Billing Address"
                {...register("billingAddress", {
                  required: "Email is required",
                })}
              />
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <Input
                  type="email"
                  placeholder="Billing Email"
                  {...register("billingEmail", {
                    required: "Email is required",
                  })}
                />
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <Input
                  placeholder="Billing Phone"
                  {...register("billingPhone", {
                    required: "Email is required",
                  })}
                />
              </div>
            </div>
          </div>
          <div className=" rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Subtotal</p>
                <p className="text-sm font-medium text-gray-900">
                  {isMounted ? (
                    priceFormat(cartTotal)
                  ) : (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>Flat Transaction Fee</span>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {isMounted ? (
                    priceFormat(fee)
                  ) : (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="text-base font-medium text-gray-900">
                  Order Total
                </div>
                <div className="text-base font-medium text-gray-900">
                  {isMounted ? (
                    priceFormat(cartTotal + fee)
                  ) : (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Button
                type="submit"
                disabled={items.length === 0 || isLoading}
                onClick={orderSubmitHandler}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : null}
                Checkout
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Page;
