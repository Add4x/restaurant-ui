import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Category } from "@/lib/types";
import { Divider } from "@/components/divider";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface MenuCardProps {
  item: Category;
}

export function MenuCard({ item }: MenuCardProps) {
  const router = useRouter();

  const handleViewMore = () => {
    const slug = item.name.toLowerCase().replace(/\s+/g, "-");
    router.push(`/menu/${slug}`);
  };

  return (
    <Card className="overflow-hidden backdrop-blur-xs md:mt-4">
      <div className="flex flex-col">
        <div className="relative w-full h-[12.5rem]">
          <Image
            src={item.imageUrl}
            alt={item.imageAltText}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <CardHeader className="flex flex-col py-2">
          <CardTitle className="text-xl font-bold text-primaryDark">
            {item.name}
          </CardTitle>
        </CardHeader>
        <Divider />
        <CardContent className="py-2 flex flex-col justify-around mb-2">
          <p className="text-sm text-gray-700 mb-2 normal-case">
            {item.description}
          </p>
          <Button
            onClick={handleViewMore}
            className="self-start cursor-pointer"
          >
            View More
          </Button>
        </CardContent>
      </div>
    </Card>
  );
}
