import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import { toast } from 'sonner'
import { PROPERTY_AMENITIES, PROPERTY_STEPS as STEPS } from '@/constants/property'
import { PropertyFormData, TouchedFields } from './types'
import { validateForm } from './validation'
import { propertyService } from '@/services/propertyService'

// Import Steps
import { PropertyDetailsStep } from './steps/PropertyDetailsStep'
import { AmenitiesStep } from './steps/AmenitiesStep'
import { PhotosStep } from './steps/PhotosStep'
import { PricingStep } from './steps/PricingStep'
import { AvailabilityStep } from './steps/AvailabilityStep'
import { LegalDocsStep } from './steps/LegalDocsStep'

const DEFAULT_FORM_DATA: PropertyFormData = {
  title: '', type: '', address: '', city: '', governorate: '', zip: '',
  bedrooms: '', beds: '', baths: '', sqm: '', description: '', numPeople: '', occupancyPreference: '',
  mapLocation: { lat: 37.7749, lng: -122.4194 },
  selectedAmenities: [], additionalAmenities: [], price: '', deposit: '',
  utilities: [], availableFrom: '', leaseDuration: 'Monthly',
  tenantPreferences: ['Students Welcome', 'Professionals Only', 'Families Welcome', 'No Smoking', 'Pets Allowed'],
  customPreferences: [],
  photos: [],
  legalDocs: []
}

export function EditPropertyPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [currentStep, setCurrentStep] = useState(1)
  const [touched, setTouched] = useState<TouchedFields>({})
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState<PropertyFormData>(() => {
    const saved = sessionStorage.getItem(`editPropertyFormData_${id}`)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        return { ...DEFAULT_FORM_DATA, ...parsed, photos: [], legalDocs: [] }
      } catch (e) {
        // ignore
      }
    }
    return DEFAULT_FORM_DATA
  })

  useEffect(() => {
    if (id) {
      propertyService.getPropertyForEdit(id).then((res) => {
        const data = res.data
        if (data) {
          // Only map if not loaded from session storage, or force override
          setFormData((prev) => {
            const existingAmenities = data.amenities || []
            const knownAmenities = PROPERTY_AMENITIES.map(a => a.name)
            const additionalAmenitiesList = ['Dishwasher', 'Microwave', 'Refrigerator', 'Balcony/Patio', 'Hardwood Floors', 'Storage Space', 'Security System', 'Elevator']
            
            const reverseAmenityMap: Record<string, string> = {
              'wifi': 'WiFi',
              'wi-fi': 'WiFi',
              'parking': 'Parking',
              'air conditioning': 'Air Conditioning',
              'airconditioning': 'Air Conditioning',
              'heating': 'Heating',
              'tv': 'Tv',
              'elevator': 'Elevator',
              'pool': 'Pool',
              'gym': 'Gym',
              'kitchen': 'Kitchen',
              'dishwasher': 'Dishwasher',
              'microwave': 'Microwave',
              'refrigerator': 'Refrigerator',
              'washer': 'Washer/Dryer',
              'dryer': 'Washer/Dryer',
              'balcony': 'Balcony/Patio',
              'hardwoodfloors': 'Hardwood Floors',
              'storagespace': 'Storage Space',
              'securitysystem': 'Security System',
              'petfriendly': 'Pet Friendly'
            }

            const getFrontendAmenityName = (backendName: string): string => {
              const raw = backendName.toLowerCase().replace(/ /g, '')
              for (const [key, val] of Object.entries(reverseAmenityMap)) {
                if (key.replace(/ /g, '') === raw || key === backendName.toLowerCase()) return val
              }
              return backendName
            }
            
            const selectedAmenities: string[] = []
            const additionalAmenities: string[] = []
            
            existingAmenities.forEach((a: any) => {
               const rawName = a.amenityDisplayName || a.amenity
               const name = getFrontendAmenityName(rawName)
               if (knownAmenities.includes(name)) {
                 if (!selectedAmenities.includes(name)) selectedAmenities.push(name)
               } else if (additionalAmenitiesList.includes(name)) {
                 if (!additionalAmenities.includes(name)) additionalAmenities.push(name)
               } else {
                 if (!selectedAmenities.includes(name)) selectedAmenities.push(name)
               }
            })

            const existingRules = data.rules || []
            const defaultPreferencesList = ['Students Welcome', 'Professionals Only', 'Families Welcome', 'No Smoking', 'Pets Allowed']
            const tenantPreferences: string[] = []
            const customPreferences: string[] = []

            existingRules.forEach((r: any) => {
              const rule = r.ruleDisplayName || r.rule
              if (defaultPreferencesList.includes(rule)) {
                tenantPreferences.push(rule)
              } else {
                customPreferences.push(rule)
              }
            })

            const isDefault = (key: keyof PropertyFormData) => {
              if (key === 'tenantPreferences') return prev.tenantPreferences.length === DEFAULT_FORM_DATA.tenantPreferences.length
              return prev[key] === DEFAULT_FORM_DATA[key] || (Array.isArray(prev[key]) && (prev[key] as any[]).length === 0)
            }

            return {
              ...prev,
              title: isDefault('title') ? (data.title || '') : prev.title,
              description: isDefault('description') ? (data.description || '') : prev.description,
              type: isDefault('type') ? (data.type || '') : prev.type,
              address: isDefault('address') ? (data.address || '') : prev.address,
              city: isDefault('city') ? (data.city || '') : prev.city,
              governorate: isDefault('governorate') ? (data.governorate || '') : prev.governorate,
              zip: isDefault('zip') ? (data.zipCode || '') : prev.zip,
              bedrooms: isDefault('bedrooms') ? (data.bedrooms?.toString() || '') : prev.bedrooms,
              beds: isDefault('beds') ? (data.beds?.toString() || '') : prev.beds,
              baths: isDefault('baths') ? (data.bathrooms?.toString() || '') : prev.baths,
              sqm: isDefault('sqm') ? (data.squareMeters?.toString() || '') : prev.sqm,
              numPeople: isDefault('numPeople') ? (data.maxOccupants?.toString() || '') : prev.numPeople,
              occupancyPreference: isDefault('occupancyPreference') ? (data.isShared ? 'shared' : 'private') : prev.occupancyPreference,
              mapLocation: { lat: data.latitude || 37.7749, lng: data.longitude || -122.4194 },
              price: isDefault('price') ? (data.price?.toString() || '') : prev.price,
              leaseDuration: isDefault('leaseDuration') ? (data.rentalUnit || 'Monthly') : prev.leaseDuration,
              existingPhotos: data.media || [],
              existingPrimaryImageUrl: data.primaryImageUrl || '',
              existingProofOfOwnershipUrl: data.proofOfOwnershipUrl || '',
              existingRules: existingRules,
              existingAmenities: existingAmenities,
              selectedAmenities: isDefault('selectedAmenities') && existingAmenities.length > 0 ? selectedAmenities : prev.selectedAmenities,
              additionalAmenities: isDefault('additionalAmenities') && existingAmenities.length > 0 ? additionalAmenities : prev.additionalAmenities,
              tenantPreferences: isDefault('tenantPreferences') && existingRules.length > 0 ? tenantPreferences : prev.tenantPreferences,
              customPreferences: isDefault('customPreferences') && existingRules.length > 0 ? customPreferences : prev.customPreferences,
            }
          })
        }
        setLoading(false)
      }).catch((err) => {
        console.error(err)
        toast.error('Failed to load property')
        setLoading(false)
      })
    }
  }, [id])

  useEffect(() => {
    try {
      const { photos, legalDocs, ...dataToSave } = formData
      sessionStorage.setItem(`editPropertyFormData_${id}`, JSON.stringify(dataToSave))
    } catch (error) {
      console.warn('Session storage quota exceeded.')
    }
  }, [formData, id])

  const updateFormData = (updates: Partial<PropertyFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const updateTouched = (field: keyof PropertyFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  // mapLocation is now part of formData

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSubmit = async () => {
    const errors = validateForm(formData)

    if (errors.length > 0) {
      const newTouched = { ...touched }
      errors.forEach(err => {
        // For special fields that map to multiple inputs, we mark a proxy key as touched
        newTouched[err.field as keyof PropertyFormData] = true
        toast.error(`Step ${err.step} (${err.stepName}): ${err.label} is missing!`)
      })
      setTouched(newTouched)
      setCurrentStep(errors[0].step)
      return
    }

    try {
      const apiData = new FormData()

      const mapPropertyType = (type: string) => {
        const t = type.toLowerCase()
        if (t === 'apartment') return 'Apartment'
        if (t === 'house') return 'House'
        if (t === 'room') return 'Room'
        if (t === 'bed') return 'SharedRoom'
        return 'Apartment'
      }

      const mapGovernorate = (gov: string) => {
        if (!gov) return 'CairoGovernorate'
        const g = gov.replace(/\s+/g, '')
        const valid = ['CairoGovernorate', 'GizaGovernorate', 'AlexandriaGovernorate', 'QalyubiaGovernorate', 'PortSaidGovernorate', 'SuezGovernorate', 'DakhaliaGovernorate', 'SharkiaGovernorate', 'GharbiaGovernorate', 'MonufiaGovernorate', 'BehiraGovernorate', 'KafrElSheikhGovernorate', 'DamiettaGovernorate', 'IsmailiaGovernorate', 'FaiyumGovernorate', 'BeniSuefGovernorate', 'MiniaGovernorate', 'AsyutGovernorate', 'SohagGovernorate', 'QenaGovernorate', 'LuxorGovernorate', 'AswanGovernorate', 'RedSeaGovernorate', 'NewValleyGovernorate', 'MarsaMatruhGovernorate', 'NorthSinaiGovernorate', 'SouthSinaiGovernorate']
        if (g.toLowerCase().endsWith('governorate')) {
          const match = valid.find(v => v.toLowerCase() === g.toLowerCase())
          return match || 'CairoGovernorate'
        }
        const withSuffix = g + 'Governorate'
        const match = valid.find(v => v.toLowerCase() === withSuffix.toLowerCase())
        return match || 'CairoGovernorate'
      }

      const mapAmenity = (amenity: string) => {
        const a = amenity.toLowerCase()
        const dict: Record<string, string> = {
          'wifi': 'Wifi', 'wi-fi': 'Wifi', 'parking': 'Parking', 'air conditioning': 'AirConditioning',
          'ac': 'AirConditioning', 'heating': 'Heating', 'tv': 'Tv', 'television': 'Tv',
          'elevator': 'Elevator', 'pool': 'Pool', 'swimming pool': 'Pool', 'gym': 'Gym',
          'kitchen': 'Kitchen', 'dishwasher': 'Dishwasher', 'microwave': 'Microwave',
          'refrigerator': 'Refrigerator', 'fridge': 'Refrigerator', 'washer': 'Washer',
          'dryer': 'Dryer', 'balcony': 'Balcony', 'balcony/patio': 'Balcony',
          'hardwood floors': 'HardwoodFloors', 'storage space': 'StorageSpace',
          'security system': 'SecuritySystem'
        }
        return dict[a] || null
      }

      // Basic Details
      apiData.append('Title', formData.title)
      apiData.append('Description', formData.description)
      apiData.append('Type', mapPropertyType(formData.type))
      
      const isShared = formData.occupancyPreference === 'shared' || formData.occupancyPreference === 'either'
      apiData.append('IsShared', isShared.toString())
      
      apiData.append('MaxOccupants', formData.numPeople)
      apiData.append('Bedrooms', formData.bedrooms)
      apiData.append('Beds', formData.beds)
      apiData.append('Bathrooms', formData.baths)

      // Pricing Logic
      apiData.append('Price', formData.price)
      apiData.append('RentalUnit', formData.leaseDuration || 'Monthly')

      // Location & Property Data
      apiData.append('Address', formData.address)
      apiData.append('City', formData.city)
      apiData.append('Governorate', mapGovernorate(formData.governorate))
      apiData.append('ZipCode', formData.zip)
      apiData.append('SquareMeters', formData.sqm)
      
      apiData.append('Latitude', formData.mapLocation.lat.toString())
      apiData.append('Longitude', formData.mapLocation.lng.toString())

      // Legal Docs
      if (formData.legalDocs && formData.legalDocs.length > 0) {
        const legalFile = formData.legalDocs[0].file
        if (legalFile) {
          apiData.append('NewProofOfOwnership', legalFile)
        }
      }

      // Photos / Media
      if (formData.removedMediaIds) {
        formData.removedMediaIds.forEach(id => apiData.append('RemovedMediaIds', id.toString()))
      }

      if (formData.photos && formData.photos.length > 0) {
        const primaryFile = formData.photos[0].file
        if (primaryFile) {
          apiData.append('NewPrimaryImage', primaryFile)
        }
      }
      
      if (formData.photos) {
        for (let i = 1; i < formData.photos.length; i++) {
          const mediaFile = formData.photos[i].file
          if (mediaFile) {
            apiData.append('AddedMediaFiles', mediaFile)
          }
        }
      }

      // Amenities
      const finalAmenities = [...(formData.selectedAmenities || []), ...(formData.additionalAmenities || []), ...(formData.utilities || [])]
      
      const reverseAmenityMap: Record<string, string> = {
        'wifi': 'WiFi',
        'wi-fi': 'WiFi',
        'parking': 'Parking',
        'air conditioning': 'Air Conditioning',
        'airconditioning': 'Air Conditioning',
        'heating': 'Heating',
        'tv': 'Tv',
        'elevator': 'Elevator',
        'pool': 'Pool',
        'gym': 'Gym',
        'kitchen': 'Kitchen',
        'dishwasher': 'Dishwasher',
        'microwave': 'Microwave',
        'refrigerator': 'Refrigerator',
        'washer': 'Washer/Dryer',
        'dryer': 'Washer/Dryer',
        'balcony': 'Balcony/Patio',
        'hardwoodfloors': 'Hardwood Floors',
        'storagespace': 'Storage Space',
        'securitysystem': 'Security System',
        'petfriendly': 'Pet Friendly'
      }

      const getFrontendAmenityName = (backendName: string): string => {
        const raw = backendName.toLowerCase().replace(/ /g, '')
        for (const [key, val] of Object.entries(reverseAmenityMap)) {
          if (key.replace(/ /g, '') === raw || key === backendName.toLowerCase()) return val
        }
        return backendName
      }

      const existingFrontendAmenityNames = formData.existingAmenities?.map(a => getFrontendAmenityName(a.amenityDisplayName || a.amenity)) || []

      formData.existingAmenities?.forEach(ea => {
        const name = getFrontendAmenityName(ea.amenityDisplayName || ea.amenity)
        if (!finalAmenities.includes(name)) {
          apiData.append('RemovedAmenityIds', ea.id.toString())
        }
      })

      finalAmenities.forEach(amenity => {
        if (!existingFrontendAmenityNames.includes(amenity)) {
          const mapped = mapAmenity(amenity)
          if (mapped) {
            apiData.append('AddedAmenities', mapped)
          }
        }
      })

      // Rules
      const finalRules = [...(formData.tenantPreferences || []), ...(formData.customPreferences || [])]
      const existingRuleNames = formData.existingRules?.map(r => r.ruleDisplayName || r.rule) || []

      formData.existingRules?.forEach(er => {
        const name = er.ruleDisplayName || er.rule
        if (!finalRules.includes(name)) {
          apiData.append('RemovedRuleIds', er.id.toString())
        }
      })

      finalRules.forEach(rule => {
        if (!existingRuleNames.includes(rule)) {
          apiData.append('AddedRules', rule)
        }
      })

      await propertyService.submitPropertyEdit(id!, apiData)

      toast.success('Property updated successfully')
      sessionStorage.removeItem(`editPropertyFormData_${id}`)
      navigate('/owner-dashboard')
    } catch (error) {
      console.error('Failed to update property', error)
      toast.error('Failed to update property. Please check your data and try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pb-20 flex items-center justify-center text-[#4a5565]">
        Loading property details...
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-[1200px] mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/owner-dashboard')}
            className="flex items-center gap-2 text-[#4a5565] hover:text-[#3A6EA5] transition-colors mb-4"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-[#1a1a1a] mb-2">
            Edit Property
          </h1>
          <p className="text-[#4a5565]">
            Modify the details of your property
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-[#f5f7fa] -z-10">
              <div
                className="h-full bg-[#3A6EA5] transition-all duration-300"
                style={{
                  width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
                }}
              />
            </div>

            {STEPS.map((step) => {
              const Icon = step.icon
              const isActive = step.id === currentStep
              const isCompleted = step.id < currentStep

              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${isActive
                        ? 'bg-[#3A6EA5] text-white shadow-lg shadow-[#3A6EA5]/30'
                        : isCompleted
                          ? 'bg-[#9CBBDC] text-white'
                          : 'bg-white border-2 border-[#f5f7fa] text-[#4a5565]'
                      }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span
                    className={`text-sm ${isActive
                        ? 'text-[#3A6EA5] font-semibold'
                        : 'text-[#4a5565]'
                      }`}
                  >
                    {step.title}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Form Content */}
        <Card className="bg-[#f5f7fa] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10">
          <CardContent className="p-8">
            {currentStep === 1 && (
              <PropertyDetailsStep
                formData={formData}
                updateFormData={updateFormData}
                touched={touched}
                updateTouched={updateTouched}
              />
            )}

            {currentStep === 2 && (
              <AmenitiesStep
                formData={formData}
                updateFormData={updateFormData}
              />
            )}

            {currentStep === 3 && (
              <PhotosStep
                formData={formData}
                updateFormData={updateFormData}
                touched={touched}
              />
            )}

            {currentStep === 4 && (
              <PricingStep
                formData={formData}
                updateFormData={updateFormData}
                touched={touched}
                updateTouched={updateTouched}
              />
            )}

            {currentStep === 5 && (
              <AvailabilityStep
                formData={formData}
                updateFormData={updateFormData}
              />
            )}

            {currentStep === 6 && (
              <LegalDocsStep
                formData={formData}
                updateFormData={updateFormData}
                touched={touched}
              />
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#3A6EA5]/20">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="rounded-xl border-[#3A6EA5]/20 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep < STEPS.length ? (
                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-xl shadow-lg shadow-[#3A6EA5]/30"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-xl shadow-lg shadow-[#3A6EA5]/30"
                >
                  Save Changes
                  <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
