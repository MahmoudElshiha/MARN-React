import { apiClient } from './apiClient'
import type { ApiResponse, PaginatedResponse } from '@/types/common'
import type { Conversation, Message } from '@/types/message'

export interface SendMessagePayload {
  conversationId: string
  text: string
  attachmentUrl?: string
}

export const messageService = {
  getConversations: () =>
    apiClient.get<PaginatedResponse<Conversation>>('/Messages/conversations'),

  getMessages: (conversationId: string) =>
    apiClient.get<PaginatedResponse<Message>>(
      `/Messages/conversations/${conversationId}`,
    ),

  sendMessage: (payload: SendMessagePayload) =>
    apiClient.post<ApiResponse<Message>>('/Messages', payload),
}
