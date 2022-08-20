// src/server/router/index.ts
import { createRouter } from "./context"
import superjson from "superjson"

import { liftRouter } from "./program/lifts"
import { movementRouter } from "./program/movements"
import { equipmentRouter } from "./program/equipment"
import { muscleRouter } from "./program/muscles"
import { protectedExampleRouter } from "./protected-example-router"

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("lift.", liftRouter)
  .merge("movement.", movementRouter)
  .merge("equipment.", equipmentRouter)
  .merge("muscle.", muscleRouter)
  .merge("question.", protectedExampleRouter)

// export type definition of API
export type AppRouter = typeof appRouter
