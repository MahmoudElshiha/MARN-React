import { Suspense, lazy, useState } from 'react'
import { MapIcon, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/app/components/ui/button'
import { Skeleton } from '@/app/components/ui/skeleton'
import { PropertyCard } from '@/app/components/PropertyCard'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/app/components/ui/sheet'
import { useProperties } from '@/hooks/useProperties'
import { useEnumOptions } from '@/hooks/useEnumOptions'
import { getImageUrl } from '@/constants/assets'

import { useSearchFilters } from './useSearchFilters'
import { SearchHeader } from './SearchHeader'
import { FilterSidebar } from './FilterSidebar'
import { Pagination } from './Pagination'
import { PAGE_SIZE } from './constants'

const PropertyMap = lazy(() =>
  import('./PropertyMap').then((m) => ({ default: m.PropertyMap }))
)

export function SearchPage() {
  const { t } = useTranslation('properties')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const search = useSearchFilters()
  const { options: cityOptions, loading: citiesLoading } = useEnumOptions('cities')
  const { options: governorateOptions, loading: governoratesLoading } = useEnumOptions('governorates')

  const { data, isLoading } = useProperties(search.filters)
  const paginated = data?.data
  const properties = paginated?.items ?? []
  const total = paginated?.totalCount ?? 0
  const totalPages = paginated?.totalPages ?? Math.max(1, Math.ceil(total / PAGE_SIZE))

  const filterSidebarProps = {
    keyword: search.keyword,
    onKeywordChange: search.setKeyword,
    onKeywordCommit: search.commitKeyword,
    city: search.city,
    onCityChange: search.setCity,
    cityOptions,
    citiesLoading,
    governorate: search.governorate,
    onGovernorateChange: search.setGovernorate,
    governorateOptions,
    governoratesLoading,
    propertyType: search.propertyType,
    onPropertyTypeChange: search.setPropertyType,
    rentalUnit: '' as const,
    onRentalUnitChange: () => {},
    isShared: search.isShared,
    onIsSharedChange: search.setIsShared,
    priceRange: search.priceRange,
    onPriceRangeChange: search.setPriceRange,
    selectedBeds: search.selectedBeds,
    onBedsChange: search.setSelectedBeds,
    selectedBaths: search.selectedBaths,
    onBathsChange: search.setSelectedBaths,
    minArea: search.minArea,
    onMinAreaChange: search.setMinArea,
    maxArea: search.maxArea,
    onMaxAreaChange: search.setMaxArea,
    minRating: search.minRating,
    onMinRatingChange: search.setMinRating,
    selectedAmenities: search.selectedAmenities,
    onToggleAmenity: search.toggleAmenity,
    amenitiesExpanded: search.amenitiesExpanded,
    onAmenitiesExpandedChange: search.setAmenitiesExpanded,
    visibleAmenities: search.visibleAmenities,
    activeFilterCount: search.activeFilterCount,
    onResetFilters: search.resetFilters,
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
        <SearchHeader
          total={total}
          isLoading={isLoading}
          sortIndex={search.sortIndex}
          onSortChange={search.setSortIndex}
          showMap={search.showMap}
          onToggleMap={() => search.setShowMap(!search.showMap)}
          activeFilterCount={search.activeFilterCount}
          onOpenMobileFilters={() => setMobileFiltersOpen(true)}
        />

        {/* Mobile filter Sheet */}
        <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
          <SheetContent side="left" className="w-[85vw] max-w-sm p-0 overflow-y-auto">
            <SheetHeader className="px-6 pt-6 pb-2">
              <SheetTitle className="text-lg font-semibold text-[#1a1a1a]">
                {t('search.filters')}
              </SheetTitle>
            </SheetHeader>
            <div className="px-4 pb-6">
              <FilterSidebar {...filterSidebarProps} />
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex gap-4 md:gap-8">
          {/* Desktop sidebar */}
          <div className="hidden md:block w-72 lg:w-80 flex-shrink-0">
            <FilterSidebar {...filterSidebarProps} />
          </div>

          <main className="flex-1 min-w-0">
            {search.showMap && (
              <Suspense
                fallback={
                  <div className="mb-8 bg-[#f5f7fa] rounded-3xl overflow-hidden shadow-lg shadow-black/5 h-[450px] flex items-center justify-center border border-[#3A6EA5]/10">
                    <div className="text-center text-[#4a5565]">
                      <Loader2 className="w-10 h-10 mx-auto mb-3 text-[#3A6EA5] animate-spin" />
                      <p className="text-sm font-medium">{t('search.loadingMap')}</p>
                    </div>
                  </div>
                }
              >
                <PropertyMap properties={properties} />
              </Suspense>
            )}

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <p className="text-lg font-semibold">{t('search.noResults')}</p>
                <p className="text-sm">{t('search.noResultsSubtitle')}</p>
                {search.activeFilterCount > 0 && (
                  <Button
                    variant="outline"
                    className="mt-6 rounded-xl border-[#3A6EA5] text-[#3A6EA5] hover:bg-[#3A6EA5] hover:text-white"
                    onClick={search.resetFilters}
                  >
                    {t('search.clearFilters')}
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
