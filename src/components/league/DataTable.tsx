import type { ReactNode } from "react";

type DataTableProps = {
  columns: Array<{ key: string; label: string; className?: string }>;
  rows: Array<Record<string, ReactNode>>;
  emptyMessage?: string;
};

export function DataTable({ columns, rows, emptyMessage = "No data yet." }: DataTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[#0066FF]/20 bg-[#0a0a0a]">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-[#0066FF]/20 bg-black text-xs uppercase tracking-wider text-[#0088FF]">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={`px-4 py-3 font-semibold ${column.className ?? ""}`}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-white/40">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr
                key={index}
                className="border-b border-white/5 text-white/80 last:border-0 hover:bg-[#0066FF]/5"
              >
                {columns.map((column) => (
                  <td key={column.key} className={`px-4 py-3 ${column.className ?? ""}`}>
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
