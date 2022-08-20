import { createRouter } from "./context";
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
  // .mutation("createLift", {
  //   input: z
  //     .object({ 
  //       name: z.string(),
        
  //     }),
  //   async resolve({ctx, input}) {
  //     return await ctx.prisma.lift.create({data: {
  //       name: input.name,

  //     }})
  //   }
  // })
