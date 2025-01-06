import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OrderButtonProps {
  className?: string;
  newLine?: boolean;
  fontSize: "base" | "small";
  href?: string;
  target?: string;
  rel?: string;
}

/**
 * Mapping for font sizes to Tailwind CSS classes.
 */
const FONT_SIZE_CLASSES: Record<OrderButtonProps["fontSize"], string> = {
  base: "text-base",
  small: "text-xs py-1",
};

/**
 * OrderButton Component
 *
 * Renders a customizable order button with adjustable font size and layout.
 *
 * @param {OrderButtonProps} props - Component properties.
 * @returns {JSX.Element} The rendered button component.
 */
export function OrderButton({
  className,
  newLine = false,
  fontSize = "base",
  href = "https://orders.cake.net/11539939",
  target = "_blank",
  rel = "noopener noreferrer",
}: OrderButtonProps) {
  const anchorClasses = cn(
    "text-center px-2 py-4",
    newLine ? "md:whitespace-normal whitespace-pre-line" : "whitespace-normal",
    FONT_SIZE_CLASSES[fontSize]
  );

  return (
    <Button asChild className={cn("inline-flex items-center", className)}>
      <a href={href} target={target} rel={rel} className={anchorClasses}>
        Order{"\n"}Now
      </a>
    </Button>
  );
}
