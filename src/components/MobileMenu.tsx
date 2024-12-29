"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavItem from "./NavItem";
import { subMenuItems } from "@/data/subMenuItems";
import Link from "next/link";
import Image from "next/image";

interface MobileMenuProps {
  isOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const MobileMenu = ({ isOpen, setIsMobileMenuOpen }: MobileMenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // close menu when orientation changes
  useEffect(() => {
    const closeHamburgerMenu = () => {
      setIsMobileMenuOpen(false);
      setIsMenuOpen(false);
    };
    window.addEventListener("orientationchange", closeHamburgerMenu);
    window.addEventListener("resize", closeHamburgerMenu);
    return () => {
      window.removeEventListener("orientationchange", closeHamburgerMenu);
      window.removeEventListener("resize", closeHamburgerMenu);
    };
  }, [setIsMobileMenuOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background z-50 md:hidden">
      <div className="flex justify-between items-center px-4">
        <Link href="/">
          <Image src="/logo.svg" alt="Logo" width={80} height={80} priority />
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setIsMobileMenuOpen(false);
            setIsMenuOpen(false);
          }}
          className="[&>svg]:!h-6 [&>svg]:!w-6"
        >
          <X className="text-primaryDark" />
        </Button>
      </div>
      <nav className="p-4">
        <ul className="flex flex-col list-none items-start font-semibold">
          <NavItem
            href="/about"
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsMenuOpen(false);
            }}
          >
            About
          </NavItem>
          <li>
            <button
              onClick={toggleMenu}
              className="text-left text-primaryDark border-b-2 border-transparent hover:scale-x-105 hover:border-b-2 hover:border-primary transition-all duration-300"
            >
              Menu
            </button>
            {isMenuOpen && (
              <ul className="pl-4 flex flex-col items-start">
                {subMenuItems.map((item) => (
                  <NavItem
                    key={item}
                    href={`/menu/${item.toLowerCase()}`}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsMenuOpen(false);
                    }}
                  >
                    {item}
                  </NavItem>
                ))}
              </ul>
            )}
          </li>
          <NavItem
            href="/contact"
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsMenuOpen(false);
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
