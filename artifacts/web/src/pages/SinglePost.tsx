import { useState, useEffect } from "react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import ImageCard from "@/components/ImageCard";
import Lightbox from "@/components/Lightbox";
import { useSearchImages, useGetRandomKeywords } from "@workspace/api-client-react";
import type { ImageResult } from "@workspace/api-client-react";
import type { ImageItem } from "@/data/mockData";

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

const COLOR_LIST = ["bg-green","bg-blue","bg-indigo","bg-red","bg-yellow","bg-orange","bg-teal","bg-purple","bg-pink"];

interface SinglePostProps {
  slug: string;
}

function slugToTitle(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}

function imageResultToItem(item: ImageResult, index: number): ImageItem {
  return {
    id: String(index),
    title: item.title,
    image: item.image,
    thumbnail: item.thumbnail,
    slug: item.title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, ""),
  };
}

export default function SinglePost({ slug }: SinglePostProps) {
  const title = slugToTitle(slug);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  const { data: imageData, isLoading } = useSearchImages(
    { q: title, count: 20 },
    { query: { enabled: !!slug } }
  );

  const { data: relatedData } = useGetRandomKeywords({ count: 20 });

  const rawImages: ImageResult[] = imageData?.images ?? [];
  const images: ImageItem[] = rawImages.map(imageResultToItem);

  const related = (relatedData?.keywords ?? [])
    .filter(k => k.slug !== slug)
    .slice(0, 9);

  const openLightbox = (item: ImageItem) => {
    const idx = images.findIndex(i => i.id === item.id);
    if (idx !== -1) setLightboxIndex(idx);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-6 items-start">
            <section className="flex-1 min-w-0">
              <nav className="text-sm text-gray-500 mb-4">
                <Link href="/" className="hover:text-blue-600">Home</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-800 font-medium">{title}</span>
              </nav>

              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-4">{title}</h1>
                <hr className="my-4" />

                {isLoading ? (
                  <div className="space-y-3 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                    <div className="h-4 bg-gray-200 rounded w-4/6" />
                  </div>
                ) : (
                  <div className="text-gray-700 text-sm space-y-3">
                    <p className="text-justify">
                      Discover the most stunning {title.toLowerCase()} images and wallpapers available. 
                      Our curated collection features breathtaking photography and artistic interpretations 
                      that will transform your screen.
                    </p>
                    <p className="text-justify">
                      Whether you are looking for desktop backgrounds, phone wallpapers, or artistic inspiration, 
                      this {title.toLowerCase()} gallery has everything you need. Each image is sourced for quality and visual impact.
                    </p>
                  </div>
                )}

                <hr className="my-6" />

                <h2 className="text-lg font-bold mb-4">Related Posts:</h2>
                <div className="flex flex-wrap gap-2">
                  {related.map((kw, i) => (
                    <Link key={kw.slug} href={`/${kw.slug}`}>
                      <button className={`text-white text-xs px-4 py-1.5 rounded-lg leading-none shadow-sm transition-colors ${colorMap[COLOR_LIST[i % 9]] || "bg-blue-500 hover:bg-blue-600"}`}>
                        {kw.name}
                      </button>
                    </Link>
                  ))}
                </div>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
                      <div className="h-56 bg-gray-200 animate-pulse" />
                      <div className="p-3"><div className="h-4 bg-gray-200 rounded animate-pulse" /></div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {images.slice(0, 6).map((item, i) => (
                      <ImageCard
                        key={i}
                        item={item}
                        linkHref="#"
                        showLightbox
                        onLightboxOpen={openLightbox}
                      />
                    ))}
                  </div>

                  {images[6] && (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                      <button onClick={() => setLightboxIndex(6)} className="block w-full">
                        <img
                          src={images[6].image}
                          alt={images[6].title}
                          className="w-full object-cover max-h-[500px] cursor-zoom-in"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = images[6].thumbnail;
                          }}
                        />
                      </button>
                      <div className="p-4 text-center">
                        <h2 className="text-xl font-bold text-gray-800">
                          {Math.floor(Math.random() * 55) + 15}+ Images of {title}
                        </h2>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {images.slice(7).map((item, i) => (
                      <ImageCard
                        key={i + 7}
                        item={item}
                        linkHref="#"
                        showLightbox
                        onLightboxOpen={openLightbox}
                      />
                    ))}
                  </div>
                </>
              )}

              {images.length === 0 && !isLoading && (
                <div className="text-center py-16 text-gray-400">
                  <p className="text-lg font-medium">No images found</p>
                  <p className="text-sm mt-1">Try searching for a different term</p>
                </div>
              )}
            </section>

            <Sidebar keywords={(relatedData?.keywords ?? []).map((k, i) => ({
              id: String(i),
              name: k.name,
              slug: k.slug,
              color: COLOR_LIST[i % 9],
            }))} />
          </div>
        </div>
      </main>

      <Footer />

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNext={() => setLightboxIndex(prev => (prev !== null && prev < images.length - 1 ? prev + 1 : prev))}
          onPrev={() => setLightboxIndex(prev => (prev !== null && prev > 0 ? prev - 1 : prev))}
        />
      )}
    </div>
  );
}
