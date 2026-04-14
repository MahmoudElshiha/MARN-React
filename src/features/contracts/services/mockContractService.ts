import type { RentalContract } from '../types/contract'

const MOCK_CONTRACT: RentalContract = {
  contractId: 'MARN-2026-001234',
  property: {
    name: 'Modern Downtown Apartment',
    address: '123 Market Street, Cairo, Egypt',
    price: 28000,
  },
  tenant: {
    name: 'Fatima Al-Masri',
    email: 'fatima.almasri@example.com',
  },
  owner: {
    name: 'Ahmed El-Sayed',
    email: 'ahmed.elsayed@example.com',
  },
  startDate: '2026-04-01',
  endDate: '2026-10-01',
  duration: '6 months',
  totalAmount: 168000,
  status: 'pending',
}

export const mockContractService = {
  getCurrentContract(): Promise<RentalContract> {
    return Promise.resolve(MOCK_CONTRACT)
  },

  downloadContract(_contractId: string): Promise<void> {
    return Promise.resolve()
  },

  submitSignedContract(_contractId: string, _file: File): Promise<void> {
    return Promise.resolve()
  },
}
