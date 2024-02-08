import { describe, it, expect } from 'vitest';
import createFlow from '../../src/lib/create-flow';

describe('createFlow', () => {
  it('creates a resource that resolves with the expected value', async () => {
    const mockAsyncFunc = () => Promise.resolve('test value');
    const resource = createFlow(mockAsyncFunc);

    let promiseThrown = false;
    try {
      resource.read();
    } catch (e) {
      if (e instanceof Promise) {
        promiseThrown = true;
        await e; // 等待Promise解决
      }
    }

    // 使用Vitest的断言
    expect(promiseThrown).toBe(true);
    expect(resource.read()).toBe('test value');
  });
});
