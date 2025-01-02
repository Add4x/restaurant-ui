interface NavItemWithSubmenuProps {
  label: string;
  onClick: (event: React.MouseEvent) => void;
  href: string;
}

export function NavItemWithSubmenu({
  label,
  onClick,
}: NavItemWithSubmenuProps) {
  return (
    <div>
      <button
        onClick={onClick}
        className="text-primaryDark border-b-2 border-transparent hover:scale-x-105 hover:border-b-2 hover:border-primary transition-all duration-300"
      >
        {label}
      </button>
    </div>
  );
}
