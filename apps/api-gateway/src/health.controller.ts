import { Controller, Get } from "@nestjs/common";
import { services } from "./config/services";

@Controller()
export class HealthController {
  @Get("health")
  async health() {
    const enabledServices = (process.env.GATEWAY_ENABLED_SERVICES ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);
    const timeoutMs = Number(process.env.HEALTHCHECK_TIMEOUT_MS ?? 2000);
    const list = Object.values(services).filter((service) => {
      if (enabledServices.length === 0) return true;
      return enabledServices.includes(service.key);
    });
    const checks = await Promise.all(
      list.map(async (service) => {
        const url = new URL(service.healthPath, service.baseUrl).toString();
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), timeoutMs);
        try {
          const res = await fetch(url, { method: "GET", signal: controller.signal });
          clearTimeout(timeout);
          const ok = res.ok;
          let payload: unknown = null;
          try {
            payload = await res.json();
          } catch {
            payload = await res.text();
          }
          return {
            service: service.key,
            ok,
            status: res.status,
            data: payload
          };
        } catch (error) {
          clearTimeout(timeout);
          return {
            service: service.key,
            ok: false,
            status: 0,
            error: error instanceof Error ? error.message : "unreachable"
          };
        }
      })
    );

    return {
      ok: checks.every((entry) => entry.ok),
      services: checks
    };
  }
}
