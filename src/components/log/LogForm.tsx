import { useState } from "react"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import Flash from "../Flash"

type LogFormProps = {
  createLog: (data: ILogFormInput) => void
}

export interface ILogFormInput {
  weight: number;
  reps: number;
  cues?: string;
  comments?: string;
}

export default function LogForm({ createLog } : LogFormProps) {
  const [flash, setFlash] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    createLog(data as ILogFormInput)
    reset()
    setFlash(true)
  }

  return (
    <>
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
              {errors.weight && <p className="mt-2 text-red-500 text-xs italic mb-3">0 to 1500 pounds.</p>}
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
              {errors.reps && <p className="mt-2 text-red-500 text-xs italic mb-3">0 to 250 reps.</p>}
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
    </>
  )
}