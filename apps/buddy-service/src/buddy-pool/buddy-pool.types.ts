export type BuddyRequestStatus = "open" | "matched" | "confirmed" | "completed";

export type BuddyRequest = {
  id: string;
  sellerId: string;
  taskType: "cooking" | "packaging" | "delivery";
  location: { lat: number; lng: number; label: string };
  timeWindow: { start: string; end: string };
  durationHours: number;
  compensation?: number;
  status: BuddyRequestStatus;
  createdAt: string;
};

export type HelperProfile = {
  id: string;
  name: string;
  skills: Array<"cooking" | "packaging" | "delivery">;
  rating: number;
  location: { lat: number; lng: number };
  available: boolean;
};

export type BuddyApplication = {
  id: string;
  requestId: string;
  helperId: string;
  note?: string;
  status: "pending" | "accepted" | "rejected";
};

export type BuddyAssignment = {
  id: string;
  requestId: string;
  helperId: string;
  status: "confirmed" | "completed";
};

export type Rating = {
  id: string;
  requestId: string;
  helperId: string;
  rating: number;
  comment?: string;
};
