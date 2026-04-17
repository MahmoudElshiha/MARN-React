import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Bath,
  Bed,
  Maximize2,
  MapPin,
  Star,
  Heart,
  Share2,
  Wifi,
  Car,
  Wind,
  Flame,
  Dog,
  Users,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';

const PROPERTY_DATA = {
  id: '1',
  name: 'Modern Downtown Apartment',
  address: '123 Market Street, Cairo, Egypt',
  price: 28000,
  rating: 4.9,
  reviews: 124,
  bedrooms: 2,
  bathrooms: 2,
  sqm: 120,
  images: [
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
  ],
  description:
    'Beautiful modern apartment in the heart of downtown Cairo. Recently renovated with high-end finishes, floor-to-ceiling windows, and stunning city views. Walking distance to public transportation, restaurants, and shopping.',
  amenities: ['WiFi', 'Parking', 'Air Conditioning', 'Heating', 'Pet Friendly'],
};

const RENTAL_REQUESTS = [
  {
    id: '1',
    tenant: {
      name: 'Fatima Al-Masri',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
      rating: 4.8,
      verified: true,
    },
    requestedPeriod: {
      from: '2026-04-01',
      to: '2026-10-01',
    },
    numberOfPeople: 2,
    totalPrice: 168000,
    status: 'pending', // pending, approved, rejected
    submittedDate: '2026-03-15',
  },
  {
    id: '2',
    tenant: {
      name: 'Omar Khalil',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      rating: 4.9,
      verified: true,
    },
    requestedPeriod: {
      from: '2026-05-01',
      to: '2026-11-01',
    },
    numberOfPeople: 1,
    totalPrice: 168000,
    status: 'pending',
    submittedDate: '2026-03-20',
  },
  {
    id: '3',
    tenant: {
      name: 'Layla Hassan',
      avatar: 'https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?w=200',
      rating: 5.0,
      verified: false,
    },
    requestedPeriod: {
      from: '2026-06-01',
      to: '2026-12-01',
    },
    numberOfPeople: 2,
    totalPrice: 168000,
    status: 'approved',
    submittedDate: '2026-03-18',
  },
];

export function PropertyByOwnerPage() {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-[1440px] mx-auto px-8">
        {/* Image Gallery */}
        <div className="grid grid-cols-4 gap-4 mb-8 h-[500px]">
          <div className="col-span-3 relative rounded-3xl overflow-hidden">
            <img
              src={PROPERTY_DATA.images[currentImageIndex]}
              alt={PROPERTY_DATA.name}
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
            {PROPERTY_DATA.images.slice(0, 3).map((img, idx) => (
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
                <h1 className="text-4xl font-bold text-[#1a1a1a]">{PROPERTY_DATA.name}</h1>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-[#FFB800] text-[#FFB800]" />
                  <span className="font-semibold text-[#1a1a1a]">{PROPERTY_DATA.rating}</span>
                  <span className="text-[#6B7280]">({PROPERTY_DATA.reviews} reviews)</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[#6B7280]">
                <MapPin className="w-5 h-5" />
                <span>{PROPERTY_DATA.address}</span>
              </div>
            </div>

            {/* Property Stats */}
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Bed className="w-5 h-5 text-[#3A6EA5]" />
                <span className="text-[#1a1a1a]">{PROPERTY_DATA.bedrooms} Bedrooms</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="w-5 h-5 text-[#3A6EA5]" />
                <span className="text-[#1a1a1a]">{PROPERTY_DATA.bathrooms} Bathrooms</span>
              </div>
              <div className="flex items-center gap-2">
                <Maximize2 className="w-5 h-5 text-[#3A6EA5]" />
                <span className="text-[#1a1a1a]">{PROPERTY_DATA.sqm} m²</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-3">Description</h2>
              <p className="text-[#1a1a1a] leading-relaxed">{PROPERTY_DATA.description}</p>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-4">Amenities</h2>
              <div className="grid grid-cols-2 gap-3">
                {PROPERTY_DATA.amenities.map((amenity) => (
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

            {/* Rental Requests Section */}
            <div>
              <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-4">
                Rental Requests ({RENTAL_REQUESTS.length})
              </h2>
              <div className="space-y-4">
                {RENTAL_REQUESTS.map((request) => (
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
                              {request.tenant.name.split(' ').map(n => n[0]).join('')}
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
                        <Badge className={`${getStatusColor(request.status)} capitalize`}>
                          {request.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="p-3 bg-white rounded-xl">
                          <p className="text-xs text-[#6B7280] mb-1">Check-in</p>
                          <p className="text-sm font-medium text-[#1a1a1a]">
                            {new Date(request.requestedPeriod.from).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                        <div className="p-3 bg-white rounded-xl">
                          <p className="text-xs text-[#6B7280] mb-1">Check-out</p>
                          <p className="text-sm font-medium text-[#1a1a1a]">
                            {new Date(request.requestedPeriod.to).toLocaleDateString('en-US', {
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
                          onClick={() => navigate(`/messages/rental-request/${request.id}`)}
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

          {/* Sidebar - Owner Actions */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="bg-[#E5EBF0] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10">
                <CardContent className="p-6 space-y-4">
                  <div className="p-4 bg-white rounded-2xl text-center">
                    <p className="text-sm text-[#6B7280] mb-1">Monthly Rent</p>
                    <p className="text-4xl font-bold text-[#3A6EA5]">
                      EGP {PROPERTY_DATA.price.toLocaleString()}
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
                    <h3 className="font-semibold text-[#1a1a1a] mb-3">Quick Stats</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#6B7280]">Total Requests</span>
                        <span className="font-semibold text-[#1a1a1a]">
                          {RENTAL_REQUESTS.length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#6B7280]">Pending</span>
                        <span className="font-semibold text-yellow-600">
                          {RENTAL_REQUESTS.filter(r => r.status === 'pending').length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#6B7280]">Approved</span>
                        <span className="font-semibold text-green-600">
                          {RENTAL_REQUESTS.filter(r => r.status === 'approved').length}
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
  );
}