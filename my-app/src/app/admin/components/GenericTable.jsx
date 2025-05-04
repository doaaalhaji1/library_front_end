import { FiEdit2 } from "react-icons/fi";

export default function GenericTable({
  data,
  columns,
  onEdit,
  onDelete,
  noDataMessage = "No data found",
}) {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {columns.map((column) => (
            <th
              key={column.key}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {column.label}
            </th>
          ))}
          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.length > 0 ? (
          data.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >
                  {item[column.key] || column.defaultValue || "Unknown"}
                </td>
              ))}
             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
  <div className="flex justify-center space-x-2">
    {/* زر التعديل */}
    <button
      onClick={() => onEdit(item.id)}
      className="text-blue-600 hover:text-blue-900 p-1 transition-colors"
    >
      <FiEdit2 className="h-6 w-6" />
    </button>

    {/* زر الحذف */}
    {onDelete(item.id, item.name)}
  </div>
</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length + 1} className="px-6 py-4 text-center text-sm text-gray-500">
              {noDataMessage}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}