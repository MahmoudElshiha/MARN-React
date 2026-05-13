import { useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'
import { cn } from './utils'

interface FileUploadProps {
  id: string
  value?: File | null
  onChange: (file: File) => void
  onClear?: () => void
  accept?: string
  className?: string
}

export function FileUpload({
  id,
  value,
  onChange,
  onClear,
  accept = 'image/*',
  className,
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    onChange(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    if (inputRef.current) inputRef.current.value = ''
    onClear?.()
  }

  return (
    <div className={cn('relative', className)}>
      <input
        ref={inputRef}
        type="file"
        id={id}
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
      <label
        htmlFor={id}
        className={cn(
          'flex flex-col items-center justify-center w-full h-40 rounded-xl border-2 border-dashed transition-colors cursor-pointer overflow-hidden',
          preview
            ? 'border-[#3A6EA5]/40'
            : 'bg-white border-[#3A6EA5]/20 hover:border-[#3A6EA5]/40',
        )}
      >
        {preview ? (
          <img
            src={preview}
            alt="Uploaded preview"
            className="w-full h-full object-contain"
          />
        ) : (
          <>
            <Upload className="w-8 h-8 text-[#4a5565] mb-2" />
            <span className="text-sm text-[#4a5565]">
              {value ? value.name : 'Click to upload'}
            </span>
          </>
        )}
      </label>

      {preview && (
        <button
          onClick={handleClear}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
          aria-label="Remove image"
        >
          <X className="w-3.5 h-3.5 text-white" />
        </button>
      )}
    </div>
  )
}
