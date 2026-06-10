export interface PropertyRatingSummaryDto {
  averageRating: number
  ratingsCount: number
  currentUserRating?: number
}

export interface PropertyCommentDto {
  commentId: number
  userId: string
  userDisplayName: string
  userProfileImage?: string
  content: string
  createdAt: string
  updatedAt?: string
}

export interface CreatePropertyRatingDto {
  rating: number
}

export interface CreatePropertyCommentDto {
  content: string
}

export interface PropertyCommentDtoPagedResult {
  items: PropertyCommentDto[]
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
}
