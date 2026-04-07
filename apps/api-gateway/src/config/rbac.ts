export type Role = "buyer" | "seller" | "buddy" | "admin" | "user";

export const serviceRoleMatrix: Record<string, Role[]> = {
  buddy: ["buddy", "admin"],
  seller: ["seller", "admin"],
  buyer: ["buyer", "admin"],
  admin: ["admin"],
  order: ["buyer", "seller", "admin"],
  payment: ["buyer", "seller", "admin"],
  payout: ["seller", "buddy", "admin"],
  menu: ["seller", "admin"],
  notification: ["buyer", "seller", "buddy", "admin"],
  delivery: ["seller", "admin"],
  review: ["buyer", "admin"],
  messaging: ["buyer", "seller", "buddy", "admin"],
  chat: ["buyer", "seller", "buddy", "admin"],
  refund: ["buyer", "admin"],
  user: ["buyer", "seller", "buddy", "admin"]
};

export const publicRoutes: RegExp[] = [
  /^\/health$/,
  /^\/auth\/.*/,
  /^\/api\/auth\/.*/,
  /^\/api\/public\/.*/
];
