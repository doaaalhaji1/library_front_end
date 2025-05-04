import Image from 'next/image';
import Link from 'next/link';
export default function Home() {
  return (
    <div dir="ltr" className="flex flex-col-reverse justify-center items-center h-screen relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/background11.jpg" // Path to the image
          alt="Background"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
        {/* Overlay */}
        
      </div>

      {/* Buttons */}
      <div className="flex space-x-4 mb-8 z-10">
  <Link href="/login" passHref>
    <button
      aria-label="Login"
      className="flex-1 px-6 py-3 bg-[#2D60B0] text-white rounded-lg hover:bg-[#4D9BF1] transition duration-300"
    >
      Login
    </button>
  </Link>
  <Link href="/register" passHref>
    <button
      aria-label="Sign Up"
      className="flex-1 px-6 py-3 bg-transparent text-black border border-black rounded-lg hover:bg-[#2D60B0] hover:text-white transition duration-300"
    >
      Sign Up
    </button>
  </Link>
</div>

      {/* Content */}
      <div className="text-center mb-12 z-10">
        <h1 className="text-5xl font-semibold text-[#000000] mb-4">Welcome to Our Digital Library!</h1>
        <p className="text-xl text-[#000000]">Login or create a new account to explore a vast collection of books.</p>
      </div>

      {/* Additional Section */}
      <div className="text-center text-[#000000] z-10 max-w-2xl px-4">
        <h2 className="text-2xl font-semibold mb-2">Discover Thousands of E-Books</h2>
        <p className="text-lg">From classic literature to the latest research papers, our library offers a diverse selection for all readers.</p>
      </div>
    </div>
  );
}