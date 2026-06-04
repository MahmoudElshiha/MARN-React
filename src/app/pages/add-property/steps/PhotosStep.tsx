import { Upload, X } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { PropertyFormData, FileData, TouchedFields } from '../types'
import { useRef } from 'react'

interface PhotosStepProps {
  formData: PropertyFormData
  updateFormData: (updates: Partial<PropertyFormData>) => void
  touched?: TouchedFields
}

export function PhotosStep({ formData, updateFormData, touched }: PhotosStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return

    const files = Array.from(e.target.files)
    const newPhotos: FileData[] = []
    
    let processed = 0
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          newPhotos.push({
            name: file.name,
            type: file.type,
            size: file.size,
            dataUrl: event.target.result as string,
            file
          })
        }
        processed++
        if (processed === files.length) {
          updateFormData({ photos: [...(formData.photos || []), ...newPhotos] })
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removePhoto = (index: number) => {
    const updated = [...(formData.photos || [])]
    updated.splice(index, 1)
    updateFormData({ photos: updated })
  }

  const photosList = formData.photos || []
  const isError = touched?.photos && photosList.length === 0
  const uploadBoxClass = `border-2 border-dashed ${isError ? 'border-red-500 bg-red-50' : 'border-[#3A6EA5]/30'} rounded-2xl p-12 text-center hover:border-[#3A6EA5] transition-colors cursor-pointer`

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-6">
        Upload Photos <span className="text-red-500">*</span>
      </h2>

      <div className="bg-white rounded-2xl p-8">
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={uploadBoxClass}
        >
          <Upload className="w-16 h-16 mx-auto mb-4 text-[#3A6EA5]" />
          <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">
            Drag & drop photos here
          </h3>
          <p className="text-[#4a5565] mb-4">
            or click to browse from your computer
          </p>
          <Button 
            type="button" 
            className="bg-[#3A6EA5] hover:bg-[#2a5a8a] text-white rounded-xl"
            onClick={(e) => {
              e.stopPropagation()
              fileInputRef.current?.click()
            }}
          >
            Choose Files
          </Button>
        </div>
      </div>

      {photosList.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {photosList.map((photo, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-2xl bg-white border border-[#3A6EA5]/20 overflow-hidden group"
            >
              <img 
                src={photo.dataUrl} 
                alt={photo.name} 
                className="w-full h-full object-cover" 
              />
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {photosList.length === 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-50">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="aspect-square rounded-2xl bg-white border-2 border-dashed border-[#3A6EA5]/30 flex items-center justify-center pointer-events-none"
            >
              <Upload className="w-8 h-8 text-[#4a5565]" />
            </div>
          ))}
        </div>
      )}

      <div className="bg-[#9CBBDC]/20 rounded-2xl p-4">
        <p className="text-sm text-[#1a1a1a]">
          <strong>Tip:</strong> Properties with 5+ high-quality photos
          get 40% more views. Include photos of living areas,
          bedrooms, kitchen, bathroom, and exterior.
        </p>
      </div>
    </div>
  )
}
