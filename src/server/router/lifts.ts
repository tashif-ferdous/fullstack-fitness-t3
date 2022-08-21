import { createRouter } from "./context";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const liftRouter = createRouter()
  .query("getByName", {
    input: z
      .object({
        name: z.string()
      }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.lift.findUnique({where: {name: input.name}})
    },
  })
  .query("getById", {
    input: z
      .object({ id: z.number() }),
    async resolve({ ctx, input}) {
      return await ctx.prisma.lift.findUnique({where: {id: input.id}})
    }
  })
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.lift.findMany();
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
  .mutation("createLift", {
    input: z
      .object({ 
        name: z.string(),
        description: z.string(),
        cues: z.string().nullish(),
        imageUrl: z.string().nullish(),
        youtubeUrls: z.string().array(),
        slug: z.string(),
      }),
    async resolve({ctx, input}) {
      return await ctx.prisma.lift.create({data: {
        name: input.name,
        description: input.description,
        cues: input.cues,
        imageUrl: input.imageUrl,
        youtubeUrls: input.youtubeUrls,
        slug: input.slug,
      }})
    }
  })
  .mutation("deleteLift", {
    input: z
      .object({
        id: z.number()
      }),
    async resolve({ctx, input}) {
      return await ctx.prisma.lift.delete({where: {id: input.id}})
    }
  })
