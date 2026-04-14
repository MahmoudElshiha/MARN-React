export type ContractStatus = 'pending' | 'owner-signed' | 'completed'

export interface ContractParty {
  name: string
  email: string
}

export interface ContractProperty {
  name: string
  address: string
  price: number
}

export interface RentalContract {
  contractId: string
  property: ContractProperty
  tenant: ContractParty
  owner: ContractParty
  startDate: string
  endDate: string
  duration: string
  totalAmount: number
  status: ContractStatus
}
