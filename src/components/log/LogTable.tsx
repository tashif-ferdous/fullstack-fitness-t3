/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react"
import { useReactTable, createColumnHelper, ColumnDef, getCoreRowModel, flexRender } from "@tanstack/react-table"
import TimeAgo from "javascript-time-ago"
import en from "javascript-time-ago/locale/en"

import { Lift, Log } from "@prisma/client"

TimeAgo.addDefaultLocale(en)
 
// for a single user, for a single lift
export default function SoloLogTable({logs, lifts} : {logs: Log[], lifts: Lift[]}) {
  const timeAgo = new TimeAgo('en-US')
  const columnHelper = createColumnHelper<Log>()

  // All accessor columns
  const logColumns: ColumnDef<Log, any>[] = [
    columnHelper.accessor('createdAt', {
      header: "Time",
      cell: date => timeAgo.format(date.getValue())
    }),
    columnHelper.accessor('liftId', {
      header: "Lift",
      cell: liftId => {
        const lift = lifts.find(lift => lift.id === liftId.getValue())
        return lift? lift.name: "UNKNOWN"
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


  return (<>
    <div className="p-2">
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
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
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map(footerGroup => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
    </div>
  </>)
}