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
  lat: number;
  lng: number;
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
    lat: -1.2865,
    lng: 36.8175,
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
      },
      {
        id: "thx-4",
        name: "Peri Peri Pizza",
        description: "Stone-baked pizza with peri chicken, peppers, and mozzarella.",
        price: 890
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
    lat: -1.2923,
    lng: 36.8069,
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
      },
      {
        id: "ss-4",
        name: "Coastal Chicken Pizza",
        description: "A spiced pizza with coconut chicken, onions, and fresh herbs.",
        price: 940
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
    lat: -1.2798,
    lng: 36.8222,
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
      },
      {
        id: "nk-4",
        name: "Office Pizza Tray",
        description: "Mixed pizza slices for team lunches and quick office bites.",
        price: 1350
      }
    ]
  },
  {
    id: "sufuria-stories",
    name: "Sufuria Stories",
    rating: 4.95,
    eta: "35-50 min",
    priceRange: "KES 420-1250",
    availability: "Available Now",
    services: ["Meal Prep", "Picnic Snacks", "Catering"],
    lat: -1.2704,
    lng: 36.8041,
    products: [
      {
        id: "sfs-1",
        name: "Slow Braised Beef Bowl",
        description: "Tender beef, pilau rice, and kachumbari with house jus.",
        price: 640
      },
      {
        id: "sfs-2",
        name: "Sunset Picnic Basket",
        description: "Mini wraps, fruit cups, pastries, and fresh juice for two.",
        price: 1180
      },
      {
        id: "sfs-3",
        name: "Story Pot Feast",
        description: "A signature family-style sufuria feast built for sharing.",
        price: 2400
      },
      {
        id: "sfs-4",
        name: "Smoked Beef Pizza",
        description: "Wood-fired style pizza topped with smoked beef and caramelized onions.",
        price: 980
      }
    ]
  },
  {
    id: "mama-njeri-table",
    name: "Mama Njeri's Table",
    rating: 4.78,
    eta: "40-55 min",
    priceRange: "KES 300-980",
    availability: "Available Now",
    services: ["Office Bites", "Meal Prep"],
    lat: -1.3018,
    lng: 36.7907,
    products: [
      {
        id: "mnt-1",
        name: "Chapati Wrap Duo",
        description: "Soft chapati wraps packed with chicken and crunchy slaw.",
        price: 460
      },
      {
        id: "mnt-2",
        name: "Family Comfort Tray",
        description: "Home-style stew, rice, greens, and chapati for four.",
        price: 1650
      },
      {
        id: "mnt-3",
        name: "Breakfast Bites Box",
        description: "Mandazi, egg muffins, fruit, and spiced tea.",
        price: 540
      }
    ]
  },
  {
    id: "green-spoon-studio",
    name: "Green Spoon Studio",
    rating: 4.82,
    eta: "30-40 min",
    priceRange: "KES 350-890",
    availability: "Limited Slots",
    services: ["Healthy", "Office Bites", "Picnic Snacks"],
    lat: -1.2842,
    lng: 36.7899,
    products: [
      {
        id: "gss-1",
        name: "Harvest Crunch Salad",
        description: "Roasted veggies, feta, seeds, and lemon dressing.",
        price: 510
      },
      {
        id: "gss-2",
        name: "Protein Bento Box",
        description: "Balanced grain bowl with grilled chicken and hummus.",
        price: 690
      },
      {
        id: "gss-3",
        name: "Fresh Press Picnic Pack",
        description: "Light bites with cold-pressed juices and fruit cups.",
        price: 880
      }
    ]
  }
];
