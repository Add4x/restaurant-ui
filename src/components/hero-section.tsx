"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";

const offers = [
  "Offer valid till 28th February 2025",
  "New Menu Items",
  "20% off on all orders",
];

const offerColors = ["bg-primary", "bg-primary/90", "bg-primary/80"];

export function HeroSection() {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);

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

  useEffect(() => {
    const offerInterval = setInterval(() => {
      setCurrentOfferIndex((prevIndex) => (prevIndex + 1) % offers.length);
    }, 5000);

    return () => clearInterval(offerInterval);
  }, []);

  return (
    <>
      <div
        ref={parallaxRef}
        className={`h-10 ${offerColors[currentOfferIndex]} flex items-center justify-center`}
      >
        <span className="text-white text-md tracking-wide">
          {offers[currentOfferIndex]}
        </span>
      </div>
      <div className="relative w-full h-[60vh] min-h-[32rem] overflow-hidden mb-8">
        {/* Parallax Image Container */}
        <div ref={parallaxRef} className="absolute inset-0 z-0">
          <Image
            src="/hero.jpg"
            alt="South Indian chutneys and accompaniments"
            fill
            className="object-cover"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mMsqAcAAWUA8f6XWZkAAAAASUVORK5CYII="
            placeholder="blur"
            priority
          />
        </div>

        {/* Static Overlay (moved outside parallax container) */}
        <div className="absolute inset-0 bg-black/40 z-10" />

        {/* Content (moved outside parallax container) */}
        <div className="relative z-20 container mx-auto px-4 text-center h-full flex flex-col justify-center items-center tracking-wide">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-playfair ">
            Indian Street Side Eatery
          </h1>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Treat yourself to a taste of India
          </h3>
        </div>
      </div>
    </>
  );
}
