export const getBuddyBaseUrl = () =>
  process.env.NEXT_PUBLIC_BUDDY_SERVICE_URL!;

export const getBuddyId = () =>
  typeof window !== "undefined" ? localStorage.getItem("jb_helper_id") : null;

export const fetchBuddyJson = async <T>(path: string): Promise<T> => {
  const baseUrl = getBuddyBaseUrl();
  const response = await fetch(`${baseUrl}${path}`);
  if (!response.ok) {
    throw new Error(`Buddy service error (${response.status})`);
  }
  return (await response.json()) as T;
};
