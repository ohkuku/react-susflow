import store from 'store';
import { v4 as uuidv4 } from 'uuid';

export type SuspenderStatus = 'loading' | 'error' | 'success';

export type CacheOptions = {
  standalone?: boolean;
};

export type ReadOptions = {
  useCache?: boolean;
};

function generateCacheKey<T extends any[]>(
  asyncFunction: (...args: T) => Promise<any>,
  params: T,
  individualCache: boolean,
): string {
  const key = JSON.stringify(params);
  const functionName = asyncFunction.name;
  if (individualCache) {
    return uuidv4();
  } else {
    return functionName + key;
  }
}

export function sus<T, Args extends any[]>(asyncFunction: (...args: Args) => Promise<T>, options?: CacheOptions) {
  let status: SuspenderStatus = 'loading';
  let result: T | undefined;
  let error: Error | undefined;
  let suspender: Promise<void> | null = null;
  let cacheKey: string | undefined = undefined;

  const { standalone = false } = options || {};

  return {
    read(...params: [...Args, ReadOptions?]): T {
      const hasOptions = params.length > asyncFunction.length - 1;
      let readOptions: ReadOptions = { useCache: true };

      if (hasOptions) {
        const possibleOptions = params[params.length - 1];
        if (typeof possibleOptions === 'object' && possibleOptions !== null && 'useCache' in possibleOptions) {
          readOptions = params.pop() as ReadOptions;
        }
      }

      const key = generateCacheKey(asyncFunction, params as unknown as Args, standalone);

      if (standalone) {
        cacheKey = key;
      }

      const cachedResult = readOptions.useCache && key ? store.get(key) : undefined;

      if (cachedResult !== undefined) {
        status = 'success';
        result = cachedResult;

        return cachedResult;
      }

      if (suspender === null) {
        suspender = asyncFunction(...(params as unknown as Args)).then(
          (r) => {
            status = 'success';
            result = r;

            if (key && readOptions.useCache) {
              store.set(key, r);
            }
          },
          (e) => {
            status = 'error';
            error = e instanceof Error ? e : new Error(String(e));
          },
        );
      }

      if (status === 'loading') throw suspender;
      if (status === 'error') throw error;
      if (status === 'success') return result as T;
      throw new Error("This should never happen; it's just for type safety.");
    },
  };
}
