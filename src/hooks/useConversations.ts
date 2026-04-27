import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { messageService } from '@/services/messageService'
import type { SendMessagePayload } from '@/services/messageService'

export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: () => messageService.getConversations(),
  })
}

export function useMessages(conversationId: string | undefined) {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => messageService.getMessages(conversationId!),
    enabled: !!conversationId,
    staleTime: 0,
  })
}

export function useSendMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SendMessagePayload) =>
      messageService.sendMessage(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['messages', variables.conversationId],
      })
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
  })
}
