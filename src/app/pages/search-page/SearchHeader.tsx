import { MapIcon, SlidersHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select'
import { SORT_OPTIONS } from './constants'

interface SearchHeaderProps {
  total: number
  isLoading: boolean
  sortIndex: number
  onSortChange: (index: number) => void
  showMap: boolean
  onToggleMap: () => void
  activeFilterCount: number
  onOpenMobileFilters: () => void
}

export function SearchHeader({
  total,
  isLoading,
  sortIndex,
  onSortChange,
  showMap,
  onToggleMap,
  activeFilterCount,
  onOpenMobileFilters,
}: SearchHeaderProps) {
  const { t } = useTranslation('properties')

  return (
    <div className="flex items-start justify-between mb-6 md:mb-8 gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-1 md:mb-2">
          {t('search.title')}
        </h1>
        <p className="text-sm text-[#4a5565]">
          {isLoading
            ? t('search.searching')
            : t('search.propertiesFound', { count: total.toLocaleString() })}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Mobile: Filters button */}
        <Button
          variant="outline"
          className="md:hidden rounded-xl border-[#3A6EA5]/20 hover:bg-[#3A6EA5]/10 relative"
          onClick={onOpenMobileFilters}
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          {t('search.filters')}
          {activeFilterCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-[#3A6EA5] text-white text-xs w-5 h-5 flex items-center justify-center p-0 rounded-full">
              {activeFilterCount}
            </Badge>
          )}
        </Button>

        {/* Sort */}
        <Select
          value={String(sortIndex)}
          onValueChange={(v) => onSortChange(Number(v))}
        >
          <SelectTrigger className="w-[140px] sm:w-[180px] md:w-[220px] rounded-xl bg-white border-[#3A6EA5]/20">
            <SelectValue placeholder={t('search.sortBy')} />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt, i) => (
              <SelectItem key={i} value={String(i)}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant={showMap ? 'default' : 'outline'}
          className={`hidden sm:flex rounded-xl ${
            showMap
              ? 'bg-[#3A6EA5] text-white'
              : 'border-[#3A6EA5]/20 hover:bg-[#3A6EA5]/10'
          }`}
          onClick={onToggleMap}
        >
          <MapIcon className="w-4 h-4 mr-2" />
          {showMap ? t('search.hideMap') : t('search.showMap')}
        </Button>
      </div>
    </div>
  )
}
