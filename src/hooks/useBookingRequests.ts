import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { rentalService } from '@/services/rentalService'

export function useContracts() {
  return useQuery({
    queryKey: ['contracts'],
    queryFn: () => rentalService.getContracts(),
  })
}

export function useContract(id: string | undefined) {
  return useQuery({
    queryKey: ['contract', id],
    queryFn: () => rentalService.getContractById(id!),
    enabled: !!id,
    staleTime: Infinity,
  })
}

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
      queryClient.invalidateQueries({ queryKey: ['ownerDashboard'] })
    },
  })

  const reject = useMutation({
    mutationFn: (requestId: string) => rentalService.rejectRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookingRequests'] })
      queryClient.invalidateQueries({ queryKey: ['ownerDashboard'] })
    },
  })

  return { ...query, accept, reject }
}

/** Mutations-only variant – does NOT fire the booking-requests query. */
export function useBookingMutations() {
  const queryClient = useQueryClient()

  const accept = useMutation({
    mutationFn: (requestId: string) => rentalService.acceptRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookingRequests'] })
      queryClient.invalidateQueries({ queryKey: ['ownerDashboard'] })
    },
  })

  const reject = useMutation({
    mutationFn: (requestId: string) => rentalService.rejectRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookingRequests'] })
      queryClient.invalidateQueries({ queryKey: ['ownerDashboard'] })
    },
  })

  return { accept, reject }
}
