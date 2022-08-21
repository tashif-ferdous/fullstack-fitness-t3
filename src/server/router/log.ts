import { createRouter } from "./context";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const logRouter = createRouter()
  .query("getById", {
    input: z
      .object({ id: z.number() }),
    async resolve({ ctx, input}) {
      return await ctx.prisma.log.findUnique({where: {id: input.id}})
    }
  })
  .query("topWeightAnyUser", {
    input: z
      .object({ 
        liftId: z.number(),
        take: z.number(),
      }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.log.findMany({
        where: { lift: { is: {id: input.liftId } } },
        orderBy: { weight: 'desc' },
        take: input.take,
      })
    },
  })
  .query("topRepsAnyUser", {
    input: z
      .object({ 
        liftId: z.number(),
        take: z.number(),
      }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.log.findMany({
        where: { lift: { is: {id: input.liftId } } },
        orderBy: { reps: 'desc' },
        take: input.take,
      })
    },
  })
  .middleware(async ({ctx, next}) => {
    // Any queries or mutations after this middleware will
    // raise an error unless there is a current session
    if (!ctx.session) {
      throw new TRPCError({code: "UNAUTHORIZED"})
    }
    return next()
  })
  .mutation("create", {
    input: z
      .object({ 
        liftId: z.number(),
        weight: z.number(),
        reps: z.number(),
        cues: z.string().nullish(),
        comments: z.string().nullish(),
      }),
    async resolve({ctx, input}) {
      return await ctx.prisma.log.create({data: {
        lift: { connect: { id: input.liftId } },
        weight: input.weight,
        reps: input.reps,
        cues: input.cues,
        comments: input.comments,
        user: { connect: { id: ctx.session?.user?.id }},
      }})
    }
  })
  .mutation("deleteLog", {
    input: z
      .object({
        id: z.number()
      }),
    async resolve({ctx, input}) {
      return await ctx.prisma.log.delete({where: {id: input.id}})
    }
  })
