import {
  CreditCard,
  Heart,
  Bell,
  Home,
  MessageSquare,
  Clock,
  FileText,
  CheckCircle,
  AlertCircle,
  Calendar,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { PropertyCard } from '../components/PropertyCard'
import { Avatar, AvatarFallback } from '../components/ui/avatar'
import { Badge } from '../components/ui/badge'
import { Skeleton } from '../components/ui/skeleton'
import { Link } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { useRenterDashboard } from '@/hooks/useRenterDashboard'
import { useProperties } from '@/hooks/useProperties'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export function TenantDashboard() {
  const { user } = useAuth()
  const { data: dashboardRes, isLoading: dashboardLoading } = useRenterDashboard()
  const { data: recommendedData, isLoading: recommendedLoading } = useProperties({ pageSize: 2 })

  const dashboard = dashboardRes?.data
  const recommendedProperties = recommendedData?.data ?? []

  const activeRental = dashboard?.activeRentals?.[0] ?? null

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-[1440px] mx-auto px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-[#1a1a1a]">My Dashboard</h1>
            <p className="text-[#4a5565] mt-2">
              Welcome back, {user?.firstName ?? 'there'}!
            </p>
            {dashboard?.accountStatus && (
              <Badge
                className={`mt-2 ${
                  dashboard.accountStatus === 'Verified'
                    ? 'bg-green-100 text-green-700 border-green-200'
                    : 'bg-amber-100 text-amber-700 border-amber-200'
                }`}
                variant="outline"
              >
                {dashboard.accountStatus === 'Verified' ? (
                  <CheckCircle className="w-3 h-3 mr-1" />
                ) : (
                  <AlertCircle className="w-3 h-3 mr-1" />
                )}
                {dashboard.accountStatus}
              </Badge>
            )}
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
          {/* Current Rent / Next Payment */}
          <Card className="bg-gradient-to-br from-[#3A6EA5] to-[#9CBBDC] border-none text-white rounded-3xl shadow-lg shadow-[#3A6EA5]/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 mb-1">
                    {dashboard?.nextPayment ? 'Next Payment' : 'Current Rent'}
                  </p>
                  {dashboardLoading ? (
                    <Skeleton className="h-8 w-28 bg-white/30" />
                  ) : (
                    <p className="text-3xl font-bold">
                      {dashboard?.nextPayment
                        ? formatDate(dashboard.nextPayment)
                        : activeRental
                          ? `${activeRental.monthlyRent.toLocaleString()} EGP`
                          : 'No active rental'}
                    </p>
                  )}
                </div>
                <CreditCard className="w-12 h-12 opacity-80" />
              </div>
            </CardContent>
          </Card>

          {/* Active Rentals */}
          <Card className="rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <CardTitle className="flex items-center gap-2 text-[#1a1a1a]">
                <Home className="w-5 h-5 text-[#3A6EA5]" />
                <span className="text-base">Active Rentals</span>
              </CardTitle>
              <p className="text-3xl font-bold text-[#3A6EA5] mt-2">
                {dashboardLoading ? '…' : (dashboard?.activeRentalsCount ?? 0)}
              </p>
            </CardContent>
          </Card>

          {/* Saved Properties */}
          <Card className="rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <CardTitle className="flex items-center gap-2 text-[#1a1a1a]">
                <Heart className="w-5 h-5 text-[#3A6EA5]" />
                <span className="text-base">Saved Properties</span>
              </CardTitle>
              <p className="text-3xl font-bold text-[#3A6EA5] mt-2">
                {dashboardLoading ? '…' : (dashboard?.savedPropertiesCount ?? 0)}
              </p>
            </CardContent>
          </Card>

          {/* Unread Notifications */}
          <Card className="rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <CardTitle className="flex items-center gap-2 text-[#1a1a1a]">
                <Bell className="w-5 h-5 text-[#3A6EA5]" />
                <span className="text-base">Notifications</span>
              </CardTitle>
              <p className="text-3xl font-bold text-[#3A6EA5] mt-2">
                {dashboardLoading ? '…' : (dashboard?.unreadNotificationsCount ?? 0)}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Rentals */}
            <Card className="rounded-3xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-[#1a1a1a]">Active Rentals</CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardLoading ? (
                  <Skeleton className="h-36 w-full rounded-2xl" />
                ) : !activeRental ? (
                  <div className="text-center py-8 text-[#4a5565]">
                    No active rentals.{' '}
                    <Link to="/search" className="text-[#3A6EA5] hover:underline">
                      Find a property.
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dashboard!.activeRentals.map((rental) => (
                      <div key={rental.id} className="bg-[#f5f7fa] rounded-2xl p-6">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="font-semibold text-lg text-[#1a1a1a]">
                            {rental.propertyName}
                          </h3>
                          <Badge className="bg-[#3A6EA5] hover:bg-[#2a5a8a] text-white">
                            {rental.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-[#6a7282] mb-1">Start Date</p>
                            <p className="text-sm font-medium text-[#1a1a1a]">
                              {formatDate(rental.startDate)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-[#6a7282] mb-1">End Date</p>
                            <p className="text-sm font-medium text-[#1a1a1a]">
                              {formatDate(rental.expiryDate)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-[#6a7282] mb-1">Monthly Rent</p>
                            <p className="text-xl font-bold text-[#3A6EA5]">
                              {rental.monthlyRent.toLocaleString()} EGP
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
                              asChild
                            >
                              <Link to="/messages">
                                <MessageSquare className="w-4 h-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pending Booking Requests */}
            {(dashboardLoading || (dashboard?.pendingBookingRequests?.length ?? 0) > 0) && (
              <Card className="rounded-3xl shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#1a1a1a]">Pending Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  {dashboardLoading ? (
                    <Skeleton className="h-24 w-full rounded-2xl" />
                  ) : (
                    <div className="space-y-3">
                      {dashboard!.pendingBookingRequests.map((req) => (
                        <div key={req.id} className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
                          <div>
                            <p className="font-medium text-[#1a1a1a]">{req.propertyName}</p>
                            <p className="text-xs text-[#6a7282] flex items-center gap-1 mt-1">
                              <Calendar className="w-3 h-3" />
                              {req.requestedDate ? formatDate(req.requestedDate) : '—'}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-amber-700 border-amber-300 bg-amber-100">
                            {req.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Recommended Properties */}
            <Card className="rounded-3xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-[#1a1a1a]">Recommended for You</CardTitle>
              </CardHeader>
              <CardContent>
                {recommendedLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-48 w-full rounded-2xl" />
                    <Skeleton className="h-48 w-full rounded-2xl" />
                  </div>
                ) : recommendedProperties.length === 0 ? (
                  <p className="text-[#4a5565] text-center py-8">No recommendations available.</p>
                ) : (
                  <div className="grid gap-6">
                    {recommendedProperties.map((property) => (
                      <PropertyCard
                        key={property.id}
                        id={property.id}
                        image={property.image ?? property.images?.[0] ?? ''}
                        title={property.title}
                        location={property.location}
                        price={property.price}
                        rating={property.rating ?? 0}
                        reviews={property.reviews ?? 0}
                        type={property.type}
                        beds={property.beds}
                        baths={property.baths}
                        guests={property.guests}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Notifications */}
            <Card className="rounded-3xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-[#1a1a1a]">Recent Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-16 w-full rounded-2xl" />
                    <Skeleton className="h-16 w-full rounded-2xl" />
                  </div>
                ) : !dashboard?.notifications?.length ? (
                  <p className="text-sm text-[#6a7282] text-center py-6">No notifications yet.</p>
                ) : (
                  <div className="space-y-3">
                    {dashboard.notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-4 rounded-2xl transition-colors ${
                          !n.isRead
                            ? 'bg-[#3A6EA5]/5 border border-[#3A6EA5]/20'
                            : 'bg-[#f5f7fa]'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                              !n.isRead ? 'bg-[#3A6EA5]' : 'bg-[#6a7282]'
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-[#1a1a1a] mb-1 leading-snug">{n.title}</p>
                            <p className="text-xs text-[#6a7282] flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {timeAgo(n.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* All Contracts */}
            {(dashboardLoading || (dashboard?.allContracts?.length ?? 0) > 0) && (
              <Card className="rounded-3xl shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-[#1a1a1a]">Contracts</CardTitle>
                </CardHeader>
                <CardContent>
                  {dashboardLoading ? (
                    <Skeleton className="h-20 w-full rounded-2xl" />
                  ) : (
                    <div className="space-y-3">
                      {dashboard!.allContracts.map((c) => (
                        <div key={c.id} className="bg-[#f5f7fa] rounded-2xl p-4">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium text-[#1a1a1a]">{c.propertyName}</p>
                            <Badge
                              variant="outline"
                              className={
                                c.status === 'Active'
                                  ? 'text-green-700 border-green-300 bg-green-50'
                                  : 'text-[#6a7282] border-[#d1d5db]'
                              }
                            >
                              {c.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-[#6a7282]">
                            {formatDate(c.startDate)} → {formatDate(c.expiryDate)}
                          </p>
                          {c.documentUrl && (
                            <a
                              href={c.documentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-[#3A6EA5] hover:underline mt-2"
                            >
                              <FileText className="w-3 h-3" />
                              View Document
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="rounded-3xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-[#1a1a1a]">Quick Actions</CardTitle>
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
                    <AvatarFallback>{user?.firstName?.[0] ?? '?'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#1a1a1a] mb-2">Complete Your Profile</h3>
                    <div className="w-full bg-[#f5f7fa] rounded-full h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] h-full w-[75%]" />
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
