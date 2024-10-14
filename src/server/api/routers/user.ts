import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getOneUser: protectedProcedure
    .input(
      z.object({
        id: z.any(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const user = await ctx.db.user.findFirst({
          where: { id: input.id },

          select: {
            id: true,
            username: true,
            email: true,
            userType: true,
          },
        });
        return user;
      } catch (error) {}
    }),
  getUserList: protectedProcedure
    .input(
      z.object({
        skip: z.number(),
        take: z.number(),
        name: z.string().default(""),
        
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const userList = await ctx.db.user.findMany({
          skip: input.skip,
          take: input.take,
          where: {
            username: { contains: input.name },
          },
          select:{
            email:true,
            username:true,
            
          }
        });
        const userListCount = await ctx.db.user.count({
          where: {
            username: { contains: input.name },
          },
        });

        return { list: userList, count: userListCount };
      } catch (e: unknown) {
        console.error("Error fetching user lists:", e);
        throw new Error("Fail to user lists");
      }
    }),
});
