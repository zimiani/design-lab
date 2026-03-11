/** Deep clone a serializable value via JSON round-trip. */
export function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}
