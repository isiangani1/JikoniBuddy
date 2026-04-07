export const getGatewayBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://127.0.0.1:4000";

export const gatewayFetchJson = async <T>(
  path: string,
  init?: RequestInit
): Promise<T> => {
  const baseUrl = getGatewayBaseUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const response = await fetch(`${baseUrl}${normalized}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(
      message || `Gateway error (${response.status}) for ${normalized}`
    );
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
};
