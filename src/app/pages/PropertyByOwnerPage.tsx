import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import {
  Bath,
  Bed,
  Maximize2,
  MapPin,
  Star,
  Heart,
  Share2,
  CheckCircle,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Badge } from '../components/ui/badge'
import { Skeleton } from '../components/ui/skeleton'
import { useProperty } from '@/hooks/useProperty'
import { useBookingRequests } from '@/hooks/useBookingRequests'

export function PropertyByOwnerPage() {
  const { t } = useTranslation('properties')
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const { data: propertyData, isLoading: propertyLoading } = useProperty(id)
  const {
    data: requestsData,
    isLoading: requestsLoading,
    accept,
    reject,
  } = useBookingRequests()

  const property = propertyData?.data ?? null
  const allRequests = requestsData?.data ?? []
  const requests = allRequests.filter((r) => r.propertyId === id)

  const images = property?.images ?? []
  const displayImages = images.length > 0 ? images : []

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-700'
      case 'rejected':
        return 'bg-red-100 text-red-700'
      case 'cancelled':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-yellow-100 text-yellow-700'
    }
  }

  if (propertyLoading) {
    return (
      <div className="min-h-screen py-20">
        <div className="max-w-[1440px] mx-auto px-8 space-y-8">
          <Skeleton className="h-[500px] w-full rounded-3xl" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-10 w-3/4 rounded" />
              <Skeleton className="h-6 w-1/2 rounded" />
              <Skeleton className="h-32 w-full rounded" />
            </div>
            <Skeleton className="h-64 rounded-3xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center text-[#4a5565]">
        {t('ownerView.notFound')}
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-[1440px] mx-auto px-8">
        {/* Image Gallery */}
        <div className="grid grid-cols-4 gap-4 mb-8 h-[500px]">
          <div className="col-span-3 relative rounded-3xl overflow-hidden">
            {displayImages.length > 0 ? (
              <img
                src={displayImages[currentImageIndex]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#E5EBF0] flex items-center justify-center text-[#6B7280]">
                {t('ownerView.noImage')}
              </div>
            )}
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
            {displayImages.slice(0, 3).map((img, idx) => (
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
                {(property.rating ?? 0) > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-[#FFB800] text-[#FFB800]" />
                    <span className="font-semibold text-[#1a1a1a]">
                      {property.rating}
                    </span>
                    <span className="text-[#6B7280]">
                      ({property.reviews} {t('details.reviews').toLowerCase()})
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-[#6B7280]">
                <MapPin className="w-5 h-5" />
                <span>{property.address ?? property.location}</span>
              </div>
            </div>

            {/* Property Stats */}
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Bed className="w-5 h-5 text-[#3A6EA5]" />
                <span className="text-[#1a1a1a]">{property.beds} {t('details.bedrooms')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="w-5 h-5 text-[#3A6EA5]" />
                <span className="text-[#1a1a1a]">
                  {property.baths} {t('details.bathrooms')}
                </span>
              </div>
              {property.area && (
                <div className="flex items-center gap-2">
                  <Maximize2 className="w-5 h-5 text-[#3A6EA5]" />
                  <span className="text-[#1a1a1a]">{property.area} m²</span>
                </div>
              )}
            </div>

            {/* Description */}
            {property.description && (
              <div>
                <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-3">
                  {t('details.description')}
                </h2>
                <p className="text-[#1a1a1a] leading-relaxed">
                  {property.description}
                </p>
              </div>
            )}

            {/* Amenities */}
            {property.amenities.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-4">
                  {t('details.amenities')}
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
            )}

            {/* Rental Requests Section */}
            <div>
              <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-4">
                {requestsLoading
                  ? t('ownerView.rentalRequestsLoading')
                  : t('ownerView.rentalRequests', { count: requests.length })}
              </h2>
              {requestsLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-40 w-full rounded-3xl" />
                  <Skeleton className="h-40 w-full rounded-3xl" />
                </div>
              ) : requests.length === 0 ? (
                <p className="text-[#4a5565]">{t('ownerView.noRequests')}</p>
              ) : (
                <div className="space-y-4">
                  {requests.map((request) => (
                    <Card
                      key={request.id}
                      className="bg-[#E5EBF0] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10 hover:shadow-xl transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <Avatar className="w-16 h-16">
                              <AvatarImage src={request.tenantAvatarUrl} />
                              <AvatarFallback>
                                {request.tenant
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-[#1a1a1a] text-lg">
                                {request.tenant}
                              </h3>
                              {request.createdAt && (
                                <p className="text-sm text-[#6B7280]">
                                  {t('ownerView.submitted')}{' '}
                                  {new Date(
                                    request.createdAt,
                                  ).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                          <Badge
                            className={`${getStatusColor(request.status)} capitalize`}
                          >
                            {request.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                          <div className="p-3 bg-white rounded-xl">
                            <p className="text-xs text-[#6B7280] mb-1">
                              {t('ownerView.moveIn')}
                            </p>
                            <p className="text-sm font-medium text-[#1a1a1a]">
                              {new Date(request.moveIn).toLocaleDateString(
                                'en-US',
                                {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                },
                              )}
                            </p>
                          </div>
                          <div className="p-3 bg-white rounded-xl">
                            <p className="text-xs text-[#6B7280] mb-1">
                              {t('ownerView.duration')}
                            </p>
                            <p className="text-sm font-medium text-[#1a1a1a]">
                              {request.requestedDates}
                            </p>
                          </div>
                          <div className="p-3 bg-white rounded-xl">
                            <p className="text-xs text-[#6B7280] mb-1">
                              {t('ownerView.monthlyRent')}
                            </p>
                            <p className="text-sm font-bold text-[#3A6EA5]">
                              EGP {request.monthlyRent.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {request.message && (
                          <p className="text-sm text-[#4a5565] mb-4 p-3 bg-white rounded-xl">
                            "{request.message}"
                          </p>
                        )}

                        <div className="flex gap-3">
                          {request.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl"
                                disabled={accept.isPending}
                                onClick={() => accept.mutate(request.id)}
                              >
                                {t('ownerView.accept')}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-xl"
                                disabled={reject.isPending}
                                onClick={() => reject.mutate(request.id)}
                              >
                                {t('ownerView.reject')}
                              </Button>
                            </>
                          )}
                          <Button
                            size="sm"
                            onClick={() =>
                              navigate(`/messages/rental-request/${request.id}`)
                            }
                            className="flex-1 bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2C5580] hover:to-[#3A6EA5] text-white rounded-xl"
                          >
                            {t('ownerView.viewChat')}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Owner Actions */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="bg-[#E5EBF0] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10">
                <CardContent className="p-6 space-y-4">
                  <div className="p-4 bg-white rounded-2xl text-center">
                    <p className="text-sm text-[#6B7280] mb-1">{t('ownerView.monthlyRentLabel')}</p>
                    <p className="text-4xl font-bold text-[#3A6EA5]">
                      EGP {property.price.toLocaleString()}
                    </p>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2C5580] hover:to-[#3A6EA5] text-white rounded-xl"
                    onClick={() => navigate(`/edit-property/${id}`)}
                  >
                    {t('ownerView.editProperty')}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-[#3A6EA5]/20"
                    onClick={() => navigate('/owner-dashboard')}
                  >
                    {t('ownerView.backToDashboard')}
                  </Button>

                  <div className="pt-4 border-t border-[#3A6EA5]/20">
                    <h3 className="font-semibold text-[#1a1a1a] mb-3">
                      {t('ownerView.quickStats')}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#6B7280]">{t('ownerView.totalRequests')}</span>
                        <span className="font-semibold text-[#1a1a1a]">
                          {requests.length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#6B7280]">{t('ownerView.pending')}</span>
                        <span className="font-semibold text-yellow-600">
                          {
                            requests.filter((r) => r.status === 'pending')
                              .length
                          }
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#6B7280]">{t('ownerView.accepted')}</span>
                        <span className="font-semibold text-green-600">
                          {
                            requests.filter((r) => r.status === 'accepted')
                              .length
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
