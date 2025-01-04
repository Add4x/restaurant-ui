export interface Testimonial {
    name: string;
    rating: number;
    quote: string;
    image?: string;
}

export const testimonials: Testimonial[] = [
    {
        name: "John Doe",
        rating: 4.5,
        quote: "Working with them has been amazing...",
        image: "/images/testimonials/t1.jpg"
    },
    {
        name: "Sarah Johnson",
        rating: 5,
        quote: "The products exceeded our expectations. Truly a game-changer for our business.",
        image: "/images/testimonials/t2.jpg"
    },
    {
        name: "Michael Chen",
        rating: 5,
        quote: "Outstanding quality and reliability. We couldn't be happier with the results.",
        image: "/images/testimonials/t3.jpg"
    },
    {
        name: "Emma Williams",
        rating: 5,
        quote: "Their innovative approach and attention to detail have transformed our workflow.",
        image: "/images/testimonials/t4.jpg"
    },
    {
        name: "Robert Martinez",
        rating: 5,
        quote: "Exceptional service and product quality. They've become our trusted partner.",
        image: "/images/testimonials/t3.jpg"
    },
    {
        name: "Lisa Thompson",
        rating: 2,
        quote: "The team's expertise and dedication have made all the difference in our projects.",
        image: "/images/testimonials/t1.jpg"
    },
    {
        name: "David Kim",
        rating: 2,
        quote: "A fantastic partnership that has helped us scale our business effectively.",
        image: "/images/testimonials/t4.jpg"
    }
]; 