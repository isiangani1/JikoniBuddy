import { Controller, Get } from "@nestjs/common";
import { services } from "./config/services";

@Controller()
export class HealthController {
  @Get("health")
  async health() {
    const checks = await Promise.all(
      Object.values(services).map(async (service) => {
        const url = new URL(service.healthPath, service.baseUrl).toString();
        try {
          const res = await fetch(url, { method: "GET" });
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
