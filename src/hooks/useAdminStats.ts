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

export function useAdminVerifications() {
  return useQuery({
    queryKey: ['adminVerifications'],
    queryFn: () => adminService.getVerifications(),
  })
}
