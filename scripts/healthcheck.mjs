import { setTimeout as delay } from "node:timers/promises";

const services = [
  { name: "gateway", url: process.env.API_GATEWAY_URL ?? "http://127.0.0.1:4000", path: "/health" },
  { name: "buyer", url: process.env.BUYER_SERVICE_URL ?? "http://127.0.0.1:4010", path: "/health" },
  { name: "buddy", url: process.env.BUDDY_SERVICE_URL ?? "http://127.0.0.1:4005", path: "/buddy/requests?status=open" },
  { name: "seller", url: process.env.SELLER_SERVICE_URL ?? "http://127.0.0.1:4007", path: "/" },
  { name: "order", url: process.env.ORDER_SERVICE_URL ?? "http://127.0.0.1:4004", path: "/" },
  { name: "menu", url: process.env.MENU_SERVICE_URL ?? "http://127.0.0.1:4006", path: "/" },
  { name: "payout", url: process.env.PAYOUT_SERVICE_URL ?? "http://127.0.0.1:4016", path: "/health" },
  { name: "notification", url: process.env.NOTIFICATION_SERVICE_URL ?? "http://127.0.0.1:4011", path: "/health" },
  { name: "payment", url: process.env.PAYMENT_SERVICE_URL ?? "http://127.0.0.1:4008", path: "/health" }
];

const timeoutMs = 3000;

async function checkService(service) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const fullUrl = new URL(service.path, service.url).toString();
  try {
    const res = await fetch(fullUrl, { signal: controller.signal });
    clearTimeout(timeout);
    return { name: service.name, ok: res.ok, status: res.status, url: fullUrl };
  } catch (error) {
    clearTimeout(timeout);
    return {
      name: service.name,
      ok: false,
      status: 0,
      url: fullUrl,
      error: error instanceof Error ? error.message : "unreachable"
    };
  }
}

async function main() {
  const results = [];
  for (const service of services) {
    results.push(await checkService(service));
    await delay(50);
  }
  const failed = results.filter((r) => !r.ok);
  results.forEach((r) => {
    if (r.ok) {
      console.log(`✅ ${r.name} ${r.status} ${r.url}`);
    } else {
      console.log(`❌ ${r.name} ${r.status} ${r.url} ${r.error ?? ""}`);
    }
  });
  if (failed.length) {
    process.exit(1);
  }
}

main();
