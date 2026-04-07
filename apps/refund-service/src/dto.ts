export type CreateRefundDto = {
  orderId: string;
  userId: string;
  reason: string;
  details?: string;
  amount?: number;
};

export type ListRefundsDto = {
  userId?: string;
  orderId?: string;
  status?: string;
  limit?: number;
  cursor?: string;
};
