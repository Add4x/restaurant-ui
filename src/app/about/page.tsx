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
            src="/images/family-photo.jpg"
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
            For three generations, our family has been committed to serving
            authentic dishes made with only natural ingredients. What started as
            a small family kitchen in 1985 has grown into a beloved
            establishment, but our principles remain unchanged.
          </p>
          <p className="text-muted-foreground">
            Every dish we serve is made from scratch, using recipes passed down
            through generations and refined over decades of experience. We
            believe that real food doesn&apos;t need artificial enhancers to
            taste amazing.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
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

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-3 text-primaryDark">
            Fresh Ingredients
          </h3>
          <p className="text-muted-foreground">
            We partner with local farmers and suppliers who share our commitment
            to quality. Our ingredients are carefully selected and delivered
            fresh daily.
          </p>
        </Card>

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
          We believe that food should be more than just sustenance – it should
          be an experience that brings people together and celebrates the
          natural flavors of quality ingredients. Our vision is to continue
          serving our community while staying true to our roots and principles.
        </p>
        <p className="text-muted-foreground">
          Thank you for being part of our journey and allowing us to share our
          passion for natural, authentic cuisine with you and your family.
        </p>
      </section>
    </main>
  );
}
