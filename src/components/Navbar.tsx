import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-[#0000FF] to-blue-400 backdrop-blur-md border-b border-blue-300/30 shadow-lg"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="bg-white px-2 py-1 rounded-xl border border-blue-200 shadow-md flex items-center gap-2" aria-label="Base Minter logo">
          <img src="/logo.svg" alt="Base Minter logo icon" className="h-7 w-7 sm:h-8 sm:w-8 rounded" />
          <span className="text-base sm:text-lg font-extrabold text-black tracking-wide">Base Minter</span>
        </span>
      </div>
      <div className="flex items-center gap-4">
        <a
          href="/gallery"
          className="text-white font-bold px-4 py-2 rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          aria-label="View Profile"
        >
          Profile
        </a>
        {/* Removed: Verify link from navbar. */}
        <ConnectButton />
      </div>
    </nav>
  );
}