"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavItem from "./NavItem";
import { menuItems } from "@/data/menuItems";

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
      <div className="flex justify-end p-4">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-6 w-6" />
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
                {menuItems.map((item) => (
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
