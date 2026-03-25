import { Controller, Get, Req, Res, HttpStatus } from "@nestjs/common";
import type { Request, Response } from "express";

const webAssetOrigin = process.env.WEB_ASSET_ORIGIN ?? "http://127.0.0.1:3000";

@Controller()
export class AssetsController {
  @Get("assets/*")
  async proxyAssets(@Req() req: Request, @Res() res: Response) {
    const path = req.originalUrl?.replace("/assets", "") ?? req.url;
    const target = new URL(path, webAssetOrigin).toString();
    try {
      const upstream = await fetch(target);
      res.status(upstream.status);
      upstream.headers.forEach((value, key) => {
        if (key.toLowerCase() === "transfer-encoding") {
          return;
        }
        res.setHeader(key, value);
      });
      const buffer = Buffer.from(await upstream.arrayBuffer());
      res.send(buffer);
    } catch (error) {
      res.status(HttpStatus.BAD_GATEWAY).json({
        ok: false,
        error: {
          code: "ASSET_PROXY_ERROR",
          message:
            error instanceof Error ? error.message : "Asset proxy failed"
        }
      });
    }
  }
}
