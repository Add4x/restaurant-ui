import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { Playfair_Display, Open_Sans } from "next/font/google";

// Re-use the same fonts as the root layout
const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-opensans",
});

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
    <html lang="en">
      <body className={`${playfair.variable} ${openSans.variable} antialiased`}>
        <div className="min-h-screen flex flex-col">
          <div className="container mx-auto p-4">
            <Link href="/menu" passHref>
              <Button variant="ghost" size="sm" className="mb-6">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Menu
              </Button>
            </Link>
          </div>
          <main className="flex-grow">{children}</main>
        </div>
      </body>
    </html>
  );
}
