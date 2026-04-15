import { useState, useEffect } from "react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import ImageCard from "@/components/ImageCard";
import { useGetRandomKeywords, useSearchImages } from "@workspace/api-client-react";
import type { ImageResult, Keyword } from "@workspace/api-client-react";

export default function Home() {
  const [activeKeyword, setActiveKeyword] = useState<string>("");

  const { data: randomKwData, isLoading: loadingKw } = useGetRandomKeywords({ count: 30 });

  const keywords: Keyword[] = randomKwData?.keywords ?? [];
  const sidebarKw = [...keywords].sort(() => Math.random() - 0.5);

  useEffect(() => {
    if (keywords.length > 0 && !activeKeyword) {
      setActiveKeyword(keywords[0].name);
    }
  }, [keywords, activeKeyword]);

  const { data: imageData, isLoading: loadingImages, isFetching } = useSearchImages(
    { q: activeKeyword, count: 20 },
    { query: { enabled: !!activeKeyword } }
  );

  const images: ImageResult[] = imageData?.images ?? [];
  const loading = loadingImages || isFetching;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-6 items-start">
            <section className="flex-1 min-w-0">
              <div className="mb-5">
                <h1 className="text-2xl font-bold text-gray-900">Wallpaper Gallery</h1>
                <p className="text-gray-500 text-sm mt-1">Discover beautiful wallpapers and images</p>
              </div>

              {loadingKw ? (
                <div className="flex gap-2 mb-5 flex-wrap">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-8 w-24 bg-gray-200 rounded-full animate-pulse" />
                  ))}
                </div>
              ) : keywords.length > 0 ? (
                <div className="flex gap-2 mb-5 flex-wrap">
                  {keywords.slice(0, 15).map(kw => (
                    <button
                      key={kw.slug}
                      onClick={() => setActiveKeyword(kw.name)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                        activeKeyword === kw.name
                          ? "bg-blue-600 text-white border-blue-600 shadow-md"
                          : "bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:text-blue-600"
                      }`}
                    >
                      {kw.name}
                    </button>
                  ))}
                </div>
              ) : null}

              {activeKeyword && (
                <div className="mb-4 flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-gray-800">{activeKeyword}</h2>
                  {loading && (
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
              )}

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
                      <div className="h-56 bg-gray-200 animate-pulse" />
                      <div className="p-3"><div className="h-4 bg-gray-200 rounded animate-pulse" /></div>
                    </div>
                  ))}
                </div>
              ) : images.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <p className="text-lg font-medium">No images found</p>
                  <p className="text-sm mt-1">Try selecting a different keyword</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {images.map((item, i) => (
                    <ImageCard
                      key={i}
                      item={{
                        id: String(i),
                        title: item.title,
                        image: item.image,
                        thumbnail: item.thumbnail,
                        slug: item.title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, ""),
                      }}
                      linkHref={`/${item.title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "")}`}
                    />
                  ))}
                </div>
              )}

              {keywords.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">Browse Categories</h2>
                  <div className="flex flex-wrap gap-2">
                    {keywords.map(kw => (
                      <Link key={kw.slug} href={`/${kw.slug}`}>
                        <span className="inline-block bg-white border border-gray-200 hover:border-blue-400 hover:text-blue-600 text-gray-700 text-sm px-4 py-1.5 rounded-full shadow-sm transition-all cursor-pointer">
                          {kw.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <Sidebar keywords={sidebarKw.map((k, i) => ({
              id: String(i),
              name: k.name,
              slug: k.slug,
              color: ["bg-green","bg-blue","bg-indigo","bg-red","bg-yellow","bg-orange","bg-teal","bg-purple","bg-pink"][i % 9],
            }))} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
