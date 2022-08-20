/* eslint-disable @typescript-eslint/no-var-requires */
// https://www.prisma.io/docs/guides/database/seed-database

const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function seedLifts() {
  const deadlift = await prisma.lift.upsert({
    where: {
      name: 'Barbell Sumo Deadlift'
    },
    update: {},
    create: {
      name: 'Barbell Sumo Deadlift',
      description: 'Best pull lift, since it activates your entire posterior chain.',
      movement: {
        create: {
          name: 'Deadlift'
        }
      },
      equipment: {
        create: {
          name: 'Barbell'
        }
      },
      muscles: {
        create: [
          { name: 'Lats' },
          { name: 'Hamstrings' },
          { name: 'Glutes' },
          { name: 'Traps' }
        ]
      }
    },
  })

  const bench = await prisma.lift.upsert({
    where: {
      name: 'Barbell Flat Bench Press'
    },
    update: {},
    create: {
      name: 'Barbell Flat Bench Press',
      description: 'Want a bigger chest?',
      movement: {
        create: {
          name: 'Flat Bench'
        }
      },
      equipment: {
        connect: {
          name: 'Barbell'
        }
      },
      muscles: {
        connect: [
          { name: 'Lats' }
        ],
        create: [
          { name: 'Pecs' },
          { name: 'Triceps' }
        ]
      }
    }
  })

  console.log(deadlift)
  console.log(bench)
}

async function seedSets() {
  const upsertBenchSet = async (rep) => {
    return await prisma.set.upsert({
      where: { name: `BB Flat Bench Press ${rep} reps` },
      update: {},
      create: {
        name: `BB Flat Bench Press ${rep} reps`,
        lift: {
          connect: { name: 'Barbell Flat Bench Press' }
        },
        rep: rep,
      }
    })
  }

  const upsertDeadliftSet = async (rep) => {
    return await prisma.set.upsert({
      where: { name: `BB Sumo Deadlift ${rep} reps` },
      update: {},
      create: {
        name: `BB Sumo Deadlift ${rep} reps`,
        lift: {
          connect: { name: 'Barbell Sumo Deadlift' }
        },
        rep: rep,
      }
    })
  }

  const reps = [2, 4, 6, 8, 10, 12, 15]
  const benchReps = []
  const deadliftReps = []
  for (const rep of reps) {
    const benchSet = await upsertBenchSet(rep)
    const deadliftSet = await upsertDeadliftSet(rep)
    benchReps.push(benchSet)
    deadliftReps.push(deadliftSet)
    console.log(benchSet)
    console.log(deadliftSet)
  }

  return { benchReps, deadliftReps }
}

async function seedExercise({ benchReps, deadliftReps }) {
  const deadliftSetIds = deadliftReps.map(set => {
    return set.id
  })
  const benchSetIds = benchReps.map(set => {
    return set.id
  })
  const deadlift = await prisma.exercise.upsert({
    where: {
      name: 'BB Sumo Deadlifts'
    },
    update: {},
    create: {
      name: 'BB Sumo Deadlifts',
      sets: {
        connect: deadliftSetIds.map(id => { return { id: id } })
      },
      orderSetIds: deadliftSetIds,
      lift: {
        connect: {
          name: 'Barbell Sumo Deadlift'
        }
      }
    }
  })
  const bench = await prisma.exercise.upsert({
    where: {
      name: 'BB Flat Bench Press'
    },
    update: {},
    create: {
      name: 'BB Flat Bench Press',
      sets: {
        connect: benchSetIds.map(id => { return { id: id } })
      },
      orderSetIds: benchSetIds,
      lift: {
        connect: {
          name: 'Barbell Flat Bench Press'
        }
      }
    }
  })

  console.log(bench)
  console.log(deadlift)
  return { bench, deadlift }
}

async function seedProgram({ bench, deadlift }) {
  const program = await prisma.program.upsert({
    where: { name: 'Pull & Bench' },
    update: {},
    create: {
      name: 'Pull & Bench',
      exercises: { connect: [deadlift.id, bench.id].map(id => { return { id: id } }) },
      orderExerciseIds: [deadlift.id, bench.id]
    }
  })
  console.log(program)
  return { program }
}

seedLifts()
  .then(async () => {
    seedSets().then(async ({ benchReps, deadliftReps }) => {
      seedExercise({ benchReps, deadliftReps }).then(async ({ deadlift, bench }) => {
        seedProgram({ deadlift, bench }).then(async ({ program }) => {
          await prisma.$disconnect
        })
      })
    })
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
