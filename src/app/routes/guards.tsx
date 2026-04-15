import type { ReactNode } from 'react'
import { Navigate } from 'react-router'

interface GuestOnlyRouteProps {
    children: ReactNode
    redirectTo?: string
}

interface RequireAuthProps {
    children: ReactNode
    redirectTo?: string
}

function isLoggedIn(): boolean {
    return Boolean(localStorage.getItem('token') ?? sessionStorage.getItem('token'))
}

export function GuestOnlyRoute({
    children,
    redirectTo = '/',
}: GuestOnlyRouteProps) {
    if (isLoggedIn()) {
        return <Navigate to={redirectTo} replace />
    }

    return <>{children}</>
}

export function RequireAuth({
    children,
    redirectTo = '/login',
}: RequireAuthProps) {
    if (!isLoggedIn()) {
        return <Navigate to={redirectTo} replace />
    }

    return <>{children}</>
}
