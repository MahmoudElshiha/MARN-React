import { useState } from 'react'
import { useNavigate } from 'react-router'
import {
  ChevronLeft,
  ChevronRight,
  Home,
  MapPin,
  DollarSign,
  Calendar,
  Upload,
  CheckCircle,
  Wifi,
  Car,
  Wind,
  Flame,
  Shirt,
  Dumbbell,
  Waves,
  Dog,
  FileText,
  Users,
  X,
  Plus,
} from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Textarea } from '@/app/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select'
import { Checkbox } from '@/app/components/ui/checkbox'
import { Card, CardContent } from '@/app/components/ui/card'
import { toast } from 'sonner'
import { useCreateProperty } from '../hooks/usePropertyMutations'

const STEPS = [
  { id: 1, title: 'Property Details', icon: Home },
  { id: 2, title: 'Amenities', icon: CheckCircle },
  { id: 3, title: 'Photos', icon: Upload },
  { id: 4, title: 'Pricing', icon: DollarSign },
  { id: 5, title: 'Availability', icon: Calendar },
  { id: 6, title: 'Legal Docs', icon: FileText },
]

const AMENITIES = [
  { name: 'WiFi', icon: Wifi },
  { name: 'Parking', icon: Car },
  { name: 'Air Conditioning', icon: Wind },
  { name: 'Heating', icon: Flame },
  { name: 'Washer/Dryer', icon: Shirt },
  { name: 'Gym', icon: Dumbbell },
  { name: 'Pool', icon: Waves },
  { name: 'Pet Friendly', icon: Dog },
]

const MAP_LOCATION = { lat: 30.0444, lng: 31.2357 } // Cairo default

export function AddPropertyForm() {
  const navigate = useNavigate()
  const { createProperty, loading } = useCreateProperty()

  const [currentStep, setCurrentStep] = useState(1)
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [customPreferences, setCustomPreferences] = useState<string[]>([])
  const [newPreference, setNewPreference] = useState('')

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity],
    )
  }

  const addCustomPreference = () => {
    if (newPreference.trim()) {
      setCustomPreferences([...customPreferences, newPreference.trim()])
      setNewPreference('')
      toast.success('Preference added')
    }
  }

  const removeCustomPreference = (preference: string) => {
    setCustomPreferences(customPreferences.filter((p) => p !== preference))
  }

  const handleNext = () => {
    if (currentStep < STEPS.length) setCurrentStep(currentStep + 1)
  }

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async () => {
    const result = await createProperty({
      title: '',
      type: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      bedrooms: '',
      bathrooms: '',
      sqm: '',
      description: '',
      numberOfPeople: '',
      occupancyPreference: '',
      dayRent: '',
      monthRent: '',
      yearRent: '',
      deposit: '',
      availableFrom: '',
      amenities: selectedAmenities,
    })
    if (result) {
      toast.success('Property submitted for approval')
      navigate('/owner-dashboard')
    } else {
      toast.error('Failed to submit property. Please try again.')
    }
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
            Add New Property
          </h1>
          <p className="text-[#4a5565]">
            Fill out the details to list your property
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
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
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                      isActive
                        ? 'bg-[#3A6EA5] text-white shadow-lg shadow-[#3A6EA5]/30'
                        : isCompleted
                          ? 'bg-[#9CBBDC] text-white'
                          : 'bg-white border-2 border-[#f5f7fa] text-[#4a5565]'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span
                    className={`text-sm ${isActive ? 'text-[#3A6EA5] font-semibold' : 'text-[#4a5565]'}`}
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
            {/* Step 1: Property Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-6">
                  Property Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label
                      htmlFor="title"
                      className="text-[#1a1a1a] mb-2 block"
                    >
                      Property Title
                    </Label>
                    <Input
                      id="title"
                      placeholder="e.g., Modern Downtown Apartment"
                      className="rounded-xl bg-white border-[#3A6EA5]/20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type" className="text-[#1a1a1a] mb-2 block">
                      Property Type
                    </Label>
                    <Select>
                      <SelectTrigger className="rounded-xl bg-white border-[#3A6EA5]/20">
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
                  <Label
                    htmlFor="address"
                    className="text-[#1a1a1a] mb-2 block"
                  >
                    Street Address
                  </Label>
                  <Input
                    id="address"
                    placeholder="123 Main Street"
                    className="rounded-xl bg-white border-[#3A6EA5]/20"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="city" className="text-[#1a1a1a] mb-2 block">
                      City
                    </Label>
                    <Input
                      id="city"
                      placeholder="Cairo"
                      className="rounded-xl bg-white border-[#3A6EA5]/20"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="state"
                      className="text-[#1a1a1a] mb-2 block"
                    >
                      Governorate
                    </Label>
                    <Input
                      id="state"
                      placeholder="Cairo"
                      className="rounded-xl bg-white border-[#3A6EA5]/20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zip" className="text-[#1a1a1a] mb-2 block">
                      Postal Code
                    </Label>
                    <Input
                      id="zip"
                      placeholder="11511"
                      className="rounded-xl bg-white border-[#3A6EA5]/20"
                    />
                  </div>
                </div>

                {/* Map Preview */}
                <div className="bg-white rounded-2xl p-6">
                  <Label className="text-[#1a1a1a] mb-3 block">
                    <MapPin className="w-5 h-5 inline-block mr-2" />
                    Property Location on Map
                  </Label>
                  <div className="w-full h-64 bg-gradient-to-br from-[#9CBBDC]/30 to-[#f5f7fa] rounded-xl flex items-center justify-center relative overflow-hidden">
                    <div className="relative z-10 text-center">
                      <MapPin className="w-12 h-12 mx-auto mb-3 text-[#3A6EA5]" />
                      <p className="text-[#1a1a1a] font-semibold mb-2">
                        Click to select exact location
                      </p>
                      <p className="text-sm text-[#4a5565]">
                        Latitude: {MAP_LOCATION.lat.toFixed(4)}, Longitude:{' '}
                        {MAP_LOCATION.lng.toFixed(4)}
                      </p>
                      <Button
                        className="mt-4 bg-white text-[#3A6EA5] hover:bg-[#f5f7fa] rounded-xl"
                        onClick={() =>
                          toast.info(
                            'Map selection feature — integration pending',
                          )
                        }
                      >
                        Select on Map
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="beds" className="text-[#1a1a1a] mb-2 block">
                      Bedrooms
                    </Label>
                    <Select>
                      <SelectTrigger className="rounded-xl bg-white border-[#3A6EA5]/20">
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
                    <Label
                      htmlFor="baths"
                      className="text-[#1a1a1a] mb-2 block"
                    >
                      Bathrooms
                    </Label>
                    <Select>
                      <SelectTrigger className="rounded-xl bg-white border-[#3A6EA5]/20">
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
                      Square Meters
                    </Label>
                    <Input
                      id="sqm"
                      type="number"
                      placeholder="120"
                      className="rounded-xl bg-white border-[#3A6EA5]/20"
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="description"
                    className="text-[#1a1a1a] mb-2 block"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your property…"
                    rows={6}
                    className="rounded-xl bg-white border-[#3A6EA5]/20"
                  />
                </div>

                {/* Occupancy Details */}
                <div className="bg-white rounded-2xl p-6 space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-[#3A6EA5]" />
                    <h3 className="font-semibold text-[#1a1a1a]">
                      Occupancy Details
                    </h3>
                  </div>
                  <div>
                    <Label
                      htmlFor="num-people"
                      className="text-[#1a1a1a] mb-2 block"
                    >
                      Number of People
                    </Label>
                    <Select>
                      <SelectTrigger
                        id="num-people"
                        className="rounded-xl border-[#3A6EA5]/20"
                      >
                        <SelectValue placeholder="Select number of people" />
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
                    <Label
                      htmlFor="occupancy-preference"
                      className="text-[#1a1a1a] mb-3 block"
                    >
                      Occupancy Preference
                    </Label>
                    <Select>
                      <SelectTrigger
                        id="occupancy-preference"
                        className="rounded-xl border-[#3A6EA5]/20"
                      >
                        <SelectValue placeholder="Select occupancy preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="shared">
                          Shared — Different users per bed/room
                        </SelectItem>
                        <SelectItem value="single">
                          Single User — Entire property for one user
                        </SelectItem>
                        <SelectItem value="either">
                          Either — Open to both options
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Amenities */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-6">
                  Select Amenities
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {AMENITIES.map((amenity) => {
                    const Icon = amenity.icon
                    const isSelected = selectedAmenities.includes(amenity.name)
                    return (
                      <button
                        key={amenity.name}
                        onClick={() => toggleAmenity(amenity.name)}
                        className={`p-6 rounded-2xl transition-all ${
                          isSelected
                            ? 'bg-[#3A6EA5] text-white shadow-lg shadow-[#3A6EA5]/30'
                            : 'bg-white text-[#1a1a1a] hover:bg-[#9CBBDC]/20'
                        }`}
                      >
                        <Icon className="w-8 h-8 mx-auto mb-3" />
                        <p className="text-sm font-medium">{amenity.name}</p>
                      </button>
                    )
                  })}
                </div>
                <div className="bg-white rounded-2xl p-6">
                  <Label className="text-[#1a1a1a] mb-3 block">
                    Additional Amenities
                  </Label>
                  <div className="space-y-3">
                    {[
                      'Dishwasher',
                      'Microwave',
                      'Refrigerator',
                      'Balcony/Patio',
                      'Hardwood Floors',
                      'Storage Space',
                      'Security System',
                      'Elevator',
                    ].map((amenity) => (
                      <div key={amenity} className="flex items-center">
                        <Checkbox
                          id={amenity}
                          className="border-[#3A6EA5] data-[state=checked]:bg-[#3A6EA5]"
                        />
                        <label
                          htmlFor={amenity}
                          className="ml-3 text-[#1a1a1a] cursor-pointer"
                        >
                          {amenity}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Photos */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-6">
                  Upload Photos
                </h2>
                <div className="bg-white rounded-2xl p-8">
                  <div className="border-2 border-dashed border-[#3A6EA5]/30 rounded-2xl p-12 text-center hover:border-[#3A6EA5] transition-colors cursor-pointer">
                    <Upload className="w-16 h-16 mx-auto mb-4 text-[#3A6EA5]" />
                    <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">
                      Drag & drop photos here
                    </h3>
                    <p className="text-[#4a5565] mb-4">
                      or click to browse from your computer
                    </p>
                    <Button className="bg-[#3A6EA5] hover:bg-[#2a5a8a] text-white rounded-xl">
                      Choose Files
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-2xl bg-white border-2 border-dashed border-[#3A6EA5]/30 flex items-center justify-center hover:border-[#3A6EA5] transition-colors cursor-pointer"
                    >
                      <Upload className="w-8 h-8 text-[#4a5565]" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Pricing */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-6">
                  Pricing Configuration
                </h2>
                <div className="bg-white rounded-2xl p-6 space-y-6">
                  <h3 className="font-semibold text-[#1a1a1a] mb-4">
                    Rental Pricing (EGP)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      {
                        id: 'day-rent',
                        label: 'Day-based Rent',
                        unit: 'Per day',
                        placeholder: '500',
                      },
                      {
                        id: 'month-rent',
                        label: 'Month-based Rent',
                        unit: 'Per month',
                        placeholder: '15000',
                      },
                      {
                        id: 'year-rent',
                        label: 'Year-based Rent',
                        unit: 'Per year',
                        placeholder: '180000',
                      },
                    ].map(({ id, label, unit, placeholder }) => (
                      <div key={id}>
                        <Label
                          htmlFor={id}
                          className="text-[#1a1a1a] mb-2 block"
                        >
                          {label}
                        </Label>
                        <div className="relative">
                          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4a5565]" />
                          <Input
                            id={id}
                            type="number"
                            placeholder={placeholder}
                            className="pl-12 rounded-xl border-[#3A6EA5]/20"
                          />
                        </div>
                        <p className="text-xs text-[#4a5565] mt-1">{unit}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="deposit"
                    className="text-[#1a1a1a] mb-2 block"
                  >
                    Security Deposit
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4a5565]" />
                    <Input
                      id="deposit"
                      type="number"
                      placeholder="15000"
                      className="pl-12 rounded-xl bg-white border-[#3A6EA5]/20"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Availability */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-6">
                  Availability Settings
                </h2>
                <div>
                  <Label
                    htmlFor="available-from"
                    className="text-[#1a1a1a] mb-2 block"
                  >
                    Available From
                  </Label>
                  <Input
                    id="available-from"
                    type="date"
                    className="rounded-xl bg-white border-[#3A6EA5]/20"
                  />
                </div>
                <div className="bg-white rounded-2xl p-6">
                  <Label className="text-[#1a1a1a] mb-3 block">
                    Tenant Preferences
                  </Label>
                  <div className="flex gap-2 mb-4">
                    <Input
                      value={newPreference}
                      onChange={(e) => setNewPreference(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && addCustomPreference()
                      }
                      placeholder="Enter new preference and press Enter"
                      className="rounded-xl border-[#3A6EA5]/20"
                    />
                    <Button
                      type="button"
                      onClick={addCustomPreference}
                      className="bg-[#3A6EA5] hover:bg-[#2a5a8a] text-white rounded-xl"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {[
                      'Students Welcome',
                      'Professionals Only',
                      'Families Welcome',
                      'No Smoking',
                      'Pets Allowed',
                    ].map((preference) => (
                      <div key={preference} className="flex items-center">
                        <Checkbox
                          id={preference}
                          className="border-[#3A6EA5] data-[state=checked]:bg-[#3A6EA5]"
                        />
                        <label
                          htmlFor={preference}
                          className="ml-3 text-[#1a1a1a] cursor-pointer"
                        >
                          {preference}
                        </label>
                      </div>
                    ))}
                    {customPreferences.map((preference) => (
                      <div
                        key={preference}
                        className="flex items-center justify-between bg-[#9CBBDC]/20 rounded-xl p-3"
                      >
                        <div className="flex items-center">
                          <Checkbox
                            id={preference}
                            defaultChecked
                            className="border-[#3A6EA5] data-[state=checked]:bg-[#3A6EA5]"
                          />
                          <label
                            htmlFor={preference}
                            className="ml-3 text-[#1a1a1a] cursor-pointer"
                          >
                            {preference}
                          </label>
                        </div>
                        <button
                          onClick={() => removeCustomPreference(preference)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Legal Docs */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-6">
                  Upload Legal Documents
                </h2>
                <div className="bg-white rounded-2xl p-8">
                  <div className="border-2 border-dashed border-[#3A6EA5]/30 rounded-2xl p-12 text-center hover:border-[#3A6EA5] transition-colors cursor-pointer">
                    <Upload className="w-16 h-16 mx-auto mb-4 text-[#3A6EA5]" />
                    <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">
                      Drag & drop documents here
                    </h3>
                    <p className="text-[#4a5565] mb-4">
                      or click to browse from your computer
                    </p>
                    <Button className="bg-[#3A6EA5] hover:bg-[#2a5a8a] text-white rounded-xl">
                      Choose Files
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
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
                  disabled={loading}
                  className="bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-xl shadow-lg shadow-[#3A6EA5]/30"
                >
                  {loading ? 'Submitting…' : 'Submit for Approval'}
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
