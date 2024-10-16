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
            id: input.id,
          },
          include: {
            products: {
              include: {
                products: {
                  select: {
                    images: true,
                  },
                },
              },
            },
            billingInfo: true,
          },
        });

        return order;
      } catch (e: any) {
        throw new Error("Order not exist", e);
      }
    }),

  getAllUserOrders: protectedProcedure
    .input(z.object({}))
    .query(async ({ ctx, input }) => {
      try {
        const orders = await ctx.db.order.findMany({
          where: {
            buyerId: ctx.session.user.id,
          },
        });
        return orders;
      } catch (e: any) {}
    }),
  getAdminOrderList: protectedProcedure
    .input(
      z.object({
        skip: z.number(),
        take: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const orderList = await ctx.db.order.findMany({
          skip: input.skip,
          take: input.take,
        });
        const orderListCount = await ctx.db.user.count({});

        return { list: orderList, count: orderListCount };
      } catch (e: unknown) {
        console.error("Error fetching user lists:", e);
        throw new Error("Fail to user lists");
      }
    }),
    changeOrderStatus:protectedProcedure
    .input(
      z.object({
        orderId:z.string(),
        status:z.string()
      })
    )
    .mutation(async({ctx,input})=>{
      try{
          await ctx.db.order.update({
            where:{
              id:input.orderId
            },
            data:{
              status:input.status
            }
          })
      }catch(e:any){

      }
    })
});
