export type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

export type DeliveryQuote = {
  fee: number;
  mode: "rider" | "seller";
  label: string;
};

export type CheckoutDraft = {
  deliveryLocation: string;
  deliveryAddressLabel: string;
  scheduledDate: string;
  timeWindow: string;
  orderNotes: string;
  paymentMethod: "mpesa" | "cash";
};

export type PaymentStatus = "not_started" | "pending" | "successful" | "failed";

export type PaymentRecord = {
  method: "mpesa" | "cash";
  status: PaymentStatus;
  receiptId?: string;
  phoneNumber?: string;
};

export type BuyerOrderStatus =
  | "placed"
  | "accepted"
  | "in_preparation"
  | "out_for_delivery"
  | "delivered"
  | "completed";

export type BuyerOrder = {
  id: string;
  sellerId: string;
  items: CartItem[];
  subtotal: number;
  delivery: DeliveryQuote;
  total: number;
  checkout: CheckoutDraft;
  payment: PaymentRecord;
  status: BuyerOrderStatus;
  createdAt: string;
};

export type SavedAddress = {
  id: string;
  label: string;
  location: string;
};

export type BuyerProfile = {
  name: string;
  phone: string;
  email: string;
};

export type SellerReview = {
  id: string;
  sellerId: string;
  orderId: string;
  rating: number;
  comment: string;
  createdAt: string;
};

type StoredState = {
  sellerId: string | null;
  cart: CartItem[];
  checkout: CheckoutDraft;
  lastOrderId: string | null;
  profile: BuyerProfile;
  addresses: SavedAddress[];
};

const STORAGE_KEY = "jb_buyer_state";
const ORDERS_KEY = "jb_orders";
const MESSAGES_PREFIX = "jb_order_messages:";
const REVIEWS_KEY = "jb_reviews";
const NOTIFICATIONS_KEY = "jb_buyer_notifications";
const SUPPORT_TICKETS_KEY = "jb_buyer_support_tickets";
const REFUNDS_KEY = "jb_buyer_refund_requests";

export type BuyerNotificationType =
  | "order_created"
  | "order_status"
  | "payment_status"
  | "promo"
  | "system";

export type BuyerNotification = {
  id: string;
  type: BuyerNotificationType;
  title: string;
  message: string;
  orderId?: string;
  createdAt: string;
  readAt?: string;
};

export type SupportTicketStatus = "open" | "in_review" | "resolved";

export type SupportTicket = {
  id: string;
  orderId?: string;
  category: "late_delivery" | "missing_items" | "quality" | "payment" | "other";
  subject: string;
  description: string;
  evidenceNote?: string;
  status: SupportTicketStatus;
  createdAt: string;
  updatedAt: string;
};

export type RefundRequestStatus = "requested" | "in_review" | "approved" | "rejected";

export type RefundRequest = {
  id: string;
  orderId: string;
  reason: "late_delivery" | "missing_items" | "quality" | "payment" | "other";
  details: string;
  status: RefundRequestStatus;
  createdAt: string;
  updatedAt: string;
};

const defaultState: StoredState = {
  sellerId: null,
  cart: [],
  checkout: {
    deliveryLocation: "",
    deliveryAddressLabel: "",
    scheduledDate: "",
    timeWindow: "",
    orderNotes: "",
    paymentMethod: "mpesa"
  },
  lastOrderId: null,
  profile: {
    name: "",
    phone: "",
    email: ""
  },
  addresses: [
    {
      id: "home",
      label: "Home",
      location: "Kilimani, Nairobi"
    },
    {
      id: "work",
      label: "Work",
      location: "Westlands, Nairobi"
    }
  ]
};

export function loadBuyerState(): StoredState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<StoredState>;
    return {
      ...defaultState,
      ...parsed,
      checkout: { ...defaultState.checkout, ...(parsed.checkout ?? {}) }
    };
  } catch {
    return defaultState;
  }
}

export function saveBuyerState(state: StoredState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearBuyerCart() {
  const state = loadBuyerState();
  saveBuyerState({ ...state, cart: [], sellerId: null });
}

export function setBuyerSeller(sellerId: string) {
  const state = loadBuyerState();
  saveBuyerState({ ...state, sellerId });
}

export function addCartItem(sellerId: string, item: { id: string; name: string; price: number }) {
  const state = loadBuyerState();
  const nextSellerId = state.sellerId ?? sellerId;

  const cart = nextSellerId !== sellerId ? [] : state.cart;
  const existing = cart.find((entry) => entry.id === item.id);
  const nextCart = existing
    ? cart.map((entry) => (entry.id === item.id ? { ...entry, qty: entry.qty + 1 } : entry))
    : [...cart, { ...item, qty: 1 }];

  saveBuyerState({ ...state, sellerId, cart: nextCart });
}

export function updateCartQty(itemId: string, qty: number) {
  const state = loadBuyerState();
  const nextCart = state.cart
    .map((entry) => (entry.id === itemId ? { ...entry, qty } : entry))
    .filter((entry) => entry.qty > 0);
  saveBuyerState({ ...state, cart: nextCart });
}

export function setCheckoutDraft(update: Partial<CheckoutDraft>) {
  const state = loadBuyerState();
  saveBuyerState({ ...state, checkout: { ...state.checkout, ...update } });
}

export function updateBuyerProfile(update: Partial<BuyerProfile>) {
  const state = loadBuyerState();
  saveBuyerState({ ...state, profile: { ...state.profile, ...update } });
}

export function addSavedAddress(input: { label: string; location: string }): SavedAddress {
  const state = loadBuyerState();
  const stored: SavedAddress = {
    id: `addr-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    label: input.label,
    location: input.location
  };
  saveBuyerState({ ...state, addresses: [stored, ...state.addresses] });
  return stored;
}

export function updateSavedAddress(addressId: string, update: Partial<Omit<SavedAddress, "id">>) {
  const state = loadBuyerState();
  const next = state.addresses.map((entry) =>
    entry.id === addressId ? { ...entry, ...update } : entry
  );
  saveBuyerState({ ...state, addresses: next });
}

export function deleteSavedAddress(addressId: string) {
  const state = loadBuyerState();
  const next = state.addresses.filter((entry) => entry.id !== addressId);
  saveBuyerState({ ...state, addresses: next });
}

export function computeSubtotal(cart: CartItem[]) {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

export function quoteDelivery(subtotal: number): DeliveryQuote {
  const fee = subtotal >= 2000 ? 149 : 249;
  return {
    fee,
    mode: "rider",
    label: "Rider delivery"
  };
}

export function loadOrders(): BuyerOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ORDERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as BuyerOrder[];
  } catch {
    return [];
  }
}

export function saveOrders(orders: BuyerOrder[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function loadNotifications(): BuyerNotification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(NOTIFICATIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as BuyerNotification[];
  } catch {
    return [];
  }
}

export function saveNotifications(items: BuyerNotification[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(items));
}

export function pushNotification(input: Omit<BuyerNotification, "id" | "createdAt" | "readAt">) {
  const stored: BuyerNotification = {
    ...input,
    id: `ntf-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    createdAt: new Date().toISOString()
  };
  const current = loadNotifications();
  saveNotifications([stored, ...current].slice(0, 50));
  return stored;
}

export function markNotificationRead(notificationId: string) {
  const current = loadNotifications();
  const next = current.map((item) =>
    item.id === notificationId ? { ...item, readAt: item.readAt ?? new Date().toISOString() } : item
  );
  saveNotifications(next);
}

export function clearNotifications() {
  saveNotifications([]);
}

export function loadSupportTickets(): SupportTicket[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SUPPORT_TICKETS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SupportTicket[];
  } catch {
    return [];
  }
}

export function saveSupportTickets(items: SupportTicket[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SUPPORT_TICKETS_KEY, JSON.stringify(items));
}

export function createSupportTicket(input: Omit<SupportTicket, "id" | "status" | "createdAt" | "updatedAt">) {
  const now = new Date().toISOString();
  const stored: SupportTicket = {
    ...input,
    id: `tkt-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    status: "open",
    createdAt: now,
    updatedAt: now
  };
  const current = loadSupportTickets();
  saveSupportTickets([stored, ...current]);
  return stored;
}

export function updateSupportTicketStatus(ticketId: string, status: SupportTicketStatus) {
  const current = loadSupportTickets();
  const next = current.map((item) =>
    item.id === ticketId
      ? { ...item, status, updatedAt: new Date().toISOString() }
      : item
  );
  saveSupportTickets(next);
}

export function loadRefundRequests(): RefundRequest[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(REFUNDS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as RefundRequest[];
  } catch {
    return [];
  }
}

export function saveRefundRequests(items: RefundRequest[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(REFUNDS_KEY, JSON.stringify(items));
}

export function getRefundRequestForOrder(orderId: string): RefundRequest | null {
  return loadRefundRequests().find((item) => item.orderId === orderId) ?? null;
}

export function createRefundRequest(input: { orderId: string; reason: RefundRequest["reason"]; details: string }) {
  const existing = getRefundRequestForOrder(input.orderId);
  if (existing) return existing;

  const now = new Date().toISOString();
  const stored: RefundRequest = {
    id: `rfd-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    orderId: input.orderId,
    reason: input.reason,
    details: input.details,
    status: "requested",
    createdAt: now,
    updatedAt: now
  };
  const current = loadRefundRequests();
  saveRefundRequests([stored, ...current]);
  pushNotification({
    type: "system",
    title: "Refund requested",
    message: `Refund request submitted for order ${input.orderId}.`,
    orderId: input.orderId
  });
  return stored;
}

export function placeOrder(order: Omit<BuyerOrder, "createdAt">): BuyerOrder {
  const orders = loadOrders();
  const stored: BuyerOrder = { ...order, createdAt: new Date().toISOString() };
  const next = [stored, ...orders];
  saveOrders(next);

  pushNotification({
    type: "order_created",
    title: "Order placed",
    message: `Your order ${stored.id} has been placed.`,
    orderId: stored.id
  });

  const state = loadBuyerState();
  saveBuyerState({ ...state, lastOrderId: stored.id });

  return stored;
}

export function getOrder(orderId: string): BuyerOrder | null {
  const orders = loadOrders();
  return orders.find((entry) => entry.id === orderId) ?? null;
}

export function updateOrderStatus(orderId: string, status: BuyerOrderStatus) {
  const orders = loadOrders();
  const next = orders.map((entry) => (entry.id === orderId ? { ...entry, status } : entry));
  saveOrders(next);

  pushNotification({
    type: "order_status",
    title: "Order update",
    message: `Order ${orderId} is now ${status.replace(/_/g, " ")}.`,
    orderId
  });
}

export function updateOrderPayment(orderId: string, update: Partial<PaymentRecord>) {
  const orders = loadOrders();
  const current = orders.find((entry) => entry.id === orderId) ?? null;
  const next = orders.map((entry) =>
    entry.id === orderId ? { ...entry, payment: { ...entry.payment, ...update } } : entry
  );
  saveOrders(next);

  const nextStatus = update.status ?? current?.payment.status;
  if (nextStatus) {
    pushNotification({
      type: "payment_status",
      title: "Payment update",
      message: `Payment for order ${orderId} is ${nextStatus}.`,
      orderId
    });
  }
}

export function startReorder(orderId: string) {
  const order = getOrder(orderId);
  if (!order) return;
  const state = loadBuyerState();
  saveBuyerState({
    ...state,
    sellerId: order.sellerId,
    cart: order.items,
    checkout: { ...state.checkout, ...order.checkout }
  });
}

export function loadReviews(): SellerReview[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(REVIEWS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SellerReview[];
  } catch {
    return [];
  }
}

export function saveReviews(reviews: SellerReview[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
}

export function getSellerReviews(sellerId: string): SellerReview[] {
  return loadReviews()
    .filter((review) => review.sellerId === sellerId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getOrderReview(orderId: string): SellerReview | null {
  return loadReviews().find((review) => review.orderId === orderId) ?? null;
}

export function submitReview(input: {
  sellerId: string;
  orderId: string;
  rating: number;
  comment: string;
}): SellerReview {
  const existing = getOrderReview(input.orderId);
  if (existing) {
    return existing;
  }

  const stored: SellerReview = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    sellerId: input.sellerId,
    orderId: input.orderId,
    rating: Math.max(1, Math.min(5, Math.round(input.rating))),
    comment: input.comment,
    createdAt: new Date().toISOString()
  };

  const reviews = loadReviews();
  saveReviews([stored, ...reviews]);
  return stored;
}

export function computeSellerAverageRating(sellerId: string): number | null {
  const reviews = getSellerReviews(sellerId);
  if (!reviews.length) return null;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / reviews.length;
}

export type OrderMessage = {
  id: string;
  orderId: string;
  sender: "buyer" | "seller";
  text: string;
  createdAt: string;
};

export function loadOrderMessages(orderId: string): OrderMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(`${MESSAGES_PREFIX}${orderId}`);
    if (!raw) return [];
    return JSON.parse(raw) as OrderMessage[];
  } catch {
    return [];
  }
}

export function appendOrderMessage(orderId: string, message: Omit<OrderMessage, "id" | "createdAt">) {
  const messages = loadOrderMessages(orderId);
  const stored: OrderMessage = {
    ...message,
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    createdAt: new Date().toISOString()
  };
  const next = [...messages, stored];
  window.localStorage.setItem(`${MESSAGES_PREFIX}${orderId}`, JSON.stringify(next));
  return stored;
}
