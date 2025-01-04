'use client'

import { testimonials } from '@/data/testimonials'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { useRef } from "react"
import Autoplay from "embla-carousel-autoplay"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Star, StarHalf } from "lucide-react"

const StarRating = ({ rating }: { rating: number }) => {
    return (
        <div className="flex text-yellow-500">
            {[1, 2, 3, 4, 5].map((star) => {
                if (star <= Math.floor(rating)) {
                    // Full star
                    return <Star key={star} size={16} fill="currentColor" />
                } else if (star - 0.5 === rating) {
                    // Half star
                    return <StarHalf key={star} size={16} fill="currentColor" />
                } else {
                    // Empty star
                    return <Star key={star} size={16} />
                }
            })}
        </div>
    )
}

const TestimonialSection = () => {
    const plugin = useRef(
        Autoplay({ delay: 30000, stopOnInteraction: true })
    )

    return (
        <section className="bg-gradient-to-br from-[#B2DFDB] to-[#E0E0E0]">
            <div className="container sm:gap-7 mx-auto py-8 md:py-16" >
                <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
                <Carousel
                    opts={{
                        loop: true,
                        align: "start",
                    }}
                    plugins={[plugin.current]}
                    className="mt-6 w-full px-4 md:px-0"
                >
                    <CarouselPrevious className="-left-6 size-7 xl:-left-12 xl:size-8" />
                    <CarouselContent className="pb-4 m-2 items-stretch">
                        {testimonials.map((testimonial, index) => (
                            <CarouselItem key={index} className="md:basis-1/3 h-full">
                                <div className="p-1 m-1 h-full">
                                    <Card className="h-full">
                                        <CardContent className="flex flex-col justify-between h-full p-6">
                                            <p className="text-md italic">"{testimonial.quote}"</p>
                                            <div className="flex items-center mt-6">
                                                {testimonial.image && (
                                                    <Avatar className="mr-4">
                                                        <AvatarImage src={testimonial.image} alt={testimonial.name} className="object-cover" />
                                                        <AvatarFallback>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
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
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselNext className="-right-6 size-7 xl:-right-12 xl:size-8" />
                </Carousel>
            </div >
        </section >
    )
}

export default TestimonialSection 