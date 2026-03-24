export type BuddyProfile = {
  id: string;
  name: string;
  role: string;
  rating: number;
  skills: string[];
  initials: string;
};

export const buddies: BuddyProfile[] = [
  {
    id: "anne-k",
    name: "Anne K.",
    role: "Packaging Specialist",
    rating: 4.8,
    skills: ["Packaging", "Quality Checks"],
    initials: "AK"
  },
  {
    id: "brian-m",
    name: "Brian M.",
    role: "Delivery Helper",
    rating: 4.6,
    skills: ["Delivery", "Route Planning"],
    initials: "BM"
  },
  {
    id: "faith-a",
    name: "Faith A.",
    role: "Kitchen Helper",
    rating: 4.9,
    skills: ["Cooking", "Prep"],
    initials: "FA"
  },
  {
    id: "njoki-j",
    name: "Njoki J.",
    role: "Prep Assistant",
    rating: 4.7,
    skills: ["Prep", "Packaging"],
    initials: "NJ"
  },
  {
    id: "sam-p",
    name: "Sam P.",
    role: "Sous Chef",
    rating: 4.85,
    skills: ["Cooking", "Inventory"],
    initials: "SP"
  },
  {
    id: "uma-m",
    name: "Uma M.",
    role: "Delivery Support",
    rating: 4.5,
    skills: ["Delivery", "Customer Care"],
    initials: "UM"
  },
  {
    id: "zuri-w",
    name: "Zuri W.",
    role: "Packaging Lead",
    rating: 4.75,
    skills: ["Packaging", "Inventory"],
    initials: "ZW"
  },
  {
    id: "ken-o",
    name: "Ken O.",
    role: "Kitchen Runner",
    rating: 4.65,
    skills: ["Prep", "Delivery"],
    initials: "KO"
  }
];
