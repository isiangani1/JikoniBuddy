export type BuddyRequest = {
  id: string;
  title: string;
  seller: string;
  skill: "Cooking" | "Packaging" | "Delivery";
  location: string;
  distanceKm: number;
  timeWindow: string;
  durationHours: number;
  pay: number;
  urgency: "ASAP" | "Scheduled";
  status: "Open" | "Reserved" | "Assigned";
  notes: string;
  posted: string;
};

export const buddyRequests: BuddyRequest[] = [
  {
    id: "req-101",
    title: "Meal prep surge support",
    seller: "Chef Amani",
    skill: "Cooking",
    location: "Kilimani, Nairobi",
    distanceKm: 3.2,
    timeWindow: "Today, 14:00 - 18:00",
    durationHours: 4,
    pay: 1800,
    urgency: "ASAP",
    status: "Open",
    notes: "Focus on prep stations and plating for 60+ orders.",
    posted: "12 minutes ago"
  },
  {
    id: "req-102",
    title: "Office bites packaging run",
    seller: "Nairobi Kitchen",
    skill: "Packaging",
    location: "Westlands",
    distanceKm: 5.1,
    timeWindow: "Tomorrow, 09:00 - 11:00",
    durationHours: 2,
    pay: 850,
    urgency: "Scheduled",
    status: "Open",
    notes: "Pack 120 lunch boxes, quality checks included.",
    posted: "1 hour ago"
  },
  {
    id: "req-103",
    title: "Event delivery runner",
    seller: "Swahili Spice",
    skill: "Delivery",
    location: "Upper Hill",
    distanceKm: 7.4,
    timeWindow: "Today, 17:30 - 19:00",
    durationHours: 1.5,
    pay: 600,
    urgency: "ASAP",
    status: "Open",
    notes: "Two drop-offs with chilled carriers provided.",
    posted: "28 minutes ago"
  },
  {
    id: "req-104",
    title: "Weekend catering assist",
    seller: "Urban Plates",
    skill: "Cooking",
    location: "Karen",
    distanceKm: 9.8,
    timeWindow: "Saturday, 10:00 - 15:00",
    durationHours: 5,
    pay: 2300,
    urgency: "Scheduled",
    status: "Reserved",
    notes: "Assist lead chef with grill and station setup.",
    posted: "Yesterday"
  },
  {
    id: "req-105",
    title: "Picnic snack boxing",
    seller: "Green Bowl Co.",
    skill: "Packaging",
    location: "Lavington",
    distanceKm: 4.3,
    timeWindow: "Friday, 08:00 - 10:00",
    durationHours: 2,
    pay: 780,
    urgency: "Scheduled",
    status: "Open",
    notes: "Light assembly + labeling. Calm, clean workspace.",
    posted: "Today"
  },
  {
    id: "req-106",
    title: "Downtown delivery sprint",
    seller: "TasteHub Express",
    skill: "Delivery",
    location: "CBD",
    distanceKm: 2.4,
    timeWindow: "Today, 12:30 - 14:00",
    durationHours: 1.5,
    pay: 520,
    urgency: "ASAP",
    status: "Assigned",
    notes: "Fast hand-offs, 3 stops within CBD.",
    posted: "5 minutes ago"
  }
];
