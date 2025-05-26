import Link from "next/link";
import Image from "next/image";
import { type Category } from "@/lib/types";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <div className="bg-gray-100 rounded-lg overflow-hidden">
      <div className="relative aspect-square">
        <Image
          src={category.imageUrl}
          alt={category.imageAltText}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
        <p className="text-gray-600 mb-4">{category.description}</p>
        <Link
          href={`/menu/${category.slug}`}
          className="inline-block bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
        >
          View all {category.name.toLowerCase()}
        </Link>
      </div>
    </div>
  );
}
