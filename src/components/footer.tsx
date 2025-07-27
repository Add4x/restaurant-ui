"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Facebook, Instagram, ChefHat } from "lucide-react";
import { motion } from "framer-motion";
import { useLocationStore } from "@/stores/location-store";

export function Footer() {
  const { selectedLocation } = useLocationStore();

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
  };

  return (
    <footer className="relative bg-gray-900 text-gray-300 overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/50 rounded-full filter blur-3xl" />
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Section */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1"
            >
              <div className="mb-6">
                <Image
                  src="/logo.png"
                  alt="Jathara Logo"
                  width={120}
                  height={60}
                  className="mb-4"
                />
                <p className="text-sm text-gray-400 leading-relaxed">
                  Experience the authentic flavors of India at Jathara, where tradition meets modern culinary excellence.
                </p>
              </div>
              
              {/* Social Links */}
              <div className="flex gap-3">
                <Link
                  href="https://www.facebook.com/people/Jathara/61565167931330/?name=xhp_nt__fb__action__open_user"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-all duration-300 group"
                >
                  <Facebook className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </Link>
                <Link
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-all duration-300 group"
                >
                  <Instagram className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </Link>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="text-white font-semibold text-lg mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {[
                  { label: "Home", href: "/" },
                  { label: "Menu", href: "/menu" },
                  { label: "About Us", href: "/about" },
                  { label: "Order Online", href: "/order" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-primary transition-colors duration-300 text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-white font-semibold text-lg mb-6">Contact Info</h3>
              <ul className="space-y-4">
                {selectedLocation && (
                  <>
                    <li>
                      <Link
                        href={`https://maps.google.com/?q=${encodeURIComponent(selectedLocation.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-3 text-sm hover:text-primary transition-colors group"
                      >
                        <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-gray-400 group-hover:text-white">
                          {selectedLocation.address}
                        </span>
                      </Link>
                    </li>
                    <li>
                      <a
                        href={`tel:${selectedLocation.phoneNumber}`}
                        className="flex items-center gap-3 text-sm hover:text-primary transition-colors group"
                      >
                        <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-gray-400 group-hover:text-white">
                          {selectedLocation.phoneNumber}
                        </span>
                      </a>
                    </li>
                    <li>
                      <a
                        href={`mailto:${selectedLocation.email}`}
                        className="flex items-center gap-3 text-sm hover:text-primary transition-colors group"
                      >
                        <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-gray-400 group-hover:text-white">
                          {selectedLocation.email}
                        </span>
                      </a>
                    </li>
                  </>
                )}
              </ul>
            </motion.div>

            {/* Opening Hours */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-white font-semibold text-lg mb-6">Opening Hours</h3>
              <div className="space-y-4">
                {/* Monday - Thursday */}
                <div className="space-y-1">
                  <p className="text-gray-400 text-sm font-medium">Monday - Thursday</p>
                  <div className="space-y-1 pl-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">Lunch:</span>
                      <span className="text-primary font-medium">12:00 PM - 3:00 PM</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">Dinner:</span>
                      <span className="text-primary font-medium">5:00 PM - 10:00 PM</span>
                    </div>
                  </div>
                </div>
                
                {/* Friday - Saturday */}
                <div className="space-y-1">
                  <p className="text-gray-400 text-sm font-medium">Friday - Saturday</p>
                  <div className="space-y-1 pl-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">All Day:</span>
                      <span className="text-primary font-medium">12:00 PM - 11:00 PM</span>
                    </div>
                  </div>
                </div>
                
                {/* Sunday */}
                <div className="space-y-1">
                  <p className="text-gray-400 text-sm font-medium">Sunday</p>
                  <div className="space-y-1 pl-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">All Day:</span>
                      <span className="text-primary font-medium">12:00 PM - 9:30 PM</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Call to Action */}
              <Link
                href="/order"
                className="inline-flex items-center gap-2 mt-6 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium"
              >
                <ChefHat className="w-4 h-4" />
                Order Now
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800">
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} Jathara. All rights reserved.
              </p>
              <div className="flex gap-6">
                <Link
                  href="/privacy"
                  className="text-gray-500 hover:text-primary text-sm transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="text-gray-500 hover:text-primary text-sm transition-colors"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}