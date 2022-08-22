import { Dispatch, useState } from "react"
import Link from "next/link"
import { RadioGroup } from "@headlessui/react"
import { Lift } from "@prisma/client"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

type LiftsSelectorProps = {
  lifts: Lift[],
  selectedLift: Lift,
  setLift: Dispatch<Lift>
}

export default function LiftsSelector({lifts, selectedLift, setLift}: LiftsSelectorProps) {
  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-md uppercase font-bold text-gray-900">Lift</h2>
        <Link href="/lifts">
          <a className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            Learn more
          </a>
        </Link>
      </div>
      <RadioGroup value={selectedLift} onChange={setLift} className="mt-2">
        <RadioGroup.Label className="sr-only">What is your lift?</RadioGroup.Label>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {lifts.map((lift) => (
            <RadioGroup.Option
              key={lift.id}
              value={lift}
              className={({ active, checked }) =>
                classNames(
                  active ? 'ring-2 ring-offset-2 ring-indigo-500' : '',
                  checked
                    ? 'bg-indigo-600 border-transparent text-white hover:bg-indigo-700'
                    : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50',
                  'border rounded-md py-3 px-3 flex items-center justify-center text-sm font-medium uppercase sm:flex-1'
                )
              }
            >
              <RadioGroup.Label as="span">{lift.name}</RadioGroup.Label>
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </section>
  )
}