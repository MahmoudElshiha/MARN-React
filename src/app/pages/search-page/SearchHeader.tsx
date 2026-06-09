import { MapIcon, MapPin } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
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
  locationLabel?: string
  radiusKm?: number
}

export function SearchHeader({
  total,
  isLoading,
  sortIndex,
  onSortChange,
  showMap,
  onToggleMap,
  locationLabel,
  radiusKm,
}: SearchHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-4xl font-bold text-[#1a1a1a] mb-2">
          Find Your Perfect Property
        </h1>
        <p className="text-[#4a5565] flex items-center gap-2 flex-wrap">
          {isLoading ? 'Searching…' : `${total.toLocaleString()} properties found`}
          {locationLabel && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#3A6EA5]/10 rounded-full text-xs font-medium text-[#3A6EA5]">
              <MapPin className="w-3 h-3" />
              Near: {locationLabel} • {radiusKm}km
            </span>
          )}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Sort */}
        <Select
          value={String(sortIndex)}
          onValueChange={(v) => onSortChange(Number(v))}
        >
          <SelectTrigger className="w-[220px] rounded-xl bg-white border-[#3A6EA5]/20">
            <SelectValue placeholder="Sort by" />
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
          className={`rounded-xl ${
            showMap
              ? 'bg-[#3A6EA5] text-white'
              : 'border-[#3A6EA5]/20 hover:bg-[#3A6EA5]/10'
          }`}
          onClick={onToggleMap}
        >
          <MapIcon className="w-4 h-4 mr-2" />
          {showMap ? 'Hide Map' : 'Show Map'}
        </Button>
      </div>
    </div>
  )
}
