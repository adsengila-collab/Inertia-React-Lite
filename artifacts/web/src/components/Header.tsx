import { Link } from "wouter";
import { useState } from "react";
import { Menu, X, Search } from "lucide-react";
import { useNavigate } from "@/hooks/useNavigate";

interface HeaderProps {
  title?: string;
}

export default function Header({ title = "WallpaperHub" }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { goToPost } = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      goToPost(searchQuery.trim());
      setSearchQuery("");
    }
  };

  return (
    <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-sm">W</div>
            <span className="text-xl font-bold tracking-tight">{title}</span>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex items-center bg-slate-800 rounded-lg px-3 py-1.5 gap-2 flex-1 max-w-sm mx-8">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search wallpapers..."
              className="bg-transparent text-sm text-white placeholder-slate-400 outline-none w-full"
            />
          </form>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="text-slate-300 hover:text-white transition-colors">Home</Link>
            <Link href="/p/contact" className="text-slate-300 hover:text-white transition-colors">Contact</Link>
            <Link href="/p/privacy-policy" className="text-slate-300 hover:text-white transition-colors">Privacy</Link>
          </nav>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-800 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700">
          <div className="px-4 py-3 space-y-1">
            <form onSubmit={handleSearch} className="flex items-center bg-slate-700 rounded-lg px-3 py-2 gap-2 mb-3">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search wallpapers..."
                className="bg-transparent text-sm text-white placeholder-slate-400 outline-none w-full"
              />
            </form>
            <Link href="/" onClick={() => setMenuOpen(false)} className="block py-2 text-slate-300 hover:text-white transition-colors">Home</Link>
            <Link href="/p/contact" onClick={() => setMenuOpen(false)} className="block py-2 text-slate-300 hover:text-white transition-colors">Contact</Link>
            <Link href="/p/privacy-policy" onClick={() => setMenuOpen(false)} className="block py-2 text-slate-300 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/p/dmca" onClick={() => setMenuOpen(false)} className="block py-2 text-slate-300 hover:text-white transition-colors">DMCA</Link>
          </div>
        </div>
      )}
    </header>
  );
}
