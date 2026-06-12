import { useState } from 'react'
import { motion } from 'motion/react'
import { useSearchParams } from 'react-router-dom'
import {
  Eye,
  Ban,
  UserCheck,
  ShieldCheck,
  Search,
  XCircle,
  Loader2,
} from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { Skeleton } from '../../../components/ui/skeleton'
import { Checkbox } from '../../../components/ui/checkbox'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../components/ui/tooltip'
import {
  useAdminUsers,
  useUpdateUserRoles,
} from '@/hooks/useAdminStats'
import { adminService, type AdminUserStatsItem } from '@/services/adminService'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getStatusBadge } from '../utils'

const ASSIGNABLE_ROLES = ['Admin', 'Owner']

export function UserManagementTab() {
  const [selectedUser, setSelectedUser] = useState<AdminUserStatsItem | null>(null)
  const [pageSize, setPageSize] = useState(10)
  const [userSearch, setUserSearch] = useState('')
  const [activeUserSearch, setActiveUserSearch] = useState('')
  
  const [searchParams, setSearchParams] = useSearchParams()
  const urlStatus = searchParams.get('userStatus')
  const statusFilter = (urlStatus && urlStatus !== 'Unverified') ? urlStatus : 'Pending'
  const setStatusFilter = (val: string) => {
    setSearchParams((prev) => {
      prev.set('userStatus', val)
      return prev
    })
  }

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [actionType, setActionType] = useState<
    'ban' | 'unban' | 'restore' | 'delete' | null
  >(null)
  const [pendingUserId, setPendingUserId] = useState<string | null>(null)

  const [showRolesModal, setShowRolesModal] = useState(false)
  const [pendingRoleUserId, setPendingRoleUserId] = useState<string | null>(
    null,
  )
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])

  const queryClient = useQueryClient()

  const apiStatus = statusFilter === 'Deleted' ? 'All' : statusFilter
  const includeDeleted = statusFilter === 'Deleted' || statusFilter === 'All'
  
  const { data: usersData, isLoading: usersLoading, isFetching: usersFetching } = useAdminUsers(
    1,
    pageSize,
    activeUserSearch || undefined,
    apiStatus,
    includeDeleted
  )
  const updateUserRoles = useUpdateUserRoles()

  let users = usersData?.data?.items ?? []
  if (statusFilter === 'Deleted') {
    users = users.filter(u => u.isDeleted)
  }
  
  const totalCount = usersData?.data?.totalCount ?? 0

  const userAction = useMutation({
    mutationFn: ({
      userId,
      action,
    }: {
      userId: string
      action: 'ban' | 'unban' | 'restore' | 'delete'
    }) => {
      if (action === 'ban') return adminService.banUser(userId)
      if (action === 'unban') return adminService.unbanUser(userId)
      if (action === 'delete') return adminService.deleteUser(userId)
      return adminService.restoreUser(userId)
    },
    onSuccess: () => {
      const labels: Record<string, string> = {
        ban: 'banned',
        unban: 'unbanned',
        restore: 'restored',
        delete: 'deleted',
      }
      toast.success(`User ${labels[actionType!] ?? actionType} successfully`)
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
      queryClient.invalidateQueries({ queryKey: ['adminRoleUsers'] })
      queryClient.invalidateQueries({ queryKey: ['adminStats'] })
      queryClient.invalidateQueries({ queryKey: ['adminUserStats'] })
      setShowConfirmModal(false)
      setPendingUserId(null)
      setSelectedUser(null)
    },
    onError: () => toast.error('Action failed'),
  })

  const handleOpenRolesModal = (userId: string, currentRoles: string[]) => {
    setPendingRoleUserId(userId)
    setSelectedRoles(currentRoles.filter((r) => ASSIGNABLE_ROLES.includes(r)))
    setShowRolesModal(true)
  }

  const confirmRoleUpdate = () => {
    if (!pendingRoleUserId) return
    const userToUpdate = users.find(u => u.userId === pendingRoleUserId)
    const protectedRoles = userToUpdate?.roles.filter(r => !ASSIGNABLE_ROLES.includes(r)) || []
    const finalRoles = [...selectedRoles, ...protectedRoles]

    updateUserRoles.mutate(
      { userId: pendingRoleUserId, roles: finalRoles },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
          queryClient.invalidateQueries({ queryKey: ['adminRoleUsers'] })
          setShowRolesModal(false)
          setPendingRoleUserId(null)
          setSelectedRoles([])
        },
      },
    )
  }

  const handleUserAction = (
    userId: string,
    action: 'ban' | 'unban' | 'restore' | 'delete',
  ) => {
    setActionType(action)
    setPendingUserId(userId)
    setShowConfirmModal(true)
  }

  const confirmUserAction = () => {
    if (pendingUserId && actionType) {
      userAction.mutate({ userId: pendingUserId, action: actionType })
    }
  }

  return (
    <>
      <Card className="bg-[#F2F4F6] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-2xl text-[#1a1a1a]">
              User Management
            </CardTitle>
            <div className="flex w-full sm:w-auto items-center gap-2">
              <Input
                placeholder="Search users..."
                className="w-full sm:w-64 bg-white rounded-xl border-[#3A6EA5]/20"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setActiveUserSearch(userSearch)
                }}
              />
              <Button
                size="icon"
                className="bg-[#3A6EA5] hover:bg-[#2A527A] text-white rounded-xl flex-shrink-0"
                onClick={() => setActiveUserSearch(userSearch)}
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {['Pending', 'Verified', 'Banned', 'Deleted', 'All'].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                size="sm"
                className={statusFilter === status ? 'bg-[#3A6EA5] text-white rounded-xl' : 'rounded-xl border-[#3A6EA5]/20 text-[#4a5565]'}
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto overflow-y-auto max-h-[600px] border-b border-[#3A6EA5]/20">
            <table className="w-full relative">
              <thead className="sticky top-0 bg-[#F2F4F6] z-10">
                <tr className="border-b border-[#3A6EA5]/20">
                  <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                    Name
                  </th>
                  <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                    Email
                  </th>
                  <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                    Roles
                  </th>
                  <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                    Status
                  </th>
                  <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                    Join Date
                  </th>
                  <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {usersLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr
                      key={i}
                      className="border-b border-[#3A6EA5]/10"
                    >
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="py-4 px-4">
                          <Skeleton className="h-5 w-full rounded" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-10 text-center text-[#4a5565]"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user.userId}
                      className="border-b border-[#3A6EA5]/10 hover:bg-white/50 transition-colors"
                    >
                      <td className="py-4 px-4 text-[#1a1a1a] font-medium">
                        {user.fullName}
                      </td>
                      <td className="py-4 px-4 text-[#4a5565]">
                        {user.email}
                      </td>
                      <td className="py-4 px-4 text-[#4a5565]">
                        {user.rolesDisplayNames.join(', ') || '—'}
                      </td>
                      <td className="py-4 px-4">
                        {getStatusBadge(user.accountStatusDisplayName)}
                      </td>
                      <td className="py-4 px-4 text-[#4a5565]">
                        {new Date(user.createdAt).toLocaleDateString(
                          'en-GB',
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <TooltipProvider delayDuration={200}>
                          <div className="flex gap-2 justify-start">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="rounded-xl border-[#3A6EA5]/20 w-8 h-8 shrink-0"
                                  onClick={() => setSelectedUser(user)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View Details</p>
                              </TooltipContent>
                            </Tooltip>

                            {user.accountStatus !== 'Banned' && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="border-[#3A6EA5] text-[#3A6EA5] hover:bg-[#3A6EA5] hover:text-white rounded-xl w-8 h-8 shrink-0"
                                    disabled={updateUserRoles.isPending}
                                    onClick={() =>
                                      handleOpenRolesModal(
                                        user.userId,
                                        user.roles,
                                      )
                                    }
                                  >
                                    <ShieldCheck className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Manage Roles</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                            {user.isDeleted ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    className="bg-green-600 hover:bg-green-700 text-white rounded-xl w-8 h-8 shrink-0"
                                    onClick={() =>
                                      handleUserAction(user.userId, 'restore')
                                    }
                                  >
                                    <UserCheck className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Restore User</p>
                                </TooltipContent>
                              </Tooltip>
                            ) : (
                              <>
                                {user.accountStatus === 'Banned' ? (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        size="icon"
                                        className="bg-green-600 hover:bg-green-700 text-white rounded-xl w-8 h-8 shrink-0"
                                        onClick={() =>
                                          handleUserAction(user.userId, 'unban')
                                        }
                                      >
                                        <UserCheck className="w-4 h-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Unban User</p>
                                    </TooltipContent>
                                  </Tooltip>
                                ) : !user.roles.includes('Admin') ? (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        size="icon"
                                        variant="outline"
                                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-xl w-8 h-8 shrink-0"
                                        onClick={() =>
                                          handleUserAction(user.userId, 'ban')
                                        }
                                      >
                                        <Ban className="w-4 h-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Ban User</p>
                                    </TooltipContent>
                                  </Tooltip>
                                ) : null}
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="icon"
                                      variant="outline"
                                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-xl w-8 h-8 shrink-0"
                                      onClick={() =>
                                        handleUserAction(user.userId, 'delete')
                                      }
                                    >
                                      <XCircle className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Delete User</p>
                                  </TooltipContent>
                                </Tooltip>
                              </>
                            )}
                          </div>
                        </TooltipProvider>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {totalCount > users.length && (
            <div className="mt-4 flex justify-center items-center min-h-[40px]">
              {usersFetching ? (
                <Loader2 className="w-6 h-6 animate-spin text-[#3A6EA5]" />
              ) : (
                <Button
                  variant="outline"
                  className="rounded-xl border-[#3A6EA5]/20 text-[#3A6EA5] hover:bg-[#3A6EA5] hover:text-white"
                  onClick={() => setPageSize((p) => p + 20)}
                >
                  Show More
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Detail Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedUser(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3A6EA5] to-[#9CBBDC] flex items-center justify-center text-white text-xl font-bold shrink-0">
                  {selectedUser.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#1a1a1a]">
                    {selectedUser.fullName}
                  </h3>
                  <p className="text-sm text-[#4a5565] mt-0.5">
                    {selectedUser.email}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    {getStatusBadge(selectedUser.accountStatusDisplayName)}
                    {selectedUser.rolesDisplayNames.length > 0 && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                        {selectedUser.rolesDisplayNames.join(', ')}
                      </span>
                    )}
                    {selectedUser.isDeleted && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-600">
                        Deleted
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="rounded-xl border-[#3A6EA5]/20 shrink-0"
                onClick={() => setSelectedUser(null)}
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </div>

            {/* Info row */}
            <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
              <div className="bg-[#F2F4F6] rounded-2xl p-4">
                <p className="text-[#4a5565] mb-1">Joined</p>
                <p className="font-semibold text-[#1a1a1a]">
                  {new Date(selectedUser.createdAt).toLocaleDateString('en-GB')}
                </p>
              </div>
              <div className="bg-[#F2F4F6] rounded-2xl p-4">
                <p className="text-[#4a5565] mb-1">User ID</p>
                <p className="font-mono text-xs font-semibold text-[#1a1a1a] break-all">
                  {selectedUser.userId}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {selectedUser.isDeleted ? (
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl"
                  disabled={userAction.isPending}
                  onClick={() =>
                    handleUserAction(selectedUser.userId, 'restore')
                  }
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Restore
                </Button>
              ) : (
                <>
                  {selectedUser.accountStatus === 'Banned' ? (
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl"
                      disabled={userAction.isPending}
                      onClick={() => handleUserAction(selectedUser.userId, 'unban')}
                    >
                      <UserCheck className="w-4 h-4 mr-2" />
                      Unban
                    </Button>
                  ) : !selectedUser.roles.includes('Admin') ? (
                    <Button
                      variant="outline"
                      className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-xl"
                      disabled={userAction.isPending}
                      onClick={() => handleUserAction(selectedUser.userId, 'ban')}
                    >
                      <Ban className="w-4 h-4 mr-2" />
                      Ban
                    </Button>
                  ) : null}
                  <Button
                    variant="outline"
                    className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-xl"
                    disabled={userAction.isPending}
                    onClick={() => handleUserAction(selectedUser.userId, 'delete')}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                className="rounded-xl border-[#3A6EA5]/20"
                onClick={() => setSelectedUser(null)}
              >
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Roles Modal */}
      {showRolesModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-[#1a1a1a] mb-2">
              Update User Roles
            </h3>
            <p className="text-[#4a5565] mb-6 text-sm">
              Select the assignable roles for this user. Protected roles (like Renter)
              are preserved automatically.
            </p>
            <div className="space-y-3 mb-6">
              {ASSIGNABLE_ROLES.map((role) => (
                <label
                  key={role}
                  className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-[#F2F4F6] transition-colors"
                >
                  <Checkbox
                    checked={selectedRoles.includes(role)}
                    onCheckedChange={(checked) =>
                      setSelectedRoles(
                        checked
                          ? [...selectedRoles, role]
                          : selectedRoles.filter((r) => r !== role),
                      )
                    }
                  />
                  <span className="text-[#1a1a1a] font-medium">{role}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1 rounded-xl border-[#3A6EA5]/20"
                onClick={() => {
                  setShowRolesModal(false)
                  setPendingRoleUserId(null)
                  setSelectedRoles([])
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] text-white rounded-xl"
                disabled={updateUserRoles.isPending}
                onClick={confirmRoleUpdate}
              >
                {updateUserRoles.isPending ? 'Saving…' : 'Save Roles'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-[#1a1a1a] mb-4">
              Confirm Action
            </h3>
            <p className="text-[#4a5565] mb-6">
              Are you sure you want to {actionType} this user? 
              {actionType === 'delete' && ' A standard notification will be shown.'}
              {' '}This action can be reversed later.
            </p>
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1 rounded-xl border-[#3A6EA5]/20"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl"
                disabled={userAction.isPending}
                onClick={confirmUserAction}
              >
                {userAction.isPending ? 'Processing…' : 'Confirm'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}
