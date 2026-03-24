export type ChefProfile = {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  eta: string;
  price: string;
  highlightComment: string;
  isVerified: boolean;
};

export const chefProfiles: ChefProfile[] = [
  {
    id: "chef-amani",
    name: "Chef Amani",
    rating: 4.8,
    reviewCount: 212,
    eta: "35-45 min",
    price: "From KES 500",
    highlightComment: "Always on time and beautifully plated meals.",
    isVerified: true
  },
  {
    id: "nairobi-kitchen",
    name: "Nairobi Kitchen",
    rating: 4.7,
    reviewCount: 178,
    eta: "45-60 min",
    price: "From KES 620",
    highlightComment: "Great office bites and consistent quality.",
    isVerified: true
  },
  {
    id: "mama-jay",
    name: "Mama Jay",
    rating: 4.9,
    reviewCount: 264,
    eta: "25-35 min",
    price: "From KES 450",
    highlightComment: "Perfect for family trays and spicy flavors.",
    isVerified: true
  },
  {
    id: "urban-plates",
    name: "Urban Plates",
    rating: 4.6,
    reviewCount: 141,
    eta: "50-65 min",
    price: "From KES 700",
    highlightComment: "Fresh ingredients with bold presentation.",
    isVerified: false
  },
  {
    id: "swahili-spice",
    name: "Swahili Spice",
    rating: 4.85,
    reviewCount: 196,
    eta: "40-55 min",
    price: "From KES 560",
    highlightComment: "Highly rated for consistency and taste.",
    isVerified: true
  }
];
