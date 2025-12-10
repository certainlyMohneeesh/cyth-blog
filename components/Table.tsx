import React from 'react'

interface TableProps {
  value: {
    caption?: string
    rows?: Array<{ cells: string[] }>
    hasHeader?: boolean
  }
}

export function Table({ value }: TableProps) {
  const { caption, rows = [], hasHeader = true } = value

  if (rows.length === 0) {
    return null
  }

  const [headerRow, ...bodyRows] = hasHeader ? rows : [null, ...rows]

  return (
    <figure className="my-8 overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <table className="min-w-full divide-y divide-gray-300 border border-gray-300">
          {headerRow && (
            <thead className="bg-gray-50">
              <tr>
                {headerRow.cells.map((cell, i) => (
                  <th
                    key={i}
                    scope="col"
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-r border-gray-300 last:border-r-0"
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className="divide-y divide-gray-200 bg-white">
            {bodyRows.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50">
                {row.cells.map((cell, j) => (
                  <td
                    key={j}
                    className="px-4 py-3 text-sm text-gray-700 border-r border-gray-300 last:border-r-0"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-gray-600 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
