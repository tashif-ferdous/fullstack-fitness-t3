import { createRouter } from "../context";
import { z } from "zod";

export const movementRouter = createRouter()
  .query("getByName", {
    input: z
      .object({
        name: z.string()
      }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.movement.findUnique({where: {name: input.name}})
    },
  })
  .query("getById", {
    input: z
      .object({ id: z.number() }),
    async resolve({ ctx, input}) {
      return await ctx.prisma.movement.findUnique({where: {id: input.id}})
    }
  })
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.movement.findMany();
    },
  })
  .mutation("create", {
    input: z
      .object({ 
        name: z.string(),
      }),
    async resolve({ctx, input}) {
      return await ctx.prisma.movement.create({data: {
        name: input.name
      }})
    }
  })
  .mutation("delete", {
    input: z
      .object({
        id: z.number()
      }),
    async resolve({ctx, input}) {
      return await ctx.prisma.movement.delete({where: {id: input.id}})
    }
  })
