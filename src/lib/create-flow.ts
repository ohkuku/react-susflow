type SuspenderStatus = 'loading' | 'error' | 'success';

function createFlow<T>(asyncFunction: () => Promise<T>) {
    let status: SuspenderStatus = 'loading';
    let result: T | undefined;
    let error: Error | undefined;
    let suspender = asyncFunction().then(
        r => {
            status = 'success';
            result = r;
        },
        e => {
            status = 'error';
            error = e instanceof Error ? e : new Error(String(e));
        }
    );

    return {
        read(): T {
            if (status === 'loading') throw suspender;
            if (status === 'error') throw error;
            return result as T;
        }
    };
}

export default createFlow;
