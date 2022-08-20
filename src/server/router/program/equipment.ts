import { createRouter } from "../context";
import { z } from "zod";

export const equipmentRouter = createRouter()
  .query("getByName", {
    input: z
      .object({
        name: z.string()
      }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.equipment.findUnique({where: {name: input.name}})
    },
  })
  .query("getById", {
    input: z
      .object({ id: z.number() }),
    async resolve({ ctx, input}) {
      return await ctx.prisma.equipment.findUnique({where: {id: input.id}})
    }
  })
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.equipment.findMany();
    },
  })
  .mutation("create", {
    input: z
      .object({ 
        name: z.string(),
      }),
    async resolve({ctx, input}) {
      return await ctx.prisma.equipment.create({data: {
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
      return await ctx.prisma.equipment.delete({where: {id: input.id}})
    }
  })
