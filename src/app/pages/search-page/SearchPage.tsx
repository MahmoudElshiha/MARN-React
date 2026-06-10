import { useState, Suspense, lazy } from 'react'
import { MapIcon, Loader2, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { Skeleton } from '@/app/components/ui/skeleton'
import { PropertyCard } from '@/app/components/PropertyCard'
import { useProperties } from '@/hooks/useProperties'
import { useEnumOptions } from '@/hooks/useEnumOptions'
import { getImageUrl } from '@/constants/assets'

import { useSearchFilters } from './useSearchFilters'
import { SearchHeader } from './SearchHeader'
import { FilterSidebar } from './FilterSidebar'
import { MapSearchControls } from './MapSearchControls'
import { Pagination } from './Pagination'
import { PAGE_SIZE } from './constants'

const PropertyMap = lazy(() =>
  import('./PropertyMap').then((m) => ({ default: m.PropertyMap }))
)

export function SearchPage() {
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const search = useSearchFilters()
  const { options: cityOptions, loading: citiesLoading } = useEnumOptions('cities')
  const { options: governorateOptions, loading: governoratesLoading } = useEnumOptions('governorates')

  const { data, isLoading } = useProperties(search.filters)
  const paginated = data?.data
  const rawProperties = paginated?.items ?? []
  
  const propertiesMap = new Map()
  rawProperties.forEach(p => {
    if (!propertiesMap.has(p.id) || p.isSaved) {
      propertiesMap.set(p.id, p)
    }
  })
  const properties = Array.from(propertiesMap.values())
  
  const total = paginated?.totalCount ?? 0
  const totalPages = paginated?.totalPages ?? Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <div className="min-h-screen">
      <div className="max-w-[1440px] mx-auto px-8 py-8">
        <SearchHeader
          total={total}
          isLoading={isLoading}
          sortIndex={search.sortIndex}
          onSortChange={search.setSortIndex}
          showMap={search.showMap}
          onToggleMap={() => search.setShowMap(!search.showMap)}
          locationLabel={search.locationLabel}
          radiusKm={search.radiusKm}
        />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex justify-between items-center bg-white p-4 rounded-3xl shadow-sm border border-[#3A6EA5]/10">
            <span className="font-medium text-[#1a1a1a]">Filters & Options</span>
            <Button
              variant="outline"
              className="rounded-xl border-[#3A6EA5] text-[#3A6EA5] flex items-center gap-2"
              onClick={() => setShowMobileFilters(true)}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {search.activeFilterCount > 0 && (
                <Badge className="bg-[#3A6EA5] text-white text-xs px-2 py-0.5 rounded-full ml-1">
                  {search.activeFilterCount}
                </Badge>
              )}
            </Button>
          </div>

          <div 
            className={`fixed inset-0 z-50 bg-black/50 transition-opacity lg:hidden ${showMobileFilters ? 'opacity-100 visible' : 'opacity-0 invisible'}`} 
            onClick={() => setShowMobileFilters(false)} 
          />

          <div className={`fixed inset-y-0 left-0 z-50 w-80 lg:bg-transparent transform transition-transform duration-300 lg:relative lg:z-10 lg:block lg:w-80 lg:translate-x-0 ${showMobileFilters ? 'translate-x-0' : '-translate-x-full'}`}>
            <FilterSidebar
              onCloseMobile={() => setShowMobileFilters(false)}
              keyword={search.keyword}
              onKeywordChange={search.setKeyword}
              onKeywordCommit={search.commitKeyword}
              city={search.city}
              onCityChange={search.setCity}
              cityOptions={cityOptions}
              citiesLoading={citiesLoading}
              governorate={search.governorate}
              onGovernorateChange={search.setGovernorate}
              governorateOptions={governorateOptions}
              governoratesLoading={governoratesLoading}
              propertyType={search.propertyType}
              onPropertyTypeChange={search.setPropertyType}
              isShared={search.isShared}
              onIsSharedChange={search.setIsShared}
              priceRange={search.priceRange}
              onPriceRangeChange={search.setPriceRange}
              onPriceRangeCommit={search.setCommittedPriceRange}
              selectedBeds={search.selectedBeds}
              onBedsChange={search.setSelectedBeds}
              selectedBaths={search.selectedBaths}
              onBathsChange={search.setSelectedBaths}
              minArea={search.minArea}
              onMinAreaChange={search.setMinArea}
              maxArea={search.maxArea}
              onMaxAreaChange={search.setMaxArea}
              minRating={search.minRating}
              onMinRatingChange={search.setMinRating}
              selectedAmenities={search.selectedAmenities}
              onToggleAmenity={search.toggleAmenity}
              amenitiesExpanded={search.amenitiesExpanded}
              onAmenitiesExpandedChange={search.setAmenitiesExpanded}
              visibleAmenities={search.visibleAmenities}
              activeFilterCount={search.activeFilterCount}
              onResetFilters={search.resetFilters}
            />
          </div>

          <main className="flex-1 w-full lg:w-auto">
            {search.showMap && (
              <>
                <MapSearchControls
                  userLat={search.userLat}
                  userLng={search.userLng}
                  radiusKm={search.radiusKm}
                  onRadiusChange={search.setRadiusKm}
                  locationLabel={search.locationLabel}
                  onSetLocation={search.setUserLocation}
                  onClearLocation={search.clearUserLocation}
                />
                <Suspense
                  fallback={
                    <div className="mb-8 bg-[#f5f7fa] rounded-3xl overflow-hidden shadow-lg shadow-black/5 h-[450px] flex items-center justify-center border border-[#3A6EA5]/10">
                      <div className="text-center text-[#4a5565]">
                        <Loader2 className="w-10 h-10 mx-auto mb-3 text-[#3A6EA5] animate-spin" />
                        <p className="text-sm font-medium">Loading map…</p>
                      </div>
                    </div>
                  }
                >
                  <PropertyMap
                    properties={properties}
                    userLat={search.userLat}
                    userLng={search.userLng}
                  />
                </Suspense>
              </>
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
                {search.activeFilterCount > 0 && (
                  <Button
                    variant="outline"
                    className="mt-6 rounded-xl border-[#3A6EA5] text-[#3A6EA5] hover:bg-[#3A6EA5] hover:text-white"
                    onClick={search.resetFilters}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    id={String(property.id)}
                    image={getImageUrl(property.imagePath)}
                    title={property.title}
                    location={property.address}
                    price={property.price}
                    rating={property.averageRating}
                    reviews={property.ratings}
                    type={property.type}
                    beds={property.bedrooms}
                    baths={property.bathrooms}
                    guests={property.maxOccupants}
                    isSaved={property.isSaved}
                  />
                ))}
              </div>
            )}

            <Pagination
              page={search.page}
              totalPages={totalPages}
              onPageChange={search.setPage}
            />
          </main>
        </div>
      </div>
    </div>
  )
}
