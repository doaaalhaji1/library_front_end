"use client";
import { useRouter } from "next/navigation";
import { FiTrash2 } from "react-icons/fi";
require('dotenv').config();

export default function DeleteBookButton({ bookId, bookTitle }:any) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`هل أنت متأكد من حذف الكتاب "${bookTitle}"؟`)) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/deleteBook/${bookId}`,
        {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error("فشل في حذف الكتاب");
      }

      router.refresh(); // تحديث الصفحة بعد الحذف
      
    } catch (error:any) {
      alert(`حدث خطأ: ${error.message}`);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-600 hover:text-red-900 transition-colors p-1"
      aria-label={`حذف ${bookTitle}`}
      title="حذف الكتاب"
    >
      <FiTrash2 className="text-lg" />
    </button>
  );
}