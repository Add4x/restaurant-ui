"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export function HeroSection() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrolled = window.scrollY;
        parallaxRef.current.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="relative w-full h-[70vh] min-h-[400px] md:min-h-[32rem] overflow-hidden">
        {/* Parallax Image Container */}
        <div ref={parallaxRef} className="absolute inset-0 z-0">
          <Image
            src="/hero.jpg"
            alt="South Indian chutneys and accompaniments"
            fill
            className="object-cover"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mMsqAcAAWUA8f6XWZkAAAAASUVORK5CYII="
            // placeholder="blur-sm"
            priority
          />
        </div>

        {/* Static Overlay (moved outside parallax container) */}
        <div className="absolute inset-0 bg-black/40 z-10" />

        {/* Content (moved outside parallax container) */}
        <div className="relative z-20 container mx-auto px-4 text-center h-full flex flex-col justify-center items-center tracking-wide">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 font-playfair"
          >
            Indian Street Side Eatery
          </motion.h1>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8"
          >
            Treat yourself to a taste of India
          </motion.h3>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 w-full max-w-md"
          >
            <Link
              href="/menu"
              className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 sm:px-8 py-3 rounded-lg transition-all transform hover:scale-105 w-full sm:w-auto inline-block text-center"
            >
              View Menu
            </Link>
            <Link
              href="/order"
              className="bg-white hover:bg-gray-100 text-primary font-semibold px-6 sm:px-8 py-3 rounded-lg transition-all transform hover:scale-105 w-full sm:w-auto inline-block text-center"
            >
              Order Online
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
}
