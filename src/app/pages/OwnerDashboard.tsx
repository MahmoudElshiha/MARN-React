import {
  Plus,
  Home,
  DollarSign,
  Users,
  Eye,
  Calendar,
  MoreVertical,
  MessageSquare,
  Download,
  CheckCircle,
  XCircle,
  Star,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Badge } from '../components/ui/badge'
import { Skeleton } from '../components/ui/skeleton'
import { Link } from 'react-router'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { toast } from 'sonner'
import { useState } from 'react'
import { useOwnerDashboard } from '@/hooks/useOwnerDashboard'
import { useBookingMutations } from '@/hooks/useBookingRequests'
import { useTranslation } from 'react-i18next'

const getContractStatusBadge = (status: string) => {
  const styles: Record<string, string> = {
    Active: 'bg-green-100 text-green-700 hover:bg-green-100',
    Expired: 'bg-red-100 text-red-700 hover:bg-red-100',
    Pending: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
  }
  return styles[status] ?? 'bg-gray-100 text-gray-700 hover:bg-gray-100'
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

export function OwnerDashboard() {
  const { t } = useTranslation('dashboard')
  const [view, setView] = useState<'monthly' | 'yearly'>('monthly')

  const { data: dashboardResponse, isLoading } = useOwnerDashboard()

  // Keep booking-request mutations (accept / reject) from the dedicated hook
  const { accept, reject } = useBookingMutations()

  const dashboard = dashboardResponse?.data

  // ── Derived values ────────────────────────────────────────────────────────
  const totalProperties = dashboard?.propertiesCount ?? 0
  const occupiedCount = dashboard?.occupiedPlaces ?? 0
  const vacantCount = dashboard?.vacantPlaces ?? 0

  const occupancyData = [
    { name: t('owner.occupancy.occupied'), value: occupiedCount, color: '#3A6EA5' },
    { name: t('owner.occupancy.vacant'), value: vacantCount, color: '#9CBBDC' },
  ]

  // Map API earning entries → chart-friendly shape.
  // The actual server field name for the value is unknown (empty arrays in sample);
  // fall back through common alternatives until one is defined.
  const pickEarning = (e: {
    amount?: number
    earning?: number
    value?: number
    total?: number
  }) => e.amount ?? e.earning ?? e.value ?? e.total ?? 0

  const monthlyChartData = (dashboard?.monthlyEarning ?? []).map((e) => ({
    month: e.month,
    earnings: pickEarning(e),
  }))

  const yearlyChartData = (dashboard?.yearlyEarning ?? []).map((e) => ({
    month: e.month,
    earnings: pickEarning(e),
  }))

  const chartData = view === 'monthly' ? monthlyChartData : yearlyChartData

  const pendingRequests = dashboard?.pendingBookingRequests ?? []
  const contracts = dashboard?.allContracts ?? []
  const notifications = dashboard?.notifications ?? []
  const myProperties = dashboard?.properties ?? []

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleAcceptRequest = (id: string) => {
    accept.mutate(id, {
      onSuccess: () => toast.success(t('owner.toasts.bookingAccepted')),
      onError: () => toast.error(t('owner.toasts.acceptFailed')),
    })
  }

  const handleDeclineRequest = (id: string) => {
    reject.mutate(id, {
      onSuccess: () => toast.error(t('owner.toasts.bookingDeclined')),
      onError: () => toast.error(t('owner.toasts.declineFailed')),
    })
  }

  const handleDownloadContract = (contractId: string) => {
    toast.success(t('owner.toasts.downloadingContract', { id: contractId }))
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#1a1a1a] mb-2">
              {t('owner.title')}
            </h1>
            <p className="text-[#4a5565]">{t('owner.subtitle')}</p>
          </div>
          <Button
            size="lg"
            className="bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-xl shadow-lg shadow-[#3A6EA5]/30"
            asChild
          >
            <Link to="/add-property">
              <Plus className="w-5 h-5 mr-2" />
              {t('owner.addNewProperty')}
            </Link>
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Properties */}
          <Card className="bg-gradient-to-br from-[#3A6EA5] to-[#9CBBDC] border-none text-white rounded-3xl shadow-lg shadow-[#3A6EA5]/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-white/90">
                <Home className="w-5 h-5" />
                {t('owner.cards.totalProperties')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-10 w-16 bg-white/30" />
              ) : (
                <>
                  <div className="text-4xl font-bold mb-1">
                    {totalProperties}
                  </div>
                  <p className="text-white/80 text-sm">
                    {t('owner.cards.occupiedVacant', { occupied: occupiedCount, vacant: vacantCount })}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Withdrawable Earnings */}
          <Card className="bg-[#f5f7fa] border-none rounded-3xl shadow-lg shadow-black/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#1a1a1a]">
                <DollarSign className="w-5 h-5 text-[#3A6EA5]" />
                {t('owner.cards.monthlyRevenue')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-10 w-32" />
              ) : (
                <>
                  <div className="text-4xl font-bold text-[#3A6EA5] mb-1">
                    {(
                      monthlyChartData[monthlyChartData.length - 1]?.earnings ??
                      0
                    ).toLocaleString()}{' '}
                    EGP
                  </div>
                  <p className="text-[#4a5565] text-sm">
                    {t('owner.cards.totalViews', { count: dashboard?.totalViews ?? 0 })}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Withdrawable Earnings */}
          <Card className="bg-[#f5f7fa] border-none rounded-3xl shadow-lg shadow-black/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#1a1a1a]">
                <DollarSign className="w-5 h-5 text-[#3A6EA5]" />
                {t('owner.cards.withdrawableEarnings')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-10 w-32" />
              ) : (
                <>
                  <div className="text-4xl font-bold text-[#3A6EA5] mb-1">
                    {(dashboard?.withdrawableEarnings ?? 0).toLocaleString()}{' '}
                    EGP
                  </div>
                  <p className="text-[#4a5565] text-sm mb-1">
                    {t('owner.cards.onHold')}{' '}
                    <span className="font-medium text-[#1a1a1a]">
                      {(dashboard?.onHoldEarnings ?? 0).toLocaleString()} EGP
                    </span>
                  </p>
                  <Button
                    size="sm"
                    className="w-full bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-xl"
                    onClick={() => toast.success(t('owner.toasts.transferInitiated'))}
                  >
                    {t('owner.cards.transferMoney')}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Pending Requests */}
          <Card className="bg-[#f5f7fa] border-none rounded-3xl shadow-lg shadow-black/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#1a1a1a]">
                <Users className="w-5 h-5 text-[#3A6EA5]" />
                {t('owner.cards.pendingRequests')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-10 w-12" />
              ) : (
                <>
                  <div className="text-4xl font-bold text-[#3A6EA5] mb-1">
                    {dashboard?.pendingBookingRequestsCount ?? 0}
                  </div>
                  <p className="text-[#4a5565] text-sm">
                    {t('owner.cards.awaitingResponse')}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Earnings Chart */}
            <Card className="bg-white border-none rounded-3xl shadow-lg shadow-black/5">
              <CardHeader>
                <CardTitle className="text-2xl text-[#1a1a1a]">
                  {t('owner.chart.earningsOverview')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[300px] w-full rounded-2xl" />
                ) : chartData.length === 0 ? (
                  <p className="text-[#4a5565] text-center py-16">
                    {t('owner.chart.noData')}
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#3A6EA5"
                        opacity={0.1}
                      />
                      <XAxis dataKey="month" stroke="#4a5565" />
                      <YAxis stroke="#4a5565" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #3A6EA5',
                          borderRadius: '12px',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="earnings"
                        stroke="#3A6EA5"
                        strokeWidth={3}
                        dot={{ fill: '#3A6EA5', r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
                <div className="flex justify-center gap-3 mt-4">
                  {(['monthly', 'yearly'] as const).map((v) => (
                    <Button
                      key={v}
                      size="sm"
                      variant={view === v ? 'default' : 'outline'}
                      className={`rounded-xl ${
                        view === v
                          ? 'bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white'
                          : 'bg-[#f5f7fa] hover:bg-[#3A6EA5]/10 text-[#1a1a1a] border border-[#3A6EA5]/20'
                      }`}
                      onClick={() => setView(v)}
                    >
                      {t(`owner.chart.${v}`)}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Booking Requests */}
            <Card className="bg-white border-none rounded-3xl shadow-lg shadow-black/5">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl text-[#1a1a1a]">
                    {t('owner.pendingRequests.bookingRequests')}
                  </CardTitle>
                  {(dashboard?.pendingBookingRequestsCount ?? 0) > 0 && (
                    <Badge className="bg-[#3A6EA5] text-white hover:bg-[#3A6EA5]">
                      {dashboard?.pendingBookingRequestsCount} New
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full rounded-2xl" />
                  ))
                ) : pendingRequests.length === 0 ? (
                  <p className="text-[#4a5565] text-center py-8">
                    {t('owner.pendingRequests.noPending')}
                  </p>
                ) : (
                  pendingRequests.map((request, index) => (
                    <div
                      key={request.id ?? index}
                      className="bg-[#f5f7fa] rounded-2xl p-6 hover:shadow-lg transition-shadow border border-[#3A6EA5]/10"
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-14 h-14">
                            {request.tenantAvatarUrl && (
                              <AvatarImage src={request.tenantAvatarUrl} />
                            )}
                            <AvatarFallback>
                              {(request.tenant ?? request.tenantName ?? '?').charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-[#1a1a1a] mb-1">
                              {request.tenant ?? request.tenantName ?? t('owner.pendingRequests.unknownTenant')}
                            </h3>
                            <p className="text-sm text-[#4a5565] mb-2">
                              {request.property ?? request.propertyName ?? request.propertyTitle ?? t('owner.pendingRequests.unknownProperty')}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1 text-[#6a7282]">
                                <Calendar className="w-4 h-4" />
                                {/* requestedDates is pre-formatted by the server */}
                                {request.requestedDates}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            disabled={
                              accept.isPending || request.status !== 'pending'
                            }
                            onClick={() => handleAcceptRequest(request.id)}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            {t('owner.pendingRequests.accept')}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={
                              reject.isPending || request.status !== 'pending'
                            }
                            onClick={() => handleDeclineRequest(request.id)}
                            className="flex-1 rounded-xl border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            {t('owner.pendingRequests.decline')}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="rounded-xl border-[#3A6EA5]/20"
                          >
                            <Link to="/messages">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              {t('owner.pendingRequests.message')}
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Contracts History */}
            <Card className="bg-white border-none rounded-3xl shadow-lg shadow-black/5">
              <CardHeader>
                <CardTitle className="text-2xl text-[#1a1a1a]">
                  {t('owner.contracts.history')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-48 w-full rounded-2xl" />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#3A6EA5]/20">
                          <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                            {t('owner.contracts.contractId')}
                          </th>
                          <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                            {t('owner.contracts.property')}
                          </th>
                          <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                            {t('owner.contracts.tenant')}
                          </th>
                          <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                            {t('owner.contracts.status')}
                          </th>
                          <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                            {t('owner.contracts.expiry')}
                          </th>
                          <th className="text-right py-4 px-4 text-[#1a1a1a] font-semibold">
                            {t('owner.contracts.actions')}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {contracts.length === 0 ? (
                          <tr>
                            <td
                              colSpan={6}
                              className="text-center py-8 text-[#4a5565]"
                            >
                              {t('owner.contracts.noContracts')}
                            </td>
                          </tr>
                        ) : (
                          contracts.map((contract, index) => (
                            <tr
                              key={contract.id ?? index}
                              className="border-b border-[#3A6EA5]/10 hover:bg-[#f5f7fa] transition-colors"
                            >
                              <td className="py-4 px-4 text-[#1a1a1a] font-medium">
                                {contract.id}
                              </td>
                              <td className="py-4 px-4 text-[#4a5565]">
                                {contract.propertyName}
                              </td>
                              <td className="py-4 px-4 text-[#4a5565]">
                                {contract.tenantName}
                              </td>
                              <td className="py-4 px-4">
                                <Badge
                                  className={getContractStatusBadge(
                                    contract.status,
                                  )}
                                >
                                  {contract.status}
                                </Badge>
                              </td>
                              <td className="py-4 px-4 text-[#4a5565]">
                                {formatDate(contract.expiryDate)}
                              </td>
                              <td className="py-4 px-4 text-right">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleDownloadContract(contract.id)
                                  }
                                  className="rounded-xl border-[#3A6EA5]/20"
                                >
                                  <Download className="w-4 h-4 mr-1" />
                                  {t('owner.contracts.download')}
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Property Listings */}
            <Card className="bg-white border-none rounded-3xl shadow-lg shadow-black/5">
              <CardHeader>
                <CardTitle className="text-2xl text-[#1a1a1a]">
                  {t('owner.properties.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-36 w-full rounded-2xl" />
                    ))}
                  </div>
                ) : myProperties.length === 0 ? (
                  <p className="text-[#4a5565] text-center py-8">
                    {t('owner.properties.noPropertiesAdd')}{' '}
                    <Link to="/add-property" className="text-[#3A6EA5] hover:underline">
                      {t('owner.properties.addFirst')}
                    </Link>
                  </p>
                ) : (
                  <div className="space-y-4">
                    {myProperties.map((property) => (
                      <div
                        key={property.id}
                        className="bg-[#f5f7fa] rounded-2xl p-6 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex gap-4">
                          <img
                            src={
                              property.imagePath ??
                              property.image ??
                              property.imageUrl ??
                              property.images?.[0] ??
                              ''
                            }
                            alt={property.title}
                            className="w-32 h-32 rounded-xl object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-lg text-[#1a1a1a] mb-1">
                                  {property.title}
                                </h3>
                                <p className="text-sm text-[#4a5565] mb-2">
                                  {property.location} • {property.type}
                                </p>
                              </div>
                              <Badge
                                className={
                                  property.status === 'rented'
                                    ? 'bg-green-100 text-green-700 hover:bg-green-100'
                                    : 'bg-orange-100 text-orange-700 hover:bg-orange-100'
                                }
                              >
                                {property.status === 'rented'
                                  ? t('owner.properties.occupied')
                                  : t('owner.properties.vacant')}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-xs text-[#6a7282] mb-1">
                                  {t('owner.properties.monthlyRent')}
                                </p>
                                <p className="font-semibold text-[#3A6EA5]">
                                  {property.price.toLocaleString()} EGP
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-[#6a7282] mb-1">
                                  {t('owner.properties.rating')}
                                </p>
                                <p className="text-sm text-[#1a1a1a] flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-[#3A6EA5] text-[#3A6EA5]" />
                                  {property.rating ?? 'N/A'}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl border-[#3A6EA5]/20"
                                asChild
                              >
                                <Link to={`/edit-property/${property.id}`}>
                                  {t('owner.properties.edit')}
                                </Link>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl border-[#3A6EA5]/20"
                                asChild
                              >
                                <Link to={`/property/${property.id}`}>
                                  {t('owner.properties.viewDetails')}
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-xl"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white border-none rounded-3xl shadow-lg shadow-black/5">
              <CardHeader>
                <CardTitle className="text-xl text-[#1a1a1a]">
                  {t('owner.quickActions.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start bg-[#f5f7fa] hover:bg-[#3A6EA5]/10 text-[#1a1a1a] rounded-xl border border-[#3A6EA5]/20"
                  variant="outline"
                  asChild
                >
                  <Link to="/messages">
                    <MessageSquare className="w-5 h-5 mr-2 text-[#3A6EA5]" />
                    {t('owner.quickActions.messages')}
                  </Link>
                </Button>
                <Button
                  className="w-full justify-start bg-[#f5f7fa] hover:bg-[#3A6EA5]/10 text-[#1a1a1a] rounded-xl border border-[#3A6EA5]/20"
                  variant="outline"
                  asChild
                >
                  <Link to="/add-property">
                    <Plus className="w-5 h-5 mr-2 text-[#3A6EA5]" />
                    {t('owner.quickActions.addProperty')}
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="bg-white border-none rounded-3xl shadow-lg shadow-black/5">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-[#1a1a1a]">
                    {t('owner.notifications.title')}
                  </CardTitle>
                  {(dashboard?.unreadNotificationsCount ?? 0) > 0 && (
                    <Badge className="bg-[#3A6EA5] text-white hover:bg-[#3A6EA5]">
                      {t('owner.notifications.unread', { count: dashboard?.unreadNotificationsCount })}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-xl" />
                  ))
                ) : notifications.length === 0 ? (
                  <p className="text-[#4a5565] text-center py-4 text-sm">
                    {t('owner.notifications.none')}
                  </p>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-xl transition-colors ${
                        notification.isRead
                          ? 'bg-[#f5f7fa]'
                          : 'bg-[#3A6EA5]/5 border border-[#3A6EA5]/20'
                      }`}
                    >
                      <p className="text-sm text-[#1a1a1a] mb-1">
                        {notification.title}
                      </p>
                      <p className="text-xs text-[#6a7282]">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Occupancy Rate */}
            <Card className="bg-white border-none rounded-3xl shadow-lg shadow-black/5">
              <CardHeader>
                <CardTitle className="text-xl text-[#1a1a1a]">
                  {t('owner.occupancy.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-48 w-full rounded-2xl" />
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={occupancyData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {occupancyData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2 mt-4">
                      {occupancyData.map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm text-[#1a1a1a]">
                              {item.name}
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-[#1a1a1a]">
                            {item.value}
                            {totalProperties > 0 &&
                              ` (${((item.value / totalProperties) * 100).toFixed(0)}%)`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-white border-none rounded-3xl shadow-lg shadow-black/5">
              <CardHeader>
                <CardTitle className="text-xl text-[#1a1a1a]">
                  {t('owner.quickStats.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-[#f5f7fa] rounded-2xl p-4">
                  <p className="text-sm text-[#6a7282] mb-1">
                    {t('owner.quickStats.totalProperties')}
                  </p>
                  <div className="text-2xl font-bold text-[#3A6EA5]">
                    {isLoading ? (
                      <Skeleton className="h-8 w-12 inline-block" />
                    ) : (
                      totalProperties
                    )}
                  </div>
                </div>
                <div className="bg-[#f5f7fa] rounded-2xl p-4">
                  <p className="text-sm text-[#6a7282] mb-1">
                    {t('owner.quickStats.pendingRequests')}
                  </p>
                  <div className="text-2xl font-bold text-[#3A6EA5]">
                    {isLoading ? (
                      <Skeleton className="h-8 w-12 inline-block" />
                    ) : (
                      (dashboard?.pendingBookingRequestsCount ?? 0)
                    )}
                  </div>
                </div>
                <div className="bg-[#f5f7fa] rounded-2xl p-4">
                  <p className="text-sm text-[#6a7282] mb-1">
                    {t('owner.quickStats.activeContracts')}
                  </p>
                  <div className="text-2xl font-bold text-[#3A6EA5] flex items-center gap-2">
                    {isLoading ? (
                      <Skeleton className="h-8 w-12 inline-block" />
                    ) : (
                      <>
                        {contracts.filter((c) => c.status === 'Active').length}
                        <Eye className="w-5 h-5" />
                      </>
                    )}
                  </div>
                </div>
                <div className="bg-[#f5f7fa] rounded-2xl p-4">
                  <p className="text-sm text-[#6a7282] mb-1">{t('owner.quickStats.averageRating')}</p>
                  <div className="text-2xl font-bold text-[#3A6EA5] flex items-center gap-2">
                    {isLoading ? (
                      <Skeleton className="h-8 w-12 inline-block" />
                    ) : (
                      <>
                        {(dashboard?.averageRating ?? 0).toFixed(1)}
                        <Star className="w-5 h-5 fill-[#3A6EA5]" />
                      </>
                    )}
                  </div>
                  <p className="text-xs text-[#6a7282] mt-1">
                    {t('owner.quickStats.reviews', { count: dashboard?.ratingsCount ?? 0 })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
