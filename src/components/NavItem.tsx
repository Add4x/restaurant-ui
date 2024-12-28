import Link from "next/link";

interface NavItemProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  // className?: string;
}

const NavItem = ({ href, children, onClick }: NavItemProps) => {
  return (
    <Link
      key={href}
      href={href}
      className="text-primaryDark border-b-2 border-transparent hover:scale-x-105 hover:border-b-2 hover:border-primary transition-all duration-300"
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default NavItem;
