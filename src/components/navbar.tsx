"use client";

import { useState, useRef, useEffect } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavItem from "@/components/nav-item";
import { NavItemWithSubmenu } from "@/components/nav-item-with-submenu";
import Submenu from "@/components/submenu";
import MobileMenu from "@/components/mobile-menu";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { OrderButton } from "@/components/order-button";

const Navbar = () => {
  const router = useRouter();
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

  // close submenu when orientation changes
  useEffect(() => {
    window.addEventListener("orientationchange", closeSubmenu);
    window.addEventListener("resize", closeSubmenu);
    return () => {
      window.removeEventListener("orientationchange", closeSubmenu);
      window.removeEventListener("resize", closeSubmenu);
    };
  }, []);

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

  const handleMenuClick = () => {
    // Toggle submenu
    toggleSubmenu();

    // Navigate to menu page after a short delay
    setTimeout(() => {
      router.push("/menu");
    }, 200); // 200ms delay, adjust as needed
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
              className="[&>svg]:!h-6 [&>svg]:!w-6"
            >
              <Menu className="text-primaryDark" />
            </Button>
          </div>
          <div className="flex items-center translate-x-2">
            <Link href="/" onClick={closeSubmenu}>
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
              onClick={closeSubmenu}
              className="border-b-2 border-transparent hover:border-b-2 hover:border-primary hover:scale-x-105 transition-all duration-300"
            >
              About
            </NavItem>
            <NavItemWithSubmenu
              label="Menu"
              onClick={handleMenuClick}
              href="/menu"
            />
            <NavItem
              href="#contact"
              onClick={closeSubmenu}
              className="border-b-2 border-transparent hover:border-b-2 hover:border-primary hover:scale-x-105 transition-all duration-300"
            >
              Contact
            </NavItem>
          </div>
          <OrderButton className="leading-4 h-12 md:h-auto" newLine={true} />
        </div>
      </nav>
      <div
        className={`transition-all duration-1000 transform ${
          isSubmenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <Submenu ref={submenuRef} onItemClick={closeSubmenu} />
      </div>
      <MobileMenu
        isOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
    </header>
  );
};

export default Navbar;
