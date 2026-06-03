import { useState, useEffect } from 'react'
import { MapPin, Users, CheckCircle } from 'lucide-react'
import { MapInput } from './MapInput'
import { Label } from '../../../components/ui/label'
import { Input } from '../../../components/ui/input'
import { Textarea } from '../../../components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select'
import { Button } from '../../../components/ui/button'
import { toast } from 'sonner'
import { PropertyFormData, TouchedFields } from '../types'

interface PropertyDetailsStepProps {
  formData: PropertyFormData
  updateFormData: (updates: Partial<PropertyFormData>) => void
  touched: TouchedFields
  updateTouched: (field: keyof PropertyFormData) => void
}

export function PropertyDetailsStep({ formData, updateFormData, touched, updateTouched }: PropertyDetailsStepProps) {
  const [localTitle, setLocalTitle] = useState(formData.title)
  const [localAddress, setLocalAddress] = useState(formData.address)
  const [localCity, setLocalCity] = useState(formData.city)
  const [localGovernorate, setLocalGovernorate] = useState(formData.governorate)
  const [localZip, setLocalZip] = useState(formData.zip)
  const [localSqm, setLocalSqm] = useState(formData.sqm)
  const [localDescription, setLocalDescription] = useState(formData.description)

  useEffect(() => {
    setLocalTitle(formData.title)
    setLocalAddress(formData.address)
    setLocalCity(formData.city)
    setLocalGovernorate(formData.governorate)
    setLocalZip(formData.zip)
    setLocalSqm(formData.sqm)
    setLocalDescription(formData.description)
  }, [formData])

  const getFieldError = (field: keyof PropertyFormData, value: string) => {
    if (!touched[field]) return null
    if (!value?.trim()) return 'This field is required'
    
    if (field === 'title' && (value.length < 10 || value.length > 100)) {
      return 'Title must be between 10 and 100 characters.'
    }
    if (field === 'description' && (value.length < 20 || value.length > 2000)) {
      return 'Description must be between 20 and 2000 characters.'
    }
    return null
  }

  const getInputClass = (field: keyof PropertyFormData, value: string) => {
    const error = getFieldError(field, value)
    return `rounded-xl bg-white ${error ? 'border-red-500 bg-red-50' : 'border-[#3A6EA5]/20'}`
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-2">
        Property Details
      </h2>
      <p className="text-sm text-[#8c94a3] mb-6">
        Fields marked with <span className="text-red-500">*</span> are mandatory.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="title" className="text-[#1a1a1a] mb-2 block">
            Property Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            placeholder="e.g., Modern Downtown Apartment"
            className={getInputClass('title', formData.title)}
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
            onBlur={() => {
              updateFormData({ title: localTitle })
              updateTouched('title')
            }}
          />
          {getFieldError('title', formData.title) && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('title', formData.title)}</p>
          )}
        </div>

        <div>
          <Label htmlFor="type" className="text-[#1a1a1a] mb-2 block">
            Property Type <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.type}
            onValueChange={(val) => {
              updateFormData({ type: val })
              updateTouched('type')
            }}
          >
            <SelectTrigger className={getInputClass('type', formData.type)} onBlur={() => updateTouched('type')}>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bed">Bed</SelectItem>
              <SelectItem value="room">Room</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="house">House</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="address" className="text-[#1a1a1a] mb-2 block">
          Street Address <span className="text-red-500">*</span>
        </Label>
        <Input
          id="address"
          placeholder="123 Main Street"
          className={getInputClass('address', formData.address)}
          value={localAddress}
          onChange={(e) => setLocalAddress(e.target.value)}
          onBlur={() => {
            updateFormData({ address: localAddress })
            updateTouched('address')
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label htmlFor="city" className="text-[#1a1a1a] mb-2 block">
            City <span className="text-red-500">*</span>
          </Label>
          <Input
            id="city"
            placeholder="San Francisco"
            className={getInputClass('city', formData.city)}
            value={localCity}
            onChange={(e) => setLocalCity(e.target.value)}
            onBlur={() => {
              updateFormData({ city: localCity })
              updateTouched('city')
            }}
          />
        </div>
        <div>
          <Label htmlFor="governorate" className="text-[#1a1a1a] mb-2 block">
            Governorate <span className="text-red-500">*</span>
          </Label>
          <Input
            id="governorate"
            placeholder="e.g., Riyadh"
            className={getInputClass('governorate', formData.governorate)}
            value={localGovernorate}
            onChange={(e) => setLocalGovernorate(e.target.value)}
            onBlur={() => {
              updateFormData({ governorate: localGovernorate })
              updateTouched('governorate')
            }}
          />
        </div>
        <div>
          <Label htmlFor="zip" className="text-[#1a1a1a] mb-2 block">
            ZIP Code <span className="text-red-500">*</span>
          </Label>
          <Input
            id="zip"
            placeholder="94103"
            className={getInputClass('zip', formData.zip)}
            value={localZip}
            onChange={(e) => setLocalZip(e.target.value)}
            onBlur={() => {
              updateFormData({ zip: localZip })
              updateTouched('zip')
            }}
          />
        </div>
      </div>

      {/* Property Location Map */}
      <div className="bg-white rounded-2xl p-6">
        <Label className="text-[#1a1a1a] mb-3 block">
          <MapPin className="w-5 h-5 inline-block mr-2" />
          Property Location on Map <span className="text-red-500">*</span>
        </Label>
        <MapInput location={formData.mapLocation} onChange={(loc) => updateFormData({ mapLocation: loc })} />
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-[#4a5565]">
            Drag the marker or click on the map to set the exact location of your property
          </p>
          <p className="text-xs text-[#4a5565] font-mono bg-[#f5f7fa] px-2 py-1 rounded">
            {formData.mapLocation.lat.toFixed(4)}, {formData.mapLocation.lng.toFixed(4)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <Label htmlFor="bedrooms" className="text-[#1a1a1a] mb-2 block">
            Bedrooms <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.bedrooms}
            onValueChange={(val) => {
              updateFormData({ bedrooms: val })
              updateTouched('bedrooms')
            }}
          >
            <SelectTrigger className={getInputClass('bedrooms', formData.bedrooms)} onBlur={() => updateTouched('bedrooms')}>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="beds" className="text-[#1a1a1a] mb-2 block">
            Beds <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.beds}
            onValueChange={(val) => {
              updateFormData({ beds: val })
              updateTouched('beds')
            }}
          >
            <SelectTrigger className={getInputClass('beds', formData.beds)} onBlur={() => updateTouched('beds')}>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="baths" className="text-[#1a1a1a] mb-2 block">
            Bathrooms <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.baths}
            onValueChange={(val) => {
              updateFormData({ baths: val })
              updateTouched('baths')
            }}
          >
            <SelectTrigger className={getInputClass('baths', formData.baths)} onBlur={() => updateTouched('baths')}>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {[1, 1.5, 2, 2.5, 3, 3.5, 4].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="sqm" className="text-[#1a1a1a] mb-2 block">
            Square Meters <span className="text-red-500">*</span>
          </Label>
          <Input
            id="sqm"
            type="number"
            placeholder="120"
            className={getInputClass('sqm', formData.sqm)}
            value={localSqm}
            onChange={(e) => setLocalSqm(e.target.value)}
            onBlur={() => {
              updateFormData({ sqm: localSqm })
              updateTouched('sqm')
            }}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description" className="text-[#1a1a1a] mb-2 block">
          Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Describe your property..."
          rows={6}
          className={getInputClass('description', formData.description)}
          value={localDescription}
          onChange={(e) => setLocalDescription(e.target.value)}
          onBlur={() => {
            updateFormData({ description: localDescription })
            updateTouched('description')
          }}
        />
        {getFieldError('description', formData.description) && (
          <p className="text-red-500 text-sm mt-1">{getFieldError('description', formData.description)}</p>
        )}
      </div>

      {/* Occupancy Details Section */}
      <div className="bg-white rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-[#3A6EA5]" />
          <h3 className="font-semibold text-[#1a1a1a]">Occupancy Details</h3>
        </div>

        <div>
          <Label htmlFor="num-people" className="text-[#1a1a1a] mb-2 block">
            Max Occupants (Number of People) <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.numPeople}
            onValueChange={(val) => {
              updateFormData({ numPeople: val })
              updateTouched('numPeople')
            }}
          >
            <SelectTrigger id="num-people" className={getInputClass('numPeople', formData.numPeople)} onBlur={() => updateTouched('numPeople')}>
              <SelectValue placeholder="Select max occupants" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? 'Person' : 'People'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="occupancy-preference" className="text-[#1a1a1a] mb-3 block">
            Occupancy Preference (Is Shared) <span className="text-red-500">*</span>
          </Label>
          <p className="text-sm text-[#4a5565] mb-3">
            How would you like this property to be occupied?
          </p>
          <Select
            value={formData.occupancyPreference}
            onValueChange={(val) => {
              updateFormData({ occupancyPreference: val })
              updateTouched('occupancyPreference')
            }}
          >
            <SelectTrigger id="occupancy-preference" className={getInputClass('occupancyPreference', formData.occupancyPreference)} onBlur={() => updateTouched('occupancyPreference')}>
              <SelectValue placeholder="Select occupancy preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="shared">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Shared - Different users per bed/room</span>
                </div>
              </SelectItem>
              <SelectItem value="single">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Single User - Entire property for one user</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-[#9CBBDC]/20 rounded-xl p-4 flex items-start gap-3">
          <div>
            <p className="text-sm text-[#1a1a1a]">
              <strong>Shared:</strong> Each bed/room can be rented to different
              users. Ideal for roommate situations.
            </p>
            <p className="text-sm text-[#1a1a1a] mt-2">
              <strong>Single User:</strong> The entire property will be rented to
              one person or family.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
