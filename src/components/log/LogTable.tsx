/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react"
import { useReactTable, createColumnHelper, ColumnDef, getCoreRowModel, flexRender } from "@tanstack/react-table"
import TimeAgo from "javascript-time-ago"
import en from "javascript-time-ago/locale/en"

import { Lift, Log } from "@prisma/client"
import Link from "next/link"

// for a single user, for a single lift
export default function WorkoutTable({logs, lifts, showLink} : {logs: Log[], lifts: Lift[], showLink: boolean}) {
  TimeAgo.addLocale(en)
  const timeAgo = new TimeAgo('en-US')
  const columnHelper = createColumnHelper<Log>()

  // All accessor columns
  const logColumns: ColumnDef<Log, any>[] = [
    columnHelper.accessor('createdAt', {
      header: "Time",
      cell: date => <span className="italic">{timeAgo.format(date.getValue())}</span>
    }),
    columnHelper.accessor('liftId', {
      header: "Lift",
      cell: liftId => {
        const lift = lifts.find(lift => lift.id === liftId.getValue())
        const liftName = lift? lift.name: "UNKNOWN"
        return <span className="font-semibold">{liftName}</span>
      },
    }),
    columnHelper.accessor('weight', {
      header: "Weight (lbs)",
      cell: weight => weight.getValue(),
    }),
    columnHelper.accessor('reps', {
      header: "Reps",
      cell: reps => reps.getValue()
    }),
    columnHelper.accessor('cues', {
      header: "Cues",
      cell: cues => cues.getValue()
    }),
    columnHelper.accessor('comments', {
      header: "Comments",
      cell: comments => comments.getValue()
    })
  ]

  const table = useReactTable({
    data: logs,
    columns: logColumns,
    getCoreRowModel: getCoreRowModel()
  })

  if (!logs || logs.length === 0) {
    if (!showLink) {
      return <p className="italic">Nothing logged.  Go hit the weights!</p>
    }
    else {
      return (<p className="italic">Nothing logged.  Go hit the weights and 
        <Link href="/log"><a>open the log!</a></Link>!</p>)
    }
  }

  return (<div className="flex flex-col">
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300" style={{ borderSpacing: 0 }}>
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map(headerGroup => (
            <tr 
              key={headerGroup.id}
              className="divide-x divide-gray-200"
            >
              {headerGroup.headers.map(header => (
                <th 
                  key={header.id} 
                  scope="col" 
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map(row => (
            <tr 
              key={row.id}
              className="divide-x divide-gray-200"
            >
              {row.getVisibleCells().map(cell => (
                <td 
                  key={cell.id} 
                  className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>)
}