import { Link } from "wouter";
import { useState } from "react";
import type { ImageItem } from "@/data/mockData";

interface ImageCardProps {
  item: ImageItem;
  linkHref: string;
  showLightbox?: boolean;
  onLightboxOpen?: (item: ImageItem) => void;
}

export default function ImageCard({ item, linkHref, showLightbox, onLightboxOpen }: ImageCardProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="border-2 bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
      <div className="h-56 overflow-hidden bg-gray-100 relative">
        {!loaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {showLightbox && onLightboxOpen ? (
          <button
            onClick={() => onLightboxOpen(item)}
            className="block w-full h-full"
          >
            <img
              src={error ? item.thumbnail : item.image}
              alt={item.title}
              onLoad={() => setLoaded(true)}
              onError={() => { setError(true); setLoaded(true); }}
              className={`object-cover h-full w-full transition-transform duration-500 group-hover:scale-110 cursor-zoom-in ${loaded ? "opacity-100" : "opacity-0"}`}
              loading="lazy"
            />
          </button>
        ) : (
          <Link href={linkHref} className="block w-full h-full">
            <img
              src={error ? item.thumbnail : item.image}
              alt={item.title}
              onLoad={() => setLoaded(true)}
              onError={() => { setError(true); setLoaded(true); }}
              className={`object-cover h-full w-full transition-transform duration-500 group-hover:scale-110 ${loaded ? "opacity-100" : "opacity-0"}`}
              loading="lazy"
            />
          </Link>
        )}
      </div>
      <div className="p-3 text-center">
        <h2 className="font-semibold text-sm text-gray-800 truncate">
          <Link
            href={linkHref}
            className="hover:text-blue-600 transition-colors"
          >
            {item.title}
          </Link>
        </h2>
      </div>
    </div>
  );
}
