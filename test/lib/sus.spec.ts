import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sus } from '../../src';

import store from 'store/dist/store.modern';

vi.mock('store/dist/store.modern', () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    addPlugin: vi.fn(),
  },
}));

describe('sus', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('succeed scenario', () => {
    it('creates a resource that resolves with the expected value', async () => {
      const mockAsyncFunc = (mockParam: string) => Promise.resolve('test value ' + mockParam);
      const resource = sus(mockAsyncFunc);

      let promiseThrown = false;
      try {
        resource.read('mockValue');
      } catch (e) {
        if (e instanceof Promise) {
          promiseThrown = true;
          await e;
        }
      }

      expect(promiseThrown).toBe(true);
      expect(resource.read('mockValue')).toBe('test value mockValue');
    });

    it('supports multiple arguments', async () => {
      const mockAsyncFunc = (prefix: string, id: number) => Promise.resolve(`${prefix}${id}`);
      const resource = sus(mockAsyncFunc);

      let promiseThrown = false;
      try {
        resource.read('item-', 42);
      } catch (e) {
        if (e instanceof Promise) {
          promiseThrown = true;
          await e;
        }
      }

      expect(promiseThrown).toBe(true);
      expect(resource.read('item-', 42)).toBe('item-42');
    });

    it('handles repeated read calls gracefully', async () => {
      const mockAsyncFunc = () => Promise.resolve('constant value');
      const resource = sus(mockAsyncFunc);

      try {
        resource.read();
      } catch (e) {
        if (e instanceof Promise) {
          await e;
        }
      }

      expect(resource.read()).toBe('constant value');
      expect(resource.read()).toBe('constant value');
    });
  });

  describe('failure scenario', () => {
    it('throws error when async function rejects error object', async () => {
      const errorMessage = 'async error';
      const mockAsyncFunc = () => Promise.reject(new Error(errorMessage));
      const resource = sus(mockAsyncFunc);

      try {
        resource.read();
      } catch (e) {
        if (e instanceof Promise) {
          try {
            await e;
            resource.read();
          } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe(errorMessage);
          }
        }
      }
    });

    it('throws error when async function rejects string', async () => {
      const errorMessage = 'async error';
      const mockAsyncFunc = () => Promise.reject(errorMessage);
      const resource = sus(mockAsyncFunc);

      try {
        resource.read();
      } catch (e) {
        if (e instanceof Promise) {
          try {
            await e;
            resource.read();
          } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe(errorMessage);
          }
        }
      }
    });
  });

  describe('cache logic', () => {
    it('should cache the result of the async function', async () => {
      const mockAsyncFunc = vi.fn((param: string) => Promise.resolve(`Result: ${param}`));
      const resource = sus(mockAsyncFunc);
      const mockTime = 1625097600000;
      vi.spyOn(store, 'get').mockReturnValueOnce(undefined);
      const dateSpy = vi.spyOn(Date.prototype, 'getTime').mockReturnValue(mockTime);

      let promiseThrown = false;
      try {
        resource.read('test');
      } catch (e) {
        if (e instanceof Promise) {
          promiseThrown = true;
          await e;
        }
      }

      expect(promiseThrown).toBe(true);
      expect(mockAsyncFunc).toHaveBeenCalledWith('test');
      expect(store.set).toHaveBeenCalledWith(expect.any(String), 'Result: test', mockTime + 60000);
      expect(resource.read('test')).toBe('Result: test');
      expect(store.get).toHaveBeenCalledWith(expect.any(String));
    });

    it('should retrieve the result from cache on subsequent calls', async () => {
      const cachedValue = 'Cached result';
      vi.spyOn(store, 'get').mockReturnValueOnce(cachedValue);

      const mockAsyncFunc = vi.fn(() => Promise.resolve('New result'));
      const resource = sus(mockAsyncFunc);

      const result = resource.read();

      expect(result).toBe(cachedValue);
      expect(mockAsyncFunc).not.toHaveBeenCalled();
    });
  });
});
