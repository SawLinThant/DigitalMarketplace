import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { ArrowsUpFromLine } from "lucide-react";
import { stripe } from "~/lib/stripe";
import Stripe from "stripe";


export const orderRouter = createTRPCRouter({
  


  getOrderById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const order = await ctx.db.order.findFirst({
          where: {
            id: input.id
          },
          include:{
            products:{
              include:{
                products:{
                  select:{
                    images:true
                  }
                }
              },
              
            },
            billingInfo:true
          }
        });

        return order;
      } catch (e: any) {
        throw new Error("Order not exist", e)
      }
    }),

    getAllUserOrders:protectedProcedure
    .input(
        z.object({})
    )
    .query(async({ctx,input})=>{
        try{
            const orders=await ctx.db.order.findMany({
                where:{
                    buyerId:ctx.session.user.id
                }
            })
            return orders
        }catch(e:any){

        }
    })

});
