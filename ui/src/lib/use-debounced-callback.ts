import { useEffect, useMemo, useRef } from 'react'

/**
 * A latest-call debouncer: returns a stable callback that runs `fn` once,
 * `ms` after calls stop; a pending run is cancelled on unmount.
 *
 * Hand-rolled per react-use.md: react-use's own `useDebounce` is effect-style
 * (fires on dep change), not a callback factory a handler can invoke.
 */
export function useDebouncedCallback<A extends readonly unknown[]>(
  fn: (...args: A) => void,
  ms: number,
) {
  const fnRef = useRef(fn)
  fnRef.current = fn
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])
  return useMemo(
    () =>
      (...args: A) => {
        clearTimeout(timer.current)
        timer.current = setTimeout(() => fnRef.current(...args), ms)
      },
    [ms],
  )
}
