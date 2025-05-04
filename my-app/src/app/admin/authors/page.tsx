"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiPlus, FiArrowLeft } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import { useFetch } from "../hooks/useFetch";
import GenericTable from "../components/GenericTable";
import Pagination from "../components/Pagination";
import DeleteAuthorButton from "./components/DeleteAuthorButton"; // استيراد مكون الحذف
require('dotenv').config();

export default function AuthorsPage() {
  const router = useRouter();
  const loadingAuth = useAuth("admin");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch authors
  const { data: authors, loading, error } = useFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/authors`);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = authors.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(authors.length / itemsPerPage);

  const handleEdit = (id:any) => {
    router.push(`/admin/authors/edit/${id}`);
  };

  if (loadingAuth || loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  const columns = [
    { key: "name", label: "Name" },
    { key: "description", label: "Description", defaultValue: "No description available" },
    { key: "nationality", label: "Nationality", defaultValue: "Unknown" },
    { key: "birthdate", label: "Birthdate", defaultValue: "Unknown" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={() => router.push("/admin")}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Back to dashboard"
          >
            <FiArrowLeft className="text-lg" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Author Management</h1>
        </div>
        <button
          onClick={() => router.push("/admin/authors/add")}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FiPlus className="mr-2" />
          Add Author
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <GenericTable
            data={currentItems}
            columns={columns}
            onEdit={handleEdit}
            onDelete={(id:any, name:any) => (
              <DeleteAuthorButton authorId={id} authorName={name} />
            )}
          />
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}