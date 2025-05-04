"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiSave, FiArrowLeft } from "react-icons/fi";
require('dotenv').config();

interface Category {
  id: string;
  name: string;
}

interface Author {
  id: string;
  name: string;
}

interface FormData {
  title: string;
  description: string;
  language: string;
  book_content: string;
  categories: string[];
  authors: string[];
}

export default function AddBookPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    language: "Arabic",
    book_content: "",
    categories: [],
    authors: []
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [allAuthors, setAllAuthors] = useState<Author[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const [categoriesRes, authorsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/authors`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);
        
        if (!categoriesRes.ok || !authorsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [categoriesData, authorsData] = await Promise.all([
          categoriesRes.json() as Promise<Category[]>,
          authorsRes.json() as Promise<Author[]>
        ]);
        
        setAllCategories(categoriesData);
        setAllAuthors(authorsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data. Please try again');
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, options } = e.target;
    const selectedValues = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
    setFormData(prev => ({ ...prev, [name]: selectedValues }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      
      // Create FormData
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('language', formData.language);
      formDataToSend.append('book_content', formData.book_content);
      
      // Add arrays correctly
      formData.categories.forEach(cat => {
        formDataToSend.append('categories[]', cat);
      });
      
      formData.authors.forEach(auth => {
        formDataToSend.append('authors[]', auth);
      });
      
      // Add image if exists
      if (image) {
        formDataToSend.append('image', image);
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/insertBook`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: formDataToSend
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || JSON.stringify(errorData.errors) || "Failed to add book");
      }
  
      router.push("/admin/books");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => router.push("/admin/books")} 
          className="flex items-center p-2 rounded-full hover:bg-gray-100 mr-4"
        >
          <FiArrowLeft className="text-lg" />
        </button>
        <h1 className="text-2xl font-bold">Add New Book</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Book Title */}
          <div className="col-span-2">
            <label className="block text-gray-700 mb-2">Book Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
              minLength={3}
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div className="col-span-2">
            <label className="block text-gray-700 mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
              minLength={15}
              maxLength={100}
            ></textarea>
          </div>

          {/* Book Image */}
          <div className="col-span-2">
            <label className="block text-gray-700 mb-2">Book Cover Image</label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-32 border rounded flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Book preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400">No image</span>
                )}
              </div>
              <input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                className="px-4 py-2 border rounded-lg"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Supported formats: JPEG, PNG, JPG, GIF (Max 2MB)
            </p>
          </div>

          {/* Language */}
          <div>
            <label className="block text-gray-700 mb-2">Language *</label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            >
              <option value="Arabic">Arabic</option>
              <option value="English">English</option>
              <option value="French">French</option>
            </select>
          </div>

          {/* Book Content */}
          <div>
            <label className="block text-gray-700 mb-2">Book Content</label>
            <textarea
              name="book_content"
              value={formData.book_content}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              minLength={5}
              maxLength={100}
            ></textarea>
          </div>

          {/* Categories - Multiple */}
          <div>
            <label className="block text-gray-700 mb-2">Categories *</label>
            <select
              multiple
              name="categories"
              onChange={handleMultiSelectChange}
              className="w-full px-4 py-2 border rounded-lg h-auto"
              required
              size={4}
            >
              {allCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              Hold Ctrl/Cmd to select multiple
            </p>
          </div>

          {/* Authors - Multiple */}
          <div>
            <label className="block text-gray-700 mb-2">Authors *</label>
            <select
              multiple
              name="authors"
              onChange={handleMultiSelectChange}
              className="w-full px-4 py-2 border rounded-lg h-auto"
              required
              size={4}
            >
              {allAuthors.map(author => (
                <option key={author.id} value={author.id}>{author.name}</option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              Hold Ctrl/Cmd to select multiple
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <FiSave className="mr-2" />
            {isSubmitting ? "Saving..." : "Save Book"}
          </button>
        </div>
      </form>
    </div>
  );
}