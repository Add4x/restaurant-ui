"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import { CheckoutSummary } from "@/components/checkout-summary";
import { PaymentOptions } from "@/components/payment-options";
import { CheckIcon } from "lucide-react";

function CheckoutContent() {
  const { items, clearCart } = useCartStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  useEffect(() => {
    // Check for success or canceled payment status
    const status = searchParams.get("status");
    const method = searchParams.get("paymentMethod");

    if (method) {
      setPaymentMethod(method);
    }

    if (status === "success") {
      setPaymentStatus("success");

      // Clear the cart for successful payments
      // The Java backend has already verified the payment via webhook
      clearCart();
    } else if (status === "canceled") {
      setPaymentStatus("canceled");
    }
  }, [searchParams, clearCart]);

  if (paymentStatus === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="bg-green-100 rounded-full p-3 mb-4">
          <CheckIcon className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">
          {paymentMethod === "in-store"
            ? "Order Placed Successfully!"
            : "Payment Successful!"}
        </h1>
        <p className="text-muted-foreground mb-6">
          {paymentMethod === "in-store"
            ? "Your order has been placed. Please pay when you pick up your order."
            : "Thank you for your order. Your payment has been processed."}
        </p>
        <Button onClick={() => router.push("/menu")}>Return to Menu</Button>
      </div>
    );
  }

  if (items.length === 0 && !paymentStatus) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">
          Add some items from our menu to get started.
        </p>
        <Button onClick={() => router.push("/menu")}>Browse Menu</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {paymentStatus === "canceled" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <p className="text-yellow-800">
            Your previous payment was canceled. Please try again.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <CheckoutSummary />
        <PaymentOptions />
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-[70vh]">
          Loading checkout...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
