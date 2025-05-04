"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiPlus, FiArrowLeft, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import DeleteUserButton from "./components/DeleteUserButton";
import GenericTable from "../components/GenericTable";
import Pagination from "../components/Pagination";
import { useAuth } from "../hooks/useAuth";
import { useFetch } from "../hooks/useFetch";
require('dotenv').config();

export default function UsersManagement() {
  const router = useRouter();
  const loadingAuth = useAuth("admin"); // التحقق من الأذونات

  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  // Fetch users using useFetch hook
  const { data: users, loading, error } = useFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/allUser`);

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const handleEdit = (id) => {
    router.push(`/admin/users/edit/${id}`);
  };

  if (loadingAuth || loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  const columns = [
    { 
      key: "name", 
      label: "Name",
      render: (name) => (
        <div className="flex items-center">
          <FiUser className="mr-2 text-gray-400" />
          {name}
        </div>
      ),
    },
    { key: "email", label: "Email" },
    { 
      key: "role", 
      label: "Role",
      render: (role) => (
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            role === 'admin' 
              ? 'bg-purple-100 text-purple-800' 
              : role === 'employee'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {role}
        </span>
      ),
    },
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
          <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>
        </div>
        <button
          onClick={() => router.push("/admin/users/add")}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          aria-label="Add new user"
        >
          <FiPlus className="mr-2" />
          Add New User
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <GenericTable
            data={currentUsers}
            columns={columns}
            onEdit={handleEdit}
            onDelete={(id, name) => (
              <DeleteUserButton userId={id} userName={name} />
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