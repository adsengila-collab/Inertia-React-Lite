export interface ImageItem {
  id: string;
  title: string;
  image: string;
  thumbnail: string;
  slug: string;
}

export interface Keyword {
  id: string;
  name: string;
  slug: string;
  color: string;
}

const colors = [
  "bg-green", "bg-blue", "bg-indigo", "bg-red",
  "bg-yellow", "bg-orange", "bg-teal", "bg-purple", "bg-pink"
];

function randomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const keywordList = [
  "Sunset Wallpaper", "Nature Photography", "Abstract Art", "Mountain Landscape",
  "Ocean Waves", "Forest Walk", "City Skyline", "Floral Design",
  "Vintage Aesthetic", "Dark Aesthetic", "Minimal Design", "Galaxy Space",
  "Anime Art", "Watercolor Painting", "Geometric Pattern", "Pastel Colors",
  "Black and White", "Neon Lights", "Japanese Art", "Fantasy World",
  "Wildlife Photography", "Architecture Design", "Street Art", "Portrait Photography",
  "Macro Photography", "Night Sky", "Desert Landscape", "Snow Mountain",
  "Tropical Beach", "Autumn Leaves"
];

export const keywords: Keyword[] = keywordList.map((name, i) => ({
  id: String(i + 1),
  name,
  slug: slugify(name),
  color: colors[i % colors.length]
}));

function generateImages(query: string, count: number): ImageItem[] {
  const items: ImageItem[] = [];
  const seed = query.charCodeAt(0) + query.length;
  const categories = [
    "nature", "architecture", "abstract", "technology", "animals",
    "travel", "food", "fashion", "city", "art"
  ];
  const cat = categories[seed % categories.length];
  for (let i = 0; i < count; i++) {
    const imgId = (seed * 7 + i * 13) % 1000 + 100;
    items.push({
      id: String(i),
      title: `${query} ${i > 0 ? `- Style ${i + 1}` : ""}`.trim(),
      image: `https://picsum.photos/seed/${imgId + seed}/800/600`,
      thumbnail: `https://picsum.photos/seed/${imgId + seed}/400/300`,
      slug: slugify(`${query}${i > 0 ? `-${i + 1}` : ""}`)
    });
  }
  return items;
}

export function getHomeImages(): ImageItem[] {
  const randomKw = keywordList[Math.floor(Math.random() * keywordList.length)];
  return generateImages(randomKw, 20);
}

export function getPostImages(slug: string): ImageItem[] {
  const title = keywords.find(k => k.slug === slug)?.name ||
    slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  return generateImages(title, 15);
}

export function getRelatedPosts(slug: string): Keyword[] {
  return keywords
    .filter(k => k.slug !== slug)
    .sort(() => Math.random() - 0.5)
    .slice(0, 9);
}

export function getPostDescription(title: string): string[] {
  return [
    `Discover the most stunning ${title.toLowerCase()} images and wallpapers available online. Our curated collection features breathtaking photography and artistic interpretations that will transform your screen.`,
    `Whether you're looking for desktop backgrounds, phone wallpapers, or artistic inspiration, our ${title.toLowerCase()} gallery has everything you need. Each image is hand-selected for quality and visual impact.`,
    `Explore hundreds of high-resolution ${title.toLowerCase()} photos from talented photographers around the world. Perfect for personal use, creative projects, or simply enjoying beautiful imagery.`,
    `Our ${title.toLowerCase()} collection is constantly updated with fresh content to keep your experience exciting and new. Browse through the gallery and find your perfect wallpaper today.`,
    `From minimalist compositions to dramatic scenes, the ${title.toLowerCase()} category offers a diverse range of styles and aesthetics to suit every taste and preference.`
  ];
}
