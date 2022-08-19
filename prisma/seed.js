/* eslint-disable @typescript-eslint/no-var-requires */
// https://www.prisma.io/docs/guides/database/seed-database

const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function seedLift() {
  const deadlift = await prisma.lift.upsert({
    where: {
      name: 'Barbell Sumo Deadlift'
    },
    update: {},
    create: {
      name: 'Barbell Sumo Deadlift',
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

  console.log(deadlift)
  return deadlift
}

seedLift()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
