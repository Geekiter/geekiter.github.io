```js
export function debounce<F extends(...rest: any[]) => void>(
  fn: F, delay = 200): (this: ThisType<F>, ...args: Parameters<F>) => void {
  let timer: number | null = null;
  return function d(this: ThisType<F>, ...args: Parameters<F>) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn.call(this, ...args);
    }, delay);
  };
}

export function throttle<F extends(...args: any[]) => void>(
  func: F,
  limit = 1000): (this: ThisType<F>, ...args: Parameters<F>) => void {
  let inThrottle: boolean;
  return function t(this: ThisType<F>, ...args: Parameters<F>) {
    if (inThrottle) return;

    inThrottle = true;

    setTimeout(() => {
      func.apply(this, args);
      inThrottle = false;
    }, limit);
  };
}
```