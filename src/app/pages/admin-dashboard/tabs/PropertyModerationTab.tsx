import { useState } from 'react'
import { motion } from 'motion/react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  Building,
  Eye,
  CheckCircle,
  XCircle,
  Loader2,
  Search,
  Trash2,
  RotateCcw,
  Download
} from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { Skeleton } from '../../../components/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../components/ui/tooltip'
import {
  useAdminPropertyModerationQueue,
  useReviewPropertyModeration,
  useAdminPropertyVerification,
} from '@/hooks/useAdminStats'
import { adminService, type PendingPropertyVerification } from '@/services/adminService'
import { toast } from 'sonner'
import { getStatusBadge, buildImageUrl } from '../utils'
import { PropertiesStatsView } from './PropertiesStatsView'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'

export function PropertyModerationTab() {
  const [search, setSearch] = useState('')
  const [activeSearch, setActiveSearch] = useState('')
  const [pageSize, setPageSize] = useState(20)
  const [selectedProperty, setSelectedProperty] = useState<PendingPropertyVerification | null>(null)
  const [reviewStatus, setReviewStatus] = useState<string>('')
  const [adminNote, setAdminNote] = useState('')
  const [detailsPropertyId, setDetailsPropertyId] = useState<number | null>(null)

  const { data: detailsData, isLoading: detailsLoading } = useAdminPropertyVerification(detailsPropertyId)
  const fullProperty = detailsData?.data

  const { data, isLoading, isFetching } = useAdminPropertyModerationQueue(1, pageSize, activeSearch)
  const reviewMutation = useReviewPropertyModeration()

  const queueItems = data?.data?.items ?? []
  const totalCount = data?.data?.totalCount ?? 0

  const handleReviewSubmit = () => {
    if (!selectedProperty) return
    reviewMutation.mutate(
      {
        propertyId: selectedProperty.propertyId,
        status: reviewStatus as any,
        note: adminNote,
      },
      {
        onSuccess: () => {
          toast.success('Property review submitted')
          setSelectedProperty(null)
        },
      }
    )
  }

  const [searchParams, setSearchParams] = useSearchParams()
  const activeSubTab = searchParams.get('subtab') || 'moderation'
  const handleSubTabChange = (value: string) => {
    setSearchParams((prev) => {
      if (value === 'moderation') {
        prev.delete('subtab')
      } else {
        prev.set('subtab', value)
      }
      return prev
    }, { replace: true, preventScrollReset: true })
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeSubTab} onValueChange={handleSubTabChange} className="w-full">
        <TabsList className="bg-[#E5E9F0] border-none rounded-xl p-1 mb-6">
          <TabsTrigger value="moderation" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#3A6EA5] data-[state=active]:shadow-sm">
            Pending Properties
          </TabsTrigger>
          <TabsTrigger value="properties" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#3A6EA5] data-[state=active]:shadow-sm">
            All Properties
          </TabsTrigger>
        </TabsList>

        <TabsContent value="moderation" className="mt-0">
          <Card className="bg-[#F2F4F6] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <CardTitle className="text-2xl text-[#1a1a1a]">
                  Pending Properties
                </CardTitle>
                <div className="flex w-full sm:w-auto items-center gap-2">
                  <Input
                    placeholder="Search titles, descriptions..."
                    className="w-full sm:w-64 bg-white rounded-xl border-[#3A6EA5]/20"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setActiveSearch(search)
                    }}
                  />
                  <Button
                    size="icon"
                    className="bg-[#3A6EA5] hover:bg-[#2A527A] text-white rounded-xl flex-shrink-0"
                    onClick={() => setActiveSearch(search)}
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {!isLoading && queueItems.length === 0 ? (
                <div className="py-10 text-center text-[#4a5565] border-b border-[#3A6EA5]/20">
                  No items in pending properties.
                </div>
              ) : (
              <div className="overflow-x-auto overflow-y-scroll max-h-[600px] border-b border-[#3A6EA5]/20">
                <table className="w-full relative" style={{ tableLayout: 'fixed' }}>
                  <thead className="sticky top-0 bg-[#F2F4F6] z-10">
                    <tr className="border-b border-[#3A6EA5]/20">
                      <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold" style={{ width: '30%' }}>
                        Property Details
                      </th>
                      <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold" style={{ width: '20%' }}>
                        Owner
                      </th>
                      <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold" style={{ width: '15%' }}>
                        Submitted Date
                      </th>
                      <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold" style={{ width: '15%' }}>
                        Status
                      </th>
                      <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold" style={{ width: '20%' }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="border-b border-[#3A6EA5]/10">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <td key={j} className="py-4 px-4">
                              <Skeleton className="h-5 w-full rounded" />
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      queueItems.map((item) => (
                        <tr key={item.propertyId} className="border-b border-[#3A6EA5]/10 hover:bg-white/50 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex flex-col max-w-xs">
                              <Link
                                to={`/properties/${item.propertyId}`}
                                target="_blank"
                                className="font-medium text-[#3A6EA5] hover:underline truncate"
                              >
                                {item.title || `Property #${item.propertyId}`}
                              </Link>
                              <span className="text-xs text-[#4a5565] truncate mt-1">
                                {item.typeDisplayName} — {item.cityDisplayName}, {item.governorateDisplayName}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex flex-col">
                              <span className="text-[#1a1a1a]">{item.ownerFullName}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-[#4a5565]">
                            {new Date(item.createdAt).toLocaleDateString('en-GB')}
                          </td>
                          <td className="py-4 px-4">
                            {getStatusBadge(item.statusDisplayName)}
                          </td>
                          <td className="py-4 px-4">
                            <TooltipProvider delayDuration={700}>
                              <div className="flex gap-2 justify-start">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="icon"
                                      variant="outline"
                                      className="rounded-xl border-[#3A6EA5]/20 w-8 h-8 shrink-0"
                                      onClick={() => setDetailsPropertyId(item.propertyId)}
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent><p>View Details</p></TooltipContent>
                                </Tooltip>
                                {item.status !== 'Verified' && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        size="icon"
                                        variant="outline"
                                        className="border-[#00A650] text-[#00A650] hover:bg-[#00A650] hover:text-white rounded-xl w-8 h-8 shrink-0"
                                        onClick={() => {
                                          setSelectedProperty(item)
                                          setReviewStatus('Approved')
                                          setAdminNote('')
                                        }}
                                      >
                                        <CheckCircle className="w-4 h-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Approve</p></TooltipContent>
                                  </Tooltip>
                                )}
                                {item.status !== 'Declined' && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        size="icon"
                                        variant="outline"
                                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-xl w-8 h-8 shrink-0"
                                        onClick={() => {
                                          setSelectedProperty(item)
                                          setReviewStatus('Rejected')
                                          setAdminNote('')
                                        }}
                                      >
                                        <XCircle className="w-4 h-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Reject</p></TooltipContent>
                                  </Tooltip>
                                )}
                              </div>
                            </TooltipProvider>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              )}

              {totalCount > queueItems.length && (
                <div className="mt-4 flex justify-center items-center min-h-[40px]">
                  {isFetching ? (
                    <Loader2 className="w-6 h-6 animate-spin text-[#3A6EA5]" />
                  ) : (
                    <Button
                      variant="outline"
                      className="rounded-xl border-[#3A6EA5]/20 text-[#3A6EA5] hover:bg-[#3A6EA5] hover:text-white"
                      onClick={() => setPageSize((p) => p + 20)}
                    >
                      Show More
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="properties" className="mt-0">
          <PropertiesStatsView />
        </TabsContent>
      </Tabs>

      <Dialog
        open={selectedProperty !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedProperty(null)
        }}
      >
        <DialogContent aria-describedby={undefined} className="bg-white rounded-3xl max-w-md w-[95vw] mx-auto p-6 border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#1a1a1a]">
              Review Property
            </DialogTitle>
          </DialogHeader>

          {selectedProperty && (
            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-[#1a1a1a]">Property Details</p>
                <div className="text-sm text-[#4a5565] bg-[#F2F4F6] p-3 rounded-xl border border-[#3A6EA5]/10">
                  <p><strong>Title:</strong> {selectedProperty.title}</p>
                  <p className="mt-1"><strong>Owner:</strong> {selectedProperty.ownerFullName}</p>
                  <p className="mt-1"><strong>Current Status:</strong> {selectedProperty.statusDisplayName}</p>
                  <div className="mt-3">
                    <Link
                      to={`/properties/${selectedProperty.propertyId}`}
                      target="_blank"
                      className="text-[#3A6EA5] hover:underline font-medium inline-flex items-center gap-1"
                    >
                      View full property page <Eye className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Review Status</p>
                <Select value={reviewStatus} onValueChange={setReviewStatus}>
                  <SelectTrigger className="w-full bg-[#F2F4F6] border-none rounded-xl">
                    <SelectValue placeholder="Select outcome" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Approved">Approve</SelectItem>
                    <SelectItem value="Rejected">Reject</SelectItem>
                    <SelectItem value="Pending">Needs More Info</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Admin Note (Optional)</p>
                <textarea
                  className="w-full h-24 p-3 bg-[#F2F4F6] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#3A6EA5] outline-none resize-none"
                  placeholder="Add context for this decision..."
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                />
              </div>

              <DialogFooter className="pt-4 border-t border-[#3A6EA5]/10 mt-6 flex-col sm:flex-row gap-3 sm:gap-0">
                <Button variant="outline" onClick={() => setSelectedProperty(null)} className="rounded-xl w-full sm:w-auto">
                  Cancel
                </Button>
                <Button
                  onClick={handleReviewSubmit}
                  disabled={reviewMutation.isPending}
                  className="bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-xl w-full sm:w-auto"
                >
                  {reviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!detailsPropertyId}
        onOpenChange={(open) => {
          if (!open) setDetailsPropertyId(null)
        }}
      >
        <DialogContent aria-describedby={undefined} className="bg-white rounded-3xl max-w-3xl w-[95vw] mx-auto p-8 border-none shadow-2xl overflow-y-auto max-h-[90vh]">
          {detailsLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-[#3A6EA5]" />
            </div>
          ) : fullProperty ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-2xl font-bold text-[#1a1a1a]">
                  {fullProperty.title}
                </DialogTitle>
                <div className="text-[#4a5565] text-sm">
                  {fullProperty.cityDisplayName}, {fullProperty.governorateDisplayName}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#F8F9FA] rounded-2xl p-4">
                  <p className="text-[#4a5565] text-sm mb-1">Owner</p>
                  <p className="font-semibold text-[#1a1a1a]">{fullProperty.ownerFullName}</p>
                  <p className="text-[#4a5565] text-sm">{fullProperty.ownerEmail}</p>
                </div>
                
                <div className="bg-[#F8F9FA] rounded-2xl p-4">
                  <p className="text-[#4a5565] text-sm mb-1">Type</p>
                  <p className="font-semibold text-[#1a1a1a]">{fullProperty.typeDisplayName || fullProperty.type}</p>
                </div>

                <div className="bg-[#F8F9FA] rounded-2xl p-4">
                  <p className="text-[#4a5565] text-sm mb-1">Status</p>
                  <div className="mt-1">
                    {getStatusBadge(fullProperty.statusDisplayName || fullProperty.status)}
                  </div>
                </div>

                <div className="bg-[#F8F9FA] rounded-2xl p-4">
                  <p className="text-[#4a5565] text-sm mb-1">Submitted</p>
                  <p className="font-semibold text-[#1a1a1a]">
                    {fullProperty.createdAt ? new Date(fullProperty.createdAt).toLocaleDateString('en-GB') : 'N/A'}
                  </p>
                </div>

                <div className="bg-[#F8F9FA] rounded-2xl p-4 md:col-span-2">
                  <p className="text-[#4a5565] text-sm mb-1">Description</p>
                  <p className="text-[#1a1a1a]">
                    {fullProperty.description || 'No description provided.'}
                  </p>
                </div>
              </div>

              {fullProperty.proofOfOwnership ? (
                <div>
                  <p className="text-[#4a5565] font-semibold mb-3">Ownership Document</p>
                  <div className="relative rounded-2xl overflow-hidden border border-[#E5E9F0] group">
                    <img 
                      src={buildImageUrl(fullProperty.proofOfOwnership)} 
                      alt="Proof of Ownership" 
                      className="w-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                      onClick={() => window.open(buildImageUrl(fullProperty.proofOfOwnership), '_blank')}
                    />
                    <a 
                      href={buildImageUrl(fullProperty.proofOfOwnership)} 
                      download 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="absolute bottom-3 right-3 bg-black hover:bg-black/80 text-white p-2.5 rounded-xl shadow-lg transition-colors flex items-center justify-center"
                      onClick={(e) => e.stopPropagation()}
                      title="Download Document"
                    >
                      <Download className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center bg-[#F8F9FA] rounded-2xl border border-dashed border-[#E5E9F0]">
                  <p className="text-[#4a5565] font-medium">No contract for this property</p>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <Button 
                  className="flex-1 bg-[#00A650] hover:bg-[#008A42] text-white rounded-xl h-12 text-base font-semibold"
                  disabled={reviewMutation.isPending}
                  onClick={() => {
                    reviewMutation.mutate({ propertyId: fullProperty.propertyId, status: 'Approved', note: '' }, {
                      onSuccess: () => {
                        toast.success('Property approved')
                        setDetailsPropertyId(null)
                      }
                    })
                  }}
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Approve
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 border-[#FF4D4F] text-[#FF4D4F] hover:bg-[#FF4D4F] hover:text-white rounded-xl h-12 text-base font-semibold"
                  disabled={reviewMutation.isPending}
                  onClick={() => {
                    setSelectedProperty(fullProperty)
                    setReviewStatus('Rejected')
                    setAdminNote('')
                    setDetailsPropertyId(null) // close details modal and let the existing review modal handle the rejection note
                  }}
                >
                  <XCircle className="w-5 h-5 mr-2" />
                  Decline
                </Button>
              </div>

            </div>
          ) : (
            <div className="py-10 text-center text-red-500">
              Failed to load property details.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
