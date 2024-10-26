"use client"

import { Menu, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PRODUCT_CATEGORIES } from "~/config";
import Cart from "./Cart";

// export async function getServerSideProps({ req, res }:any) {
//   return {
//     props: {
//       session: await getServerSession(req, res, authOptions)
//     }
//   }
// }

const MobileNav =  () => {
  const [isOpen, setIsOpen] = useState<boolean | null>(false);
  const pathname = usePathname();

  //const { data: session } = useSession();
  const session=useSession();

  const user = session?.data?.user;
  const username= session?.data?.user?.username;

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,    
    });
    console.log("logout");
  };

  //cloase the menu when an item is clicked
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const closeOnCurrent = (href: string) => {
    if (pathname === href) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isOpen]);

  if (!isOpen)
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 lg:hidden"
      >
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>
    );

  return (
    <div>
      <div className="relative z-40 lg:hidden">
        <div className="fixed inset-0 bg-black bg-opacity-25"></div>
      </div>

      <div className="fixed inset-0 z-40 flex overflow-y-scroll overscroll-y-none">
        <div className="w-4/5">
          <div className="relative flex w-full max-w-sm flex-col overflow-y-auto bg-white pb-12 shadow-xl">
            <div className="flex px-4 pb-2 pt-5">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-2">
              <ul>
                {PRODUCT_CATEGORIES.map((category) => (
                  <li
                    key={category.label}
                    className="space-y-10 px-4 pb-8 pt-10"
                  >
                    <div className="border-b border-gray-200">
                      <div className="-mb-px flex">
                        <p className="flex-1 whitespace-nowrap border-b-2 border-transparent py-4 text-base font-medium text-gray-900">
                          {category.label}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-10">
                      {category.details.map((item) => (
                        <div key={item.name} className="group relative text-sm">
                          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                            <Image
                              fill
                              src={item.imageSrc}
                              alt="category image"
                              className="object-cover object-center"
                            />
                          </div>
                          <Link
                            href="/pages/product/list"
                            className="mt-6 block font-medium text-gray-900"
                          >
                            {item.name}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              {user ? username : (
                <div className="flow-root">
                  <Link
                    onClick={() => closeOnCurrent("/login")}
                    href="/pages/login"
                    className="-m-2 block p-2 font-medium text-gray-900"
                  >
                    Sign In
                  </Link>
                </div>
              )}

              {user ? (
                <div className="flow-root">
                <Link
                  onClick={handleLogout}
                  href="/pages/register"
                  className="-m-2 block p-2 font-medium text-gray-900"
                >
                  Logout
                </Link>
              </div>
              )
               : (
                <div className="flow-root">
                  <Link
                    onClick={() => closeOnCurrent("/register")}
                    href="/pages/register"
                    className="-m-2 block p-2 font-medium text-gray-900"
                  >
                    Sign up
                  </Link>
                </div>          
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MobileNav;

