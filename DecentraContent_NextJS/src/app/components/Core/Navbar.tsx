import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-pink-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-black font-bold text-4xl">DCEX</span>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/"
                  className="text-white hover:bg-black hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Home
                </Link>
                <Link
                  href="/IpfsConvertor"
                  className="text-white hover:bg-black hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  IpfsConvertor
                </Link>
                <Link
                  href="/contact"
                  className="text-white hover:bg-black hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;