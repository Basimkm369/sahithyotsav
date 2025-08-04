import { useCallback, useMemo } from 'react'

export default function useUrlState<T = string>(
  key: string,
  defaultValue?: T,
  fromUrl?: (value: string | undefined) => T | undefined,
  toUrl?: (value: T | undefined) => string | undefined,
): [T, (value: T | undefined) => void] {
  // Get value from URL
  const value = useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    const raw = params.get(key)
    const rawOrUndefined = raw === null ? undefined : raw
    if (fromUrl) {
      return fromUrl(rawOrUndefined) ?? defaultValue!
    }
    return (rawOrUndefined ?? defaultValue) as T
  }, [key, defaultValue, fromUrl, window.location.search])

  // Setter updates the URL param
  const setValue = useCallback(
    (newValue: T | undefined) => {
      const params = new URLSearchParams(window.location.search)
      if (
        !newValue ||
        newValue === defaultValue ||
        (toUrl && !toUrl?.(newValue))
      ) {
        params.delete(key)
      } else {
        params.set(key, toUrl ? toUrl(newValue)! : String(newValue))
      }
      const newUrl =
        window.location.pathname +
        (params.toString() ? `?${params.toString()}` : '')
      window.history.replaceState({}, '', newUrl)
    },
    [key, defaultValue, toUrl],
  )

  return [value, setValue]
}
