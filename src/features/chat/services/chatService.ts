import type {
    ChatMessage,
    ChatbotMessage,
    Conversation,
    RentalRequest,
} from '../types/chat'
import { mockChatService } from './mockChatService'

/**
 * Chat service - real API implementation.
 * Currently delegates to the mock adapter; replace with apiClient
 * calls once backend endpoints are available.
 */
export const chatService = {
    getConversations(): Promise<Conversation[]> {
        return mockChatService.getConversations()
    },

    getConversationMessages(conversationId: string): Promise<ChatMessage[]> {
        return mockChatService.getConversationMessages(conversationId)
    },

    getRentalRequest(): Promise<RentalRequest> {
        return mockChatService.getRentalRequest()
    },

    getRentalRequestMessages(): Promise<ChatMessage[]> {
        return mockChatService.getRentalRequestMessages()
    },

    getChatbotWelcome(): Promise<ChatbotMessage[]> {
        return mockChatService.getChatbotWelcome()
    },

    getChatbotReply(message: string): Promise<ChatbotMessage> {
        return mockChatService.getChatbotReply(message)
    },
}
