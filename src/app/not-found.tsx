import React from "react";
import Link from "next/link";
import { Dog } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <Dog className="w-24 h-24 text-primary" />
      <h1 className="text-2xl text-center">
        404 - Page Not Found
        <span className="text-primary block text-center">
          Oops&apos; The page you&apos;re looking for doesn&apos;t exist.
        </span>
      </h1>
      <Button asChild className="transition-colors duration-300">
        <Link href="/">Return to Home</Link>
      </Button>
    </div>
  );
}
