"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function CheckoutSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // Redirect to the checkout page with success status
    router.push(
      `/checkout?status=success${sessionId ? `&session_id=${sessionId}` : ""}`
    );
  }, [router, sessionId]);

  return (
    <div className="flex justify-center items-center h-[60vh]">
      <p>Redirecting to order confirmation...</p>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-[60vh]">
          Loading...
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
