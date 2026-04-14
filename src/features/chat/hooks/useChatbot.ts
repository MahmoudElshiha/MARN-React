import { useEffect, useRef, useState } from 'react'
import { normalizeError } from '@/services/httpErrors'
import type { ApiError } from '@/types/common'
import { chatService } from '../services/chatService'
import type { ChatbotMessage } from '../types/chat'

interface State {
    messages: ChatbotMessage[]
    loading: boolean
    isTyping: boolean
    error: ApiError | null
}

export function useChatbot() {
    const [state, setState] = useState<State>({
        messages: [],
        loading: true,
        isTyping: false,
        error: null,
    })

    const timerRef = useRef<number | null>(null)

    useEffect(() => {
        let cancelled = false

        chatService
            .getChatbotWelcome()
            .then((messages) => {
                if (!cancelled) {
                    setState({ messages, loading: false, isTyping: false, error: null })
                }
            })
            .catch((err: unknown) => {
                if (!cancelled) {
                    setState({
                        messages: [],
                        loading: false,
                        isTyping: false,
                        error: normalizeError(err),
                    })
                }
            })

        return () => {
            cancelled = true
            if (timerRef.current) {
                window.clearTimeout(timerRef.current)
            }
        }
    }, [])

    async function sendMessage(text: string) {
        if (!text.trim()) return

        const userMessage: ChatbotMessage = {
            id: Date.now(),
            text,
            sender: 'user',
            timestamp: new Date(),
        }

        setState((prev) => ({
            ...prev,
            messages: [...prev.messages, userMessage],
            isTyping: true,
            error: null,
        }))

        timerRef.current = window.setTimeout(async () => {
            try {
                const reply = await chatService.getChatbotReply(text)
                setState((prev) => ({
                    ...prev,
                    messages: [...prev.messages, reply],
                    isTyping: false,
                }))
            } catch (err) {
                setState((prev) => ({
                    ...prev,
                    isTyping: false,
                    error: normalizeError(err),
                }))
            }
        }, 1200)
    }

    return {
        ...state,
        sendMessage,
    }
}
