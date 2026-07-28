// Storage adapter.
//
// In the Claude artifact runtime a `window.storage` object exists (with cross-user
// `shared` support). On Vercel it does not, so we fall back to localStorage.
//
// NOTE: the localStorage fallback is device-local. Personal tracking (streaks,
// timers, weight, the share card) works fully offline. The crew leaderboard's
// `shared` data will only show entries created on this device until you wire a
// real backend (Supabase recommended) — see README.

export type StorageResult = { key: string; value: string; shared: boolean } | null;
export type ListResult = { keys: string[]; prefix?: string; shared: boolean } | null;

type ArtifactStorage = {
  get: (key: string, shared?: boolean) => Promise<StorageResult>;
  set: (key: string, value: string, shared?: boolean) => Promise<StorageResult>;
  delete: (key: string, shared?: boolean) => Promise<{ key: string; deleted: boolean; shared: boolean } | null>;
  list: (prefix?: string, shared?: boolean) => Promise<ListResult>;
};

function artifact(): ArtifactStorage | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { storage?: ArtifactStorage };
  return w.storage ?? null;
}

const ns = (key: string, shared?: boolean) => `aap:${shared ? "shared" : "local"}:${key}`;

const local = {
  async get(key: string, shared = false): Promise<StorageResult> {
    if (typeof window === "undefined") return null;
    const v = window.localStorage.getItem(ns(key, shared));
    return v != null ? { key, value: v, shared } : null;
  },
  async set(key: string, value: string, shared = false): Promise<StorageResult> {
    if (typeof window === "undefined") return null;
    window.localStorage.setItem(ns(key, shared), value);
    return { key, value, shared };
  },
  async delete(key: string, shared = false) {
    if (typeof window === "undefined") return null;
    window.localStorage.removeItem(ns(key, shared));
    return { key, deleted: true, shared };
  },
  async list(prefix = "", shared = false): Promise<ListResult> {
    if (typeof window === "undefined") return { keys: [], prefix, shared };
    const full = ns(prefix, shared);
    const keys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith(full)) keys.push(k.slice(ns("", shared).length));
    }
    return { keys, prefix, shared };
  },
};

export const storage = {
  get: (key: string, shared = false) => (artifact() ?? local).get(key, shared),
  set: (key: string, value: string, shared = false) => (artifact() ?? local).set(key, value, shared),
  delete: (key: string, shared = false) => (artifact() ?? local).delete(key, shared),
  list: (prefix = "", shared = false) => (artifact() ?? local).list(prefix, shared),
};
