import { ForbiddenException, Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    this.$use(async (params, next) => {
      if (params.model === "Transaction" && (params.action === "delete" || params.action === "deleteMany")) {
        throw new ForbiddenException("Transaction ledger is immutable.");
      }
      if (params.model === "Transaction" && params.action === "update") {
        const data = params.args?.data ?? {};
        const allowedKeys = new Set(["status", "metadata"]);
        const hasDisallowed = Object.keys(data).some((key) => !allowedKeys.has(key));
        if (hasDisallowed) {
          throw new ForbiddenException("Transaction ledger updates are restricted.");
        }
      }
      return next(params);
    });
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
