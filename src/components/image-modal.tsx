import { X } from "lucide-react";
import Image from "next/image";

interface ImageModalProps {
  src: string;
  alt: string;
  isClosing: boolean;
  handleClose: () => void;
}

const animationDuration = 200;

export function ImageModal({
  src,
  alt,
  isClosing,
  handleClose,
}: ImageModalProps) {
  return (
    <div
      className={`fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 ${
        isClosing
          ? `animate-out fade-out duration-${animationDuration}`
          : `animate-in fade-in duration-${animationDuration}`
      }`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={`relative w-full max-w-4xl h-[80vh] rounded-lg overflow-hidden ${
          isClosing
            ? `animate-out zoom-out-50 duration-${animationDuration}`
            : `animate-in zoom-in-50 duration-${animationDuration}`
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <Image src={src} alt={alt} fill className="object-cover rounded-lg" />
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
}
