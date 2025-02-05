"use client";

import { useEffect } from "react";
import { useOffersStore } from "@/store/offers-store";
import { ChevronRight } from "lucide-react";
import { OfferModal } from "@/components/offer-modal";

export function OffersBanner() {
  const { offers, currentOfferIndex, setCurrentOfferIndex, setModalOpen } =
    useOffersStore();

  useEffect(() => {
    const offerInterval = setInterval(() => {
      setCurrentOfferIndex((currentOfferIndex + 1) % offers.length);
    }, 5000);

    return () => clearInterval(offerInterval);
  }, [currentOfferIndex, offers.length, setCurrentOfferIndex]);

  const handleClick = () => {
    if (offers[currentOfferIndex].modalContent) {
      setModalOpen(true);
    }
  };

  return (
    <>
      <div
        onClick={handleClick}
        className={`h-10 ${offers[currentOfferIndex].backgroundColor} flex items-center justify-center cursor-pointer group`}
      >
        <span className="text-white text-md tracking-wide flex items-center gap-2">
          {offers[currentOfferIndex].text}
          {offers[currentOfferIndex].modalContent && (
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          )}
        </span>
      </div>
      <OfferModal />
    </>
  );
}
