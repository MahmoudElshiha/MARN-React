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
import { useState } from 'react'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card'
import { useOwnerDashboard } from '../hooks/useOwnerDashboard'

function getContractStatusBadge(status: string) {
  const styles = {
    Active: 'bg-green-100 text-green-700 hover:bg-green-100',
    Expired: 'bg-red-100 text-red-700 hover:bg-red-100',
    Pending: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
  }

  return (
    styles[status as keyof typeof styles] ||
    'bg-gray-100 text-gray-700 hover:bg-gray-100'
  )
}

export function OwnerDashboardView() {
  const { dashboard, loading, error } = useOwnerDashboard()
  const [view, setView] = useState<'monthly' | 'yearly'>('monthly')

  const handleAcceptRequest = (_id: string) => {
    toast.success('Booking request accepted')
  }

  const handleDeclineRequest = (_id: string) => {
    toast.error('Booking request declined')
  }

  const handleDownloadContract = (contractId: string) => {
    toast.success(`Downloading contract ${contractId}`)
  }

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
        {error?.message ?? 'Failed to load owner dashboard'}
      </div>
    )
  }

  const chartData =
    view === 'monthly' ? dashboard.earningsMonthly : dashboard.earningsYearly

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-[1440px] mx-auto px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#1a1a1a] mb-2">
              Owner Dashboard
            </h1>
            <p className="text-[#4a5565]">
              Manage your properties and track performance
            </p>
          </div>
          <Button
            size="lg"
            className="bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-xl shadow-lg shadow-[#3A6EA5]/30"
            asChild
          >
            <Link to="/add-property">
              <Plus className="w-5 h-5 mr-2" />
              Add New Property
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-[#3A6EA5] to-[#9CBBDC] border-none text-white rounded-3xl shadow-lg shadow-[#3A6EA5]/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-white/90">
                <Home className="w-5 h-5" />
                Total Properties
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-1">
                {dashboard.summary.totalProperties}
              </div>
              <p className="text-white/80 text-sm">
                {dashboard.summary.occupiedProperties} occupied •{' '}
                {dashboard.summary.vacantProperties} vacant
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#f5f7fa] border-none rounded-3xl shadow-lg shadow-black/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#1a1a1a]">
                <DollarSign className="w-5 h-5 text-[#3A6EA5]" />
                Monthly Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#3A6EA5] mb-1">
                {dashboard.summary.monthlyRevenue.toLocaleString()} EGP
              </div>
              <p className="text-green-600 text-sm">
                +{dashboard.summary.monthlyRevenueChangePercent}% from last
                month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#f5f7fa] border-none rounded-3xl shadow-lg shadow-black/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#1a1a1a]">
                <DollarSign className="w-5 h-5 text-[#3A6EA5]" />
                Money Saved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <div className="text-4xl font-bold text-[#3A6EA5]">
                  {dashboard.summary.moneySaved.toLocaleString()} EGP
                </div>
              </div>
              <p className="text-[#4a5565] text-sm mb-3">
                Available for transfer
              </p>
              <Button
                size="sm"
                className="w-full bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-xl"
                onClick={() => toast.success('Transfer initiated')}
              >
                Transfer Money
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#f5f7fa] border-none rounded-3xl shadow-lg shadow-black/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[#1a1a1a]">
                <Users className="w-5 h-5 text-[#3A6EA5]" />
                Pending Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#3A6EA5] mb-1">
                {dashboard.summary.pendingRequests}
              </div>
              <p className="text-[#4a5565] text-sm">Awaiting your response</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-white border-none rounded-3xl shadow-lg shadow-black/5">
              <CardHeader>
                <CardTitle className="text-2xl text-[#1a1a1a]">
                  Earnings Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
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
                <div className="flex justify-center gap-3 mt-4">
                  <Button
                    size="sm"
                    className={`${
                      view === 'monthly'
                        ? 'bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white'
                        : 'bg-[#f5f7fa] hover:bg-[#3A6EA5]/10 text-[#1a1a1a] border border-[#3A6EA5]/20'
                    } rounded-xl`}
                    variant={view === 'monthly' ? 'default' : 'outline'}
                    onClick={() => setView('monthly')}
                  >
                    Monthly
                  </Button>
                  <Button
                    size="sm"
                    className={`${
                      view === 'yearly'
                        ? 'bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white'
                        : 'bg-[#f5f7fa] hover:bg-[#3A6EA5]/10 text-[#1a1a1a] border border-[#3A6EA5]/20'
                    } rounded-xl`}
                    variant={view === 'yearly' ? 'default' : 'outline'}
                    onClick={() => setView('yearly')}
                  >
                    Yearly
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-none rounded-3xl shadow-lg shadow-black/5">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl text-[#1a1a1a]">
                    Booking Requests
                  </CardTitle>
                  <Badge className="bg-[#3A6EA5] text-white hover:bg-[#3A6EA5]">
                    {dashboard.bookingRequests.length} New
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {dashboard.bookingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="bg-[#f5f7fa] rounded-2xl p-6 hover:shadow-lg transition-shadow border border-[#3A6EA5]/10"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-14 h-14">
                          <AvatarImage src={request.image} />
                          <AvatarFallback>
                            {request.tenant.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-[#1a1a1a] mb-1">
                            {request.tenant}
                          </h3>
                          <p className="text-sm text-[#4a5565] mb-2">
                            {request.property}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1 text-[#6a7282]">
                              <Calendar className="w-4 h-4" />
                              {request.requestedDates}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleAcceptRequest(request.id)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeclineRequest(request.id)}
                          className="flex-1 rounded-xl border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Decline
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="rounded-xl border-[#3A6EA5]/20"
                        >
                          <Link to="/messages">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Message
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-white border-none rounded-3xl shadow-lg shadow-black/5">
              <CardHeader>
                <CardTitle className="text-2xl text-[#1a1a1a]">
                  Contracts History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#3A6EA5]/20">
                        <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                          Contract ID
                        </th>
                        <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                          Property Name
                        </th>
                        <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                          Tenant Name
                        </th>
                        <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                          Status
                        </th>
                        <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                          Expiry Date
                        </th>
                        <th className="text-right py-4 px-4 text-[#1a1a1a] font-semibold">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboard.contractsHistory.map((contract) => (
                        <tr
                          key={contract.id}
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
                            {contract.expiryDate}
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
                              Download
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-none rounded-3xl shadow-lg shadow-black/5">
              <CardHeader>
                <CardTitle className="text-2xl text-[#1a1a1a]">
                  My Properties
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboard.properties.map((property) => (
                    <div
                      key={property.id}
                      className="bg-[#f5f7fa] rounded-2xl p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex gap-4">
                        <img
                          src={property.image}
                          alt={property.name}
                          className="w-32 h-32 rounded-xl object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg text-[#1a1a1a] mb-1">
                                {property.name}
                              </h3>
                              <p className="text-sm text-[#4a5565] mb-2">
                                {property.location} • {property.type}
                              </p>
                            </div>
                            <Badge
                              className={`${
                                property.status === 'occupied'
                                  ? 'bg-green-100 text-green-700 hover:bg-green-100'
                                  : 'bg-orange-100 text-orange-700 hover:bg-orange-100'
                              }`}
                            >
                              {property.status === 'occupied'
                                ? 'Occupied'
                                : 'Vacant'}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-[#6a7282] mb-1">
                                Monthly Rent
                              </p>
                              <p className="font-semibold text-[#3A6EA5]">
                                ${property.rent.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-[#6a7282] mb-1">
                                Tenant
                              </p>
                              <p className="text-sm text-[#1a1a1a]">
                                {property.tenant ?? 'N/A'}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-[#6a7282] mb-1">
                                Views
                              </p>
                              <p className="text-sm text-[#1a1a1a] flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {property.views}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-xl border-[#3A6EA5]/20"
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-xl border-[#3A6EA5]/20"
                            >
                              View Details
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
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-white border-none rounded-3xl shadow-lg shadow-black/5">
              <CardHeader>
                <CardTitle className="text-xl text-[#1a1a1a]">
                  Quick Actions
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
                    Messages
                  </Link>
                </Button>
                <Button
                  className="w-full justify-start bg-[#f5f7fa] hover:bg-[#3A6EA5]/10 text-[#1a1a1a] rounded-xl border border-[#3A6EA5]/20"
                  variant="outline"
                  asChild
                >
                  <Link to="/add-property">
                    <Plus className="w-5 h-5 mr-2 text-[#3A6EA5]" />
                    Add Property
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white border-none rounded-3xl shadow-lg shadow-black/5">
              <CardHeader>
                <CardTitle className="text-xl text-[#1a1a1a]">
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {dashboard.notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-xl transition-colors ${
                      notification.read
                        ? 'bg-[#f5f7fa]'
                        : 'bg-[#3A6EA5]/5 border border-[#3A6EA5]/20'
                    }`}
                  >
                    <p className="text-sm text-[#1a1a1a] mb-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-[#6a7282]">
                      {notification.time}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-white border-none rounded-3xl shadow-lg shadow-black/5">
              <CardHeader>
                <CardTitle className="text-xl text-[#1a1a1a]">
                  Occupancy Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={dashboard.occupancy}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {dashboard.occupancy.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">
                  {dashboard.occupancy.map((item) => (
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
                        {item.value} (
                        {(
                          (item.value / dashboard.summary.totalProperties) *
                          100
                        ).toFixed(0)}
                        %)
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-none rounded-3xl shadow-lg shadow-black/5">
              <CardHeader>
                <CardTitle className="text-xl text-[#1a1a1a]">
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-[#f5f7fa] rounded-2xl p-4">
                  <p className="text-sm text-[#6a7282] mb-1">Average Rent</p>
                  <p className="text-2xl font-bold text-[#3A6EA5]">
                    ${dashboard.quickStats.averageRent.toLocaleString()}
                  </p>
                </div>
                <div className="bg-[#f5f7fa] rounded-2xl p-4">
                  <p className="text-sm text-[#6a7282] mb-1">Total Tenants</p>
                  <p className="text-2xl font-bold text-[#3A6EA5]">
                    {dashboard.quickStats.totalTenants}
                  </p>
                </div>
                <div className="bg-[#f5f7fa] rounded-2xl p-4">
                  <p className="text-sm text-[#6a7282] mb-1">Average Rating</p>
                  <p className="text-2xl font-bold text-[#3A6EA5] flex items-center gap-2">
                    {dashboard.quickStats.averageRating}
                    <Star className="w-5 h-5 fill-[#3A6EA5]" />
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
