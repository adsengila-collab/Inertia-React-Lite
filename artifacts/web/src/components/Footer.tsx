import { Link } from "wouter";
import { Rss, Map } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-800 text-white mt-10">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-3">WallpaperHub</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Your premier destination for high-quality wallpapers, stunning photography, and beautiful artwork curated from around the world.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-3">Pages</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/p/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/p/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/p/dmca" className="hover:text-white transition-colors">DMCA</Link></li>
              <li><Link href="/p/copyright" className="hover:text-white transition-colors">Copyright</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-3">Resources</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a href="/rss.xml" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Rss className="w-4 h-4" /> RSS Feed
                </a>
              </li>
              <li>
                <a href="/sitemaps" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Map className="w-4 h-4" /> Sitemaps
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-700 pt-6 text-center text-sm text-slate-400">
          <p>Copyright &copy; {year} WallpaperHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
