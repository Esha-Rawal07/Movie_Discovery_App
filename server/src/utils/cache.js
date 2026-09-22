const store = new Map();

export const getCached = (key) => {
  const item = store.get(key);

  if (!item) return null;

  if (Date.now() > item.expiresAt) {
    store.delete(key);
    return null;
  }

  return item.value;
};

export const setCached = (key, value, ttlMs = 60_000) => {
  store.set(key, {
    value,
    expiresAt: Date.now() + ttlMs
  });
};
