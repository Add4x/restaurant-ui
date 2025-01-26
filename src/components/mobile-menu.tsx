"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavItem from "@/components/nav-item";
import Link from "next/link";
import Image from "next/image";

interface MobileMenuProps {
  isOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const MobileMenu = ({ isOpen, setIsMobileMenuOpen }: MobileMenuProps) => {
  // close menu when orientation changes
  useEffect(() => {
    const closeHamburgerMenu = () => {
      setIsMobileMenuOpen(false);
    };
    window.addEventListener("orientationchange", closeHamburgerMenu);
    window.addEventListener("resize", closeHamburgerMenu);
    return () => {
      window.removeEventListener("orientationchange", closeHamburgerMenu);
      window.removeEventListener("resize", closeHamburgerMenu);
    };
  }, [setIsMobileMenuOpen]);

  return (
    <div
      className={`fixed inset-0 bg-background z-50 md:hidden transition-all duration-300 transform ${
        isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
      }`}
    >
      <div className="flex justify-between items-center px-4">
        <Link href="/">
          <Image src="/logo.svg" alt="Logo" width={80} height={80} priority />
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setIsMobileMenuOpen(false);
          }}
          className="[&>svg]:h-6! [&>svg]:w-6!"
        >
          <X className="text-primaryDark" />
        </Button>
      </div>
      <nav className="p-4">
        <ul className="flex flex-col list-none font-semibold gap-2">
          <NavItem
            href="/about"
            onClick={() => {
              setIsMobileMenuOpen(false);
            }}
          >
            About
          </NavItem>
          <NavItem
            href="/menu"
            onClick={() => {
              setIsMobileMenuOpen(false);
            }}
          >
            Menu
          </NavItem>
          <NavItem
            href="/#contact"
            onClick={() => {
              setIsMobileMenuOpen(false);
            }}
          >
            Contact
          </NavItem>
        </ul>
      </nav>
    </div>
  );
};

export default MobileMenu;
