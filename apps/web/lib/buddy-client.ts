export const getGatewayBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://127.0.0.1:4000";

export const getBuddyId = () =>
  typeof window !== "undefined" ? sessionStorage.getItem("jb_helper_id") : null;

export const fetchBuddyJson = async <T>(path: string): Promise<T> => {
  const baseUrl = getGatewayBaseUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const response = await fetch(`${baseUrl}/api/buddy${normalized}`);
  if (!response.ok) {
    throw new Error(`Gateway error (${response.status})`);
  }
  return (await response.json()) as T;
};
export const getUserProfile = async (id: string): Promise<any> => {
  return fetchBuddyJson(`/users/${id}`);
};
