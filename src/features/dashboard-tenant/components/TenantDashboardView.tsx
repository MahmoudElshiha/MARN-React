import { CreditCard, Heart, Bell, Home, MessageSquare } from 'lucide-react'
import { Link } from 'react-router'
import { PropertyCard } from '@/app/components/PropertyCard'
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card'
import { useTenantDashboard } from '../hooks/useTenantDashboard'

export function TenantDashboardView() {
  const { dashboard, loading, error } = useTenantDashboard()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-[#3A6EA5] border-t-transparent animate-spin" />
      </div>
    )
  }

  if (error || !dashboard) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error?.message ?? 'Failed to load tenant dashboard'}
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-[1440px] mx-auto px-8 py-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-[#1a1a1a]">My Dashboard</h1>
            <p className="text-[#4a5565] mt-2">
              Welcome back, {dashboard.welcomeName}!
            </p>
          </div>
          <Button
            className="bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-xl"
            asChild
          >
            <Link to="/search">Find Properties</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-[#3A6EA5] to-[#9CBBDC] border-none text-white rounded-3xl shadow-lg shadow-[#3A6EA5]/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 mb-1">Current Rent</p>
                  <p className="text-3xl font-bold">
                    {dashboard.summary.currentRent.toLocaleString()} EGP
                  </p>
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
              <p className="text-3xl font-bold text-[#3A6EA5] mt-2">
                {dashboard.summary.activeBookings}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <CardTitle className="flex items-center gap-2 text-[#1a1a1a]">
                <Heart className="w-5 h-5 text-[#3A6EA5]" />
                <span className="text-base">Saved Properties</span>
              </CardTitle>
              <p className="text-3xl font-bold text-[#3A6EA5] mt-2">
                {dashboard.summary.savedProperties}
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
                {dashboard.summary.unreadNotifications}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
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
                      src={dashboard.currentRental.image}
                      alt={dashboard.currentRental.property}
                      className="w-32 h-32 rounded-2xl object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg text-[#1a1a1a] mb-1">
                            {dashboard.currentRental.property}
                          </h3>
                          <p className="text-[#4a5565] text-sm">
                            {dashboard.currentRental.location}
                          </p>
                        </div>
                        <Badge className="bg-[#3A6EA5] hover:bg-[#2a5a8a] text-white">
                          {dashboard.currentRental.status === 'active'
                            ? 'Active'
                            : 'Ended'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-[#6a7282] mb-1">Move In</p>
                          <p className="text-sm font-medium text-[#1a1a1a]">
                            {dashboard.currentRental.moveIn}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[#6a7282] mb-1">
                            Move Out
                          </p>
                          <p className="text-sm font-medium text-[#1a1a1a]">
                            {dashboard.currentRental.moveOut}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-[#6a7282] mb-1">
                            Monthly Rent
                          </p>
                          <p className="text-xl font-bold text-[#3A6EA5]">
                            {dashboard.currentRental.rent.toLocaleString()} EGP
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
                  {dashboard.savedPropertiesList.map((property) => (
                    <PropertyCard key={property.id} {...property} />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-[#1a1a1a]">
                  Recommended for You
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {dashboard.recommendedProperties.map((property) => (
                    <PropertyCard key={property.id} {...property} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="rounded-3xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-[#1a1a1a]">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboard.notifications.map((notification) => (
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

            <Card className="rounded-3xl shadow-lg bg-gradient-to-br from-[#f5f7fa] to-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="w-12 h-12 border-2 border-[#3A6EA5]">
                    <AvatarImage src={dashboard.profileCompletion.avatar} />
                    <AvatarFallback>
                      {dashboard.profileCompletion.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-[#1a1a1a] mb-2">
                      Complete Your Profile
                    </h3>
                    <div className="w-full bg-[#f5f7fa] rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] h-full"
                        style={{
                          width: `${dashboard.profileCompletion.completionPercent}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-[#6a7282] mt-2">
                      {dashboard.profileCompletion.completionPercent}% Complete
                    </p>
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
