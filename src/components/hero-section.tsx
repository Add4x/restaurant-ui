"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

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
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 font-playfair">
            Indian Street Side Eatery
          </h1>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8">
            Treat yourself to a taste of India
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <a
              href="/menu"
              className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 sm:px-8 py-3 rounded-lg transition-all transform hover:scale-105 w-full sm:w-auto"
            >
              View Menu
            </a>
            <a
              href="/order"
              className="bg-white hover:bg-gray-100 text-primary font-semibold px-6 sm:px-8 py-3 rounded-lg transition-all transform hover:scale-105 w-full sm:w-auto"
            >
              Order Online
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
