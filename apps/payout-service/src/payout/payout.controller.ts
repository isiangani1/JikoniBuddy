import { Body, Controller, Get, Query, Post } from "@nestjs/common";
import { PayoutMethodDto, WalletType, WithdrawRequestDto } from "./dto";
import { PayoutService } from "./payout.service";

@Controller()
export class PayoutController {
  constructor(private readonly payoutService: PayoutService) {}

  @Get("wallet")
  async getWallet(
    @Query("userId") userId: string,
    @Query("type") type: WalletType = WalletType.buddy
  ) {
    await this.payoutService.validateRoleAccess(userId, type);
    return this.payoutService.getWallet(userId, type);
  }

  @Get("transactions")
  async getTransactions(
    @Query("userId") userId: string,
    @Query("type") type?: WalletType
  ) {
    if (type) {
      await this.payoutService.validateRoleAccess(userId, type);
    } else {
      await this.payoutService.validatePayoutUserRole(userId);
    }
    return this.payoutService.getTransactions(userId, type);
  }

  @Post("withdraw")
  async requestWithdraw(@Body() dto: WithdrawRequestDto) {
    await this.payoutService.validateRoleAccess(dto.userId, dto.walletType);
    return this.payoutService.requestWithdraw(dto);
  }

  @Post("withdraw/otp")
  async requestOtp(@Body() body: { userId: string }) {
    return this.payoutService.generateOtp(body.userId);
  }

  @Post("payout-method")
  async savePayoutMethod(@Body() dto: PayoutMethodDto) {
    await this.payoutService.validatePayoutUserRole(dto.userId);
    return this.payoutService.savePayoutMethod(dto);
  }
}
