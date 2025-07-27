"use client";

import { MenuCategoryGrid } from "@/app/(main)/menu/components/menu-category-grid";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MenuSearch } from "@/components/menu/menu-search";
import { useRouter } from "next/navigation";

export default function MenuPage() {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrolled = window.scrollY;
        parallaxRef.current.style.transform = `translateY(${scrolled * 0.4}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Navigate to search results
      router.push(`/menu/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Parallax */}
      <div className="relative w-full h-[40vh] min-h-[300px] md:min-h-[400px] overflow-hidden">
        <div ref={parallaxRef} className="absolute inset-0 z-0">
          <Image
            src="/hero.jpg"
            alt="Delicious Indian cuisine"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="relative z-20 container mx-auto px-4 text-center h-full flex flex-col justify-center items-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 font-playfair"
          >
            Our Menu
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-white/90 max-w-2xl"
          >
            Explore authentic Indian flavors crafted with love and tradition
          </motion.p>
        </div>
      </div>

      {/* Menu Categories Section */}
      <div className="container md:max-w-6xl py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-playfair">Browse Categories</h2>
          <MenuSearch onSearch={handleSearch} />
        </div>
        <MenuCategoryGrid />
      </div>
    </div>
  );
}