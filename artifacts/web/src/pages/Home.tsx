import { useState, useEffect } from "react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import ImageCard from "@/components/ImageCard";
import { getHomeImages, keywords, slugify, type ImageItem } from "@/data/mockData";

export default function Home() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const imgs = getHomeImages();
    setImages(imgs);
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-6 items-start">
            <section className="flex-1 min-w-0">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Wallpaper Gallery</h1>
                <p className="text-gray-500 text-sm mt-1">Discover beautiful wallpapers and images</p>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
                      <div className="h-56 bg-gray-200 animate-pulse" />
                      <div className="p-3">
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {images.map((item, i) => (
                    <ImageCard
                      key={i}
                      item={item}
                      linkHref={`/${item.slug}`}
                    />
                  ))}
                </div>
              )}

              <div className="mt-10">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Browse Categories</h2>
                <div className="flex flex-wrap gap-2">
                  {keywords.map(kw => (
                    <Link key={kw.id} href={`/${kw.slug}`}>
                      <span className="inline-block bg-white border border-gray-200 hover:border-blue-400 hover:text-blue-600 text-gray-700 text-sm px-4 py-1.5 rounded-full shadow-sm transition-all cursor-pointer">
                        {kw.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </section>

            <Sidebar keywords={keywords.sort(() => Math.random() - 0.5)} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
