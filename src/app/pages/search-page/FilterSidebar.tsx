import { SlidersHorizontal, Search, X, ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/app/components/ui/badge'
import { Label } from '@/app/components/ui/label'
import { Input } from '@/app/components/ui/input'
import { Checkbox } from '@/app/components/ui/checkbox'
import { Slider } from '@/app/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select'
import type { PropertyType, RentalUnit, Amenity } from '@/types/property'
import { AMENITY_OPTIONS, AMENITY_LABELS } from '@/types/property'
import { CITY_TO_GOVERNORATE } from '@/constants/locations'
import {
  PROPERTY_TYPES,
  RENTAL_UNITS,
  BED_OPTIONS,
  BATH_OPTIONS,
  SHARED_OPTIONS,
} from './constants'

interface FilterSidebarProps {
  keyword: string
  onKeywordChange: (v: string) => void
  onKeywordCommit: (v: string) => void

  city: string
  onCityChange: (v: string) => void
  cityOptions: { id: string | number; name: string; displayName?: string }[]
  citiesLoading: boolean

  governorate: string
  onGovernorateChange: (v: string) => void
  governorateOptions: { id: string | number; name: string; displayName?: string }[]
  governoratesLoading: boolean

  propertyType: PropertyType | ''
  onPropertyTypeChange: (v: PropertyType | '') => void

  rentalUnit: RentalUnit | ''
  onRentalUnitChange: (v: RentalUnit | '') => void

  isShared: string
  onIsSharedChange: (v: string) => void

  priceRange: number[]
  onPriceRangeChange: (v: number[]) => void

  selectedBeds: string
  onBedsChange: (v: string) => void

  selectedBaths: string
  onBathsChange: (v: string) => void

  minArea: string
  onMinAreaChange: (v: string) => void
  maxArea: string
  onMaxAreaChange: (v: string) => void

  minRating: string
  onMinRatingChange: (v: string) => void

  selectedAmenities: string[]
  onToggleAmenity: (v: string) => void
  amenitiesExpanded: boolean
  onAmenitiesExpandedChange: (v: boolean) => void
  visibleAmenities: readonly string[]

  activeFilterCount: number
  onResetFilters: () => void
}

export function FilterSidebar({
  keyword,
  onKeywordChange,
  onKeywordCommit,
  city,
  onCityChange,
  cityOptions,
  citiesLoading,
  governorate,
  onGovernorateChange,
  governorateOptions,
  governoratesLoading,
  propertyType,
  onPropertyTypeChange,
  rentalUnit,
  onRentalUnitChange,
  isShared,
  onIsSharedChange,
  priceRange,
  onPriceRangeChange,
  selectedBeds,
  onBedsChange,
  selectedBaths,
  onBathsChange,
  minArea,
  onMinAreaChange,
  maxArea,
  onMaxAreaChange,
  minRating,
  onMinRatingChange,
  selectedAmenities,
  onToggleAmenity,
  amenitiesExpanded,
  onAmenitiesExpandedChange,
  visibleAmenities,
  activeFilterCount,
  onResetFilters,
}: FilterSidebarProps) {
  const { t } = useTranslation('properties')

  const filteredCityOptions = governorate
    ? cityOptions.filter((c) => CITY_TO_GOVERNORATE[c.name] === governorate)
    : cityOptions

  return (
    <aside className="w-80 flex-shrink-0">
      <div className="sticky top-24 bg-white rounded-3xl p-6 shadow-lg shadow-black/5 border border-[#3A6EA5]/10 space-y-7 max-h-[calc(100vh-7rem)] overflow-y-auto">
        {/* Sidebar header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-[#3A6EA5]" />
            <h2 className="text-xl font-semibold text-[#1a1a1a]">{t('search.filters')}</h2>
            {activeFilterCount > 0 && (
              <Badge className="bg-[#3A6EA5] text-white text-xs px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </Badge>
            )}
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={onResetFilters}
              className="text-xs text-[#3A6EA5] hover:underline flex items-center gap-1"
            >
              <X className="w-3 h-3" /> {t('search.clearAll')}
            </button>
          )}
        </div>

        {/* ── Keyword search ── */}
        <div>
          <Label className="text-[#1a1a1a] mb-2 block">{t('search.keyword')}</Label>
          <div className="relative">
            <Input
              placeholder={t('search.keywordPlaceholder')}
              value={keyword}
              onChange={(e) => onKeywordChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onKeywordCommit(keyword)
                }
              }}
              className="rounded-xl pr-10 border-[#3A6EA5]/20"
            />
            <button
              onClick={() => onKeywordCommit(keyword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3A6EA5] hover:text-[#2a5a8a]"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Governorate ── */}
        <div>
          <Label className="text-[#1a1a1a] mb-2 block">{t('search.governorate')}</Label>
          <Select
            value={governorate}
            onValueChange={(v) => onGovernorateChange(v === '__all' ? '' : v)}
          >
            <SelectTrigger className="rounded-xl bg-[#f5f7fa] border-[#3A6EA5]/20">
              <SelectValue
                placeholder={governoratesLoading ? t('search.loading') : t('search.anyGovernorate')}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all">{t('search.anyGovernorate')}</SelectItem>
              {governorateOptions.map((o) => (
                <SelectItem key={o.id} value={o.name}>
                  {o.displayName || o.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ── City ── */}
        <div>
          <Label className="text-[#1a1a1a] mb-2 block">{t('search.city')}</Label>
          <Select
            value={city}
            onValueChange={(v) => onCityChange(v === '__all' ? '' : v)}
          >
            <SelectTrigger className="rounded-xl bg-[#f5f7fa] border-[#3A6EA5]/20">
              <SelectValue placeholder={citiesLoading ? t('search.loading') : t('search.anyCity')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all">{t('search.anyCity')}</SelectItem>
              {filteredCityOptions.map((o) => (
                <SelectItem key={o.id} value={o.name}>
                  {o.displayName || o.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ── Property Type ── */}
        <div>
          <Label className="text-[#1a1a1a] mb-2 block">{t('search.propertyType')}</Label>
          <div className="flex flex-wrap gap-2">
            {PROPERTY_TYPES.map((tp) => (
              <button
                key={tp}
                onClick={() => onPropertyTypeChange(propertyType === tp ? '' : tp)}
                className={`px-3 py-1.5 rounded-xl text-sm transition-colors ${
                  propertyType === tp
                    ? 'bg-[#3A6EA5] text-white'
                    : 'bg-[#f5f7fa] text-[#1a1a1a] hover:bg-[#3A6EA5]/10'
                }`}
              >
                {tp === 'SharedRoom' ? t('search.sharedRoom') : tp}
              </button>
            ))}
          </div>
        </div>

        {/* ── Rental Unit ── */}
        <div>
          <Label className="text-[#1a1a1a] mb-2 block">{t('search.rentalDuration')}</Label>
          <Select
            value={rentalUnit}
            onValueChange={(v) =>
              onRentalUnitChange(v === '__all' ? '' : (v as RentalUnit))
            }
          >
            <SelectTrigger className="rounded-xl bg-[#f5f7fa] border-[#3A6EA5]/20">
              <SelectValue placeholder={t('search.anyDuration')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all">{t('search.anyDuration')}</SelectItem>
              {RENTAL_UNITS.map((u) => (
                <SelectItem key={u.value} value={u.value}>
                  {u.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ── Shared / Private ── */}
        <div>
          <Label className="text-[#1a1a1a] mb-2 block">{t('search.sharing')}</Label>
          <div className="flex gap-2">
            {SHARED_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onIsSharedChange(isShared === opt.value ? '' : opt.value)}
                className={`flex-1 py-2 rounded-xl text-sm transition-colors ${
                  isShared === opt.value
                    ? 'bg-[#3A6EA5] text-white'
                    : 'bg-[#f5f7fa] text-[#1a1a1a] hover:bg-[#3A6EA5]/10'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Price Range ── */}
        <div>
          <Label className="text-[#1a1a1a] mb-2 block">
            {rentalUnit
              ? t('search.priceRangeWithUnit', { unit: rentalUnit })
              : t('search.priceRange')}
          </Label>
          <Slider
            min={500}
            max={50000}
            step={100}
            value={priceRange}
            onValueChange={onPriceRangeChange}
            className="mb-3"
          />
          <div className="flex justify-between text-sm text-[#6a7282]">
            <span>{priceRange[0].toLocaleString()} EGP</span>
            <span>{priceRange[1].toLocaleString()} EGP</span>
          </div>
        </div>

        {/* ── Bedrooms ── */}
        <div>
          <Label className="text-[#1a1a1a] mb-2 block">{t('search.minBedrooms')}</Label>
          <div className="flex gap-2">
            {BED_OPTIONS.map((bed) => (
              <button
                key={bed}
                onClick={() => onBedsChange(bed)}
                className={`flex-1 py-2 rounded-xl text-sm transition-colors ${
                  selectedBeds === bed
                    ? 'bg-[#3A6EA5] text-white'
                    : 'bg-[#f5f7fa] text-[#1a1a1a] hover:bg-[#3A6EA5]/10'
                }`}
              >
                {bed}
              </button>
            ))}
          </div>
        </div>

        {/* ── Bathrooms ── */}
        <div>
          <Label className="text-[#1a1a1a] mb-2 block">{t('search.minBathrooms')}</Label>
          <div className="flex gap-2">
            {BATH_OPTIONS.map((bath) => (
              <button
                key={bath}
                onClick={() => onBathsChange(bath)}
                className={`flex-1 py-2 rounded-xl text-sm transition-colors ${
                  selectedBaths === bath
                    ? 'bg-[#3A6EA5] text-white'
                    : 'bg-[#f5f7fa] text-[#1a1a1a] hover:bg-[#3A6EA5]/10'
                }`}
              >
                {bath}
              </button>
            ))}
          </div>
        </div>

        {/* ── Area ── */}
        <div>
          <Label className="text-[#1a1a1a] mb-2 block">{t('search.area')}</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={minArea}
              onChange={(e) => onMinAreaChange(e.target.value)}
              className="rounded-xl border-[#3A6EA5]/20 text-sm"
            />
            <Input
              type="number"
              placeholder="Max"
              value={maxArea}
              onChange={(e) => onMaxAreaChange(e.target.value)}
              className="rounded-xl border-[#3A6EA5]/20 text-sm"
            />
          </div>
        </div>

        {/* ── Min Rating ── */}
        <div>
          <Label className="text-[#1a1a1a] mb-2 block">{t('search.minRating')}</Label>
          <div className="flex gap-2">
            {['Any', '3', '4', '4.5'].map((r) => (
              <button
                key={r}
                onClick={() => onMinRatingChange(r === 'Any' ? '' : r)}
                className={`flex-1 py-2 rounded-xl text-sm transition-colors ${
                  (r === 'Any' && !minRating) || minRating === r
                    ? 'bg-[#3A6EA5] text-white'
                    : 'bg-[#f5f7fa] text-[#1a1a1a] hover:bg-[#3A6EA5]/10'
                }`}
              >
                {r === 'Any' ? t('search.any') : `${r}★`}
              </button>
            ))}
          </div>
        </div>

        {/* ── Amenities ── */}
        <div>
          <Label className="text-[#1a1a1a] mb-2 block">{t('search.amenities')}</Label>
          <div className="space-y-2">
            {visibleAmenities.map((amenity) => (
              <div key={amenity} className="flex items-center">
                <Checkbox
                  id={`amenity-${amenity}`}
                  checked={selectedAmenities.includes(amenity)}
                  onCheckedChange={() => onToggleAmenity(amenity)}
                  className="border-[#3A6EA5] data-[state=checked]:bg-[#3A6EA5]"
                />
                <label
                  htmlFor={`amenity-${amenity}`}
                  className="ml-3 text-sm text-[#1a1a1a] cursor-pointer"
                >
                  {AMENITY_LABELS[amenity as Amenity]}
                </label>
              </div>
            ))}
          </div>
          {AMENITY_OPTIONS.length > 6 && (
            <button
              onClick={() => onAmenitiesExpandedChange(!amenitiesExpanded)}
              className="mt-3 text-xs text-[#3A6EA5] hover:underline flex items-center gap-1"
            >
              <ChevronDown
                className={`w-3 h-3 transition-transform ${
                  amenitiesExpanded ? 'rotate-180' : ''
                }`}
              />
              {amenitiesExpanded
                ? t('search.showLess')
                : t('search.showAll', { count: AMENITY_OPTIONS.length })}
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}
