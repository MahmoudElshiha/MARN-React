const BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''

export const AVATAR_PLACEHOLDER =
  'https://plus.unsplash.com/premium_photo-1677252438411-9a930d7a5168?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YXZhdGFyJTIwcGxhY2Vob2xkZXJ8ZW58MHx8MHx8fDA%3D'

export function getImageUrl(path: string | null | undefined): string {
  if (!path) return AVATAR_PLACEHOLDER
  if (path.startsWith('http')) return path
  return `${BASE_URL}${path}`
}
