import { useEffect, useState } from 'react'
import { normalizeError } from '@/services/httpErrors'
import type { ApiError } from '@/types/common'
import { contractService } from '../services/contractService'
import type { RentalContract } from '../types/contract'

interface State {
  contract: RentalContract | null
  uploadedContract: File | null
  loading: boolean
  submitting: boolean
  error: ApiError | null
}

export function useContract() {
  const [state, setState] = useState<State>({
    contract: null,
    uploadedContract: null,
    loading: true,
    submitting: false,
    error: null,
  })

  useEffect(() => {
    let cancelled = false

    contractService
      .getCurrentContract()
      .then((contract) => {
        if (!cancelled) {
          setState((prev) => ({
            ...prev,
            contract,
            loading: false,
            error: null,
          }))
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState((prev) => ({
            ...prev,
            contract: null,
            loading: false,
            error: normalizeError(err),
          }))
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  function setUploadedContract(file: File | null) {
    setState((prev) => ({ ...prev, uploadedContract: file }))
  }

  async function downloadContract(): Promise<boolean> {
    if (!state.contract) return false

    try {
      await contractService.downloadContract(state.contract.contractId)
      return true
    } catch (err: unknown) {
      setState((prev) => ({ ...prev, error: normalizeError(err) }))
      return false
    }
  }

  async function submitSignedContract(): Promise<boolean> {
    if (!state.contract || !state.uploadedContract) {
      return false
    }

    setState((prev) => ({ ...prev, submitting: true }))

    try {
      await contractService.submitSignedContract(
        state.contract.contractId,
        state.uploadedContract,
      )
      setState((prev) => ({
        ...prev,
        submitting: false,
        contract:
          prev.contract == null
            ? null
            : {
                ...prev.contract,
                status: 'completed',
              },
      }))
      return true
    } catch (err: unknown) {
      setState((prev) => ({
        ...prev,
        submitting: false,
        error: normalizeError(err),
      }))
      return false
    }
  }

  return {
    ...state,
    setUploadedContract,
    downloadContract,
    submitSignedContract,
  }
}
