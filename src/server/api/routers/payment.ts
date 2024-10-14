import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { ArrowsUpFromLine } from "lucide-react";
import { stripe } from "~/lib/stripe";
import Stripe from "stripe";
import { productRouter } from "./product";

export const paymentRouter = createTRPCRouter({
  createSession: protectedProcedure
    .input(
      z.object({
        productId: z.array(z.string()),
        billingAddress:z.string(),
        billingEmail:z.string(),
        billingPhone:z.string()
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx;
      let { productId } = input;

      if (productId.length === 0) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const product = await ctx.db.product.findMany({
        where: {
          id: {
            in: productId,
          },
        },
      });

      const validProduct = product.filter((prod) => Boolean(prod.price));

      const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

      validProduct.forEach((product) => {
        line_items.push({
          price: product.stripePriceId?.toString(),
          quantity: 1,
        });
      });

      //   line_items.push({
      //     price: "price_1PKx2J051yfPdIlU75A33AiB",
      //     quantity: 1,
      //     adjustable_quantity:{
      //         enabled: false
      //     }
      //    })

      const order = await ctx.db.order.create({
        data: {
          paidStatus: false,
          products: {
            create: validProduct.map((product) => ({
              productId: product.id,
              productName: product.name || "",
              productPrice: product.price || ""
            })),
          },
          buyerId: user.session.user.id,
          buyerName: user.session.user.name,
          billingInfo:{
            create:{
              billingAddress:input.billingAddress,
              billingEmail:input.billingEmail,
              billingPhone:input.billingPhone
            }
          }
        },
      });

      try {
        const stripeSession = await stripe.checkout.sessions.create({
          success_url: `${process.env.NEXTAUTH_URL}/pages/thank-you/${order.id}`,
          cancel_url: `${process.env.NEXTAUTH_URL}/pages/Cart`,
          payment_method_types: ["card"],
          mode: "payment",
          metadata: {
            userId: user.session.user.id,
            orderId: order.id,
          },
          line_items,
        });
        console.log("Stripe session created:", stripeSession.url);

        return {
          url: stripeSession.url,
        };
      } catch (e: any) {
        console.error("Stripe session creation failed:", e);
        return {
          url: null,
        };
      }
    }),

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
            products: true
          }
        });

        return order;
      } catch (e: any) {
        throw new Error("Order not exist", e)
      }
    }),

    pollOrderStatus: protectedProcedure
    .input(z.object({
      orderId: z.string(),
    }))
    .query(async({ctx,input}) =>{
      try {
        const order = await ctx.db.order.findFirst({
          where: {
            id: input.orderId
          },
          include:{
            products: true
          }
        });
        
        return {isPaid: order?.paidStatus}
      } catch (e: any) {
        throw new Error("Order not exist", e)
      }
    })
});
