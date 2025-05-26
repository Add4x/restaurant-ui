"use client";

import { useState } from "react";
import { useApiQuery, useApiMutation } from "@/hooks/use-api";
import { FavoriteMenuItem } from "@/lib/types";

// Define protein option type
interface ProteinOption {
  id: string;
  name: string;
  is_vegetarian: boolean;
  price_addition: number;
}

// Define the order item type
interface OrderItem {
  id: string;
  menuItem: FavoriteMenuItem;
  quantity: number;
  selectedProtein: ProteinOption | null;
  totalPrice: number;
}

// Define the order payload type
interface OrderPayload {
  items: OrderItem[];
  customerName: string;
}

export function ExampleClientComponent() {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Fetch favorite menu items
  const {
    data: result,
    isLoading,
    error,
  } = useApiQuery<FavoriteMenuItem[]>("/api/menu-items/favorites", [
    "favoriteMenuItems",
  ]);

  // Example mutation to place an order
  const {
    mutate: placeOrder,
    isPending,
    isError,
    isSuccess,
  } = useApiMutation<{ success: boolean; orderNumber: number }, OrderPayload>(
    "/api/orders"
  );

  // Handle order submission
  const handleOrderSubmit = () => {
    if (selectedItemId && result && !result.error) {
      const favoriteItems = result.data;
      const selectedItem = favoriteItems.find(
        (item) => item.id === selectedItemId
      );

      if (selectedItem) {
        placeOrder({
          items: [
            {
              id: selectedItem.id,
              menuItem: selectedItem,
              quantity: 1,
              selectedProtein: null,
              totalPrice: 10.99, // Example price
            },
          ],
          customerName: "Example Customer",
        });
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Handle API error response
  if (result?.error) {
    return <div>Error: {result.message}</div>;
  }

  // Get the actual data
  const favoriteItems = result?.data;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Favorite Menu Items</h2>

      {favoriteItems && favoriteItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 border rounded ${
                selectedItemId === item.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
              onClick={() => setSelectedItemId(item.id)}
            >
              <img
                src={item.image_url}
                alt={item.image_alt_text}
                className="w-full h-40 object-cover rounded mb-2"
              />
              <h3 className="font-bold">{item.name}</h3>
              <p className="text-sm text-gray-600">{item.shortDescription}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No favorite items found.</p>
      )}

      <div className="mt-6">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          disabled={!selectedItemId || isPending}
          onClick={handleOrderSubmit}
        >
          {isPending ? "Placing Order..." : "Order Selected Item"}
        </button>

        {isSuccess && (
          <div className="mt-4 p-3 bg-green-100 text-green-800 rounded">
            Order placed successfully!
          </div>
        )}

        {isError && (
          <div className="mt-4 p-3 bg-red-100 text-red-800 rounded">
            Failed to place order. Please try again.
          </div>
        )}
      </div>
    </div>
  );
}
