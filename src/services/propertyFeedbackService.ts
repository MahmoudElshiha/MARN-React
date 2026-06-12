import { axiosInstance } from '@/services/apiClient'
import type { ApiResponse } from '@/types/common'
import type {
  PropertyRatingSummaryDto,
  PropertyCommentDto,
  CreatePropertyCommentDto,
  PropertyCommentDtoPagedResult,
  CreatePropertyRatingDto,
} from '@/types/propertyFeedback'

export const propertyFeedbackService = {
  getRatingSummary: async (
    propertyId: string,
  ): Promise<ApiResponse<PropertyRatingSummaryDto>> => {
    const response = await axiosInstance.get(
      `/api/properties/${propertyId}/ratings/summary`,
    )
    return response.data
  },

  getComments: async (
    propertyId: string,
    pageNumber: number = 1,
    pageSize: number = 20,
  ): Promise<ApiResponse<PropertyCommentDtoPagedResult>> => {
    const response = await axiosInstance.get(
      `/api/properties/${propertyId}/comments`,
      { params: { pageNumber, pageSize } },
    )
    return response.data
  },

  addComment: async (
    propertyId: string,
    payload: CreatePropertyCommentDto,
  ): Promise<ApiResponse<PropertyCommentDto>> => {
    const response = await axiosInstance.post(
      `/api/properties/${propertyId}/comments`,
      payload,
    )
    return response.data
  },

  addRating: async (
    propertyId: string,
    payload: CreatePropertyRatingDto,
  ): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.post(
      `/api/properties/${propertyId}/ratings`,
      payload,
    )
    return response.data
  },

  updateComment: async (
    propertyId: string,
    commentId: string,
    payload: CreatePropertyCommentDto,
  ): Promise<ApiResponse<PropertyCommentDto>> => {
    const response = await axiosInstance.put(
      `/api/properties/${propertyId}/comments/${commentId}`,
      payload,
    )
    return response.data
  },

  deleteComment: async (
    propertyId: string,
    commentId: string,
  ): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.delete(
      `/api/properties/${propertyId}/comments/${commentId}`,
    )
    return response.data
  },
}
