import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '@/services/userService'
import type { UpdateProfilePayload, ChangePasswordPayload } from '@/services/userService'

export function useProfile() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['profile'],
    queryFn: () => userService.getProfile(),
  })

  const update = useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      userService.updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })

  const changePassword = useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      userService.changePassword(payload),
  })

  const uploadAvatar = useMutation({
    mutationFn: (file: File) => userService.uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })

  return { ...query, update, changePassword, uploadAvatar }
}
