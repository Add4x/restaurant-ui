import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen text-white flex items-center justify-center">
      <Loader2 className="w-12 h-12 animate-spin text-primaryDark" />
    </div>
  );
}
