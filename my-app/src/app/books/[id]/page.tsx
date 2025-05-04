import BookDetailClient from './BookDetailClient';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation'; 
require('dotenv').config();             
interface PageProps {
  params: { id: string };
}

async function getBookData(id: string): Promise<any> {
  const token = (await cookies()).get('token')?.value;
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/books/${id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    next: { revalidate: 60 } 
  });

  if (!response.ok) {
    return null; // ارجع null بدل ما ترمي خطأ
  }

  const data = await response.json();
  
  return {
    ...data,
    authors: data.authors || [],
    categories: data.categories || []
  };
}

export default async function BookDetailPage({ params }: PageProps) {
  const { id } = params;

  const book = await getBookData(id);

  if (!book) {
    notFound(); // هذا بيرجع صفحة 404 الأصلية من Next.js
  }

  return <BookDetailClient book={book} />;
}
