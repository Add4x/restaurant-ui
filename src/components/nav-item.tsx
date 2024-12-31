"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";

interface NavItemProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const NavItem = ({ href, children, onClick, className }: NavItemProps) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    }
    setTimeout(() => {
      router.push(href);
    }, 300);
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={`text-primaryDark border-b-2 border-transparent hover:scale-x-105 hover:border-b-2 hover:border-primary transition-all duration-300 ${className || ''}`}
    >
      {children}
    </Link>
  );
};

export default NavItem;
