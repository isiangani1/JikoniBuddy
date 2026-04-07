type ServiceConfig = {
  key: string;
  baseUrl: string;
  healthPath: string;
};

const env = process.env;

const defaultHealthPath = "/health";

export const services: Record<string, ServiceConfig> = {
  auth: {
    key: "auth",
    baseUrl: env.AUTH_SERVICE_URL ?? "http://127.0.0.1:4001",
    healthPath: env.AUTH_SERVICE_HEALTH ?? defaultHealthPath
  },
  user: {
    key: "user",
    baseUrl: env.USER_SERVICE_URL ?? "http://127.0.0.1:4002",
    healthPath: env.USER_SERVICE_HEALTH ?? defaultHealthPath
  },
  seller: {
    key: "seller",
    baseUrl: env.SELLER_SERVICE_URL ?? "http://127.0.0.1:4007",
    healthPath: env.SELLER_SERVICE_HEALTH ?? defaultHealthPath
  },
  buyer: {
    key: "buyer",
    baseUrl: env.BUYER_SERVICE_URL ?? "http://127.0.0.1:4010",
    healthPath: env.BUYER_SERVICE_HEALTH ?? defaultHealthPath
  },
  order: {
    key: "order",
    baseUrl: env.ORDER_SERVICE_URL ?? "http://127.0.0.1:4004",
    healthPath: env.ORDER_SERVICE_HEALTH ?? defaultHealthPath
  },
  payment: {
    key: "payment",
    baseUrl: env.PAYMENT_SERVICE_URL ?? "http://127.0.0.1:4008",
    healthPath: env.PAYMENT_SERVICE_HEALTH ?? defaultHealthPath
  },
  payout: {
    key: "payout",
    baseUrl: env.PAYOUT_SERVICE_URL ?? "http://127.0.0.1:4016",
    healthPath: env.PAYOUT_SERVICE_HEALTH ?? defaultHealthPath
  },
  buddy: {
    key: "buddy",
    baseUrl: env.BUDDY_SERVICE_URL ?? "http://127.0.0.1:4005",
    healthPath: env.BUDDY_SERVICE_HEALTH ?? defaultHealthPath
  },
  notification: {
    key: "notification",
    baseUrl: env.NOTIFICATION_SERVICE_URL ?? "http://127.0.0.1:4011",
    healthPath: env.NOTIFICATION_SERVICE_HEALTH ?? defaultHealthPath
  },
  menu: {
    key: "menu",
    baseUrl: env.MENU_SERVICE_URL ?? "http://127.0.0.1:4006",
    healthPath: env.MENU_SERVICE_HEALTH ?? defaultHealthPath
  },
  delivery: {
    key: "delivery",
    baseUrl: env.DELIVERY_SERVICE_URL ?? "http://127.0.0.1:4012",
    healthPath: env.DELIVERY_SERVICE_HEALTH ?? defaultHealthPath
  },
  review: {
    key: "review",
    baseUrl: env.REVIEW_SERVICE_URL ?? "http://127.0.0.1:4013",
    healthPath: env.REVIEW_SERVICE_HEALTH ?? defaultHealthPath
  },
  messaging: {
    key: "messaging",
    baseUrl: env.MESSAGING_SERVICE_URL ?? "http://127.0.0.1:4014",
    healthPath: env.MESSAGING_SERVICE_HEALTH ?? defaultHealthPath
  },
  chat: {
    key: "chat",
    baseUrl: env.CHAT_SERVICE_URL ?? "http://127.0.0.1:4017",
    healthPath: env.CHAT_SERVICE_HEALTH ?? defaultHealthPath
  },
  refund: {
    key: "refund",
    baseUrl: env.REFUND_SERVICE_URL ?? "http://127.0.0.1:4018",
    healthPath: env.REFUND_SERVICE_HEALTH ?? defaultHealthPath
  },
  admin: {
    key: "admin",
    baseUrl: env.ADMIN_SERVICE_URL ?? "http://127.0.0.1:4015",
    healthPath: env.ADMIN_SERVICE_HEALTH ?? defaultHealthPath
  }
};
