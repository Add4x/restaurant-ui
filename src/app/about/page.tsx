import { Metadata } from "next";
import Image from "next/image";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About Us | Natural Kitchen",
  description:
    "Learn about our family's commitment to serving natural, authentic food made with love and tradition.",
};

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-4xl font-bold text-center mb-8 font-playfair text-primaryDark">
        Our Story
      </h1>

      <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
        <div className="relative min-h-[18rem] h-full w-full">
          <Image
            src="/logo.png"
            alt="The jathara family in their restaurant kitchen"
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-primaryDark">
            A Family Tradition of Natural Cooking
          </h2>
          <p className="text-muted-foreground">
            At JATHARA, we are dedicated to bringing the vibrant spirit of India
            to the heart of Atlanta, serving as a culinary bridge between
            tradition and modernity for the city&apos;s diverse and culturally
            rich community. The name &apos;Jathara&apos; carries a profound dual
            meaning—rooted in the concept of the digestive fire that nourishes
            and sustains life, and celebrated as a grand cultural festival that
            unites people in joy, devotion, and festivity.
          </p>
          <p className="text-muted-foreground">
            In a city that thrives on diversity, JATHARA aspires to be more than
            just a restaurant. We envision it as a gathering place where
            everyone can experience the essence of Indian culture, rediscover
            the tastes of home, and share the richness of these traditions with
            others.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-3 text-primaryDark">
            Our Promise
          </h3>
          <p className="text-muted-foreground">
            We never use artificial flavors, preservatives, or MSG in our
            cooking. Every sauce, every broth, and every marinade is made
            in-house using natural ingredients.
          </p>
        </Card>

        {/* <Card className="p-6">
          <h3 className="text-xl font-semibold mb-3 text-primaryDark">
            Fresh Ingredients
          </h3>
          <p className="text-muted-foreground">
            We partner with local farmers and suppliers who share our commitment
            to quality. Our ingredients are carefully selected and delivered
            fresh daily.
          </p>
        </Card> */}

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-3 text-primaryDark">
            Sustainable Practices
          </h3>
          <p className="text-muted-foreground">
            We&apos;re committed to environmental responsibility through
            composting, recycling, and using eco-friendly packaging for takeout
            orders.
          </p>
        </Card>
      </div>

      <section className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-semibold mb-4 text-primaryDark">
          Our Vision
        </h2>
        <p className="text-muted-foreground mb-6">
          “At Jathara, our vision is celebrate the rich tapestry of Indian
          culture tradition by offering an authentic, vibrant and unforgettable
          dining experience. We aim to be the beacon of Indian cuisine, blending
          timeless recipes with contemporary presentation, all while fostering a
          warm and welcoming atmosphere. Through our passion for food and
          commitment to excellence, we aspire to connect people, culture and
          stories - one plate at a time”
        </p>
        <p className="text-muted-foreground">
          Thank you for being part of our journey and allowing us to share our
          passion for natural, authentic cuisine with you and your family.
        </p>
      </section>
    </main>
  );
}
