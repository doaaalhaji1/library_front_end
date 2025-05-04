"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FiSave, FiArrowLeft, FiTrash2, FiImage, FiLoader } from "react-icons/fi";
require('dotenv').config();

interface Category {
  id: string;
  name: string;
}

interface Author {
  id: string;
  name: string;
}

interface BookFormData {
  title: string;
  description: string;
  language: string;
  book_content: string;
  categories: string[];
  authors: string[];
  image: string;
}

export default function EditBookPage() {
  const router = useRouter();
  const { id } = useParams();
  const bookId = id as string;

  // Component states
  const [formData, setFormData] = useState<BookFormData>({
    title: "",
    description: "",
    language: "English",
    book_content: "",
    categories: [],
    authors: [],
    image: ""
  });

  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [allAuthors, setAllAuthors] = useState<Author[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Fetch book data on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication token not found");
     
        const [bookRes, categoriesRes, authorsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/books/${bookId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/authors`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (!bookRes.ok) throw new Error("Failed to fetch book data");
        if (!categoriesRes.ok) throw new Error("Failed to fetch categories");
        if (!authorsRes.ok) throw new Error("Failed to fetch authors");

        const [bookData, categoriesData, authorsData] = await Promise.all([
          bookRes.json() as Promise<{
            title: string;
            description: string;
            language?: string;
            book_content?: string;
            categories?: { id: string }[];
            authors?: { id: string }[];
            image?: string;
          }>,
          categoriesRes.json() as Promise<Category[]>,
          authorsRes.json() as Promise<Author[]>
        ]);

        setFormData({
          title: bookData.title,
          description: bookData.description,
          language: bookData.language || "English",
          book_content: bookData.book_content || "",
          categories: bookData.categories?.map(c => c.id) || [],
          authors: bookData.authors?.map(a => a.id) || [],
          image: bookData.image || ""
        });

        if (bookData.image) {
          setImagePreview(bookData.image);
        }

        setAllCategories(categoriesData);
        setAllAuthors(authorsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [bookId]);

  // Handle text field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle multi-select changes
  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, options } = e.target;
    const selectedValues = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
    setFormData(prev => ({ ...prev, [name]: selectedValues }));
  };

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
      
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove image
  const handleRemoveImage = () => {
    setNewImage(null);
    setImagePreview("");
    setFormData(prev => ({ ...prev, image: "" }));
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

      const formDataToSend = new FormData();
      
      // Add text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'categories' && key !== 'authors' && key !== 'image') {
          formDataToSend.append(key, value);
        }
      });

      // Add arrays
      formData.categories.forEach(cat => {
        formDataToSend.append('categories[]', cat);
      });
      
      formData.authors.forEach(auth => {
        formDataToSend.append('authors[]', auth);
      });
      
      // Handle images
      if (newImage) {
        formDataToSend.append('image', newImage);
      } else if (!formData.image) {
        formDataToSend.append('remove_image', 'true');
      }

      // Add method override for server compatibility
      formDataToSend.append('_method', 'PUT');
    
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/updateBook/${bookId}`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update book");
      }

      router.push("/admin/books");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FiLoader className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center mb-8">
        <button 
          onClick={() => router.push("/admin/books")}
          className="flex items-center p-2 rounded-lg hover:bg-gray-100 mr-4 transition-colors"
        >
          <FiArrowLeft className="text-xl" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Edit Book</h1>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
          <div className="flex items-center">
            <div className="text-red-500 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
        <div className="space-y-6">
          {/* Cover Image Section */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Cover Image</h2>
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="relative w-48 h-64 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden bg-gray-50 flex items-center justify-center">
                {imagePreview ? (
                  <>
                    <img 
                      src={imagePreview} 
                      alt="Book cover preview" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md hover:bg-red-50 text-red-500 transition-colors"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <FiImage className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">No image</p>
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {imagePreview ? "Change Image" : "Upload Image"}
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer">
                    <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      Choose File
                    </span>
                    <input
                      type="file"
                      id="book-cover"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                  </label>
                  <p className="text-sm text-gray-500">
                    JPEG, PNG or GIF (Max 2MB)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Book Information */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Book Title */}
            <div className="sm:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Book Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                minLength={3}
                maxLength={100}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                required
                minLength={15}
                maxLength={100}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              />
            </div>

            {/* Language */}
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                Language *
              </label>
              <select
                id="language"
                name="language"
                value={formData.language}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              >
                <option value="Arabic">Arabic</option>
                <option value="English">English</option>
                <option value="French">French</option>
              </select>
            </div>

            {/* Book Content */}
            <div>
              <label htmlFor="book_content" className="block text-sm font-medium text-gray-700 mb-1">
                Book Content
              </label>
              <textarea
                id="book_content"
                name="book_content"
                rows={3}
                value={formData.book_content}
                onChange={handleChange}
                minLength={5}
                maxLength={100}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              />
            </div>

            {/* Categories */}
            <div>
              <label htmlFor="categories" className="block text-sm font-medium text-gray-700 mb-1">
                Categories *
              </label>
              <select
                id="categories"
                name="categories"
                multiple
                size={4}
                value={formData.categories}
                onChange={handleMultiSelectChange}
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              >
                {allCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Hold Ctrl/Cmd to select multiple options
              </p>
            </div>

            {/* Authors */}
            <div>
              <label htmlFor="authors" className="block text-sm font-medium text-gray-700 mb-1">
                Authors *
              </label>
              <select
                id="authors"
                name="authors"
                multiple
                size={4}
                value={formData.authors}
                onChange={handleMultiSelectChange}
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              >
                {allAuthors.map((author) => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Hold Ctrl/Cmd to select multiple options
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/books")}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Saving...
              </>
            ) : (
              <>
                <FiSave className="-ml-1 mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}