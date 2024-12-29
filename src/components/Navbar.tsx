"use client";

import { useState, useRef, useEffect } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavItem from "@/components/NavItem";
import NavItemWithSubmenu from "@/components/NavItemWithSubmenu";
import Submenu from "@/components/Submenu";
import MobileMenu from "@/components/MobileMenu";
import Image from "next/image";
import Link from "next/link";
const Navbar = () => {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const submenuRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLElement>(null);

  const toggleSubmenu = () => {
    setIsSubmenuOpen((prev) => !prev);
  };

  const closeSubmenu = () => {
    setIsSubmenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isSubmenuOpen &&
        submenuRef.current &&
        !submenuRef.current.contains(event.target as Node) &&
        navbarRef.current &&
        !navbarRef.current.contains(event.target as Node)
      ) {
        closeSubmenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSubmenuOpen]);

  return (
    <header
      ref={navbarRef}
      className="sticky top-0 z-50 bg-background shadow-md"
    >
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
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
          <div className="hidden md:flex items-center gap-6 font-semibold">
            <NavItem href="/about">About</NavItem>
            <NavItemWithSubmenu label="Menu" onClick={toggleSubmenu} />
            <NavItem href="/contact">Contact</NavItem>
          </div>
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="[&>svg]:!h-6 [&>svg]:!w-6"
            >
              <Menu className="text-primaryDark" />
            </Button>
          </div>
        </div>
      </nav>
      {isSubmenuOpen && <Submenu ref={submenuRef} onItemClick={closeSubmenu} />}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
};

export default Navbar;
