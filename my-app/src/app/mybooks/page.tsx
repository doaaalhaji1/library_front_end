import Nav from '../components/Nav';
import Footer from '../components/Footer';
import MyBooksSection from '../components/MyBooksSection';

export default function MyBooksPage() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-between">
      <Nav activeTab="mybooks" />
      <div className="flex-grow p-4">
        <MyBooksSection />
      </div>
      <Footer />
    </div>
  );
}
