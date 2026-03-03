export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function uniqueId(base: string, exists: (id: string) => boolean): string {
  if (!exists(base)) return base
  let i = 2
  while (exists(`${base}-${i}`)) i++
  return `${base}-${i}`
}
