"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavItem from "./NavItem";
import { subMenuItems } from "@/data/subMenuItems";
import Link from "next/link";
import Image from "next/image";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
          onClick={onClose}
          className="[&>svg]:!h-6 [&>svg]:!w-6"
        >
          <X className="text-primaryDark" />
        </Button>
      </div>
      <nav className="p-4">
        <ul className="space-y-4">
          <NavItem href="/" onClick={onClose}>
            Home
          </NavItem>
          <NavItem href="/about" onClick={onClose}>
            About
          </NavItem>
          <li>
            <button onClick={toggleMenu} className="w-full text-left py-2">
              Menu
            </button>
            {isMenuOpen && (
              <ul className="pl-4 mt-2 space-y-2">
                {subMenuItems.map((item) => (
                  <NavItem
                    key={item}
                    href={`/menu/${item.toLowerCase()}`}
                    onClick={onClose}
                  >
                    {item}
                  </NavItem>
                ))}
              </ul>
            )}
          </li>
          <NavItem href="/contact" onClick={onClose}>
            Contact
          </NavItem>
          <NavItem href="/faq" onClick={onClose}>
            FAQ
          </NavItem>
        </ul>
      </nav>
    </div>
  );
};

export default MobileMenu;
