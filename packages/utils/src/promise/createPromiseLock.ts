import { remove } from '@/utils/array/removeItem';
/**
 * Create a promise lock
 *
 * @category Promise
 * @example
 * ```
 * const lock = createPromiseLock()
 *
 * lock.run(async () => {
 *   await doSomething()
 * })
 *
 * // in anther context:
 * await lock.wait() // it will wait all tasking finished
 * ```
 */
export function createPromiseLock() {
  const locks: Promise<any>[] = [];

  return {
    //使用：传入一个async函数,会向locks数组中push一个等待响应状态的promise
    //待这个promise转为成功态后，就会删除locks数组中的这个promise
    async run<T = void>(fn: () => Promise<T>): Promise<T> {
      const p = fn();
      locks.push(p);
      try {
        return await p;
      } finally {
        remove(locks, p);
      }
    },
    //等待所有locks数组中的promise都已敲定时，才会返回一个成功态的promise,并带有描述每个promise结果的对象数组。
    async wait(): Promise<void> {
      await Promise.allSettled(locks);
    },
    isWaiting() {
      return Boolean(locks.length);
    },
    clear() {
      locks.length = 0;
    },
  };
}
