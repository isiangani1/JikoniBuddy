import type { Server } from "node:http";
import { createProxyServer } from "http-proxy";
import { services } from "./config/services";

const wsPrefix = process.env.WS_PROXY_PREFIX ?? "/ws";

export function attachWsProxy(server: Server) {
  const proxy = createProxyServer({
    ws: true,
    changeOrigin: true
  });

  server.on("upgrade", (req, socket, head) => {
    const url = req.url ?? "";
    if (!url.startsWith(wsPrefix)) {
      return;
    }
    const parts = url.split("/");
    const serviceKey = parts[2];
    const service = services[serviceKey];
    if (!service) {
      socket.destroy();
      return;
    }
    const target = service.baseUrl.replace(/^http/, "ws");
    proxy.ws(req, socket, head, { target });
  });
}
