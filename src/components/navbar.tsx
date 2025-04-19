"use client";

import { useState, useRef } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavItem from "@/components/nav-item";
import MobileMenu from "@/components/mobile-menu";
import Image from "next/image";
import Link from "next/link";
import { OrderButton } from "@/components/order-button";
import { Cart } from "@/components/cart/cart";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navbarRef = useRef<HTMLElement>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <header
      ref={navbarRef}
      className="sticky top-0 z-50 bg-background shadow-md"
    >
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="[&>svg]:h-6! [&>svg]:w-6!"
            >
              <Menu className="text-primaryDark" />
            </Button>
          </div>
          <div className="flex items-center translate-x-2">
            <Link href="/">
              <Image
                src="/logo.svg"
                alt="Logo"
                width={80}
                height={80}
                priority
              />
            </Link>
          </div>
          {/* translate x-1 */}
          <div className="hidden md:flex items-center gap-6 font-semibold">
            <NavItem
              href="/about"
              className="border-b-2 border-transparent hover:border-b-2 hover:border-primary hover:scale-x-105 transition-all duration-300"
            >
              About
            </NavItem>
            {/* <NavItemWithSubmenu label="Menu" href="/menu" /> */}
            <NavItem
              href="/menu"
              className="border-b-2 border-transparent hover:border-b-2 hover:border-primary hover:scale-x-105 transition-all duration-300"
            >
              Menu
            </NavItem>
            <NavItem
              href="#contact"
              className="border-b-2 border-transparent hover:border-b-2 hover:border-primary hover:scale-x-105 transition-all duration-300"
            >
              Contact
            </NavItem>
          </div>
          <div className="flex items-center gap-4">
            <div className="mt-1">
              <Cart />
            </div>
            <OrderButton
              className="leading-4 h-12 md:h-auto"
              fontSize="base"
              newLine={true}
            />
          </div>
        </div>
      </nav>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
    </header>
  );
};

export default Navbar;
