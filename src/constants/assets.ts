const BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''

export const AVATAR_PLACEHOLDER =
  'https://ui-avatars.com/api/?background=9CBBDC&color=ffffff&size=400&name=User'

export function getImageUrl(path: string | null | undefined): string {
  if (!path) return AVATAR_PLACEHOLDER
  if (path.startsWith('http')) return path
  return `${BASE_URL}${path}`
}
