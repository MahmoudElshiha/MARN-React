import { MapIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
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
}

export function SearchHeader({
  total,
  isLoading,
  sortIndex,
  onSortChange,
  showMap,
  onToggleMap,
}: SearchHeaderProps) {
  const { t } = useTranslation('properties')

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-4xl font-bold text-[#1a1a1a] mb-2">
          {t('search.title')}
        </h1>
        <p className="text-[#4a5565]">
          {isLoading
            ? t('search.searching')
            : t('search.propertiesFound', { count: total.toLocaleString() })}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Sort */}
        <Select
          value={String(sortIndex)}
          onValueChange={(v) => onSortChange(Number(v))}
        >
          <SelectTrigger className="w-[220px] rounded-xl bg-white border-[#3A6EA5]/20">
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
          className={`rounded-xl ${
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
