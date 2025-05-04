"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiPlus, FiArrowLeft } from "react-icons/fi";
import DeleteCategoryButton from'./components/DeleteCategoryButton';
import GenericTable from "../components/GenericTable";
import Pagination from "../components/Pagination";
import { useAuth } from "../hooks/useAuth";
import { useFetch } from "../hooks/useFetch";
require('dotenv').config();


export default function CategoriesPage() {
  const router = useRouter();
  const loadingAuth = useAuth("admin"); // التحقق من الأذونات

  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage] = useState(10);

  // Fetch categories using useFetch hook
  const { data: categories, loading, error } = useFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categoriesadmin`);

  // Pagination logic
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);
  const totalPages = Math.ceil(categories.length / categoriesPerPage);

  const handleEdit = (id) => {
    router.push(`/admin/categories/edit/${id}`);
  };

  if (loadingAuth || loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  const columns = [
    { key: "name", label: "Category Name" },
    { key: "slug", label: "Description", defaultValue: "No description" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={() => router.push("/admin")}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Back to dashboard"
          >
            <FiArrowLeft className="text-lg" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Categories Management</h1>
        </div>
        <button
          onClick={() => router.push("/admin/categories/add")}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          aria-label="Add new category"
        >
          <FiPlus className="mr-2" />
          Add Category
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <GenericTable
            data={currentCategories}
            columns={columns}
            onEdit={handleEdit}
            onDelete={(id, name) => (
              <DeleteCategoryButton
                categoryId={id}
                categoryName={name}
                onDeleteSuccess={() => {
                  setCategories(categories.filter((cat) => cat.id !== id));
                }}
              />
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