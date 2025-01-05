import { Button } from "@/components/ui/button";

export function OrderButton() {
  return (
    <Button asChild className="md:block">
      <a
        href="https://orders.cake.net/11539939"
        target="_blank"
        rel="noopener noreferrer"
      >
        Order Now
      </a>
    </Button>
  );
}
