import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const gatewayUrl = process.env.API_GATEWAY_URL ?? "http://127.0.0.1:4000";
const orderUrl = process.env.ORDER_SERVICE_URL ?? "http://127.0.0.1:4004";
const paymentUrl = process.env.PAYMENT_SERVICE_URL ?? "http://127.0.0.1:4008";
const chatUrl = process.env.CHAT_SERVICE_URL ?? "http://127.0.0.1:4017";
const refundUrl = process.env.REFUND_SERVICE_URL ?? "http://127.0.0.1:4018";

const buyerId = `e2e-buyer-${Date.now()}`;
const sellerId = `e2e-seller-${Date.now()}`;

async function ensureUsers() {
  await prisma.user.upsert({
    where: { id: buyerId },
    update: {},
    create: {
      id: buyerId,
      name: "E2E Buyer",
      email: `${buyerId}@jikoni.local`,
      phone: `${buyerId}-phone`,
      passwordHash: "test",
      role: "buyer"
    }
  });
  await prisma.user.upsert({
    where: { id: sellerId },
    update: {},
    create: {
      id: sellerId,
      name: "E2E Seller",
      email: `${sellerId}@jikoni.local`,
      phone: `${sellerId}-phone`,
      passwordHash: "test",
      role: "seller"
    }
  });
}

async function createOrder() {
  const res = await fetch(`${orderUrl}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      buyerId,
      sellerId,
      items: [{ productId: null, quantity: 1, price: 1200 }],
      totalAmount: 1200
    })
  });
  if (!res.ok) throw new Error(`Order create failed: ${res.status}`);
  return res.json();
}

async function initiatePayment(orderId) {
  const res = await fetch(`${paymentUrl}/payments/c2b/stk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: buyerId,
      amount: 1200,
      method: "mpesa",
      phone: "254700000000",
      orderId
    })
  });
  if (!res.ok) throw new Error(`Payment init failed: ${res.status}`);
  return res.json();
}

async function simulatePaymentCallback(orderId) {
  const res = await fetch(`${paymentUrl}/payments/c2b/callback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ResultCode: 0,
      AccountReference: orderId
    })
  });
  if (!res.ok) throw new Error(`Payment callback failed: ${res.status}`);
  return res.json();
}

async function sendChat(orderId) {
  const res = await fetch(`${chatUrl}/chat/orders/${orderId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      senderId: buyerId,
      receiverId: sellerId,
      text: "E2E hello from buyer"
    })
  });
  if (!res.ok) throw new Error(`Chat send failed: ${res.status}`);
  return res.json();
}

async function listChat(orderId) {
  const res = await fetch(`${chatUrl}/chat/orders/${orderId}/messages?userId=${buyerId}`);
  if (!res.ok) throw new Error(`Chat list failed: ${res.status}`);
  return res.json();
}

async function requestRefund(orderId) {
  const res = await fetch(`${refundUrl}/refunds`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      orderId,
      userId: buyerId,
      reason: "missing_items",
      details: "E2E refund request"
    })
  });
  if (!res.ok) throw new Error(`Refund request failed: ${res.status}`);
  return res.json();
}

async function approveRefund(refundId) {
  const res = await fetch(`${refundUrl}/refunds/${refundId}/approve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      actorId: "admin-e2e",
      note: "approved in test"
    })
  });
  if (!res.ok) throw new Error(`Refund approve failed: ${res.status}`);
  return res.json();
}

async function checkPayoutReversal(orderId) {
  const refundTx = await prisma.transaction.findFirst({
    where: { reference: `refund_${orderId}` }
  });
  return refundTx;
}

async function run() {
  console.log("Running E2E chat + refund checks...");
  await ensureUsers();
  const order = await createOrder();
  console.log("Order created", order.id);

  await initiatePayment(order.id);
  await simulatePaymentCallback(order.id);

  const chatMessage = await sendChat(order.id);
  const chatList = await listChat(order.id);

  console.log("Chat send ok", chatMessage.id);
  console.log("Chat list count", chatList?.messages?.length ?? 0);

  const refund = await requestRefund(order.id);
  console.log("Refund requested", refund.id);

  await approveRefund(refund.id);
  const refundTx = await checkPayoutReversal(order.id);

  if (!refundTx) {
    console.log("Refund reversal transaction not found yet.");
  } else {
    console.log("Refund reversal transaction", refundTx.id, refundTx.amount);
  }

  console.log("E2E checks done.");
}

run()
  .catch((error) => {
    console.error("E2E checks failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
