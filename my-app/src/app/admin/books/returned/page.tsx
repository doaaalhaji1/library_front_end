"use client";
import DataTable from "../../components/DataTable";
import ReturnBookButton from "../components/ReturnBookButton";

export default function ReturnedBooksPage() {
  const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

  return (
    <DataTable
      title="Returned Books"
      apiEndpoint="http://libraryproject.test/api/books/returned"
      columns={["User Name", "Book Title", "Delivery Date", "Status", "Action"]}
      renderRow={(book: any) => {
        const isLate = currentDate > book.reservation?.reservation_end_date;
        return (
          <tr key={book.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">{book.reservation?.user?.name || 'N/A'}</td>
            <td className="px-6 py-4">{book.title}</td>
            <td
              className={`px-6 py-4 whitespace-nowrap text-center ${isLate ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}
            >
              {currentDate}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">{book.status}</td>
            <td className="px-6 py-4 whitespace-nowrap text-center">
              <ReturnBookButton bookId={book.id} onSuccess={() => { } } />
            </td>
          </tr>
        );
      } } onBack={undefined}    />
  );
}
