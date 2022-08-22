import { useState } from "react"
import { NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react"
import { SubmitHandler, useForm } from "react-hook-form"
import { trpc } from "../../utils/trpc"

import { Lift } from "@prisma/client"
import LiftsSelector from "../../components/LiftSelector"
import Loader from "../../components/Loader"
import Flash from "../../components/Flash"

interface ILogFormInput {
  weight: number;
  reps: number;
  cues?: string;
  comments?: string;
}

const Log: NextPage = () => {
  const { data: session } = useSession()
  const ctx = trpc.useContext()

  // what lift are we logging?
  const [selectedLift, setSelectedLift] = useState<Lift | undefined>(undefined)
  const [lifts, setLifts] = useState<Lift[]>([])
  const liftsQuery = trpc.useQuery(["lift.getAll"], {onSuccess: (data) => {
    setLifts(data)
    setSelectedLift(data[0])
  }})

  const createLog = trpc.useMutation(["log.create"], {
    // onMutate: () => {
    //   ctx.cancelQuery([])
    // }
  })

  // form for weight, reps, thoughts
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const [flash, setFlash] = useState(false)
  const onSubmit: SubmitHandler<ILogFormInput> = (data) => {
    console.debug("submitting new log with data: ", data)
    createLog.mutate({
      liftId: selectedLift?.id as number,
      weight: data.weight,
      reps: data.reps,
      cues: data.cues,
      comments: data.comments
    })

    reset()
    setFlash(true)
  }

  const title = "Fullstack Fitness | Log"

  if (liftsQuery.isError) {
    return (
      <Loader title={title} text={`Error: ${JSON.stringify(errors)}`}/>
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
        <title>Fullstack Fitness | Log </title>
        <meta name="description" content="do you even lift bro?" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto flex flex-col items-center min-h-screen p-4">
        <section className="container w-5-6 md:w-3/4 lg:w-2/3">
          <LiftsSelector lifts={lifts} selectedLift={selectedLift} setLift={setSelectedLift} />
        </section>
        <section className="container mt-5 w:5-6 md:w-3/4 lg:w-2/3">
          {flash? <Flash text="Log saved." toggle={setFlash} /> : ""}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-2">
            <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Weight (lbs)
                </label>
                <input
                  type="number"
                  {...register("weight", {required: true, valueAsNumber: true, min: 0, max: 1500 })}
                  className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-400 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                  placeholder="135"
                />
                {errors.weight && <p className="text-red-500 text-xs italic mb-3">Error</p>}
              </div>
              <div>
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Reps
                </label>
                <input 
                  type="number"
                  {...register("reps", {required: true, valueAsNumber: true, min: 0, max: 250 })}
                  className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-400 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                  placeholder="10"
                />
                {errors.reps && <p className="text-red-500 text-xs italic mb-3"> Error</p>}
              </div>
            </section>
            <section className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div>
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Cues
                </label>
                <textarea 
                  {...register("cues", {required: false })}
                  className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-400 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                  placeholder="For bench, shoulders back, arch my back, leg drive, elbows tucked"
                /> 
              </div>
              <div>
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Thoughts
                </label>
                <textarea 
                  {...register("cues", {required: false })}
                  className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-400 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                  placeholder="The lockout is tough, I'm going to do some tricep extensions after."
                /> 
              </div>
            </section>
            <input 
              className="mt-5 border rounded-md py-3 px-3 flex items-center justify-center text-sm font-medium uppercase sm:flex-1 hover:bg-indigo-700 hover:text-white hover:cursor-pointer"
              type="submit" 
            />
          </form>
        </section>
      </main>
    </>
  )
}

export default Log