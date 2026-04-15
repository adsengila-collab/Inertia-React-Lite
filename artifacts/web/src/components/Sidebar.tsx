import { Link } from "wouter";
import type { Keyword } from "@/data/mockData";

const colorMap: Record<string, string> = {
  "bg-green": "bg-green-500 hover:bg-green-600",
  "bg-blue": "bg-blue-500 hover:bg-blue-600",
  "bg-indigo": "bg-indigo-500 hover:bg-indigo-600",
  "bg-red": "bg-red-500 hover:bg-red-600",
  "bg-yellow": "bg-yellow-500 hover:bg-yellow-600",
  "bg-orange": "bg-orange-500 hover:bg-orange-600",
  "bg-teal": "bg-teal-500 hover:bg-teal-600",
  "bg-purple": "bg-purple-500 hover:bg-purple-600",
  "bg-pink": "bg-pink-500 hover:bg-pink-600",
};

interface SidebarProps {
  keywords: Keyword[];
}

export default function Sidebar({ keywords }: SidebarProps) {
  return (
    <aside className="hidden lg:block lg:w-64 shrink-0 my-6">
      <div className="bg-white rounded-xl shadow-md p-4 sticky top-20">
        <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide mb-4 pb-2 border-b">
          Random Posts
        </h3>
        <div className="flex flex-wrap gap-2">
          {keywords.slice(0, 20).map((kw) => (
            <Link key={kw.id} href={`/${kw.slug}`}>
              <button
                className={`text-white text-xs px-3 py-1.5 rounded-full leading-none shadow-sm transition-colors ${colorMap[kw.color] || "bg-blue-500 hover:bg-blue-600"}`}
              >
                {kw.name}
              </button>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
