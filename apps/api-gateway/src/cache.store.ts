type CacheEntry = {
  expiresAt: number;
  payload: unknown;
  status: number;
  headers: Record<string, string>;
};

const cache = new Map<string, CacheEntry>();
const maxEntries = Number(process.env.CACHE_MAX_ENTRIES ?? 500);

export function getCache(key: string) {
  const entry = cache.get(key);
  if (!entry) {
    return null;
  }
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry;
}

export function setCache(key: string, entry: CacheEntry) {
  if (cache.size >= maxEntries) {
    const oldest = cache.keys().next().value;
    if (oldest) {
      cache.delete(oldest);
    }
  }
  cache.set(key, entry);
}

export function clearCache() {
  cache.clear();
}
