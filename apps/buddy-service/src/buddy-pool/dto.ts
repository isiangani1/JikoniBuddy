 export type CreateBuddyRequestDto = {
  sellerId: string;
  taskType: "cooking" | "packaging" | "delivery";
  location: { lat: number; lng: number; label: string };
  timeWindow: { start: string; end: string };
  durationHours: number;
  compensation?: number;
};

export type ApplyBuddyRequestDto = {
  helperId: string;
  note?: string;
};

export type ConfirmBuddyRequestDto = {
  helperId: string;
};

export type CompleteAssignmentDto = {
  statusNote?: string;
};

export type CreateRatingDto = {
  requestId: string;
  helperId: string;
  rating: number;
  comment?: string;
};

export type RegisterBuddyDto = {
  name: string;
  email: string;
  phone: string;
  password: string;
  skills: Array<"cooking" | "packaging" | "delivery">;
  location: { lat: number; lng: number; label: string };
  radiusKm?: number;
  profilePhotoUrl?: string;
  idNumber?: string;
};

export type LoginBuddyDto = {
  email: string;
  password: string;
};
