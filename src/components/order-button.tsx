import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OrderButtonProps {
  className?: string;
  newLine?: boolean;
}

export function OrderButton({ className, newLine = false }: OrderButtonProps) {
  return (
    <Button
      asChild
      className={cn("md:block text-center inline-block", className)}
    >
      <a
        href="https://orders.cake.net/11539939"
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "whitespace-pre-line md:whitespace-normal text-center ",
          newLine ? "whitespace-pre-line" : "whitespace-normal"
        )}
      >
        Order{"\n"}Now
      </a>
    </Button>
  );
}
