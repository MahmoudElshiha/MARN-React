import { useState } from 'react'
import { useNavigate } from 'react-router'
import {
  Bath,
  Bed,
  Maximize2,
  MapPin,
  Star,
  Heart,
  Share2,
  Users,
  CheckCircle,
} from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent } from '@/app/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar'
import { Badge } from '@/app/components/ui/badge'
import { useOwnerProperty } from '../hooks/useOwnerProperty'

function getStatusColor(status: string) {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-700'
    case 'rejected':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-yellow-100 text-yellow-700'
  }
}

export function PropertyByOwner() {
  const navigate = useNavigate()
  const { property, rentalRequests, loading, error } = useOwnerProperty()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

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

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-[1440px] mx-auto px-8">
        {/* Image Gallery */}
        <div className="grid grid-cols-4 gap-4 mb-8 h-[500px]">
          <div className="col-span-3 relative rounded-3xl overflow-hidden">
            <img
              src={images[currentImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <button className="w-12 h-12 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors">
                <Share2 className="w-5 h-5 text-[#1a1a1a]" />
              </button>
              <button className="w-12 h-12 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors">
                <Heart className="w-5 h-5 text-[#1a1a1a]" />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {images.slice(0, 3).map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`rounded-2xl overflow-hidden flex-1 ${
                  currentImageIndex === idx ? 'ring-4 ring-[#3A6EA5]' : ''
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Property Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Location */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-4xl font-bold text-[#1a1a1a]">
                  {property.title}
                </h1>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-[#FFB800] text-[#FFB800]" />
                  <span className="font-semibold text-[#1a1a1a]">
                    {property.rating}
                  </span>
                  <span className="text-[#6B7280]">
                    ({property.reviews} reviews)
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[#6B7280]">
                <MapPin className="w-5 h-5" />
                <span>{property.address}</span>
              </div>
            </div>

            {/* Property Stats */}
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Bed className="w-5 h-5 text-[#3A6EA5]" />
                <span className="text-[#1a1a1a]">{property.beds} Bedrooms</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="w-5 h-5 text-[#3A6EA5]" />
                <span className="text-[#1a1a1a]">
                  {property.baths} Bathrooms
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Maximize2 className="w-5 h-5 text-[#3A6EA5]" />
                <span className="text-[#1a1a1a]">{property.sqm} m²</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-3">
                Description
              </h2>
              <p className="text-[#1a1a1a] leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-4">
                Amenities
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {property.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-3 p-3 bg-[#E5EBF0] rounded-xl"
                  >
                    <CheckCircle className="w-5 h-5 text-[#3A6EA5]" />
                    <span className="text-[#1a1a1a]">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rental Requests */}
            <div>
              <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-4">
                Rental Requests ({rentalRequests.length})
              </h2>
              <div className="space-y-4">
                {rentalRequests.map((request) => (
                  <Card
                    key={request.id}
                    className="bg-[#E5EBF0] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10 hover:shadow-xl transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-16 h-16">
                            <AvatarImage src={request.tenant.avatar} />
                            <AvatarFallback>
                              {request.tenant.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-[#1a1a1a] text-lg">
                                {request.tenant.name}
                              </h3>
                              {request.tenant.verified && (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                              <Star className="w-4 h-4 fill-[#FFB800] text-[#FFB800]" />
                              <span>{request.tenant.rating}</span>
                            </div>
                          </div>
                        </div>
                        <Badge
                          className={`${getStatusColor(request.status)} capitalize`}
                        >
                          {request.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="p-3 bg-white rounded-xl">
                          <p className="text-xs text-[#6B7280] mb-1">
                            Check-in
                          </p>
                          <p className="text-sm font-medium text-[#1a1a1a]">
                            {new Date(
                              request.requestedPeriod.from,
                            ).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                        <div className="p-3 bg-white rounded-xl">
                          <p className="text-xs text-[#6B7280] mb-1">
                            Check-out
                          </p>
                          <p className="text-sm font-medium text-[#1a1a1a]">
                            {new Date(
                              request.requestedPeriod.to,
                            ).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                        <div className="p-3 bg-white rounded-xl">
                          <p className="text-xs text-[#6B7280] mb-1">People</p>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-[#3A6EA5]" />
                            <p className="text-sm font-medium text-[#1a1a1a]">
                              {request.numberOfPeople}
                            </p>
                          </div>
                        </div>
                        <div className="p-3 bg-white rounded-xl">
                          <p className="text-xs text-[#6B7280] mb-1">Total</p>
                          <p className="text-sm font-bold text-[#3A6EA5]">
                            EGP {request.totalPrice.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/user/${request.id}`)}
                          className="flex-1 rounded-xl border-[#3A6EA5]/20"
                        >
                          View Profile
                        </Button>
                        <Button
                          size="sm"
                          onClick={() =>
                            navigate(`/messages/rental-request/${request.id}`)
                          }
                          className="flex-1 bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2C5580] hover:to-[#3A6EA5] text-white rounded-xl"
                        >
                          View Chat
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar — Owner Actions */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="bg-[#E5EBF0] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10">
                <CardContent className="p-6 space-y-4">
                  <div className="p-4 bg-white rounded-2xl text-center">
                    <p className="text-sm text-[#6B7280] mb-1">Monthly Rent</p>
                    <p className="text-4xl font-bold text-[#3A6EA5]">
                      EGP {property.price.toLocaleString()}
                    </p>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2C5580] hover:to-[#3A6EA5] text-white rounded-xl"
                    onClick={() => navigate('/edit-property/1')}
                  >
                    Edit Property
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-[#3A6EA5]/20"
                    onClick={() => navigate('/owner-dashboard')}
                  >
                    Back to Dashboard
                  </Button>

                  <div className="pt-4 border-t border-[#3A6EA5]/20">
                    <h3 className="font-semibold text-[#1a1a1a] mb-3">
                      Quick Stats
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#6B7280]">Total Requests</span>
                        <span className="font-semibold text-[#1a1a1a]">
                          {rentalRequests.length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#6B7280]">Pending</span>
                        <span className="font-semibold text-yellow-600">
                          {
                            rentalRequests.filter((r) => r.status === 'pending')
                              .length
                          }
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#6B7280]">Approved</span>
                        <span className="font-semibold text-green-600">
                          {
                            rentalRequests.filter(
                              (r) => r.status === 'approved',
                            ).length
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
