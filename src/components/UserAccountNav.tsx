"use client"

import { MarketplaceUser } from "~/types/global";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/react";


const UserAccountNav = ({user,userType}:any) => {
  
  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,    
    });
    console.log("logout");
  };

  // const session = await getServerAuthSession();

  // const users= api.user.getOneUser.useQuery({id:session?.user?.id})

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="overflow-visible">
        <Button variant="ghost" size="sm" className="relative">
          My account
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-60 bg-white" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-0.5 leading-none">
            <p className="text-sm font-medium text-black">{user}</p>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
         {userType==="seller"?(<Link href="/pages/productform">Sellar Dashboard</Link>):<Link href="/">Account</Link>} 
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default UserAccountNav;
