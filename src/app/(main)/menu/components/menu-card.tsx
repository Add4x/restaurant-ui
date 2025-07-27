"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Category } from "@/lib/types";
import { Divider } from "@/components/divider";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useMenuStore } from "@/stores/menu-store";
import { ArrowRight } from "lucide-react";

interface MenuCardProps {
  item: Category;
}

export function MenuCard({ item }: MenuCardProps) {
  const router = useRouter();
  const { setCurrentCategory } = useMenuStore();

  const handleViewMore = () => {
    // Set the current category in the store
    setCurrentCategory(item.slug);

    // Navigate to the category page
    router.push(`/menu/${item.slug}`);
  };

  return (
    <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 h-full flex flex-col">
      <div className="relative w-full h-[14rem] overflow-hidden">
        <Image
          src={item.imageUrl}
          alt={item.imageAltText}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="flex flex-col flex-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl md:text-2xl font-bold text-primaryDark font-playfair">
            {item.name}
          </CardTitle>
        </CardHeader>
        
        <Divider className="mx-6" />
        
        <CardContent className="pt-4 pb-6 flex flex-col flex-1 justify-between">
          <p className="text-sm md:text-base text-gray-600 mb-4 line-clamp-3">
            {item.description}
          </p>
          <Button
            onClick={handleViewMore}
            variant="outline"
            className="group/btn hover:bg-primary hover:text-white transition-all self-start"
          >
            View Menu
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </CardContent>
      </div>
    </Card>
  );
}