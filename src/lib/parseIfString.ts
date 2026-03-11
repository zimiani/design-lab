/** Parse JSON if the value is a string, otherwise return as-is. */
export function parseIfString<T>(val: unknown): T {
  return (typeof val === 'string' ? JSON.parse(val) : val) as T
}
