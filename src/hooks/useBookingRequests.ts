import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { rentalService } from '@/services/rentalService'

export function useBookingRequests() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['bookingRequests'],
    queryFn: () => rentalService.getBookingRequests(),
  })

  const accept = useMutation({
    mutationFn: (requestId: string) => rentalService.acceptRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookingRequests'] })
    },
  })

  const reject = useMutation({
    mutationFn: (requestId: string) => rentalService.rejectRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookingRequests'] })
    },
  })

  return { ...query, accept, reject }
}
