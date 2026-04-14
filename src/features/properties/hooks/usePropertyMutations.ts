import { useState } from 'react'
import type { PropertyDetail, PropertyFormData } from '../types/property'
import { propertyService } from '../services/propertyService'
import { normalizeError } from '@/services/httpErrors'
import type { ApiError } from '@/types/common'

interface MutationState<T> {
  data: T | null
  loading: boolean
  error: ApiError | null
}

export function useCreateProperty() {
  const [state, setState] = useState<MutationState<PropertyDetail>>({
    data: null,
    loading: false,
    error: null,
  })

  async function createProperty(
    formData: PropertyFormData,
  ): Promise<PropertyDetail | null> {
    setState({ data: null, loading: true, error: null })
    try {
      const result = await propertyService.createProperty(formData)
      setState({ data: result, loading: false, error: null })
      return result
    } catch (err) {
      setState({ data: null, loading: false, error: normalizeError(err) })
      return null
    }
  }

  return { ...state, createProperty }
}

export function useUpdateProperty() {
  const [state, setState] = useState<MutationState<PropertyDetail>>({
    data: null,
    loading: false,
    error: null,
  })

  async function updateProperty(
    id: string,
    formData: Partial<PropertyFormData>,
  ): Promise<PropertyDetail | null> {
    setState({ data: null, loading: true, error: null })
    try {
      const result = await propertyService.updateProperty(id, formData)
      setState({ data: result, loading: false, error: null })
      return result
    } catch (err) {
      setState({ data: null, loading: false, error: normalizeError(err) })
      return null
    }
  }

  return { ...state, updateProperty }
}
