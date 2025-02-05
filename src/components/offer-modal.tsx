"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useOffersStore } from "@/store/offers-store";
import Image from "next/image";

export function OfferModal() {
  const { offers, currentOfferIndex, isModalOpen, setModalOpen } =
    useOffersStore();
  const currentOffer = offers[currentOfferIndex];

  if (!currentOffer.modalContent) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-playfair tracking-wide">
            {currentOffer.modalContent.title}
          </DialogTitle>
        </DialogHeader>
        <div className="relative w-full h-48 mb-4">
          <Image
            src={currentOffer.modalContent.imageSrc}
            alt={currentOffer.modalContent.title}
            fill
            className="object-cover rounded-md"
          />
        </div>
        <p className="text-center text-muted-foreground">
          {currentOffer.modalContent.description}
        </p>
      </DialogContent>
    </Dialog>
  );
}
