import { Injectable } from "@nestjs/common";

type DarajaTokenResponse = {
  access_token: string;
  expires_in: string;
};

@Injectable()
export class MpesaService {
  private cachedToken: { token: string; expiresAt: number } | null = null;

  normalizePhone(value: string) {
    const cleaned = value.replace(/\s+/g, "");
    if (cleaned.startsWith("07")) return `254${cleaned.slice(1)}`;
    if (cleaned.startsWith("+254")) return cleaned.slice(1);
    return cleaned;
  }

  async getToken() {
    const now = Date.now();
    if (this.cachedToken && this.cachedToken.expiresAt > now) {
      return this.cachedToken.token;
    }
    const baseUrl = process.env.DARAJA_BASE_URL ?? "https://sandbox.safaricom.co.ke";
    const key = process.env.DARAJA_CONSUMER_KEY ?? "";
    const secret = process.env.DARAJA_CONSUMER_SECRET ?? "";
    const auth = Buffer.from(`${key}:${secret}`).toString("base64");

    const res = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: { Authorization: `Basic ${auth}` }
    });
    if (!res.ok) {
      throw new Error("Failed to fetch Daraja token.");
    }
    const data = (await res.json()) as DarajaTokenResponse;
    const expiresIn = Number(data.expires_in ?? 3600);
    const token = data.access_token;
    this.cachedToken = { token, expiresAt: now + (expiresIn - 60) * 1000 };
    return token;
  }

  async requestStkPush({
    amount,
    phone,
    reference
  }: {
    amount: number;
    phone: string;
    reference: string;
  }) {
    const shortCode = process.env.DARAJA_STK_SHORTCODE ?? "";
    const passkey = process.env.DARAJA_STK_PASSKEY ?? "";
    const callbackUrl = process.env.DARAJA_STK_CALLBACK_URL ?? "";
    if (!shortCode || !passkey || !callbackUrl) {
      throw new Error("Daraja STK credentials are not configured.");
    }

    const token = await this.getToken();
    const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
    const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString("base64");
    const formattedPhone = this.normalizePhone(phone);

    const payload = {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(amount),
      PartyA: formattedPhone,
      PartyB: shortCode,
      PhoneNumber: formattedPhone,
      CallBackURL: callbackUrl,
      AccountReference: reference,
      TransactionDesc: "Jikoni Buddy Order Payment"
    };

    const res = await fetch(
      `${process.env.DARAJA_BASE_URL ?? "https://sandbox.safaricom.co.ke"}/mpesa/stkpush/v1/processrequest`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data, payload };
  }
}
