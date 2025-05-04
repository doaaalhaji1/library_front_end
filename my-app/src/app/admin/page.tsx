"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiBook, FiUsers, FiFolder, FiUser, FiCheckCircle, FiClock, FiRefreshCw } from "react-icons/fi";

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("role");

    // التحقق من صلاحيات الدخول
    if (role !== "admin" && role !== "employee") {
      router.push("/books"); // توجيه غير المصرح لهم
    } else {
      setIsLoading(false); // السماح بعرض الصفحة
    }
  }, [router]);

  if (isLoading) {
    return <p className="text-center mt-20 text-lg">Loading...</p>;
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Books Management */}
          <Link href="/admin/books">
            <div className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-all cursor-pointer border-l-4 border-blue-500">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 text-blue-500 rounded-full mr-4">
                  <FiBook size={20} />
                </div>
                <div>
                  <h2 className="font-bold">Books Management</h2>
                  <p className="text-sm text-gray-500">Manage all books in the library</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Authors */}
          <Link href="/admin/authors">
            <div className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-all cursor-pointer border-l-4 border-green-500">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 text-green-500 rounded-full mr-4">
                  <FiUsers size={20} />
                </div>
                <div>
                  <h2 className="font-bold">Authors</h2>
                  <p className="text-sm text-gray-500">Manage book authors</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Categories */}
          <Link href="/admin/categories">
            <div className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-all cursor-pointer border-l-4 border-purple-500">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 text-purple-500 rounded-full mr-4">
                  <FiFolder size={20} />
                </div>
                <div>
                  <h2 className="font-bold">Categories</h2>
                  <p className="text-sm text-gray-500">Organize book categories</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Users */}
          <Link href="/admin/users">
            <div className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-all cursor-pointer border-l-4 border-orange-500">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 text-orange-500 rounded-full mr-4">
                  <FiUser size={20} />
                </div>
                <div>
                  <h2 className="font-bold">Users</h2>
                  <p className="text-sm text-gray-500">Manage system users</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Reservations */}
          <Link href="/admin/reservations">
            <div className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-all cursor-pointer border-l-4 border-teal-500">
              <div className="flex items-center">
                <div className="p-3 bg-teal-100 text-teal-500 rounded-full mr-4">
                  <FiClock size={20} />
                </div>
                <div>
                  <h2 className="font-bold">Reservations</h2>
                  <p className="text-sm text-gray-500">Manage all reservations</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Approved Reservations */}
          <Link href="/admin/reservations/approved">
            <div className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-all cursor-pointer border-l-4 border-green-500">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 text-green-500 rounded-full mr-4">
                  <FiCheckCircle size={20} />
                </div>
                <div>
                  <h2 className="font-bold">Approved Reservations</h2>
                  <p className="text-sm text-gray-500">View approved reservations</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Returned Books */}
          <Link href="/admin/books/returned">
            <div className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-all cursor-pointer border-l-4 border-indigo-500">
              <div className="flex items-center">
                <div className="p-3 bg-indigo-100 text-indigo-500 rounded-full mr-4">
                  <FiRefreshCw size={20} />
                </div>
                <div>
                  <h2 className="font-bold">Returned Books</h2>
                  <p className="text-sm text-gray-500">Manage returned books</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}