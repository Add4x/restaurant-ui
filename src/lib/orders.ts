"use server";

import { CartItem } from "@/stores/cart-store";

/**
 * Creates a new order in the database
 * @param items Cart items to be included in the order
 * @param total Total order amount
 * @param paymentMethod Payment method ('stripe' or 'in-store')
 * @returns Created order object with ID
 */
export async function createOrder(
  items: CartItem[],
  total: number,
  paymentMethod: "stripe" | "in-store"
) {
  // In a real application, this would create an order in your database
  console.log(
    `Creating new order with ${items.length} items, total: $${total.toFixed(
      2
    )}, payment method: ${paymentMethod}`
  );

  // Generate a random order ID for demonstration purposes
  const orderId = `ORD-${Math.floor(Math.random() * 10000)}-${Date.now()
    .toString()
    .slice(-4)}`;

  // TODO: Implement database creation
  // For example with Supabase:
  // const { data, error } = await supabase
  //   .from('orders')
  //   .insert({
  //     id: orderId,
  //     items: items,
  //     total: total,
  //     payment_method: paymentMethod,
  //     payment_status: paymentMethod === 'in-store' ? 'pending' : 'awaiting',
  //     created_at: new Date()
  //   });

  return {
    id: orderId,
    total,
    paymentMethod,
    paymentStatus: paymentMethod === "in-store" ? "pending" : "awaiting",
  };
}

/**
 * Updates the payment status of an order
 * @param orderId The ID of the order to update
 * @param status The new payment status ('paid', 'pending', 'failed')
 */
export async function updateOrderPaymentStatus(
  orderId: string,
  status: "paid" | "pending" | "failed"
) {
  // In a real application, this would update the order in your database
  console.log(`Updating order ${orderId} payment status to ${status}`);

  // TODO: Implement database update
  // For example with Supabase:
  // const { error } = await supabase
  //   .from('orders')
  //   .update({ payment_status: status })
  //   .eq('id', orderId);

  return { success: true };
}
