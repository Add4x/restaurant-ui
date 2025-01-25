import { Suspense } from "react";
import { subMenuItems } from "@/data/submenu-items";
import { MenuItemsGrid } from "@/app/menu/[slug]/menu-items-grid";
import { LoadingGrid } from "@/components/loading-grid";
import { notFound } from "next/navigation";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const categoryId = subMenuItems[slug as keyof typeof subMenuItems];

  if (!categoryId) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-12 normal-case font-playfair text-primaryDark text-center">
          {slug.replace("-", " ")}
        </h1>
        <Suspense fallback={<LoadingGrid />}>
          <MenuItemsGrid categoryId={categoryId} />
        </Suspense>
      </div>
    </div>
  );
}
