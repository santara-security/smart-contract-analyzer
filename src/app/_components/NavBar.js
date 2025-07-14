import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800/50 animate-fadeSlideDown">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Link 
            href={"/"}
            className="w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center from-indigo-500 to-indigo-600 cursor-pointer">
              {/* CPU Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-cpu w-4 h-4 text-white stroke-2"
              >
                <path d="M12 20v2"></path>
                <path d="M12 2v2"></path>
                <path d="M17 20v2"></path>
                <path d="M17 2v2"></path>
                <path d="M2 12h2"></path>
                <path d="M2 17h2"></path>
                <path d="M2 7h2"></path>
                <path d="M20 12h2"></path>
                <path d="M20 17h2"></path>
                <path d="M20 7h2"></path>
                <path d="M7 20v2"></path>
                <path d="M7 2v2"></path>
                <rect x="4" y="4" width="16" height="16" rx="2"></rect>
                <rect x="8" y="8" width="8" height="8" rx="1"></rect>
              </svg>
            </Link>
            <Link href="/" className="text-lg tracking-tight font-geist font-normal">
              Nexus AI
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/analyze"
              className="text-sm text-neutral-400 hover:text-neutral-200 transition-colors font-geist font-normal"
            >
              Analyze
            </Link>
          </div>
          <button className="md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-menu w-5 h-5"
            >
              <path d="M4 12h16"></path>
              <path d="M4 18h16"></path>
              <path d="M4 6h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
