"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Utensils, Leaf, Heart, ChefHat } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrolled = window.scrollY;
        parallaxRef.current.style.transform = `translateY(${scrolled * 0.3}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen">
      {/* Hero Section with Parallax */}
      <div className="relative w-full h-[50vh] min-h-[400px] md:min-h-[28rem] overflow-hidden">
        <div ref={parallaxRef} className="absolute inset-0 z-0">
          <Image
            src="/images/family-photo.jpg"
            alt="Jathara restaurant interior"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="relative z-20 container mx-auto px-4 text-center h-full flex flex-col justify-center items-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 font-playfair"
          >
            Our Story
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/90 max-w-2xl"
          >
            A culinary bridge between tradition and modernity
          </motion.p>
        </div>
      </div>

      {/* Story Section */}
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primaryDark font-playfair">
              A Family Tradition of Authentic Indian Cooking
            </h2>
            <p className="text-gray-600 leading-relaxed">
              At JATHARA, we are dedicated to bringing the vibrant spirit of India
              to the heart of Atlanta, serving as a culinary bridge between
              tradition and modernity for the city&apos;s diverse and culturally
              rich community.
            </p>
            <p className="text-gray-600 leading-relaxed">
              The name &apos;Jathara&apos; carries a profound dual meaning—rooted in the 
              concept of the digestive fire that nourishes and sustains life, 
              and celebrated as a grand cultural festival that unites people 
              in joy, devotion, and festivity.
            </p>
            <p className="text-gray-600 leading-relaxed">
              In a city that thrives on diversity, JATHARA aspires to be more than
              just a restaurant. We envision it as a gathering place where
              everyone can experience the essence of Indian culture, rediscover
              the tastes of home, and share the richness of these traditions with
              others.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative h-[400px] lg:h-[500px] rounded-lg overflow-hidden"
          >
            <Image
              src="/logo.png"
              alt="Jathara restaurant kitchen"
              fill
              className="object-contain p-8 bg-gray-50"
            />
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-primaryDark font-playfair"
          >
            Our Core Values
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <Utensils className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3 text-primaryDark">
                    Natural Ingredients
                  </h3>
                  <p className="text-gray-600">
                    No artificial flavors, preservatives, or MSG. Every sauce and 
                    marinade is made in-house using natural ingredients.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <ChefHat className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3 text-primaryDark">
                    Authentic Recipes
                  </h3>
                  <p className="text-gray-600">
                    Time-honored recipes passed down through generations, 
                    prepared with traditional techniques and modern presentation.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <Leaf className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3 text-primaryDark">
                    Sustainable Practices
                  </h3>
                  <p className="text-gray-600">
                    Committed to environmental responsibility through composting, 
                    recycling, and eco-friendly packaging.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3 text-primaryDark">
                    Community First
                  </h3>
                  <p className="text-gray-600">
                    Building connections through food, celebrating culture, 
                    and creating memorable experiences for our community.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-6"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primaryDark font-playfair">
            Our Vision
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed italic">
            &ldquo;At Jathara, our vision is to celebrate the rich tapestry of Indian
            culture and tradition by offering an authentic, vibrant and unforgettable
            dining experience. We aim to be the beacon of Indian cuisine, blending
            timeless recipes with contemporary presentation, all while fostering a
            warm and welcoming atmosphere. Through our passion for food and
            commitment to excellence, we aspire to connect people, culture and
            stories - one plate at a time.&rdquo;
          </p>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/10 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="container mx-auto px-4 text-center"
        >
          <h2 className="text-3xl font-bold mb-6 text-primaryDark font-playfair">
            Experience Jathara Today
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Thank you for being part of our journey and allowing us to share our
            passion for authentic Indian cuisine with you and your family.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/menu"
              className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 rounded-lg transition-all transform hover:scale-105 inline-block"
            >
              Explore Our Menu
            </Link>
            <Link
              href="/order"
              className="bg-white hover:bg-gray-100 text-primary font-semibold px-8 py-3 rounded-lg transition-all transform hover:scale-105 inline-block border border-primary"
            >
              Order Online
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}