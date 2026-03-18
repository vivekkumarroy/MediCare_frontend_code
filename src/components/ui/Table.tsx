import { ReactNode } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  loading?: boolean;
}

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  onEdit,
  onDelete,
  loading = false,
}: TableProps<T>) {
  const hasActions = onEdit || onDelete;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 bg-slate-50 font-medium text-slate-600 dark:text-slate-300"
              >
                {col.label}
              </th>
            ))}
            {hasActions && (
              <th className="px-4 py-3 bg-slate-50 font-medium text-slate-600 dark:text-slate-300">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
                  </td>
                ))}
                {hasActions && (
                  <td className="px-4 py-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-16" />
                  </td>
                )}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (hasActions ? 1 : 0)}
                className="px-4 py-8 text-center text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700"
              >
                No data found
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    {col.render ? col.render(row) : String(row[col.key] ?? '')}
                  </td>
                ))}
                {hasActions && (
                  <td className="px-4 py-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="text-gray-500 hover:text-primary transition-colors"
                          aria-label="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          className="text-gray-500 hover:text-danger transition-colors"
                          aria-label="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
