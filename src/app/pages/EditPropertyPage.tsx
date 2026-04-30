import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ChevronLeft, ChevronRight, MapPin, Users, X, Plus } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import { Checkbox } from '../components/ui/checkbox'
import { Card, CardContent } from '../components/ui/card'
import { toast } from 'sonner'
import {
  PROPERTY_STEPS as STEPS,
  PROPERTY_AMENITIES as AMENITIES,
} from '@/constants/property'

export function EditPropertyPage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'WiFi',
    'Parking',
    'Air Conditioning',
    'Heating',
  ])
  const [customPreferences, setCustomPreferences] = useState<string[]>([
    'Non-smokers only',
  ])
  const [newPreference, setNewPreference] = useState('')
  const [mapLocation] = useState({
    lat: 37.7749,
    lng: -122.4194,
  })

  // Pre-filled property data
  const [propertyData, setPropertyData] = useState({
    title: 'Modern Downtown Apartment',
    type: 'apartment',
    address: '123 Market Street',
    city: 'Alexandria',
    state: 'Alexandria',
    zip: '21500',
    bedrooms: '2',
    bathrooms: '2',
    sqm: '120',
    description:
      'Beautiful modern apartment in the heart of downtown Alexandria. Recently renovated with high-end finishes, floor-to-ceiling windows, and stunning city views.',
    numberOfPeople: '2',
    occupancyPreference: 'either',
    dayRent: '500',
    monthRent: '15000',
    yearRent: '180000',
    deposit: '15000',
    availableFrom: '2026-04-01',
  })

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
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleUpdate = () => {
    toast.success('Property updated successfully')
    navigate('/owner-dashboard')
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
          <p className="text-[#4a5565]">Update your property details</p>
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
                    className={`text-sm ${
                      isActive
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
                      value={propertyData.title}
                      onChange={(e) =>
                        setPropertyData({
                          ...propertyData,
                          title: e.target.value,
                        })
                      }
                      className="rounded-xl bg-white border-[#3A6EA5]/20"
                    />
                  </div>

                  <div>
                    <Label htmlFor="type" className="text-[#1a1a1a] mb-2 block">
                      Property Type
                    </Label>
                    <Select
                      value={propertyData.type}
                      onValueChange={(value) =>
                        setPropertyData({ ...propertyData, type: value })
                      }
                    >
                      <SelectTrigger className="rounded-xl bg-white border-[#3A6EA5]/20">
                        <SelectValue />
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
                    value={propertyData.address}
                    onChange={(e) =>
                      setPropertyData({
                        ...propertyData,
                        address: e.target.value,
                      })
                    }
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
                      value={propertyData.city}
                      onChange={(e) =>
                        setPropertyData({
                          ...propertyData,
                          city: e.target.value,
                        })
                      }
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
                      value={propertyData.state}
                      onChange={(e) =>
                        setPropertyData({
                          ...propertyData,
                          state: e.target.value,
                        })
                      }
                      className="rounded-xl bg-white border-[#3A6EA5]/20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zip" className="text-[#1a1a1a] mb-2 block">
                      Postal Code
                    </Label>
                    <Input
                      id="zip"
                      value={propertyData.zip}
                      onChange={(e) =>
                        setPropertyData({
                          ...propertyData,
                          zip: e.target.value,
                        })
                      }
                      className="rounded-xl bg-white border-[#3A6EA5]/20"
                    />
                  </div>
                </div>

                {/* Google Maps Preview */}
                <div className="bg-white rounded-2xl p-6">
                  <Label className="text-[#1a1a1a] mb-3 block">
                    <MapPin className="w-5 h-5 inline-block mr-2" />
                    Property Location on Map
                  </Label>
                  <div className="w-full h-64 bg-gradient-to-br from-[#9CBBDC]/30 to-[#f5f7fa] rounded-xl flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiM5Q0JCREMiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iMC4zIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
                    <div className="relative z-10 text-center">
                      <MapPin className="w-12 h-12 mx-auto mb-3 text-[#3A6EA5]" />
                      <p className="text-[#1a1a1a] font-semibold mb-2">
                        Click to select exact location
                      </p>
                      <p className="text-sm text-[#4a5565]">
                        Latitude: {mapLocation.lat.toFixed(4)}, Longitude:{' '}
                        {mapLocation.lng.toFixed(4)}
                      </p>
                      <Button
                        className="mt-4 bg-white text-[#3A6EA5] hover:bg-[#f5f7fa] rounded-xl"
                        onClick={() =>
                          toast.info(
                            'Map selection feature - Integration pending',
                          )
                        }
                      >
                        Select on Map
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-[#4a5565] mt-3">
                    Drag the marker to set the exact location of your property
                    for better visibility
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="beds" className="text-[#1a1a1a] mb-2 block">
                      Bedrooms
                    </Label>
                    <Select
                      value={propertyData.bedrooms}
                      onValueChange={(value) =>
                        setPropertyData({ ...propertyData, bedrooms: value })
                      }
                    >
                      <SelectTrigger className="rounded-xl bg-white border-[#3A6EA5]/20">
                        <SelectValue />
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
                    <Select
                      value={propertyData.bathrooms}
                      onValueChange={(value) =>
                        setPropertyData({ ...propertyData, bathrooms: value })
                      }
                    >
                      <SelectTrigger className="rounded-xl bg-white border-[#3A6EA5]/20">
                        <SelectValue />
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
                      value={propertyData.sqm}
                      onChange={(e) =>
                        setPropertyData({
                          ...propertyData,
                          sqm: e.target.value,
                        })
                      }
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
                    value={propertyData.description}
                    onChange={(e) =>
                      setPropertyData({
                        ...propertyData,
                        description: e.target.value,
                      })
                    }
                    rows={6}
                    className="rounded-xl bg-white border-[#3A6EA5]/20"
                  />
                </div>

                {/* Occupancy Details Section */}
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
                    <Select
                      value={propertyData.numberOfPeople}
                      onValueChange={(value) =>
                        setPropertyData({
                          ...propertyData,
                          numberOfPeople: value,
                        })
                      }
                    >
                      <SelectTrigger
                        id="num-people"
                        className="rounded-xl border-[#3A6EA5]/20"
                      >
                        <SelectValue />
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
                    <p className="text-sm text-[#4a5565] mb-3">
                      How would you like this property to be occupied?
                    </p>
                    <Select
                      value={propertyData.occupancyPreference}
                      onValueChange={(value) =>
                        setPropertyData({
                          ...propertyData,
                          occupancyPreference: value,
                        })
                      }
                    >
                      <SelectTrigger
                        id="occupancy-preference"
                        className="rounded-xl border-[#3A6EA5]/20"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="shared">
                          Shared - Different users per bed/room
                        </SelectItem>
                        <SelectItem value="single">
                          Single User - Entire property for one user
                        </SelectItem>
                        <SelectItem value="either">
                          Either - Open to both options
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="bg-[#9CBBDC]/20 rounded-xl p-4 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#3A6EA5] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-[#1a1a1a]">
                        <strong>Shared:</strong> Each bed/room can be rented to
                        different users. Ideal for roommate situations.
                      </p>
                      <p className="text-sm text-[#1a1a1a] mt-2">
                        <strong>Single User:</strong> The entire property will
                        be rented to one person or family.
                      </p>
                      <p className="text-sm text-[#1a1a1a] mt-2">
                        <strong>Either:</strong> You're flexible and open to
                        both shared and single-user arrangements.
                      </p>
                    </div>
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
                          defaultChecked
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
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-2xl bg-white border-2 border-dashed border-[#3A6EA5]/30 flex items-center justify-center hover:border-[#3A6EA5] transition-colors cursor-pointer"
                    >
                      <Upload className="w-8 h-8 text-[#4a5565]" />
                    </div>
                  ))}
                </div>

                <div className="bg-[#9CBBDC]/20 rounded-2xl p-4">
                  <p className="text-sm text-[#1a1a1a]">
                    <strong>Tip:</strong> Properties with 5+ high-quality photos
                    get 40% more views. Include photos of living areas,
                    bedrooms, kitchen, bathroom, and exterior.
                  </p>
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
                    <div>
                      <Label
                        htmlFor="day-rent"
                        className="text-[#1a1a1a] mb-2 block"
                      >
                        Day-based Rent
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4a5565]" />
                        <Input
                          id="day-rent"
                          type="number"
                          value={propertyData.dayRent}
                          onChange={(e) =>
                            setPropertyData({
                              ...propertyData,
                              dayRent: e.target.value,
                            })
                          }
                          className="pl-12 rounded-xl border-[#3A6EA5]/20"
                        />
                      </div>
                      <p className="text-xs text-[#4a5565] mt-1">Per day</p>
                    </div>

                    <div>
                      <Label
                        htmlFor="month-rent"
                        className="text-[#1a1a1a] mb-2 block"
                      >
                        Month-based Rent
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4a5565]" />
                        <Input
                          id="month-rent"
                          type="number"
                          value={propertyData.monthRent}
                          onChange={(e) =>
                            setPropertyData({
                              ...propertyData,
                              monthRent: e.target.value,
                            })
                          }
                          className="pl-12 rounded-xl border-[#3A6EA5]/20"
                        />
                      </div>
                      <p className="text-xs text-[#4a5565] mt-1">Per month</p>
                    </div>

                    <div>
                      <Label
                        htmlFor="year-rent"
                        className="text-[#1a1a1a] mb-2 block"
                      >
                        Year-based Rent
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4a5565]" />
                        <Input
                          id="year-rent"
                          type="number"
                          value={propertyData.yearRent}
                          onChange={(e) =>
                            setPropertyData({
                              ...propertyData,
                              yearRent: e.target.value,
                            })
                          }
                          className="pl-12 rounded-xl border-[#3A6EA5]/20"
                        />
                      </div>
                      <p className="text-xs text-[#4a5565] mt-1">Per year</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        value={propertyData.deposit}
                        onChange={(e) =>
                          setPropertyData({
                            ...propertyData,
                            deposit: e.target.value,
                          })
                        }
                        className="pl-12 rounded-xl bg-white border-[#3A6EA5]/20"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6">
                  <h3 className="font-semibold text-[#1a1a1a] mb-4">
                    Utilities Included
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      'Water',
                      'Electricity',
                      'Gas',
                      'Internet',
                      'Trash',
                      'Parking',
                    ].map((utility) => (
                      <div key={utility} className="flex items-center">
                        <Checkbox
                          id={utility}
                          defaultChecked
                          className="border-[#3A6EA5] data-[state=checked]:bg-[#3A6EA5]"
                        />
                        <label
                          htmlFor={utility}
                          className="ml-3 text-[#1a1a1a] cursor-pointer"
                        >
                          {utility}
                        </label>
                      </div>
                    ))}
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
                    value={propertyData.availableFrom}
                    onChange={(e) =>
                      setPropertyData({
                        ...propertyData,
                        availableFrom: e.target.value,
                      })
                    }
                    className="rounded-xl bg-white border-[#3A6EA5]/20"
                  />
                </div>

                <div className="bg-white rounded-2xl p-6">
                  <Label className="text-[#1a1a1a] mb-3 block">
                    Lease Duration
                  </Label>
                  <div className="space-y-3">
                    {[
                      { label: 'Day-based', value: 'day' },
                      { label: 'Month-based', value: 'month' },
                      { label: 'Year-based', value: 'year' },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center">
                        <Checkbox
                          id={option.value}
                          defaultChecked={option.value === 'month'}
                          className="border-[#3A6EA5] data-[state=checked]:bg-[#3A6EA5]"
                        />
                        <label
                          htmlFor={option.value}
                          className="ml-3 text-[#1a1a1a] cursor-pointer"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6">
                  <Label className="text-[#1a1a1a] mb-3 block">
                    Tenant Preferences
                  </Label>

                  {/* Input to add new preference */}
                  <div className="flex gap-2 mb-4">
                    <Input
                      value={newPreference}
                      onChange={(e) => setNewPreference(e.target.value)}
                      onKeyPress={(e) =>
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

                  {/* Default preferences */}
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
                    ))}

                    {/* Custom preferences */}
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

                  <p className="text-xs text-[#4a5565] mt-4">
                    Add custom preferences to attract the right tenants for your
                    property
                  </p>
                </div>
              </div>
            )}

            {/* Step 6: Legal Documents */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-6">
                  Legal Documents
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

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-2xl bg-white border-2 border-dashed border-[#3A6EA5]/30 flex items-center justify-center hover:border-[#3A6EA5] transition-colors cursor-pointer"
                    >
                      <Upload className="w-8 h-8 text-[#4a5565]" />
                    </div>
                  ))}
                </div>

                <div className="bg-[#9CBBDC]/20 rounded-2xl p-4">
                  <p className="text-sm text-[#1a1a1a]">
                    <strong>Tip:</strong> Uploading legal documents ensures
                    compliance and trustworthiness. Include lease agreements,
                    property deeds, and any other relevant documents.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-[#9CBBDC]/40 to-[#f5f7fa] rounded-2xl p-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-[#3A6EA5] flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-[#1a1a1a] mb-2">
                        Review Before Publishing
                      </h3>
                      <p className="text-sm text-[#4a5565]">
                        Your updated listing will be reviewed by our team within
                        24 hours. Once approved, the changes will be visible to
                        potential tenants.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-[#3A6EA5]/20">
              <Button
                onClick={handlePrev}
                disabled={currentStep === 1}
                variant="outline"
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
                  onClick={handleUpdate}
                  className="bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-xl shadow-lg shadow-[#3A6EA5]/30"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Update Property
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
