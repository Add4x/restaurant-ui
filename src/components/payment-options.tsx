"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCartStore } from "@/stores/cart-store";
import { useLocationStore } from "@/stores/location-store";
import { useRouter } from "next/navigation";
import { createOrderAndCheckout } from "@/actions/orders";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { CreditCard, Store } from "lucide-react";

export function PaymentOptions() {
  const { items, clearCart } = useCartStore();
  const { selectedLocation } = useLocationStore();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<"online" | "in-store">(
    "online"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate tax and total
  const subtotal = items.reduce((total, item) => total + item.totalPrice, 0);
  const taxRate = 0.08; // 8% tax rate
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const handleCheckout = async () => {
    if (!selectedLocation) {
      setError("Please select a location first");
      return;
    }

    if (paymentMethod === "in-store") {
      // Handle in-store payment
      clearCart();
      router.push("/checkout?status=success&paymentMethod=in-store");
      return;
    }

    // Handle online payment - call server action directly
    try {
      setIsLoading(true);
      setError(null);

      const result = await createOrderAndCheckout(
        items,
        total,
        selectedLocation.locationId
      );

      if (result.success) {
        window.location.href = result.data.checkoutUrl;
      } else {
        setError(result.error || "Failed to create checkout session");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
        <CardDescription>
          Choose how you want to pay for your order
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="card">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="card"
              className="flex items-center gap-2"
              onClick={() => setPaymentMethod("online")}
            >
              <CreditCard className="h-4 w-4" />
              <span>Pay Online</span>
            </TabsTrigger>
            <TabsTrigger
              value="store"
              className="flex items-center gap-2"
              onClick={() => setPaymentMethod("in-store")}
            >
              <Store className="h-4 w-4" />
              <span>Pay at Store</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="card">
            <p className="text-sm text-gray-600 my-4">
              You&apos;ll be redirected to Stripe to complete your payment
              securely.
            </p>
          </TabsContent>
          <TabsContent value="store">
            <p className="text-sm text-gray-600 my-4">
              Your order will be prepared and you can pay when you pick it up.
            </p>
          </TabsContent>
        </Tabs>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md my-4">
            {error}
          </div>
        )}

        <Button
          className="w-full bg-primary hover:bg-primary/80 text-white py-6 mt-4"
          onClick={handleCheckout}
          disabled={isLoading}
        >
          {isLoading
            ? "Processing..."
            : paymentMethod === "online"
            ? `Pay $${total.toFixed(2)}`
            : `Place Order for Pickup`}
        </Button>
      </CardContent>
    </Card>
  );
}
