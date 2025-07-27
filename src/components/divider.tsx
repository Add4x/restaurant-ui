import { cn } from "@/lib/utils";

interface DividerProps {
  className?: string;
}

export function Divider({ className }: DividerProps) {
  return (
    <div className={cn("container relative mx-auto", className)}>
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center mx-auto"
      >
        <div className="w-full h-px bg-linear-to-r from-transparent via-primary to-transparent" />
      </div>
    </div>
  );
}
