import { useEffect, useState } from 'react'
import { normalizeError } from '@/services/httpErrors'
import type { ApiError } from '@/types/common'
import { chatService } from '../services/chatService'
import type { ChatMessage, RentalRequest } from '../types/chat'

interface State {
  rentalRequest: RentalRequest | null
  messages: ChatMessage[]
  loading: boolean
  error: ApiError | null
}

export function useRentalRequestChat() {
  const [state, setState] = useState<State>({
    rentalRequest: null,
    messages: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false

    Promise.all([
      chatService.getRentalRequest(),
      chatService.getRentalRequestMessages(),
    ])
      .then(([rentalRequest, messages]) => {
        if (!cancelled) {
          setState({ rentalRequest, messages, loading: false, error: null })
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({
            rentalRequest: null,
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
    }))
  }

  function deleteMessage(id: string) {
    setState((prev) => ({
      ...prev,
      messages: prev.messages.filter((message) => message.id !== id),
    }))
  }

  return {
    ...state,
    sendMessage,
    deleteMessage,
  }
}
