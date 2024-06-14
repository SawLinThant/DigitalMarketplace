import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter=createTRPCRouter({
   getOneUser: protectedProcedure
   .input(
    z.object({
        id: z.any(),
    })
   )
   .query(async({ctx,input})=>{
    try{
      const user= await ctx.db.user.findFirst({
        where: {id: input.id},

        select:{
            id: true,
            username: true,
            email: true,
            userType: true,
        }
      });
      return user;
    }catch(error){}
   })
});