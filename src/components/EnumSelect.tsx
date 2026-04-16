import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select'
import { useEnumOptions } from '@/hooks/useEnumOptions'
import type { EnumEndpoint } from '@/hooks/useEnumOptions'

interface EnumSelectProps {
  endpoint: EnumEndpoint
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function EnumSelect({
  endpoint,
  value,
  onChange,
  placeholder = 'Select...',
  className,
  disabled,
}: EnumSelectProps) {
  const { options, loading } = useEnumOptions(endpoint)

  // The profile API may return a name string (e.g. "Male") instead of an id
  // string. Resolve it to the matching id so Radix Select can highlight it.
  const resolvedValue =
    options.find(
      (o) => o.name.toLowerCase() === value?.toLowerCase(),
    )?.id !== undefined
      ? String(
          options.find((o) => o.name.toLowerCase() === value?.toLowerCase())!.id,
        )
      : value

  return (
    <Select
      value={resolvedValue}
      onValueChange={onChange}
      disabled={disabled || loading}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={loading ? 'Loading...' : placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.id} value={String(option.id)}>
            {option.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
