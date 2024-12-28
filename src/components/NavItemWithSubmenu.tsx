interface NavItemWithSubmenuProps {
  label: string;
  onClick: () => void;
}

const NavItemWithSubmenu = ({ label, onClick }: NavItemWithSubmenuProps) => {
  return (
    <li className="text-foreground transition-colors list-none">
      <button
        onClick={onClick}
        className="text-primaryDark border-b-2 border-transparent hover:border-primary hover:scale-x-105 hover:border-b-2 transition-all duration-300 focus:outline-none"
      >
        {label}
      </button>
    </li>
  );
};

export default NavItemWithSubmenu;
