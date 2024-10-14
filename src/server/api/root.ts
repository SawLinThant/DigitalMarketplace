import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "./routers/auth";
import { userRouter } from "./routers/user";
import { productRouter } from "./routers/product";
import { paymentRouter } from "./routers/payment";
import { orderRouter } from "./routers/order";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  auth: authRouter,
  user: userRouter,
  product: productRouter,
  payment: paymentRouter,
  order: orderRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
