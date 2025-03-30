"use client";

import { useCart } from "@/components/cart-provider";
import { Card } from "@/components/ui/card";
export function CheckoutSummary() {
  const { items, getTotalPrice } = useCart();

  // Calculate tax and total
  const subtotal = getTotalPrice();
  const taxRate = 0.08; // 8% tax rate
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

      {items.map((item) => (
        <div key={item.id} className="mb-4 pb-4 border-b">
          <div className="flex justify-between">
            <div>
              <h3 className="font-medium">{item.menuItem.name}</h3>
              <p className="text-sm text-gray-600">
                Qty: {item.quantity}
                {item.selectedProtein && (
                  <span className="ml-2">
                    ({item.selectedProtein.protein_options.name})
                  </span>
                )}
              </p>
            </div>
            <span className="font-medium">${item.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      ))}

      <div className="space-y-2 pt-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax ({(taxRate * 100).toFixed(0)}%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </Card>
  );
}
