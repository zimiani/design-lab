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

/** Regex for a valid flow/screen slug: lowercase alphanumeric with hyphens */
export const SLUG_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/

/** Format user input into a valid slug (strips invalid chars, collapses hyphens) */
export function formatSlug(input: string): string {
  return input.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-/, '')
}
