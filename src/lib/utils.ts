import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function priceFormat(
  price: number | string,
  options: {
    currency?: 'USD' | 'MMK' | 'EUR'
    notation?: Intl.NumberFormatOptions['notation']
  }={}
){
  const {currency= 'USD', notation='compact'}=options;
  const numericPrice= typeof price==='string'? parseFloat(price):price;
  return Intl.NumberFormat('en-us',{
    style: 'currency',
    currency,
    notation,
    maximumFractionDigits: 2,
  }).format(numericPrice)
}
