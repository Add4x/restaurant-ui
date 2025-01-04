"use client";

import { testimonials } from "@/data/testimonials";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, StarHalf } from "lucide-react";

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex text-yellow-500">
      {[1, 2, 3, 4, 5].map((star) => {
        if (star <= Math.floor(rating)) {
          // Full star
          return <Star key={star} size={16} fill="currentColor" />;
        } else if (star - 0.5 === rating) {
          // Half star
          return <StarHalf key={star} size={16} fill="currentColor" />;
        } else {
          // Empty star
          return <Star key={star} size={16} />;
        }
      })}
    </div>
  );
};

const TestimonialSection = () => {
  const plugin = useRef(Autoplay({ delay: 30000, stopOnInteraction: true }));

  return (
    <section className="bg-gradient-to-br from-primary/0 to-primary/10">
      <div className="container m-auto">
        <div className="sm:gap-7 mx-auto py-16 md:py-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-primaryDark">
            What Our Clients Say
          </h2>
          <div className="relative">
            <Carousel
              opts={{
                loop: true,
                align: "start",
              }}
              plugins={[plugin.current]}
              className="mt-6 w-full px-4 md:px-8"
            >
              <CarouselContent className="pb-4 h-full">
                {testimonials.map((testimonial, index) => (
                  <CarouselItem
                    key={index}
                    className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 pl-4"
                  >
                    <Card className="h-full">
                      <CardContent className="flex flex-col justify-between h-full p-6">
                        <p className="text-md italic mb-4">
                          {testimonial.quote}
                        </p>
                        <div className="flex items-center mt-auto">
                          {testimonial.image && (
                            <Avatar className="mr-4">
                              <AvatarImage
                                src={testimonial.image}
                                alt={testimonial.name}
                                className="object-cover"
                              />
                              <AvatarFallback>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucide-user"
                                >
                                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                  <circle cx="12" cy="7" r="4" />
                                </svg>
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div>
                            <p className="font-semibold">{testimonial.name}</p>
                            <StarRating rating={testimonial.rating} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute -left-6 size-7 xl:-left-6 xl:size-8" />
              <CarouselNext className="absolute -right-6 size-7 xl:-right-8 xl:size-8" />
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
