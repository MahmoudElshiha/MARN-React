const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''

export function buildImageUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined
  if (path.startsWith('http')) return path
  return `${BASE_URL}${path}`
}

export const formatTrend = (pct?: number) => {
  if (pct == null) return ''
  return pct >= 0 ? `+${pct}%` : `${pct}%`
}

export const getStatusBadge = (status: string) => {
  const styles: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    active: 'bg-green-100 text-green-700',
    verified: 'bg-green-100 text-green-700',
    unverified: 'bg-yellow-100 text-yellow-700',
    suspended: 'bg-red-100 text-red-700',
    banned: 'bg-gray-100 text-gray-700',
  }
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status.toLowerCase()] ?? 'bg-gray-100 text-gray-700'}`}
    >
      {status}
    </span>
  )
}
