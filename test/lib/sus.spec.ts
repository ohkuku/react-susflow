import {describe, it, expect} from 'vitest';
import {sus} from '../../src';

describe('sus', () => {

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

  })

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

  })

});
