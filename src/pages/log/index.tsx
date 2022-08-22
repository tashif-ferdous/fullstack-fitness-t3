import { useState } from "react"
import { NextPage } from "next"
import Head from "next/head"
import { trpc } from "../../utils/trpc"

import { Lift, Log } from "@prisma/client"
import LiftsSelector from "../../components/LiftSelector"
import Loader from "../../components/Loader"
import LogForm, { ILogFormInput } from "../../components/log/LogForm"
import SoloLogTable from "../../components/log/LogTable"
import { useSession } from "next-auth/react"

const Log: NextPage = () => {
  // what lift are we logging?
  const [selectedLift, setSelectedLift] = useState<Lift | undefined>(undefined)
  const [lifts, setLifts] = useState<Lift[]>([])
  const liftsQuery = trpc.useQuery(["lift.getAll"], {onSuccess: (data) => {
    setLifts(data)
    setSelectedLift(data[0])
  }})

  const [currentWorkout, setCurrentWorkout] = useState<Log[]>([])
  trpc.useQuery(["log.getCurrentWorkout", {}], {
    onSuccess: (data) => {
      setCurrentWorkout(data)
    }
  })

  const ctx = trpc.useContext()
  const createMutation = trpc.useMutation(["log.create"], {
    onMutate: () => {
      ctx.cancelQuery(["log.getCurrentWorkout", {}])
      const optimisticUpdate = ctx.getQueryData(["log.getCurrentWorkout", {}]);
      if (optimisticUpdate) {
        ctx.setQueryData(["log.getCurrentWorkout", {}], optimisticUpdate);
      }
    },
    onSettled: () => {
      ctx.invalidateQueries(["log.getCurrentWorkout", {}])
    }
  })

  const createLog = (data: ILogFormInput) => {
    createMutation.mutate({
      liftId: selectedLift?.id as number,
      weight: data.weight,
      reps: data.reps,
      cues: data.cues,
      comments: data.comments
    })
  }

  const title = "Fullstack Fitness | Log"
  const { data: session } = useSession()
  const name = session?.user?.name

  if (liftsQuery.isError) {
    console.error('failed to load lifts: ', liftsQuery.error)
    return (
      <Loader title={title} text={`Could not fetch lifts, check the console!`}/>
    )
  }
  if (selectedLift === undefined) {
    return (
      <Loader title={title} text="Opening the log book 📖 ..." />
    ) 
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="do you even lift bro?" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto flex flex-col items-center min-h-screen p-4">
        <section className="container w-5-6 md:w-3/4 lg:w-2/3">
          <h2 className="text-bold text-2xl tracking-wide"><span className="text-indigo-500">{`${name}'s `}</span>Logbook</h2>
        </section>
        <section className="container mt-5 w-5-6 md:w-3/4 lg:w-2/3">
          <LiftsSelector lifts={lifts} selectedLift={selectedLift} setLift={setSelectedLift} />
        </section>
        <section className="container mt-5 w:5-6 md:w-3/4 lg:w-2/3">
          <LogForm createLog={createLog} />
        </section>
        <section className="container mt-8 w:5-6 md:w-3/4 lg:w-2/3">
          <h2 className="mt-3 mb-5 font-semibold uppercase text-xl">Current workout</h2>
          <SoloLogTable logs={currentWorkout} lifts={lifts} />
        </section>
      </main>
    </>
  )
}

export default Log