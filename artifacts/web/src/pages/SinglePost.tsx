import { useState, useEffect } from "react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import ImageCard from "@/components/ImageCard";
import Lightbox from "@/components/Lightbox";
import { getPostImages, getRelatedPosts, getPostDescription, keywords, type ImageItem } from "@/data/mockData";

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

interface SinglePostProps {
  slug: string;
}

export default function SinglePost({ slug }: SinglePostProps) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const title = keywords.find(k => k.slug === slug)?.name ||
    slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  const related = getRelatedPosts(slug);
  const descriptions = getPostDescription(title);

  useEffect(() => {
    setImages(getPostImages(slug));
    window.scrollTo(0, 0);
  }, [slug]);

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

                <div className="prose prose-sm max-w-none text-gray-700 space-y-3">
                  <p className="text-justify">{descriptions[0]} {descriptions[1]}</p>
                  <p className="text-justify"><br />{descriptions[2]} {descriptions[3]}</p>
                </div>

                <hr className="my-6" />

                <h2 className="text-xl font-bold mb-4">Related Posts of {title}:</h2>
                <div className="flex flex-wrap gap-2">
                  {related.map(kw => (
                    <Link key={kw.id} href={`/${kw.slug}`}>
                      <button className={`text-white text-xs px-4 py-1.5 rounded-lg leading-none shadow-sm transition-colors ${colorMap[kw.color] || "bg-blue-500 hover:bg-blue-600"}`}>
                        {kw.name}
                      </button>
                    </Link>
                  ))}
                </div>
              </div>

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
                  <div className="relative">
                    <button onClick={() => setLightboxIndex(6)} className="block w-full">
                      <img
                        src={images[6].image}
                        alt={images[6].title}
                        className="w-full object-cover max-h-[500px] cursor-zoom-in"
                        loading="lazy"
                      />
                    </button>
                  </div>
                  <div className="p-4 text-center">
                    <h2 className="text-xl font-bold text-gray-800">
                      {Math.floor(Math.random() * 55) + 15}+ Images of {title}
                    </h2>
                  </div>
                </div>
              )}

              {descriptions.length > 2 && (
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                  <div className="prose prose-sm max-w-none text-gray-700 space-y-3">
                    {descriptions.slice(4).map((d, i) => (
                      <p key={i} className="text-justify">{d}</p>
                    ))}
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
            </section>

            <Sidebar keywords={keywords.sort(() => Math.random() - 0.5)} />
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
