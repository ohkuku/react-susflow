export type SuspenderStatus = 'loading' | 'error' | 'success';

export function sus<T, Args extends any[]>(asyncFunction: (...args: Args) => Promise<T>) {
  let status: SuspenderStatus = 'loading';
  let result: T | undefined;
  let error: Error | undefined;
  let suspender: Promise<void> | null = null;

  return {
    read(...params: Args): T {
      if (suspender === null) {
        suspender = asyncFunction(...params).then(
          (r) => {
            status = 'success';
            result = r;
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
