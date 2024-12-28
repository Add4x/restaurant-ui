import React from "react";

interface SubmenuProps {
  onItemClick: () => void;
}

const Submenu = React.forwardRef<HTMLDivElement, SubmenuProps>(
  ({ onItemClick }, ref) => {
    const submenuItems = [
      "Breakfast",
      "Lunch",
      "Dinner",
      "Desserts",
      "Drinks",
      "Snacks",
      "Specialties",
    ];

    return (
      <div
        ref={ref}
        className="absolute left-0 right-0 bg-background shadow-md z-40 border-t border-border/40"
      >
        <div className="container mx-auto px-4 py-4">
          <ul className="flex flex-wrap justify-center gap-12">
            {submenuItems.map((item) => (
              <li key={item} className="w-full sm:w-auto mb-2 sm:mb-0">
                <button
                  onClick={onItemClick}
                  className="w-full border-b-2 border-transparent sm:w-auto font-semibold text-primaryDark hover:scale-x-105 hover:border-b-2 hover:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors duration-300"
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
);

Submenu.displayName = "Submenu";

export default Submenu;
