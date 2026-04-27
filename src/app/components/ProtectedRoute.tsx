import { Navigate, useLocation } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import type { UserRole } from '@/types/user'

interface ProtectedRouteProps {
  children: React.ReactNode
  /** If provided, only users with one of these roles can access the route. */
  roles?: UserRole[]
  /** Where to redirect unauthenticated users. Defaults to /login. */
  redirectTo?: string
}

/**
 * Blocks unauthenticated users. When `roles` is provided, also blocks users
 * whose role is not in the allowed list.
 */
export function ProtectedRoute({
  children,
  roles,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  if (roles && user && !roles.includes(user.role)) {
    // Redirect to their own dashboard if they hit a page for another role
    const fallback =
      user.role === 'admin'
        ? '/admin-dashboard'
        : user.role === 'owner'
          ? '/owner-dashboard'
          : '/tenant-dashboard'
    return <Navigate to={fallback} replace />
  }

  return <>{children}</>
}
