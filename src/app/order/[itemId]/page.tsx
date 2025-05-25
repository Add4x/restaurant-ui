"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  ChevronLeft,
  Minus,
  Plus,
  ShoppingCart,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCartStore } from "@/stores/cart-store";
import { MenuItem, MenuItemProtein } from "@/lib/types";

type SpiceLevel = "mild" | "medium" | "spicy" | "hot" | "very-hot";

export default function OrderItemPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addItem } = useCartStore();
  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedProtein, setSelectedProtein] =
    useState<MenuItemProtein | null>(null);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [spiceLevel, setSpiceLevel] = useState<SpiceLevel | null>(null);
  const [spiceLevelError, setSpiceLevelError] = useState(false);

  const itemData = searchParams.get("data");

  useEffect(() => {
    try {
      // Try to parse the item data from the URL
      if (itemData) {
        const decodedItem = JSON.parse(
          decodeURIComponent(itemData)
        ) as MenuItem;
        setItem(decodedItem);

        // Set default protein if available
        if (decodedItem?.menu_item_proteins?.length) {
          setSelectedProtein(decodedItem.menu_item_proteins[0]);
        }
      } else {
        console.error("No item data found in URL");
      }
    } catch (error) {
      console.error("Error parsing item data:", error);
    } finally {
      setLoading(false);
    }
  }, [itemData]);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleProteinChange = (proteinIndex: number) => {
    if (item?.menu_item_proteins[proteinIndex]) {
      setSelectedProtein(item.menu_item_proteins[proteinIndex]);
    }
  };

  const handleAddToCart = () => {
    if (item) {
      // Require spice level selection before adding to cart
      if (!spiceLevel) {
        setSpiceLevelError(true);
        return;
      }

      setSpiceLevelError(false);
      // In a real implementation, we'd include spiceLevel and specialInstructions
      // with the order details
      addItem(item, selectedProtein);
      router.push("/checkout");
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto p-4 min-h-[80vh] flex items-center justify-center">
        <p>Loading item details...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container max-w-4xl mx-auto p-4 min-h-[80vh] flex flex-col items-center justify-center">
        <p className="text-lg mb-4">Item not found</p>
        <Button onClick={handleGoBack} variant="outline" className="gap-2">
          <ChevronLeft className="h-4 w-4" /> Back to Menu
        </Button>
      </div>
    );
  }

  const itemPrice =
    item.base_price + (selectedProtein?.protein_options.price_addition || 0);
  const totalPrice = itemPrice * quantity;

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <Button
        onClick={handleGoBack}
        variant="ghost"
        className="mb-6 hover:bg-transparent p-0 gap-1"
      >
        <ChevronLeft className="h-5 w-5" />
        <span>Back</span>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="relative h-80 md:h-96 rounded-lg overflow-hidden">
          <Image
            src={item.image_url || "/placeholder.svg"}
            alt={item.image_alt_text}
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">{item.name}</h1>
          <p className="text-gray-600 mt-2">{item.short_description}</p>

          {item.has_protein_options && item.menu_item_proteins.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium mb-2">Select Protein</h3>
              <div className="grid grid-cols-2 gap-2">
                {item.menu_item_proteins.map((protein, index) => {
                  const totalPrice =
                    item.base_price +
                    (protein.protein_options.price_addition || 0);
                  return (
                    <Button
                      key={index}
                      variant={
                        selectedProtein?.protein_options.name ===
                        protein.protein_options.name
                          ? "default"
                          : "outline"
                      }
                      className="w-full justify-between px-4"
                      onClick={() => handleProteinChange(index)}
                    >
                      <span>{protein.protein_options.name}</span>
                      <span className="text-sm ml-1">
                        (${totalPrice.toFixed(2)})
                      </span>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-6">
            <h3 className="font-medium mb-2">Spice Level</h3>
            <DropdownMenu
              onOpenChange={() => spiceLevelError && setSpiceLevelError(false)}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-between ${
                    spiceLevelError ? "border-red-500 ring-1 ring-red-500" : ""
                  }`}
                >
                  {spiceLevel
                    ? spiceLevel.charAt(0).toUpperCase() +
                      spiceLevel.slice(1).replace("-", " ")
                    : "Select spice level"}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full min-w-[200px]">
                <DropdownMenuItem
                  onClick={() => {
                    setSpiceLevel("mild");
                    setSpiceLevelError(false);
                  }}
                >
                  Mild
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSpiceLevel("medium");
                    setSpiceLevelError(false);
                  }}
                >
                  Medium
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSpiceLevel("spicy");
                    setSpiceLevelError(false);
                  }}
                >
                  Spicy
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSpiceLevel("hot");
                    setSpiceLevelError(false);
                  }}
                >
                  Hot
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSpiceLevel("very-hot");
                    setSpiceLevelError(false);
                  }}
                >
                  Very Hot
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {spiceLevelError && (
              <div className="flex items-center text-red-500 text-sm mt-1">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>Please select a spice level</span>
              </div>
            )}
          </div>

          <div className="mt-6">
            <h3 className="font-medium mb-2">Special Instructions</h3>
            <Textarea
              placeholder="Any special requests or allergies we should know about?"
              className="resize-none"
              value={specialInstructions}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setSpecialInstructions(e.target.value)
              }
            />
          </div>

          <div className="flex items-center mt-6">
            <h3 className="font-medium mr-4">Quantity</h3>
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleQuantityChange(1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-auto pt-6">
            <div className="text-xl font-bold mb-4">
              Total: ${totalPrice.toFixed(2)}
            </div>
            <Button onClick={handleAddToCart} className="w-full gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span>Add to Cart</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
