import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { propertyFeedbackService } from '@/services/propertyFeedbackService'
import type { CreatePropertyCommentDto, CreatePropertyRatingDto } from '@/types/propertyFeedback'

export const usePropertyRatingSummary = (propertyId: string | undefined) => {
  return useQuery({
    queryKey: ['propertyRatingSummary', propertyId],
    queryFn: () => propertyFeedbackService.getRatingSummary(propertyId!),
    enabled: !!propertyId,
  })
}

export const usePropertyComments = (propertyId: string | undefined) => {
  return useQuery({
    queryKey: ['propertyComments', propertyId],
    queryFn: () => propertyFeedbackService.getComments(propertyId!),
    enabled: !!propertyId,
  })
}

export const useAddPropertyFeedback = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      propertyId,
      commentData,
      ratingData,
    }: {
      propertyId: string
      commentData: CreatePropertyCommentDto
      ratingData: CreatePropertyRatingDto
      _optimistic?: { userId: string; displayName: string; profileImage?: string }
    }) => {
      const [commentRes, ratingRes] = await Promise.all([
        propertyFeedbackService.addComment(propertyId, commentData),
        propertyFeedbackService.addRating(propertyId, ratingData)
      ])
      return { commentRes, ratingRes }
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['propertyComments', variables.propertyId],
      })
      queryClient.invalidateQueries({
        queryKey: ['propertyRatingSummary', variables.propertyId],
      })
      queryClient.invalidateQueries({
        queryKey: ['property', variables.propertyId],
      })
    },
  })
}

export const useUpdatePropertyComment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ propertyId, commentId, payload }: { propertyId: string; commentId: string; payload: CreatePropertyCommentDto }) =>
      propertyFeedbackService.updateComment(propertyId, commentId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['propertyComments', variables.propertyId] })
    },
  })
}

export const useDeletePropertyFeedback = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ propertyId, commentId }: { propertyId: string; commentId?: string }) => {
      // Helper to check for 404 across both HttpError (.status) and raw axios (.response.status)
      const is404 = (e: any) => e?.status === 404 || e?.response?.status === 404;

      let ratingError = null;
      try {
        await propertyFeedbackService.deleteRating(propertyId)
      } catch (e: any) {
        if (!is404(e)) ratingError = e;
      }
      
      let commentError = null;
      if (commentId) {
        try {
          await propertyFeedbackService.deleteComment(propertyId, commentId)
        } catch (e: any) {
          if (!is404(e)) commentError = e;
        }
      }
      
      if (ratingError && commentError) throw commentError;
      if (ratingError && !commentId) throw ratingError;
      if (commentError && !ratingError) throw commentError;
      
      return true
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: ['propertyComments', variables.propertyId] })
      queryClient.invalidateQueries({ queryKey: ['propertyRatingSummary', variables.propertyId] })
      queryClient.invalidateQueries({ queryKey: ['property', variables.propertyId] })
    },
  })
}
