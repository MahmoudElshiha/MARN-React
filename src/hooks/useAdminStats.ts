import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { adminService } from '@/services/adminService'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { GenerateReportPayload, ReviewModerationReportPayload } from '@/services/adminService'

export function useAdminStats() {
  return useQuery({
    queryKey: ['adminStats'],
    queryFn: () => adminService.getStats(),
    staleTime: 5 * 60 * 1000,
  })
}

export function useAdminUsers(page = 1, pageSize = 20, search?: string, status?: string, includeDeleted?: boolean) {
  return useQuery({
    queryKey: ['adminUsers', page, pageSize, search, status, includeDeleted],
    queryFn: () => adminService.getUsers(page, pageSize, search, status, includeDeleted),
    placeholderData: keepPreviousData,
  })
}

export function useAdminVerifications(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ['adminVerifications', page, pageSize],
    queryFn: () => adminService.getVerifications(page, pageSize),
    placeholderData: keepPreviousData,
  })
}

export function useAdminUserStats(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ['adminUserStats', page, pageSize],
    queryFn: () => adminService.getUserStats(page, pageSize),
    placeholderData: keepPreviousData,
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

export function useAdminRoleUsers(page = 1, pageSize = 20, search?: string) {
  return useQuery({
    queryKey: ['adminRoleUsers', page, pageSize, search],
    queryFn: () => adminService.getRoleUsers(page, pageSize, search),
    placeholderData: keepPreviousData,
  })
}

export function useAdminAnalyticsReports(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ['adminAnalyticsReports', page, pageSize],
    queryFn: () => adminService.getAnalyticsReports(page, pageSize),
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  })
}

export function useGenerateReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: GenerateReportPayload) =>
      adminService.generateReport(payload),
    onSuccess: () => {
      toast.success('Report generated successfully')
      queryClient.invalidateQueries({ queryKey: ['adminAnalyticsReports'] })
    },
    onError: () => toast.error('Failed to generate report'),
  })
}

export function useAdminPropertyVerifications(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ['adminPropertyVerifications', page, pageSize],
    queryFn: () => adminService.getPendingPropertyVerifications(page, pageSize),
    placeholderData: keepPreviousData,
  })
}

export function useAdminPropertyVerification(propertyId: number | null) {
  return useQuery({
    queryKey: ['adminPropertyVerification', propertyId],
    queryFn: () => adminService.getPropertyVerification(propertyId!),
    enabled: propertyId != null,
    staleTime: 60 * 1000,
  })
}

export function useUpdateUserRoles() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, roles }: { userId: string; roles: string[] }) =>
      adminService.updateUserRoles(userId, roles),
    onSuccess: () => {
      toast.success('Roles updated successfully')
      queryClient.invalidateQueries({ queryKey: ['adminRoleUsers'] })
    },
    onError: () => toast.error('Failed to update roles'),
  })
}

export function useAdminModerationReports(page = 1, pageSize = 20, search?: string) {
  return useQuery({
    queryKey: ['adminModerationReports', page, pageSize, search],
    queryFn: () => adminService.getModerationReports(page, pageSize, search),
    placeholderData: keepPreviousData,
  })
}

export function useReviewModerationReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ reportId, payload }: { reportId: number; payload: ReviewModerationReportPayload }) =>
      adminService.reviewModerationReport(reportId, payload),
    onSuccess: () => {
      toast.success('Report reviewed successfully')
      queryClient.invalidateQueries({ queryKey: ['adminModerationReports'] })
    },
    onError: () => toast.error('Failed to review report'),
  })
}

export function useAdminProperties(page = 1, pageSize = 20, search?: string, status?: string) {
  return useQuery({
    queryKey: ['adminProperties', page, pageSize, search, status],
    queryFn: () => adminService.getProperties(page, pageSize, search, status),
    placeholderData: keepPreviousData,
  })
}

export function useAdminContracts(page = 1, pageSize = 20, search?: string, status?: string) {
  return useQuery({
    queryKey: ['adminContracts', page, pageSize, search, status],
    queryFn: () => adminService.getContracts(page, pageSize, search, status),
    placeholderData: keepPreviousData,
  })
}

export function useCancelContract() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (contractId: number) => adminService.cancelContract(contractId),
    onSuccess: () => {
      toast.success('Contract cancelled successfully')
      queryClient.invalidateQueries({ queryKey: ['adminContracts'] })
    },
    onError: () => toast.error('Failed to cancel contract'),
  })
}
