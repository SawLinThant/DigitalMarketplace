"use client"

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ProductCategory, userType } from "~/config";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./ui/command";
import { cn } from "~/lib/utils";

const ProductComboBox= ({checkBoxHandler}:any)=>{
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
            {value? ProductCategory.find((producttype)=>producttype.value===value)?.label:"Select category..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
         </Button>
      </PopoverTrigger>

      <PopoverContent>
         <Command>
            <CommandInput placeholder="Select User Type"/>
            <CommandEmpty>No Category Found</CommandEmpty>
            <CommandGroup>
            {ProductCategory.map((category) => (
              <CommandItem
                key={category.value}
                value={category.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue)
                  setOpen(false)
                  checkBoxHandler(category.value)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === category.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {category.label}
              </CommandItem>
            ))}
            </CommandGroup>
         </Command>
      </PopoverContent>
    </Popover>
   )
}
export default ProductComboBox;