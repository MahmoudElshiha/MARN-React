/**
 * Property service — real API implementation.
 * Currently delegates to the mock adapter; swap `apiClient` calls in here
 * once the backend endpoints are available.
 */
import type {
  Property,
  PropertyDetail,
  PropertyFormData,
  OwnerPropertyView,
} from '../types/property'
import { mockPropertyService } from './mockPropertyService'

// When the real API is ready, replace mock calls with:
//   import { apiClient } from '@/services/apiClient'
//   return apiClient.get<Property[]>('/properties')

export const propertyService = {
  getProperties(): Promise<Property[]> {
    return mockPropertyService.getProperties()
  },

  getPropertyById(id: string): Promise<PropertyDetail> {
    return mockPropertyService.getPropertyById(id)
  },

  getOwnerProperty(): Promise<OwnerPropertyView> {
    return mockPropertyService.getOwnerProperty()
  },

  createProperty(data: PropertyFormData): Promise<PropertyDetail> {
    return mockPropertyService.createProperty(data)
  },

  updateProperty(
    id: string,
    data: Partial<PropertyFormData>,
  ): Promise<PropertyDetail> {
    return mockPropertyService.updateProperty(id, data)
  },
}
