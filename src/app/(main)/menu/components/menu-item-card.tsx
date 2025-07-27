"use client";

import Image from "next/image";
import { type MenuItem } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { useState, useCallback, useEffect } from "react";
import { ImageModal } from "@/components/image-modal";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { motion } from "framer-motion";
import { Leaf, ChefHat } from "lucide-react";

interface MenuItemCardProps {
  item: MenuItem;
  index?: number;
}

function capitalizeWords(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function MenuItemCard({ item, index = 0 }: MenuItemCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const animationDuration = 200;

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsClosing(false);
    }, animationDuration);
  }, []);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isModalOpen) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen, handleClose]);

  const hasVegetarianOptions = item.isVegetarian;
  const hasNonVegetarianOptions = !item.isVegetarian;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        viewport={{ once: true }}
        className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
      >
        <div className="relative">
          {/* Image Section */}
          <div
            onClick={handleOpenModal}
            onKeyDown={(e) => e.key === "Enter" && handleOpenModal()}
            tabIndex={0}
            role="button"
            aria-label="View larger image"
            className="relative h-48 w-full cursor-pointer overflow-hidden"
          >
            <Image
              src={item.image_url || "/placeholder.svg"}
              alt={item.image_alt_text}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Dietary Badges */}
          <div className="absolute top-3 right-3 flex gap-2">
            {hasVegetarianOptions && (
              <Badge className="bg-green-600 text-white border-0 shadow-md">
                <Leaf className="w-3 h-3 mr-1" />
                Veg
              </Badge>
            )}
            {hasNonVegetarianOptions && (
              <Badge className="bg-red-600 text-white border-0 shadow-md">
                <ChefHat className="w-3 h-3 mr-1" />
                Non-Veg
              </Badge>
            )}
          </div>
        </div>

        <div className="p-5 flex flex-col flex-1">
          {/* Title and Price */}
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold text-gray-900 font-playfair flex-1 mr-2">
              {capitalizeWords(item.name)}
            </h3>
            <div className="text-right">
              <span className="text-2xl font-bold text-primary">
                ${item.price.toFixed(2)}
              </span>
              {item.proteins.length > 1 && (
                <p className="text-xs text-gray-500 mt-1">
                  + protein options
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {item.description
              ? capitalizeFirstLetter(item.description)
              : "A delicious dish prepared with authentic spices and fresh ingredients."}
          </p>

          {/* Protein Options */}
          {item.proteins.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                Protein Options
              </p>
              <div className="flex flex-wrap gap-2">
                {item.proteins
                  .sort((a, b) => a.additionalCost - b.additionalCost)
                  .map((protein) => (
                    <Badge
                      key={protein.id}
                      variant="outline"
                      className="text-xs border-gray-300 hover:border-primary hover:bg-primary/5 transition-colors"
                    >
                      {protein.name}
                      {protein.additionalCost > 0 && (
                        <span className="ml-1 text-primary font-medium">
                          +${protein.additionalCost.toFixed(2)}
                        </span>
                      )}
                    </Badge>
                  ))}
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <div className="mt-auto pt-4">
            <AddToCartButton item={item} />
          </div>
        </div>
      </motion.div>

      {isModalOpen && (
        <ImageModal
          src={item.image_url || "/placeholder.svg"}
          alt={item.image_alt_text}
          isClosing={isClosing}
          handleClose={handleClose}
        />
      )}
    </>
  );
}