"use client"

interface Props {
  headers: string[]
  rows: Record<string, string>[]
  error?: string
}

export default function SheetPanel({ headers, rows, error }: Props) {
  if (error) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Headliner Cards Home Base — Sheet
        </h2>
        <p className="text-xs text-amber-400">{error}</p>
      </div>
    )
  }

  if (headers.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Headliner Cards Home Base — Sheet
        </h2>
        <p className="text-xs text-gray-600 italic">
          Add GOOGLE_SHEET_ID to .env.local to connect your sheet.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Headliner Cards Home Base — Sheet
        </h2>
        <span className="text-xs text-gray-600">{rows.length} rows</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/10">
              {headers.map((h) => (
                <th key={h} className="text-left text-gray-500 font-medium pb-2 pr-4 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 20).map((row, i) => (
              <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                {headers.map((h) => (
                  <td key={h} className="py-2 pr-4 text-gray-300 whitespace-nowrap max-w-[200px] truncate">
                    {row[h] || "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length > 20 && (
          <p className="text-xs text-gray-600 mt-2">{rows.length - 20} more rows not shown</p>
        )}
      </div>
    </div>
  )
}
