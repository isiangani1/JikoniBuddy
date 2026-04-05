export enum WalletType {
  seller = "seller",
  buddy = "buddy"
}

export enum PayoutMethodType {
  mpesa = "mpesa",
  bank = "bank"
}

export class WithdrawRequestDto {
  userId!: string;

  walletType!: WalletType;

  amount!: number;

  payoutMethodId?: string;

  instant?: boolean;

  otp?: string;

  mpesaNumber?: string;
}

export class PayoutMethodDto {
  userId!: string;

  type!: PayoutMethodType;

  label?: string;

  details?: Record<string, unknown>;

  isDefault?: boolean;
}
