import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout - Indian Street Side Eatery",
  description: "Complete your order from Indian Street Side Eatery",
};

export default function CheckoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto p-4">
        <Link href="/menu">
          <Button variant="ghost" size="sm" className="mb-6">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Menu
          </Button>
        </Link>
      </div>
      <main className="flex-grow">{children}</main>
    </div>
  );
}
