import { undefined } from "zod";

export interface PrismaError extends Error{
    code: string;
    meta?: {
        target?: string[];
    };
}

export interface User{
    id: string;
    username?: string;
    email: string;
   // role?: string;
}

export interface Media {
    id: string;
    user?: (string | null) | User;
    updatedAt: string;
    createdAt: string;
    url?: string | null;
    filename?: string | null;
    mimeType?: string | null;
    filesize?: number | null;
    width?: number | null;
    height?: number | null;
    sizes?: {
      thumbnail?: {
        url?: string | null;
        width?: number | null;
        height?: number | null;
        mimeType?: string | null;
        filesize?: number | null;
        filename?: string | null;
      };
      card?: {
        url?: string | null;
        width?: number | null;
        height?: number | null;
        mimeType?: string | null;
        filesize?: number | null;
        filename?: string | null;
      };
      tablet?: {
        url?: string | null;
        width?: number | null;
        height?: number | null;
        mimeType?: string | null;
        filesize?: number | null;
        filename?: string | null;
      };
    };
  }

export interface Product{
    id: string;
    name: string;
    category: string;
    description: string;
    price: string;
    sellerName: string;
    images: {
        image: string | Media;
        id?: string | null;
      }[];
} 

export type SearchParamType={
  ParamName:string;
  ParamValue:string;
}