// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { liftRouter } from "./lifts";
import { protectedExampleRouter } from "./protected-example-router";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("lift.", liftRouter)
  .merge("question.", protectedExampleRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
