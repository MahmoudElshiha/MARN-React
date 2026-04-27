import { useState } from 'react'
import { PropertyCard } from '../components/PropertyCard'
import { Slider } from '../components/ui/slider'
import { Checkbox } from '../components/ui/checkbox'
import { Label } from '../components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import { Skeleton } from '../components/ui/skeleton'
import { SlidersHorizontal, MapIcon } from 'lucide-react'
import { Button } from '../components/ui/button'
import { useProperties } from '@/hooks/useProperties'
import type { PropertyFilters } from '@/types/property'

const AMENITY_OPTIONS = [
  'WiFi',
  'Parking',
  'Air Conditioning',
  'Heating',
  'Washer/Dryer',
  'Dishwasher',
  'Gym',
  'Pool',
  'Pet Friendly',
  'Balcony',
]

const PAGE_SIZE = 9

export function SearchPage() {
  const [priceRange, setPriceRange] = useState([500, 10000])
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [showMap, setShowMap] = useState(false)
  const [rentalDuration, setRentalDuration] = useState<string>('')
  const [selectedBeds, setSelectedBeds] = useState<string>('Any')
  const [selectedBaths, setSelectedBaths] = useState<string>('Any')
  const [page, setPage] = useState(1)

  const filters: PropertyFilters = {
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    amenities: selectedAmenities.length ? selectedAmenities : undefined,
    beds:
      selectedBeds !== 'Any' ? parseInt(selectedBeds.replace('+', '')) : undefined,
    baths:
      selectedBaths !== 'Any'
        ? parseInt(selectedBaths.replace('+', ''))
        : undefined,
    page,
    pageSize: PAGE_SIZE,
  }

  const { data, isLoading } = useProperties(filters)

  const properties = data?.data ?? []
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity],
    )
    setPage(1)
  }

  const resetFilters = () => {
    setPriceRange([500, 10000])
    setSelectedAmenities([])
    setRentalDuration('')
    setSelectedBeds('Any')
    setSelectedBaths('Any')
    setPage(1)
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-[1440px] mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#1a1a1a] mb-2">
              Find Your Perfect Property
            </h1>
            <p className="text-[#4a5565]">
              {isLoading ? 'Loading…' : `${total} properties found`}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Select defaultValue="recommended">
              <SelectTrigger className="w-[200px] rounded-xl bg-white border-[#3A6EA5]/20">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant={showMap ? 'default' : 'outline'}
              className={`rounded-xl ${
                showMap
                  ? 'bg-[#3A6EA5] text-white'
                  : 'border-[#3A6EA5]/20 hover:bg-[#3A6EA5]/10'
              }`}
              onClick={() => setShowMap(!showMap)}
            >
              <MapIcon className="w-4 h-4 mr-2" />
              {showMap ? 'Hide Map' : 'Show Map'}
            </Button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <aside className="w-80 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-3xl p-6 shadow-lg shadow-black/5 border border-[#3A6EA5]/10">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="w-5 h-5 text-[#3A6EA5]" />
                <h2 className="text-xl font-semibold text-[#1a1a1a]">
                  Filters
                </h2>
              </div>

              {/* Rental Duration */}
              <div className="mb-8">
                <Label className="text-[#1a1a1a] mb-3 block">
                  Rental Duration
                </Label>
                <Select value={rentalDuration} onValueChange={setRentalDuration}>
                  <SelectTrigger className="rounded-xl bg-[#f5f7fa] border-[#3A6EA5]/20">
                    <SelectValue placeholder="Select rental duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Day-based</SelectItem>
                    <SelectItem value="month">Month-based</SelectItem>
                    <SelectItem value="year">Year-based</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <Label
                  className={`mb-3 block ${!rentalDuration ? 'text-[#6a7282]' : 'text-[#1a1a1a]'}`}
                >
                  Price Range
                </Label>
                {!rentalDuration ? (
                  <div className="p-4 bg-[#f5f7fa] rounded-xl border-2 border-dashed border-[#3A6EA5]/20 text-center">
                    <p className="text-sm text-[#6a7282]">
                      Please set Rental Duration first
                    </p>
                  </div>
                ) : (
                  <div className="mb-4">
                    <Slider
                      min={500}
                      max={10000}
                      step={100}
                      value={priceRange}
                      onValueChange={(v) => { setPriceRange(v); setPage(1) }}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-[#6a7282]">
                      <span>{priceRange[0].toLocaleString()} EGP</span>
                      <span>{priceRange[1].toLocaleString()} EGP</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Property Type */}
              <div className="mb-8">
                <Label className="text-[#1a1a1a] mb-3 block">
                  Property Type
                </Label>
                <div className="space-y-3">
                  {['Bed', 'Room', 'Apartment', 'House'].map((type) => (
                    <div key={type} className="flex items-center">
                      <Checkbox
                        id={type}
                        className="border-[#3A6EA5] data-[state=checked]:bg-[#3A6EA5]"
                      />
                      <label
                        htmlFor={type}
                        className="ml-3 text-[#1a1a1a] cursor-pointer"
                      >
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bedrooms */}
              <div className="mb-8">
                <Label className="text-[#1a1a1a] mb-3 block">Bedrooms</Label>
                <div className="flex gap-2">
                  {['Any', '1', '2', '3', '4+'].map((bed) => (
                    <button
                      key={bed}
                      onClick={() => { setSelectedBeds(bed); setPage(1) }}
                      className={`flex-1 py-2 rounded-xl transition-colors text-sm ${
                        selectedBeds === bed
                          ? 'bg-[#3A6EA5] text-white'
                          : 'bg-[#f5f7fa] text-[#1a1a1a] hover:bg-[#3A6EA5] hover:text-white'
                      }`}
                    >
                      {bed}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bathrooms */}
              <div className="mb-8">
                <Label className="text-[#1a1a1a] mb-3 block">Bathrooms</Label>
                <div className="flex gap-2">
                  {['Any', '1', '2', '3+'].map((bath) => (
                    <button
                      key={bath}
                      onClick={() => { setSelectedBaths(bath); setPage(1) }}
                      className={`flex-1 py-2 rounded-xl transition-colors text-sm ${
                        selectedBaths === bath
                          ? 'bg-[#3A6EA5] text-white'
                          : 'bg-[#f5f7fa] text-[#1a1a1a] hover:bg-[#3A6EA5] hover:text-white'
                      }`}
                    >
                      {bath}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-8">
                <Label className="text-[#1a1a1a] mb-3 block">Amenities</Label>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {AMENITY_OPTIONS.map((amenity) => (
                    <div key={amenity} className="flex items-center">
                      <Checkbox
                        id={amenity}
                        checked={selectedAmenities.includes(amenity)}
                        onCheckedChange={() => toggleAmenity(amenity)}
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

              <Button
                variant="outline"
                className="w-full rounded-xl border-[#3A6EA5] text-[#3A6EA5] hover:bg-[#3A6EA5] hover:text-white"
                onClick={resetFilters}
              >
                Reset Filters
              </Button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {showMap && (
              <div className="mb-8 bg-[#f5f7fa] rounded-3xl overflow-hidden shadow-lg shadow-black/5 h-[400px] flex items-center justify-center border border-[#3A6EA5]/10">
                <div className="text-center text-[#4a5565]">
                  <MapIcon className="w-16 h-16 mx-auto mb-4 text-[#3A6EA5]" />
                  <p className="text-lg">Interactive Map View</p>
                  <p className="text-sm">Map integration would appear here</p>
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <div key={i} className="bg-white rounded-3xl overflow-hidden">
                    <Skeleton className="aspect-[4/3] w-full" />
                    <div className="p-5 space-y-3">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-6 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-[#4a5565]">
                <MapIcon className="w-16 h-16 mb-4 text-[#9CBBDC]" />
                <p className="text-lg font-semibold">No properties found</p>
                <p className="text-sm">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    id={property.id}
                    image={property.image ?? property.images?.[0] ?? ''}
                    title={property.title}
                    location={property.location}
                    price={property.price}
                    rating={property.rating ?? 0}
                    reviews={property.reviews ?? 0}
                    type={property.type}
                    beds={property.beds}
                    baths={property.baths}
                    guests={property.guests}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-12 h-12 rounded-xl transition-all ${
                      p === page
                        ? 'bg-[#3A6EA5] text-white shadow-lg shadow-[#3A6EA5]/30'
                        : 'bg-[#f5f7fa] text-[#1a1a1a] hover:bg-[#9CBBDC] hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
