import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { PrismaError } from "~/types/global";
import { Prisma } from "@prisma/client";
import {hash} from "argon2"

export const authRouter=createTRPCRouter({
    register: publicProcedure
    .input(
        z.object({
            username: z.string(),
            email: z.string(),
            password: z.string(),
            userType: z.string(),
        })
    )
    .mutation(async({ctx,input})=>{
        try{
           const userdata= await ctx.db.user.create({
            data:{
               username: input.username,
               email: input.email,
               password: await hash(input.password),
               userType: input.userType,
            },
           });
           return {...userdata}
        }catch(error:unknown)
        {
            const prismaError=error as PrismaError;
         if(prismaError.code==="P2002" && prismaError.meta?.target?.includes("email")){
            throw new Error("Email is already registered");
         }
         if(error instanceof Prisma.PrismaClientUnknownRequestError && error.message.includes("Failed to connect")){
            throw new Error("Internet connection failed");
         }
         throw new Error("Registration failed");
        }
    })
});