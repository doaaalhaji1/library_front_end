"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiPlus, FiArrowLeft } from "react-icons/fi";
import DeleteBookButton from "./components/DeleteBookButton";
import GenericTable from "../components/GenericTable";
import Pagination from "../components/Pagination";
import { useAuth } from "../hooks/useAuth"; // استيراد Hook للتحقق من الأذونات
import { useFetch } from "../hooks/useFetch";
require('dotenv').config();

export default function BooksManagement() {
  const router = useRouter();
  const loadingAuth = useAuth("admin"); // التحقق من الأذونات

  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(10);

  // Fetch books using useFetch hook
  const { data: books, loading, error } = useFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/booksadmin`);

  // Pagination logic
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(books.length / booksPerPage);

  const handleEdit = (id:any) => {
    router.push(`/admin/books/updateBook/${id}`);
  };

  if (loadingAuth || loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  const columns = [
    { key: "title", label: "Title" },
    { key: "description", label: "Description", defaultValue: "No description available" },
    { 
      key: "status", 
      label: "Status",
      render: (status:any) => (
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            status === 'active' || status === 'available'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {status}
        </span>
      ),
    },
    { key: "language", label: "Language", defaultValue: "Unknown" },
  ];

  return (
    <div className="container mx-auto px-4 py-8" dir="ltr">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center">
          <button
            onClick={() => router.push("/admin")}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Back to dashboard"
          >
            <FiArrowLeft className="text-lg" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Books Management</h1>
        </div>
        <button
          onClick={() => router.push("/admin/books/add")}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          aria-label="Add new book"
        >
          <FiPlus className="mr-2" />
          Add New Book
        </button>
      </div>

      {/* Books Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <GenericTable
            data={currentBooks}
            columns={columns}
            onEdit={handleEdit}
            onDelete={(id:any, title:any) => (
              <DeleteBookButton bookId={id} bookTitle={title} />
            )}
          />
        </div>
      </div>

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}