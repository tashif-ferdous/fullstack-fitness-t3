/* eslint-disable @typescript-eslint/no-var-requires */
// https://www.prisma.io/docs/guides/database/seed-database

const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function seedLifts() {
  const deadlift = await prisma.lift.upsert({
    where: {
      name: 'Barbell Deadlift'
    },
    update: {},
    create: {
      name: 'Barbell Deadlift',
      description: 'Best pull lift, since it activates your entire posterior chain.',
      imageUrl: 'https://fitnessvolt.com/wp-content/uploads/2019/12/dorian-yates-deadlift.jpg',
      youtubeUrls: ['https://youtu.be/nPvDrlSXuP0', 'https://youtu.be/MBbyAqvTNkU'],
      slug: 'barbell-deadlift',
    },
  })

  const squat = await prisma.lift.upsert({
    where: { name: 'Barbell Squat' },
    update: {},
    create: {
      name: 'Barbell Squat',
      description: 'Best lift for legs.',
      imageUrl: 'https://i0.wp.com/t2experiment.com/wp-content/uploads/2019/05/mike-mentzer-barbell-squat.jpg?',
      youtubeUrls: ['https://youtu.be/t3-qeTT1brA', 'https://youtu.be/8Kls95w2jFA', 'https://youtu.be/ubdIGnX2Hfs'],
      slug: 'barbell-squat',
    }
  })

  const bench = await prisma.lift.upsert({
    where: { name: 'Barbell Flat Bench' },
    update: {},
    create: {
      name: 'Barbell Flat Bench',
      description: 'Chest, back, and arms.',
      imageUrl: 'https://cdn.muscleandstrength.com/sites/default/files/arnold_workout_-_1200x630.jpg',
      youtubeUrls: ['https://youtu.be/74nhtcP1Ur0', 'https://youtu.be/rT7DgCr-3pg', 'https://youtu.be/vcBig73ojpE', 'https://youtu.be/-MAABwVKxok'],
      slug: 'barbell-flat-bench',
    }
  })

  return { deadlift, squat, bench }
}

seedLifts()
  .then(async ({ deadlift, squat, bench }) => {
    console.log(deadlift)
    console.log(squat)
    console.log(bench)

    await prisma.$disconnects
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
