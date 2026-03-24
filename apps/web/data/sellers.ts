export type SellerProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
};

export type SellerProfile = {
  id: string;
  name: string;
  rating: number;
  eta: string;
  priceRange: string;
  availability: string;
  services: string[];
  products: SellerProduct[];
};

export const sellers: SellerProfile[] = [
  {
    id: "tastehub-express",
    name: "TasteHub Express",
    rating: 4.7,
    eta: "30-45 min",
    priceRange: "KES 350-900",
    availability: "Available Now",
    services: ["Meal Prep", "Office Bites"],
    products: [
      {
        id: "thx-1",
        name: "Grilled Chicken Bowl",
        description: "High-protein bowl with greens and avocado.",
        price: 520
      },
      {
        id: "thx-2",
        name: "Office Snack Box",
        description: "Assorted bites for team meetings.",
        price: 760
      },
      {
        id: "thx-3",
        name: "Spiced Rice Tray",
        description: "Serves 4-6 with sides.",
        price: 1200
      }
    ]
  },
  {
    id: "swahili-spice",
    name: "Swahili Spice",
    rating: 4.85,
    eta: "45-60 min",
    priceRange: "KES 400-1100",
    availability: "Limited Slots",
    services: ["Picnic Snacks", "Catering"],
    products: [
      {
        id: "ss-1",
        name: "Coconut Fish Platter",
        description: "Coastal flavors with sides.",
        price: 980
      },
      {
        id: "ss-2",
        name: "Spice Mix Picnic Basket",
        description: "Finger foods and dips for two.",
        price: 650
      },
      {
        id: "ss-3",
        name: "Event Buffet Set",
        description: "Full service catering starter pack.",
        price: 3500
      }
    ]
  },
  {
    id: "nairobi-kitchen",
    name: "Nairobi Kitchen",
    rating: 4.7,
    eta: "40-55 min",
    priceRange: "KES 500-1300",
    availability: "Available Now",
    services: ["Office Bites", "Catering"],
    products: [
      {
        id: "nk-1",
        name: "Executive Lunch Tray",
        description: "Premium trays for corporate teams.",
        price: 1500
      },
      {
        id: "nk-2",
        name: "Meeting Bites",
        description: "Tea-break bites with pastries.",
        price: 720
      },
      {
        id: "nk-3",
        name: "Signature Platter",
        description: "Chef-curated platter for 4.",
        price: 980
      }
    ]
  }
];
