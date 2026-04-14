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
} from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar'
import { Calendar as CalendarComponent } from '@/app/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover'
import { format } from 'date-fns'
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback'
import { useProperty } from '../hooks/useProperty'

const AMENITIES_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  WiFi: Wifi,
  Parking: Car,
  'Air Conditioning': Wind,
  Heating: Flame,
  'Washer/Dryer': Shirt,
  Gym: Dumbbell,
  Pool: Waves,
  'Pet Friendly': Dog,
}

export function PropertyDetailView() {
  const { id = '1' } = useParams<{ id: string }>()
  const { property, loading, error } = useProperty(id)

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-[#3A6EA5] border-t-transparent animate-spin" />
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error?.message ?? 'Property not found'}
      </div>
    )
  }

  const images = property.images.length ? property.images : [property.image]

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % images.length)

  const prevImage = () =>
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)

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
              <ImageWithFallback
                src={images[currentImageIndex]}
                alt="Property"
                className="w-full h-full object-cover"
              />
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
            </div>

            {/* Thumbnails */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex
                      ? 'bg-white w-8'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Title & Rating */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h1 className="text-4xl font-bold text-[#1a1a1a] mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center gap-2 text-[#4a5565]">
                    <MapPin className="w-5 h-5" />
                    <span>{property.address}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-[#3A6EA5] text-[#3A6EA5]" />
                  <span className="font-semibold text-[#1a1a1a]">
                    {property.rating}
                  </span>
                  <span className="text-[#4a5565]">
                    ({property.reviews} reviews)
                  </span>
                </div>
                <span className="text-[#4a5565]">•</span>
                <span className="px-3 py-1 bg-[#9CBBDC]/20 rounded-full text-sm text-[#1a1a1a]">
                  {property.type}
                </span>
                <span className="text-[#4a5565]">•</span>
                <span className="text-[#1a1a1a]">
                  {property.beds} beds • {property.baths} baths •{' '}
                  {property.sqm.toLocaleString()} sq ft
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8 p-6 bg-[#f5f7fa] rounded-3xl">
              <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-4">
                About This Property
              </h2>
              <p className="text-[#1a1a1a] leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="mb-8 p-6 bg-[#f5f7fa] rounded-3xl">
              <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-6">
                Amenities
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {property.amenities.map((name) => {
                  const Icon = AMENITIES_ICONS[name]
                  return (
                    <div
                      key={name}
                      className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl"
                    >
                      <div className="w-12 h-12 rounded-xl bg-[#9CBBDC]/20 flex items-center justify-center">
                        {Icon ? (
                          <Icon className="w-6 h-6 text-[#3A6EA5]" />
                        ) : (
                          <span className="text-xs text-[#3A6EA5]">✓</span>
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

            {/* Owner Profile */}
            <div className="p-6 bg-[#f5f7fa] rounded-3xl mb-8">
              <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-6">
                Hosted By
              </h2>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200" />
                  <AvatarFallback>AH</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-[#1a1a1a]">
                    Ahmed Hassan
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-[#4a5565]">
                    <Star className="w-4 h-4 fill-[#3A6EA5] text-[#3A6EA5]" />
                    <span>4.9 rating • 47 properties</span>
                  </div>
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
              <p className="text-[#1a1a1a]">
                Experienced property manager with over 10 years in the real
                estate industry. Committed to providing excellent service and
                ensuring tenant satisfaction.
              </p>
            </div>

            {/* Reviews Section */}
            <div className="p-6 bg-[#f5f7fa] rounded-3xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-[#1a1a1a]">
                  Reviews ({property.reviews})
                </h2>
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 fill-[#FFB800] text-[#FFB800]" />
                  <span className="text-2xl font-bold text-[#1a1a1a]">
                    {property.rating}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full mt-4 rounded-xl border-[#3A6EA5] text-[#3A6EA5] hover:bg-[#3A6EA5] hover:text-white"
              >
                Show All {property.reviews} Reviews
              </Button>
            </div>
          </div>

          {/* Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-[#f5f7fa] rounded-3xl p-6 shadow-2xl shadow-[#3A6EA5]/20">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-4xl font-bold text-[#3A6EA5]">
                      {property.price.toLocaleString()} EGP
                    </span>
                    <span className="text-[#4a5565]">/ month</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-[#3A6EA5] text-[#3A6EA5]" />
                    <span className="text-[#1a1a1a]">
                      {property.rating} ({property.reviews} reviews)
                    </span>
                  </div>
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
                          {checkOut ? format(checkOut, 'PPP') : 'Select date'}
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
