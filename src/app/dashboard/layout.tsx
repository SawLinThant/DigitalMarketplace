'use client'

import { Suspense } from "react";
import MobileNav from "~/components/MobileNav";
import SheetMenu from "~/components/SheetMenu";
import SideBarNav from "~/components/SidebarNav";
import isAdmin from "~/hoc/isAdmin";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-bg-sidebar flex w-full flex-col">
      <div className="top-0 flex w-full flex-row items-center justify-center bg-black px-5 py-5">
        <div className=" absolute left-3">
          <SheetMenu />
        </div>
        <span className="text-pretty font-sans text-[30px] font-bold text-white">
          Admin Dashboard
        </span>
      </div>
      <Suspense>
        <div className="flex w-full flex-col">{children}</div>
      </Suspense>
    </div>
  );
};

export default isAdmin(layout) ;
