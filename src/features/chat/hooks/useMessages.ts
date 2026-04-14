import { useEffect, useState } from 'react'
import { normalizeError } from '@/services/httpErrors'
import type { ApiError } from '@/types/common'
import { chatService } from '../services/chatService'
import type { ChatMessage, Conversation } from '../types/chat'

interface State {
    conversations: Conversation[]
    selectedConversation: Conversation | null
    messages: ChatMessage[]
    loading: boolean
    error: ApiError | null
}

export function useMessages() {
    const [state, setState] = useState<State>({
        conversations: [],
        selectedConversation: null,
        messages: [],
        loading: true,
        error: null,
    })
    const [isMobileView, setIsMobileView] = useState(false)

    useEffect(() => {
        let cancelled = false

        chatService
            .getConversations()
            .then(async (conversations) => {
                const first = conversations[0] ?? null
                const messages = first
                    ? await chatService.getConversationMessages(first.id)
                    : []

                if (!cancelled) {
                    setState({
                        conversations,
                        selectedConversation: first,
                        messages,
                        loading: false,
                        error: null,
                    })
                }
            })
            .catch((err: unknown) => {
                if (!cancelled) {
                    setState({
                        conversations: [],
                        selectedConversation: null,
                        messages: [],
                        loading: false,
                        error: normalizeError(err),
                    })
                }
            })

        return () => {
            cancelled = true
        }
    }, [])

    async function selectConversation(conversation: Conversation) {
        try {
            const messages = await chatService.getConversationMessages(
                conversation.id,
            )
            setState((prev) => ({
                ...prev,
                selectedConversation: conversation,
                messages,
            }))
            setIsMobileView(true)
        } catch (err) {
            setState((prev) => ({ ...prev, error: normalizeError(err) }))
        }
    }

    function sendMessage(text: string) {
        if (!text.trim()) return

        const message: ChatMessage = {
            id: String(Date.now()),
            sender: 'me',
            text,
            time: new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
            }),
            status: 'sent',
        }

        setState((prev) => ({
            ...prev,
            messages: [...prev.messages, message],
            conversations: prev.conversations.map((conversation) =>
                conversation.id === prev.selectedConversation?.id
                    ? {
                        ...conversation,
                        lastMessage: text,
                        time: 'now',
                        unread: 0,
                    }
                    : conversation,
            ),
        }))
    }

    return {
        ...state,
        isMobileView,
        setIsMobileView,
        selectConversation,
        sendMessage,
    }
}
