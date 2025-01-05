"use client";

import Link from "next/link";

interface NavItemProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const NavItem = ({ href, children, onClick, className }: NavItemProps) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const elementId = href.substring(1);
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    onClick?.();
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={`text-primaryDark ${className || ""}`}
    >
      {children}
    </Link>
  );
};

export default NavItem;
