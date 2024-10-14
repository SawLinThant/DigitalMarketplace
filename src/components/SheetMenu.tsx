"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "~/components/ui/sheet";
import { useSideBar } from "~/hooks/sidebar-context";


const SheetMenu = () => {
  const router = useRouter();
  const { collapse, routes } = useSideBar();
  const onSelect = (id: string, path: string) => {
    routes.map((r) => {
      if (r.route.id === id) {
        // r.selected[1](true);
        r.setSelected(true);
      } else {
        // r.selected[1](false);
        r.setSelected(false);
      }
    });
    // collapse[1](false);
    router.push(`${path}`);
  };
  const handleLogOut = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };
  return (
    <Sheet key={"left"}>
      <SheetTrigger asChild>
        <div
          className="bg-blue flex w-[70px] items-center  text-white"
          // onClick={() => collapse[1](true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-8 w-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
            />
          </svg>
        </div>
      </SheetTrigger>

      <SheetContent
        side={"left"}
        className="w-full bg-[#687887] px-0 md:w-[250px]"
      >
        <div className=" flex w-full  flex-col bg-[#687887] pt-10">
          {routes.map((route) => (
            <div
              className={`ml-[20px] flex cursor-pointer flex-row items-center justify-center  ${route?.selected[0] ? "border-0 text-white" : "text-[#A2ACB5]"}`}
              onClick={() => onSelect(route?.route?.id, route?.route?.path)}
            >
              <SheetClose className="flex h-[50px] w-full flex-row items-center justify-center ">
                <div className="flex w-full flex-row items-center gap-x-2">
                  {route?.route?.icon}
                  {route?.route?.label}
                  <div
                    className={`absolute right-0 flex h-[50px] w-[10px] ${route?.selected[0] ? "bg-green-300" : "bg-[#687887]"}`}
                  ></div>
                </div>
              </SheetClose>
            </div>
          ))}
          <div
            className={`ml-[20px] flex cursor-pointer flex-row items-center justify-center border-0  text-white hover:text-gray-700`}
            onClick={() => handleLogOut()}
          >
            <SheetClose className="flex h-[50px] w-full flex-row items-center justify-center ">
              <div className="flex w-full flex-row items-center gap-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                  />
                </svg>
                Logout
                <div
                  className={`absolute right-0 flex h-[50px] w-[10px] `}
                ></div>
              </div>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SheetMenu;
