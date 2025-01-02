import { MenuCard } from "@/app/menu/components/menu-card";
import { Category } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/divider";
interface MenuCategoryGridProps {
  items: Category[];
}

export async function MenuCategoryGrid({ items }: MenuCategoryGridProps) {
  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8 text-primaryDark font-playfair">
        Our Menu
      </h1>
      <div className="grid gap-6">
        {/* first item - full width */}
        <Card className="w-full rounded-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative w-full h-[18.75rem] ">
              <Image
                src={items[0].image_url}
                alt={items[0].image_alt_text}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <CardContent className="flex flex-col gap-4 justify-center">
              <CardHeader className="p-0"></CardHeader>
              <CardTitle className="text-2xl font-bold text-primaryDark">
                {items[0].name}
              </CardTitle>
              <Divider />
              <CardDescription className="flex flex-col gap-4 text-sm text-gray-500">
                <p className="text-sm">{items[0].description}</p>
                <Button className="self-start">View More</Button>
              </CardDescription>
            </CardContent>
          </div>
        </Card>
        {/* Remaining items */}
        <div className="grid md:grid-cols-2 gap-6">
          {items.slice(1).map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
