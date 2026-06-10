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
    }) => {
      // Execute both requests concurrently
      const [commentRes, ratingRes] = await Promise.all([
        propertyFeedbackService.addComment(propertyId, commentData),
        propertyFeedbackService.addRating(propertyId, ratingData)
      ])
      return { commentRes, ratingRes }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['propertyComments', variables.propertyId],
      })
      queryClient.invalidateQueries({
        queryKey: ['propertyRatingSummary', variables.propertyId],
      })
    },
  })
}
