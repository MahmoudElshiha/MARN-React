import {
  Calendar,
  CreditCard,
  Heart,
  Bell,
  Home,
  TrendingUp,
  MessageSquare,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { PropertyCard } from '../components/PropertyCard'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Badge } from '../components/ui/badge'
import { Link } from 'react-router'

const CURRENT_RENTAL = {
  id: '1',
  property: 'Modern Zamalek Apartment',
  location: 'Cairo, Egypt',
  moveIn: 'March 1, 2026',
  moveOut: 'March 1, 2027',
  rent: 50000,
  status: 'active',
  image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
}

const SAVED_PROPERTIES = [
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    title: 'Cozy Studio in Maadi',
    location: 'Alexandria, Egypt',
    price: 35000,
    rating: 4.8,
    reviews: 89,
    type: 'Studio',
    beds: 1,
    baths: 1,
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    title: 'Spacious Family Villa',
    location: 'Giza, Egypt',
    price: 60000,
    rating: 5.0,
    reviews: 156,
    type: 'House',
    beds: 4,
    baths: 3,
  },
]

const NOTIFICATIONS = [
  {
    id: '1',
    type: 'payment',
    message: 'Rent payment due in 5 days',
    time: '2 hours ago',
    unread: true,
  },
  {
    id: '2',
    type: 'message',
    message: 'New message from your landlord',
    time: '5 hours ago',
    unread: true,
  },
  {
    id: '3',
    type: 'update',
    message: 'Maintenance scheduled for next week',
    time: '1 day ago',
    unread: false,
  },
]

const RECOMMENDED_PROPERTIES = [
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
    title: 'Cozy Studio in Zamalek',
    location: 'Cairo, Egypt',
    price: 8500,
    rating: 4.8,
    reviews: 89,
    type: 'Studio',
    beds: 1,
    baths: 1,
    guests: 2,
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
    title: 'Luxury Villa in New Cairo',
    location: 'Cairo, Egypt',
    price: 35000,
    rating: 5.0,
    reviews: 156,
    type: 'House',
    beds: 4,
    baths: 3,
    guests: 8,
  },
]

export function TenantDashboard() {
  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-[1440px] mx-auto px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-[#1a1a1a]">My Dashboard</h1>
            <p className="text-[#4a5565] mt-2">Welcome back, Ahmed!</p>
          </div>
          <Button
            className="bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-xl"
            asChild
          >
            <Link to="/search">Find Properties</Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-[#3A6EA5] to-[#9CBBDC] border-none text-white rounded-3xl shadow-lg shadow-[#3A6EA5]/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 mb-1">Current Rent</p>
                  <p className="text-3xl font-bold">50,000 EGP</p>
                </div>
                <CreditCard className="w-12 h-12 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <CardTitle className="flex items-center gap-2 text-[#1a1a1a]">
                <Home className="w-5 h-5 text-[#3A6EA5]" />
                <span className="text-base">Active Bookings</span>
              </CardTitle>
              <p className="text-3xl font-bold text-[#3A6EA5] mt-2">1</p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <CardTitle className="flex items-center gap-2 text-[#1a1a1a]">
                <Heart className="w-5 h-5 text-[#3A6EA5]" />
                <span className="text-base">Saved Properties</span>
              </CardTitle>
              <p className="text-3xl font-bold text-[#3A6EA5] mt-2">
                {SAVED_PROPERTIES.length}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <CardTitle className="flex items-center gap-2 text-[#1a1a1a]">
                <Bell className="w-5 h-5 text-[#3A6EA5]" />
                <span className="text-base">Notifications</span>
              </CardTitle>
              <p className="text-3xl font-bold text-[#3A6EA5] mt-2">
                {NOTIFICATIONS.filter((n) => n.unread).length}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Current Rental */}
            <Card className="rounded-3xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-[#1a1a1a]">
                  Active Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-[#f5f7fa] rounded-2xl p-6">
                  <div className="flex gap-6">
                    <img
                      src={CURRENT_RENTAL.image}
                      alt={CURRENT_RENTAL.property}
                      className="w-32 h-32 rounded-2xl object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg text-[#1a1a1a] mb-1">
                            {CURRENT_RENTAL.property}
                          </h3>
                          <p className="text-[#4a5565] text-sm">
                            {CURRENT_RENTAL.location}
                          </p>
                        </div>
                        <Badge className="bg-[#3A6EA5] hover:bg-[#2a5a8a] text-white">
                          Active
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-[#6a7282] mb-1">Move In</p>
                          <p className="text-sm font-medium text-[#1a1a1a]">
                            {CURRENT_RENTAL.moveIn}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[#6a7282] mb-1">
                            Move Out
                          </p>
                          <p className="text-sm font-medium text-[#1a1a1a]">
                            {CURRENT_RENTAL.moveOut}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-[#6a7282] mb-1">
                            Monthly Rent
                          </p>
                          <p className="text-xl font-bold text-[#3A6EA5]">
                            {CURRENT_RENTAL.rent.toLocaleString()} EGP
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl border-[#3A6EA5] text-[#3A6EA5] hover:bg-[#3A6EA5] hover:text-white"
                          >
                            Pay Rent
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Saved Properties */}
            <Card className="rounded-3xl shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-2xl text-[#1a1a1a]">
                  Saved Properties
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#3A6EA5] hover:text-[#2a5a8a] hover:bg-[#f5f7fa]"
                  asChild
                >
                  <Link to="/saved">View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {SAVED_PROPERTIES.map((property) => (
                    <PropertyCard key={property.id} {...property} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommended Properties */}
            <Card className="rounded-3xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-[#1a1a1a]">
                  Recommended for You
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {RECOMMENDED_PROPERTIES.map((property) => (
                    <PropertyCard key={property.id} {...property} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Recent Activity */}
            <Card className="rounded-3xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-[#1a1a1a]">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {NOTIFICATIONS.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-2xl transition-colors ${
                        notification.unread
                          ? 'bg-[#3A6EA5]/5 border border-[#3A6EA5]/20'
                          : 'bg-[#f5f7fa]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${
                            notification.unread
                              ? 'bg-[#3A6EA5]'
                              : 'bg-[#6a7282]'
                          }`}
                        />
                        <div className="flex-1">
                          <p className="text-sm text-[#1a1a1a] mb-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-[#6a7282]">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="rounded-3xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-[#1a1a1a]">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-xl"
                  asChild
                >
                  <Link to="/payment">Pay Rent</Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full rounded-xl border-[#3A6EA5] text-[#3A6EA5] hover:bg-[#3A6EA5] hover:text-white"
                  asChild
                >
                  <Link to="/maintenance">Request Maintenance</Link>
                </Button>
                <Button variant="outline" className="w-full rounded-xl" asChild>
                  <Link to="/messages">Contact Landlord</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Profile Completion */}
            <Card className="rounded-3xl shadow-lg bg-gradient-to-br from-[#f5f7fa] to-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="w-12 h-12 border-2 border-[#3A6EA5]">
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" />
                    <AvatarFallback>AN</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-[#1a1a1a] mb-2">
                      Complete Your Profile
                    </h3>
                    <div className="w-full bg-[#f5f7fa] rounded-full h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] h-full w-[75%]"></div>
                    </div>
                    <p className="text-xs text-[#6a7282] mt-2">75% Complete</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-xl border-[#3A6EA5] text-[#3A6EA5] hover:bg-[#3A6EA5] hover:text-white"
                  asChild
                >
                  <Link to="/profile-settings">Complete Profile</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
