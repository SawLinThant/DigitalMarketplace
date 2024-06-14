import { ArrowDown, CheckCircle, Leaf } from "lucide-react";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

import { CreatePost } from "~/app/_components/create-post";
import MaxWidthWrapper from "~/components/MaxWidthWrapper";
import ProductReel from "~/components/ProductReel";
import { Button, buttonVariants } from "~/components/ui/button";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

const perk=[
  {
    name:'Instant Delivery',
    icon: ArrowDown,
    description:'Get your items delievered to your email in seconds and download them right away'
  },
  {
    name:'Guranteed Quality',
    icon: CheckCircle,
    description:'Every asset on our platform is verified by our team for high quality standard',
  },
  {
    name:'For the planet',
    icon: Leaf,
    description:'We have pledge 1% of sale to the preservation and restoration of the nature',
  },
]

export default async function Home() {
  noStore();
 // const hello = await api.post.hello.query({ text: "from tRPC" });
 // const session = await getServerAuthSession();

  return (
    <>
     <MaxWidthWrapper>
      <div className="py-20 m-auto text-center flex flex-col items-center max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Your market place for high quality{" "}
          <span className="text-blue-600">Products</span>.
        </h1>
        <p className="mt-6 text-lg max-w-prose text-muted-foreground">
          welcome to DigitalHippo. Every asset on our platform is verified by
          our team for high quality standard.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Link href="/product" className={buttonVariants()}>Browse Trending</Link>
          <Button variant='ghost'>Our quality promise &rarr;</Button>
        </div>
      </div>

    <ProductReel query={{sort: 'dsc', limit: 4}} title="New Product" subtitle="new" href="/product" />
    </MaxWidthWrapper>
    <section className="border-t border-gray-300 bg-gray-50">
      <MaxWidthWrapper classname="py-20">
        <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-3 lg:gap-y-0">
          {perk.map((perk)=>(
          <div key={perk.name}
               className="text-center md:fex md:items-start md:text-left lg:block lg:text-center"
          >
              <div className="md:flex-shrink-0 flex justify-center sm:mt-5">
                <div className="h-16 w-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-900">
                  {<perk.icon className="w-1/3 h-1/3"/>}
                </div>
              </div>
              <div className="mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mb-6">
                <h3 className="text-base font-medium text-gray-900">{perk.name}</h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  {perk.description}
                </p>
              </div>
          </div>
          ))}
        </div>
      </MaxWidthWrapper>
    </section>
    </>
  );
}

