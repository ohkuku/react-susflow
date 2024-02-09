import store from 'store/dist/store.modern';
import plugins from 'store/plugins/all';
import { v4 as uuidv4 } from 'uuid';

store.addPlugin(plugins);

export type SuspenderStatus = 'loading' | 'error' | 'success';

export type CacheOptions = {
  enableCache?: boolean;
  ttl?: number;
};

export type ReadOptions = {
  useCache?: boolean;
};

function generateCacheKey<T extends any[]>(
  asyncFunction: (...args: T) => Promise<any>,
  params: T,
): string {
  const key = JSON.stringify(params);
  const functionName = asyncFunction.name;
  return `${functionName}:${key}`;
}

export function sus<T, Args extends any[]>(asyncFunction: (...args: Args) => Promise<T>, options?: CacheOptions) {
  const internalResourceMap = new Map<string, { status: SuspenderStatus; result: T | undefined; error: Error | undefined; suspender: Promise<void> | null }>();
  const { enableCache = true, ttl = 60000 } = options || {};

  function read(...params: [...Args, ReadOptions?]): T {
    const hasOptions = params.length > asyncFunction.length - 1;
    let readOptions: ReadOptions = { useCache: true };

    if (hasOptions) {
      const possibleOptions = params[params.length - 1];
      if (typeof possibleOptions === 'object' && possibleOptions !== null && 'useCache' in possibleOptions) {
        readOptions = params.pop() as ReadOptions;
      }
    }

    const cacheKey = generateCacheKey(asyncFunction, params as unknown as Args);

    let resource = internalResourceMap.get(cacheKey);
    if (!resource) {
      resource = { status: 'loading', result: undefined, error: undefined, suspender: null };
      internalResourceMap.set(cacheKey, resource);
    }

    if (enableCache && readOptions.useCache) {
      const cachedResult = store.get(cacheKey);
      if (cachedResult !== undefined) {
        return cachedResult;
      }
    }

    if (!resource.suspender) {
      resource.suspender = asyncFunction(...params as unknown as Args)
        .then(result => {
          resource!.status = 'success';
          resource!.result = result;
          if (enableCache && readOptions.useCache) {
            (store as any).set(cacheKey, result, new Date().getTime() + ttl);
          }
        })
        .catch(error => {
          resource!.status = 'error';
          resource!.error = error instanceof Error ? error : new Error(String(error));
        });
    }

    if (resource.status === 'loading') throw resource.suspender;
    if (resource.status === 'error') throw resource.error;
    return resource.result!;
  }

  return { read };
}