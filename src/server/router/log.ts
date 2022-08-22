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
  .query("getCurrentWorkout", {
    input: z
      .object({
        timeStart: z.date().nullish(),
        take: z.number().nullish(),
      }),
    async resolve({ctx, input}) {
      const session = ctx.session
      if (session === null) {
        throw new TRPCError({code: "INTERNAL_SERVER_ERROR"})
      }
      const user = session.user
      if (user === undefined) {
        throw new TRPCError({code: "INTERNAL_SERVER_ERROR"})
      }

      const sixHoursAgo = new Date(Date.now() - (6 * 60 * 60 * 1000))
      return await ctx.prisma.log.findMany({
        where: {
          userId: user.id,
          createdAt: {
            gt: input.timeStart? input.timeStart: sixHoursAgo
          }
        },
        take: input.take? input.take: 1000 
      })
    }
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
