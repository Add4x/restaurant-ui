export interface Testimonial {
  name: string;
  rating: number;
  quote: string;
  image?: string;
}

export const testimonials: Testimonial[] = [
  {
    name: "Suresh Namala",
    rating: 4.5,
    quote: "The Biryani and Chai are authentic and delicious.",
    image: "/images/testimonials/t1.jpg",
  },
  {
    name: "Rajesh Kumar",
    rating: 5,
    quote:
      "We ordered Veg Hakka Noodles, Paneer Tikka, and a Paneer Butter Masala. All were delicious.",
    image: "/images/testimonials/t2.jpg",
  },
  {
    name: "Kavya Reddy",
    rating: 5,
    quote:
      "I liked that they avoid too much food coloring and artificial flavors.",
    image: "/images/testimonials/t3.jpg",
  },
  {
    name: "Vimlesh Kumar",
    rating: 5,
    quote: "The Chicken Tikka and Chicken Butter Masala were amazing.",
    image: "/images/testimonials/t4.jpg",
  },
  {
    name: "Robert Martinez",
    rating: 5,
    quote: "Ordered Vijayawada Special Biryani and the spices were just right.",
    image: "/images/testimonials/t5.jpg",
  },
  {
    name: "Sai Kumar",
    rating: 5,
    quote: "The Chicken Tikka and Chicken Butter Masala were amazing.",
    image: "/images/testimonials/t6.jpg",
  },
];
