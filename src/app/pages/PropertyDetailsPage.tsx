import { useState } from 'react'
import { Link, useParams } from 'react-router'
import {
  Star,
  MapPin,
  Share2,
  Heart,
  Wifi,
  Car,
  Wind,
  Flame,
  Shirt,
  Dumbbell,
  Waves,
  Dog,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
  MessageSquare,
  Check,
  Tv,
  Utensils,
  Maximize,
  ShieldCheck,
  Thermometer,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Calendar as CalendarComponent } from '../components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../components/ui/popover'
import { Skeleton } from '../components/ui/skeleton'
import { format } from 'date-fns'
import { ImageWithFallback } from '../components/figma/ImageWithFallback'
import { useProperty } from '@/hooks/useProperty'
import { getImageUrl } from '@/constants/assets'

const AMENITY_ICONS: Record<string, React.ElementType> = {
  WiFi: Wifi,
  Parking: Car,
  'Air Conditioning': Wind,
  Heating: Flame,
  'Washer/Dryer': Shirt,
  Washer: Shirt,
  Dryer: Wind,
  Gym: Dumbbell,
  Pool: Waves,
  'Pet Friendly': Dog,
  TV: Tv,
  Kitchen: Utensils,
  Dishwasher: Utensils,
  Microwave: Utensils,
  Refrigerator: Thermometer,
  Balcony: Maximize,
  Elevator: Maximize,
  'Security System': ShieldCheck,
  'Storage Space': Maximize,
}

export function PropertyDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, isError } = useProperty(id)

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()

  const property = data?.data
  const images: string[] = (() => {
    const p = property as any
    // API returns a `media` array of { path, isPrimary } objects
    if (p?.media?.length) {
      return p.media.map((m: any) => m.path ?? m.url ?? '')
        .filter(Boolean) as string[]
    }
    if (p?.images?.length) return p.images as string[]
    if (p?.imagePath) return [p.imagePath as string]
    if (p?.image) return [p.image as string]
    return []
  })()

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % Math.max(images.length, 1))
  const prevImage = () =>
    setCurrentImageIndex(
      (prev) =>
        (prev - 1 + Math.max(images.length, 1)) % Math.max(images.length, 1),
    )

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#4a5565]">
        Property not found.{' '}
        <Link to="/search" className="text-[#3A6EA5] hover:underline ml-1">
          Back to search
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-[1440px] mx-auto px-8 py-8">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/search"
            className="flex items-center gap-2 text-[#4a5565] hover:text-[#3A6EA5] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Search
          </Link>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl border-[#3A6EA5]/20 hover:bg-[#9CBBDC]/20"
            >
              <Share2 className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl border-[#3A6EA5]/20 hover:bg-[#9CBBDC]/20"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart
                className={`w-5 h-5 ${isFavorite ? 'fill-[#3A6EA5] text-[#3A6EA5]' : ''}`}
              />
            </Button>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-8">
          <div className="relative rounded-3xl overflow-hidden bg-[#f5f7fa] shadow-2xl shadow-[#3A6EA5]/20">
            <div className="aspect-[21/9] relative">
              {isLoading ? (
                <Skeleton className="w-full h-full" />
              ) : images.length > 0 ? (
                <ImageWithFallback
                  src={getImageUrl(images[currentImageIndex])}
                  alt="Property"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#9CBBDC]/20 flex items-center justify-center text-[#4a5565]">
                  No images available
                </div>
              )}

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all"
                  >
                    <ChevronLeft className="w-6 h-6 text-[#1a1a1a]" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all"
                  >
                    <ChevronRight className="w-6 h-6 text-[#1a1a1a]" />
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2 rounded-full transition-all ${index === currentImageIndex
                        ? 'bg-white w-8'
                        : 'bg-white/50 hover:bg-white/75 w-2'
                      }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Title & Rating */}
            <div className="mb-6">
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-10 w-3/4" />
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-5 w-1/3" />
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h1 className="text-4xl font-bold text-[#1a1a1a] mb-2">
                        {property?.title}
                      </h1>
                      <div className="flex items-center gap-2 text-[#4a5565]">
                        <MapPin className="w-5 h-5" />
                        <span>{property?.address ?? property?.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-wrap">
                    {property?.rating !== undefined && (
                      <>
                        <div className="flex items-center gap-1">
                          <Star className="w-5 h-5 fill-[#3A6EA5] text-[#3A6EA5]" />
                          <span className="font-semibold text-[#1a1a1a]">
                            {property.rating}
                          </span>
                          {property.reviews !== undefined && (
                            <span className="text-[#4a5565]">
                              ({property.reviews} reviews)
                            </span>
                          )}
                        </div>
                        <span className="text-[#4a5565]">•</span>
                      </>
                    )}
                    <span className="px-3 py-1 bg-[#9CBBDC]/20 rounded-full text-sm text-[#1a1a1a]">
                      {property?.type}
                    </span>
                    <span className="text-[#4a5565]">•</span>
                    <span className="text-[#1a1a1a]">
                      {(property as any)?.bedrooms ?? property?.beds} {((property as any)?.bedrooms ?? property?.beds) === 1 ? 'bed' : 'beds'} • {(property as any)?.bathrooms ?? property?.baths} {((property as any)?.bathrooms ?? property?.baths) === 1 ? 'bath' : 'baths'}
                      {property?.area ? ` • ${property.area} sq ft` : ''}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Description */}
            {isLoading ? (
              <div className="mb-8 p-6 bg-[#f5f7fa] rounded-3xl space-y-3">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            ) : property?.description ? (
              <div className="mb-8 p-6 bg-[#f5f7fa] rounded-3xl">
                <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-4">
                  About This Property
                </h2>
                <p className="text-[#1a1a1a] leading-relaxed">
                  {property.description}
                </p>
              </div>
            ) : null}

            {/* Amenities */}
            {!isLoading && property?.amenities?.length ? (
              <div className="mb-8 p-6 bg-[#f5f7fa] rounded-3xl">
                <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-6">
                  Amenities
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {property.amenities.map((amenityItem: any) => {
                    const name = typeof amenityItem === 'string'
                      ? amenityItem
                      : (amenityItem.amenityDisplayName || amenityItem.amenity)
                    const key = typeof amenityItem === 'string' ? amenityItem : (amenityItem.id || name)
                    const Icon = AMENITY_ICONS[name]
                    return (
                      <div
                        key={key}
                        className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl"
                      >
                        <div className="w-12 h-12 rounded-xl bg-[#9CBBDC]/20 flex items-center justify-center">
                          {Icon ? (
                            <Icon className="w-6 h-6 text-[#3A6EA5]" />
                          ) : (
                            <Check className="w-6 h-6 text-[#3A6EA5]" />
                          )}
                        </div>
                        <span className="text-sm text-[#1a1a1a] text-center">
                          {name}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : null}

            {/* Owner Profile */}
            {!isLoading && property?.ownerName && (
              <div className="p-6 bg-[#f5f7fa] rounded-3xl mb-8">
                <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-6">
                  Hosted By
                </h2>
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="w-16 h-16">
                    {property.ownerAvatarUrl && (
                      <AvatarImage src={property.ownerAvatarUrl} />
                    )}
                    <AvatarFallback>
                      {property.ownerName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-[#1a1a1a]">
                      {property.ownerName}
                    </h3>
                  </div>
                  <Button
                    variant="outline"
                    className="rounded-xl border-[#3A6EA5] text-[#3A6EA5] hover:bg-[#3A6EA5] hover:text-white"
                    asChild
                  >
                    <Link to="/messages">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-[#f5f7fa] rounded-3xl p-6 shadow-2xl shadow-[#3A6EA5]/20">
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-2/3" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : (
                  <>
                    <div className="mb-6">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-4xl font-bold text-[#3A6EA5]">
                          {property?.price?.toLocaleString()} EGP
                        </span>
                        <span className="text-[#4a5565]">/ month</span>
                      </div>
                      {property?.rating !== undefined && (
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="w-4 h-4 fill-[#3A6EA5] text-[#3A6EA5]" />
                          <span className="text-[#1a1a1a]">
                            {property.rating}{' '}
                            {property.reviews !== undefined &&
                              `(${property.reviews} reviews)`}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Date Selectors */}
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="text-sm text-[#1a1a1a] mb-2 block">
                          Move-in Date
                        </label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left rounded-xl border-[#3A6EA5]/20 hover:bg-white"
                            >
                              <Calendar className="mr-2 h-4 w-4 text-[#3A6EA5]" />
                              {checkIn ? format(checkIn, 'PPP') : 'Select date'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={checkIn}
                              onSelect={setCheckIn}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <label className="text-sm text-[#1a1a1a] mb-2 block">
                          Move-out Date
                        </label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left rounded-xl border-[#3A6EA5]/20 hover:bg-white"
                            >
                              <Calendar className="mr-2 h-4 w-4 text-[#3A6EA5]" />
                              {checkOut
                                ? format(checkOut, 'PPP')
                                : 'Select date'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={checkOut}
                              onSelect={setCheckOut}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    {/* Price Summary */}
                    <div className="space-y-3 mb-6 p-4 bg-white rounded-2xl">
                      <div className="flex justify-between text-[#1a1a1a]">
                        <span>Monthly rent</span>
                        <span>{property?.price?.toLocaleString()} EGP</span>
                      </div>
                      <div className="flex justify-between text-[#1a1a1a]">
                        <span>Security deposit</span>
                        <span>{property?.price?.toLocaleString()} EGP</span>
                      </div>
                      <div className="flex justify-between text-[#1a1a1a]">
                        <span>Service fee</span>
                        <span>
                          {Math.round(
                            (property?.price ?? 0) * 0.05,
                          ).toLocaleString()}{' '}
                          EGP
                        </span>
                      </div>
                      <div className="border-t border-[#3A6EA5]/20 pt-3 flex justify-between font-semibold text-[#1a1a1a]">
                        <span>Total (First Month)</span>
                        <span className="text-[#3A6EA5]">
                          {Math.round(
                            (property?.price ?? 0) * 2.05,
                          ).toLocaleString()}{' '}
                          EGP
                        </span>
                      </div>
                    </div>

                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-xl shadow-lg shadow-[#3A6EA5]/30 mb-3"
                    >
                      Book Now
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full rounded-xl border-[#3A6EA5] text-[#3A6EA5] hover:bg-[#3A6EA5] hover:text-white"
                    >
                      Schedule Tour
                    </Button>

                    <p className="text-xs text-center text-[#4a5565] mt-4">
                      You won't be charged yet
                    </p>
                  </>
                )}
              </div>

              {/* Additional Info */}
              <div className="mt-6 p-4 bg-[#9CBBDC]/20 rounded-2xl">
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-[#3A6EA5] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-[#1a1a1a] mb-1">
                      Looking for Roommates?
                    </h4>
                    <p className="text-sm text-[#4a5565]">
                      Use our roommate matching feature to find compatible
                      housemates
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
