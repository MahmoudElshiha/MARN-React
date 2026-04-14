import { useEffect, useState } from 'react'
import { normalizeError } from '@/services/httpErrors'
import type { ApiError } from '@/types/common'
import { dashboardAdminService } from '../services/dashboardAdminService'
import type {
  AdminDashboardData,
  ManagedUserStatus,
  UserActionType,
} from '../types/dashboardAdmin'

interface State {
  dashboard: AdminDashboardData | null
  loading: boolean
  error: ApiError | null
}

export function useAdminDashboard() {
  const [state, setState] = useState<State>({
    dashboard: null,
    loading: true,
    error: null,
  })
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [actionType, setActionType] = useState<UserActionType | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false

    dashboardAdminService
      .getDashboard()
      .then((dashboard) => {
        if (!cancelled) {
          setState({ dashboard, loading: false, error: null })
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({
            dashboard: null,
            loading: false,
            error: normalizeError(err),
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  async function approveVerification(id: number): Promise<boolean> {
    try {
      await dashboardAdminService.approveVerification(id)
      setState((prev) => {
        if (!prev.dashboard) return prev
        return {
          ...prev,
          dashboard: {
            ...prev.dashboard,
            pendingVerifications: prev.dashboard.pendingVerifications.filter(
              (item) => item.id !== id,
            ),
          },
        }
      })
      return true
    } catch (err: unknown) {
      setState((prev) => ({ ...prev, error: normalizeError(err) }))
      return false
    }
  }

  async function rejectVerification(id: number): Promise<boolean> {
    try {
      await dashboardAdminService.rejectVerification(id)
      setState((prev) => {
        if (!prev.dashboard) return prev
        return {
          ...prev,
          dashboard: {
            ...prev.dashboard,
            pendingVerifications: prev.dashboard.pendingVerifications.filter(
              (item) => item.id !== id,
            ),
          },
        }
      })
      return true
    } catch (err: unknown) {
      setState((prev) => ({ ...prev, error: normalizeError(err) }))
      return false
    }
  }

  async function downgradeAdmin(id: number): Promise<boolean> {
    try {
      await dashboardAdminService.downgradeAdmin(id)
      setState((prev) => {
        if (!prev.dashboard) return prev
        return {
          ...prev,
          dashboard: {
            ...prev.dashboard,
            adminUsers: prev.dashboard.adminUsers.filter(
              (admin) => admin.id !== id,
            ),
          },
        }
      })
      return true
    } catch (err: unknown) {
      setState((prev) => ({ ...prev, error: normalizeError(err) }))
      return false
    }
  }

  function openUserActionModal(userId: number, action: UserActionType) {
    setSelectedUserId(userId)
    setActionType(action)
    setShowConfirmModal(true)
  }

  function closeUserActionModal() {
    setShowConfirmModal(false)
    setSelectedUserId(null)
    setActionType(null)
  }

  async function confirmUserAction(): Promise<{
    success: boolean
    userId: number | null
    action: UserActionType | null
  }> {
    if (selectedUserId === null || !actionType) {
      return { success: false, userId: null, action: null }
    }

    const currentUserId = selectedUserId
    const currentAction = actionType

    try {
      const { status } = await dashboardAdminService.updateUserStatus(
        currentUserId,
        currentAction,
      )

      setState((prev) => {
        if (!prev.dashboard) return prev
        return {
          ...prev,
          dashboard: {
            ...prev.dashboard,
            users: prev.dashboard.users.map((user) =>
              user.id === currentUserId
                ? { ...user, status: status as ManagedUserStatus }
                : user,
            ),
          },
        }
      })

      closeUserActionModal()
      return { success: true, userId: currentUserId, action: currentAction }
    } catch (err: unknown) {
      setState((prev) => ({ ...prev, error: normalizeError(err) }))
      closeUserActionModal()
      return { success: false, userId: currentUserId, action: currentAction }
    }
  }

  return {
    ...state,
    showConfirmModal,
    actionType,
    approveVerification,
    rejectVerification,
    downgradeAdmin,
    openUserActionModal,
    closeUserActionModal,
    confirmUserAction,
  }
}
