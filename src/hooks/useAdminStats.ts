import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/services/adminService'

export function useAdminStats() {
  return useQuery({
    queryKey: ['adminStats'],
    queryFn: () => adminService.getStats(),
    staleTime: 5 * 60 * 1000,
  })
}

export function useAdminUsers(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ['adminUsers', page, pageSize],
    queryFn: () => adminService.getUsers(page, pageSize),
  })
}

export function useAdminVerifications(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ['adminVerifications', page, pageSize],
    queryFn: () => adminService.getVerifications(page, pageSize),
  })
}

export function useAdminUserStats(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ['adminUserStats', page, pageSize],
    queryFn: () => adminService.getUserStats(page, pageSize),
  })
}

export function useAdminUserVerification(userId: string | null) {
  return useQuery({
    queryKey: ['adminUserVerification', userId],
    queryFn: () => adminService.getUserVerification(userId!),
    enabled: !!userId,
    staleTime: 60 * 1000,
  })
}
