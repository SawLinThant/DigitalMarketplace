"use client";
import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import NavItems from "./Navitems";
import { buttonVariants } from "./ui/button";
import Cart from "./Cart";
import { Icons } from "./Icons";
import MobileNav from "./MobileNav";
import { getServerAuthSession } from "~/server/auth";
import UserAccountNav from "./UserAccountNav";
import { signOut, useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import Image from "next/image";

const NavBar = () => {
  const session = useSession();

  const userType = session?.data?.user?.userType;
  

  const user = session?.data?.user?.username;
  return (
    <div className="z-[100] sticky inset-x-0 top-0 h-16 bg-white">
      <header className="relative bg-white">
        <MaxWidthWrapper>
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center">
              <MobileNav />
              <div className="ml-4 flex lg:ml-0">
                <Link href="/">
                  <Image
                    src="/MyLogo.png"
                    height={256}
                    width={256}
                    className="h-[80px] w-[80px] object-cover object-center"
                    alt="thank you for your order"
                  />
                </Link>
              </div>
              <div className=" hidden lg:ml-8 lg:block lg:self-stretch">
                <NavItems />
              </div>
              <div className="ml-auto flex items-center">
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                  {user ? null : (
                    <Link
                      href="/pages/login"
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      Sign In
                    </Link>
                  )}
                  {user ? null : (
                    <span
                      className="h-6 w-px bg-gray-200"
                      aria-hidden="true"
                    ></span>
                  )}
                  {user ? (
                    <UserAccountNav user={user} userType={userType} />
                  ) : (
                    <Link
                      href="/pages/register"
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      Create Account
                    </Link>
                  )}
                  {user ? (
                    <span
                      className="h-6 w-px bg-gray-200"
                      aria-hidden="true"
                    ></span>
                  ) : null}
                  {user ? null : (
                    <div className="flex lg:ml-6">
                      <span
                        className="h-6 w-px bg-gray-200"
                        aria-hidden="true"
                      ></span>
                    </div>
                  )}
                  <div className="ml-4 flow-root lg:ml-6">
                    <Cart />
                  </div>
                  <div className="ml-4 flow-root lg:ml-6">
                    <Link href={'/pages/order/list'}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6 cursor-pointer stroke-gray-400 hover:stroke-black"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
    </div>
  );
};
export default NavBar;
