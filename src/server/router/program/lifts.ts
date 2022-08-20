import { createRouter } from "../context";
import { z } from "zod";

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
  .mutation("createLift", {
    input: z
      .object({ 
        name: z.string(),
        description: z.string(),
        cues: z.string().nullish(),
        link: z.string().nullish(),
        movementId: z.number(),
        equipmentId: z.number(),
        muscleIds: z.number().array().nullish(), 
      }),
    async resolve({ctx, input}) {
      return await ctx.prisma.lift.create({data: {
        name: input.name,
        description: input.description,
        cues: input.cues,
        link: input.link,
        movement: { connect: { id: input.movementId}},
        equipment: { connect: { id: input.equipmentId}}, 
        muscles: { connect: input.muscleIds?.map(id => { return { id }}) }
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
