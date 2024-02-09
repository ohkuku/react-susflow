import store from 'store/dist/store.modern';
import plugins from 'store/plugins/all';

store.addPlugin(plugins);

export type SuspenderStatus = 'loading' | 'error' | 'success';

export type SuspenderOptions = {
  cache?: {
    enable?: boolean;
    ttl?: number;
  };
};

export type SuspenderReadOptions = {
  useCache?: boolean;
};

function generateCacheKey<T extends any[]>(asyncFunction: (...args: T) => Promise<any>, params: T): string {
  const key = JSON.stringify(params);
  const functionName = asyncFunction.name || 'anonymous';
  return `${functionName}:${key}`;
}

function extractReadOptions(
  params: any[],
  asyncFunctionLength: number,
): { parameters: any[]; readOptions: SuspenderReadOptions } {
  const hasOptions = params.length > asyncFunctionLength;
  let readOptions: SuspenderReadOptions = { useCache: true };
  if (hasOptions) {
    const possibleOptions = params.pop();
    if (typeof possibleOptions === 'object' && possibleOptions !== null && 'useCache' in possibleOptions) {
      readOptions = possibleOptions;
    }
  }
  return { parameters: params, readOptions };
}

export function sus<T, Args extends any[]>(asyncFunction: (...args: Args) => Promise<T>, options?: SuspenderOptions) {
  const internalResourceMap = new Map<
    string,
    { status: SuspenderStatus; result: T | undefined; error: Error | undefined; suspender: Promise<void> | null }
  >();
  const enableCache = options?.cache?.enable ?? true;
  const ttl = options?.cache?.ttl ?? 60000;

  function read(...params: [...Args, SuspenderReadOptions?]): T {
    const { parameters, readOptions } = extractReadOptions([...params], asyncFunction.length);
    const cacheKey = generateCacheKey(asyncFunction, parameters as Args);

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
      resource.suspender = asyncFunction(...(parameters as Args))
        .then((result) => {
          resource!.status = 'success';
          resource!.result = result;
          if (enableCache && readOptions.useCache) {
            (store as any).set(cacheKey, result, new Date().getTime() + ttl);
          }
        })
        .catch((error) => {
          resource!.status = 'error';
          resource!.error = error instanceof Error ? error : new Error(String(error));
        })
        .finally(() => {
          resource!.suspender = null; // Ensure the suspender is reset after completion
        });
    }

    if (resource.status === 'loading') throw resource.suspender;
    if (resource.status === 'error') throw resource.error;
    return resource.result!;
  }

  return { read };
}
