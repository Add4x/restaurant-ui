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
    name: "Muchukota Raja Kumar",
    rating: 5,
    quote:
      "The food, service, and ambiance were excellent. We ordered Vijayawada paneer biryani, haleem, rumali roti, jalapeño chicken, and veg keema curry, and everything was delicious. Ending the meal with a cup of amazing Irani chai made the experience even better. We will definitely visit again and highly recommend this place.",
    image: "/images/testimonials/t2.jpg",
  },
  {
    name: "Sri Kanth",
    rating: 5,
    quote:
      "Fantastic food! We ordered quite a few varieties of food and everything was tasty and service was quick and efficient as well.",
    image: "/images/testimonials/t3.jpg",
  },
  {
    name: "Monika Katipally",
    rating: 5,
    quote:
      "Started off with their complimentary Irani chai n Maska bun (soft n yummlicious). We were recommended their Jalapeño Chicken appetizer n also we chose to try Baby corn appetizer. Both were great to taste. We got to try their Haleem. And it was my first time trying Haleem and liked it!! We got home some Tandoori Chicken.We also got to try the Rumaali roti which is not a regular item to find on the menu for many restaurants around.Overall the food was good n definitely would come to try their other items in the menu.",
    image: "/images/testimonials/t4.jpg",
  },
  {
    name: "Akhila Akhi",
    rating: 5,
    quote:
      "This place offers a variety of vegetarian food options. For a snack, we ordered punugulu and Irani chai. The ginger and groundnut chutneys served with the punugulu had authentic flavors and were delicious. The Irani chai was amazing. For the main course, we had Vijayawada paneer biryani, rumali roti, and kadai paneer, all of which were absolutely delicious. Would surely visit again.",
    image: "/images/testimonials/t5.jpg",
  },
  {
    name: "Siri Puligadda",
    rating: 5,
    quote:
      "Newly opened indian restaurant in Alpharetta. It was truly delicious and delightful. We tried the snacks cut mirchi, pungulu, samosa and the Appetizers like babycorn 65, jalapeno chicken. I highly recommend the pungulu. Overall all the dishes tasted amazing. The irani chai and bun is complimentary as it was opened today.",
    image: "/images/testimonials/t6.jpg",
  },
];
