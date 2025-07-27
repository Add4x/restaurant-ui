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
              <CardContent className="p-6 text-center">
                <Clock className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Hours</h3>
                <p className="text-gray-600">
                  {selectedLocation.openingHours || "Contact for hours"}
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