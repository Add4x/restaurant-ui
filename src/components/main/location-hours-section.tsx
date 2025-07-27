"use client";

import { MapPin, Clock, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useLocationStore } from "@/stores/location-store";

export function LocationHoursSection() {
  const { selectedLocation } = useLocationStore();

  if (!selectedLocation) return null;


  return (
    <section className="container py-12 md:py-16">
      <div className="mx-auto px-8 md:px-12">
        <h2 className="text-3xl font-bold text-center mb-8 font-playfair text-primaryDark">
          Visit Us Today
        </h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(
                selectedLocation.address
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full"
            >
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <MapPin className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Location</h3>
                  <p className="text-gray-600">
                    {selectedLocation.address}
                  </p>
                  <p className="text-primary text-sm mt-2">Click for map & directions</p>
                </CardContent>
              </Card>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Clock className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-3 text-center">Today&apos;s Hours</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Lunch:</span>
                    <span className="text-gray-700 font-medium">12:00 PM - 3:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Dinner:</span>
                    <span className="text-gray-700 font-medium">5:00 PM - 10:00 PM</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  Closed between lunch & dinner
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Phone className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Call Us</h3>
                <p className="text-gray-600">{selectedLocation.phoneNumber}</p>
                <a
                  href={`tel:${selectedLocation.phoneNumber}`}
                  className="text-primary hover:underline mt-2 inline-block"
                >
                  Order by Phone
                </a>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}