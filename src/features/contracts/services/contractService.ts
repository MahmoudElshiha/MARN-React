import type { RentalContract } from '../types/contract'
import { mockContractService } from './mockContractService'

/**
 * Contracts service - real API implementation.
 * Currently delegates to the mock adapter; replace with apiClient
 * calls once backend endpoints are available.
 */
export const contractService = {
  getCurrentContract(): Promise<RentalContract> {
    return mockContractService.getCurrentContract()
  },

  downloadContract(contractId: string): Promise<void> {
    return mockContractService.downloadContract(contractId)
  },

  submitSignedContract(contractId: string, file: File): Promise<void> {
    return mockContractService.submitSignedContract(contractId, file)
  },
}
