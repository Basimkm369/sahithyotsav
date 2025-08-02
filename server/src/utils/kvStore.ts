type KeyValueStore = {
  [key: string]: any;
};

const store: KeyValueStore = {};

const kvStore = {
  set<T = any>(key: string, value: T): void {
    store[key] = value;
  },

  get<T = any>(key: string): T | undefined {
    return store[key];
  },

  has(key: string): boolean {
    return key in store;
  },

  delete(key: string): void {
    delete store[key];
  },

  clear(): void {
    Object.keys(store).forEach((key) => delete store[key]);
  },

  keys(): string[] {
    return Object.keys(store);
  },

  values(): any[] {
    return Object.values(store);
  },
};

export default kvStore;
