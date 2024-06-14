"use client"

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { userType } from "~/config";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./ui/command";
import { cn } from "~/lib/utils";

const ComboBox= ({checkBoxHandler}:any)=>{
   const [open,setOpen]=useState<boolean> (false);
   const [value,setValue]=useState<string> ("");
   

   return(
    <Popover>
      <PopoverTrigger asChild>
         <Button
         variant="outline"
         role="combobox"
         aria-expanded={open}
         className="w-full justify-between"
         >
            {value? userType.find((usertype)=>usertype.value===value)?.label:"Select User Type..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
         </Button>
      </PopoverTrigger>

      <PopoverContent>
         <Command>
            <CommandInput placeholder="Select User Type"/>
            <CommandEmpty>No User Type Found</CommandEmpty>
            <CommandGroup>
            {userType.map((userType) => (
              <CommandItem
                key={userType.value}
                value={userType.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue)
                  setOpen(false)
                  checkBoxHandler(userType.value)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === userType.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {userType.label}
              </CommandItem>
            ))}
            </CommandGroup>
         </Command>
      </PopoverContent>
    </Popover>
   )
}
export default ComboBox;