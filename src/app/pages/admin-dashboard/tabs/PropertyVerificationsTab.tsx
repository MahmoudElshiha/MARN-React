import { useState } from 'react'
import { motion } from 'motion/react'
import {
  Building,
  Eye,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Skeleton } from '../../../components/ui/skeleton'
import {
  useAdminPropertyVerifications,
  useAdminPropertyVerification,
} from '@/hooks/useAdminStats'
import { adminService } from '@/services/adminService'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { buildImageUrl, getStatusBadge } from '../utils'

export function PropertyVerificationsTab() {
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(
    null,
  )
  const [pageSize, setPageSize] = useState(10)
  const [showPropertyRejectModal, setShowPropertyRejectModal] = useState(false)
  const [pendingRejectPropertyId, setPendingRejectPropertyId] = useState<
    number | null
  >(null)
  const [propertyRejectReason, setPropertyRejectReason] = useState('')

  const queryClient = useQueryClient()

  const {
    data: propertyVerificationsData,
    isLoading: propertyVerificationsLoading,
    isFetching: propertyVerificationsFetching,
  } = useAdminPropertyVerifications(1, pageSize)
  const {
    data: propertyVerificationDetailData,
    isLoading: propertyVerificationDetailLoading,
  } = useAdminPropertyVerification(selectedPropertyId)

  const propertyVerificationDetail = propertyVerificationDetailData?.data
  const pendingPropertyVerifications =
    propertyVerificationsData?.data?.items ?? []
  const totalCount = propertyVerificationsData?.data?.totalCount ?? 0

  const approvePropertyVerification = useMutation({
    mutationFn: (propertyId: number) =>
      adminService.approvePropertyVerification(propertyId),
    onSuccess: () => {
      toast.success('Property verification approved')
      queryClient.invalidateQueries({
        queryKey: ['adminPropertyVerifications'],
      })
      queryClient.invalidateQueries({ queryKey: ['adminStats'] })
      setSelectedPropertyId(null)
    },
    onError: () => toast.error('Failed to approve property'),
  })

  const declinePropertyVerification = useMutation({
    mutationFn: ({
      propertyId,
      reason,
    }: {
      propertyId: number
      reason: string
    }) => adminService.declinePropertyVerification(propertyId, reason),
    onSuccess: () => {
      toast.success('Property verification declined')
      queryClient.invalidateQueries({
        queryKey: ['adminPropertyVerifications'],
      })
      queryClient.invalidateQueries({ queryKey: ['adminStats'] })
      setShowPropertyRejectModal(false)
      setPendingRejectPropertyId(null)
      setPropertyRejectReason('')
      setSelectedPropertyId(null)
    },
    onError: () => toast.error('Failed to decline property'),
  })

  const handleApproveProperty = (propertyId: number) =>
    approvePropertyVerification.mutate(propertyId)
  const handleDeclineProperty = (propertyId: number) => {
    setPendingRejectPropertyId(propertyId)
    setPropertyRejectReason('')
    setShowPropertyRejectModal(true)
  }
  const confirmPropertyDecline = () => {
    if (pendingRejectPropertyId && propertyRejectReason.trim()) {
      declinePropertyVerification.mutate({
        propertyId: pendingRejectPropertyId,
        reason: propertyRejectReason.trim(),
      })
    }
  }

  return (
    <>
      <Card className="bg-[#F2F4F6] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl text-[#1a1a1a]">
              Pending Property Verifications
            </CardTitle>
            <span className="text-sm text-[#4a5565]">
              {pendingPropertyVerifications.length} pending
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto overflow-y-auto max-h-[600px] border-b border-[#3A6EA5]/20">
            <table className="w-full relative">
              <thead className="sticky top-0 bg-[#F2F4F6] z-10">
                <tr className="border-b border-[#3A6EA5]/20">
                  <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                    Property
                  </th>
                  <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                    Owner
                  </th>
                  <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                    Type
                  </th>
                  <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                    Governorate
                  </th>
                  <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                    Submitted
                  </th>
                  <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                    Status
                  </th>
                  <th className="text-right py-4 px-4 text-[#1a1a1a] font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {propertyVerificationsLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr
                      key={i}
                      className="border-b border-[#3A6EA5]/10"
                    >
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="py-4 px-4">
                          <Skeleton className="h-5 w-full rounded" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : pendingPropertyVerifications.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-10 text-center text-[#4a5565]"
                    >
                      No pending property verifications.
                    </td>
                  </tr>
                ) : (
                  pendingPropertyVerifications.map((item) => (
                    <tr
                      key={item.propertyId}
                      className="border-b border-[#3A6EA5]/10 hover:bg-white/50 transition-colors"
                    >
                      <td className="py-4 px-4 text-[#1a1a1a] font-medium">
                        <div className="flex items-center gap-3">
                          {item.mainImage ? (
                            <img
                              src={buildImageUrl(item.mainImage)}
                              alt={item.title}
                              className="w-10 h-10 rounded-xl object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-[#3A6EA5]/10 flex items-center justify-center shrink-0">
                              <Building className="w-5 h-5 text-[#3A6EA5]" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium">
                              {item.title}
                            </div>
                            <div className="text-xs text-[#4a5565]">
                              {item.address}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-[#1a1a1a] font-medium">
                          {item.ownerFullName}
                        </div>
                        <div className="text-xs text-[#4a5565]">
                          {item.ownerEmail}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-[#4a5565]">
                        {item.typeDisplayName}
                      </td>
                      <td className="py-4 px-4 text-[#4a5565]">
                        {item.governorate}
                      </td>
                      <td className="py-4 px-4 text-[#4a5565]">
                        {new Date(item.submittedAt).toLocaleDateString(
                          'en-GB',
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {getStatusBadge(item.statusDisplayName)}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-xl border-[#3A6EA5]/20"
                            onClick={() =>
                              setSelectedPropertyId(item.propertyId)
                            }
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white rounded-xl"
                            disabled={
                              approvePropertyVerification.isPending
                            }
                            onClick={() =>
                              handleApproveProperty(item.propertyId)
                            }
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-xl"
                            disabled={
                              declinePropertyVerification.isPending
                            }
                            onClick={() =>
                              handleDeclineProperty(item.propertyId)
                            }
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Decline
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {totalCount > pendingPropertyVerifications.length && (
            <div className="mt-4 flex justify-center items-center min-h-[40px]">
              {propertyVerificationsFetching ? (
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

      {/* Property Verification Detail Modal */}
      {selectedPropertyId && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPropertyId(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                {propertyVerificationDetailLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-7 w-48 rounded" />
                    <Skeleton className="h-4 w-36 rounded" />
                  </div>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-[#1a1a1a]">
                      {propertyVerificationDetail?.title}
                    </h3>
                    <p className="text-sm text-[#4a5565] mt-1">
                      {propertyVerificationDetail?.address},{' '}
                      {propertyVerificationDetail?.governorate}
                    </p>
                  </>
                )}
              </div>
              <Button
                size="sm"
                variant="outline"
                className="rounded-xl border-[#3A6EA5]/20 shrink-0"
                onClick={() => setSelectedPropertyId(null)}
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              {propertyVerificationDetailLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-[#F2F4F6] rounded-2xl p-4 space-y-2"
                  >
                    <Skeleton className="h-3 w-20 rounded" />
                    <Skeleton className="h-5 w-32 rounded" />
                  </div>
                ))
              ) : (
                <>
                  <div className="bg-[#F2F4F6] rounded-2xl p-4">
                    <p className="text-[#4a5565] mb-1">Owner</p>
                    <p className="font-semibold text-[#1a1a1a]">
                      {propertyVerificationDetail?.ownerFullName}
                    </p>
                    <p className="text-xs text-[#4a5565]">
                      {propertyVerificationDetail?.ownerEmail}
                    </p>
                  </div>
                  <div className="bg-[#F2F4F6] rounded-2xl p-4">
                    <p className="text-[#4a5565] mb-1">Type</p>
                    <p className="font-semibold text-[#1a1a1a]">
                      {propertyVerificationDetail?.typeDisplayName}
                    </p>
                  </div>
                  <div className="bg-[#F2F4F6] rounded-2xl p-4">
                    <p className="text-[#4a5565] mb-1">Status</p>
                    <div className="mt-1">
                      {getStatusBadge(
                        propertyVerificationDetail?.statusDisplayName ?? '',
                      )}
                    </div>
                  </div>
                  <div className="bg-[#F2F4F6] rounded-2xl p-4">
                    <p className="text-[#4a5565] mb-1">Submitted</p>
                    <p className="font-semibold text-[#1a1a1a]">
                      {propertyVerificationDetail?.submittedAt
                        ? new Date(
                            propertyVerificationDetail.submittedAt,
                          ).toLocaleDateString('en-GB')
                        : '—'}
                    </p>
                  </div>
                  {propertyVerificationDetail?.description && (
                    <div className="bg-[#F2F4F6] rounded-2xl p-4 col-span-2">
                      <p className="text-[#4a5565] mb-1">Description</p>
                      <p className="text-sm text-[#1a1a1a]">
                        {propertyVerificationDetail.description}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Ownership Document */}
            <div className="mb-6">
              <p className="text-sm text-[#4a5565] mb-2 font-medium">
                Ownership Document
              </p>
              {propertyVerificationDetailLoading ? (
                <Skeleton className="h-40 w-full rounded-2xl" />
              ) : propertyVerificationDetail?.ownershipDocumentUrl ? (
                <img
                  src={buildImageUrl(
                    propertyVerificationDetail.ownershipDocumentUrl,
                  )}
                  alt="Ownership document"
                  className="w-full rounded-2xl border border-[#3A6EA5]/20 object-cover max-h-56"
                />
              ) : (
                <div className="w-full rounded-2xl border border-dashed border-[#3A6EA5]/30 bg-[#F2F4F6] flex items-center justify-center h-32 text-[#4a5565] text-sm">
                  No document uploaded
                </div>
              )}
            </div>

            {/* Property Images */}
            {!propertyVerificationDetailLoading &&
              (propertyVerificationDetail?.images?.length ?? 0) > 0 && (
                <div className="mb-6">
                  <p className="text-sm text-[#4a5565] mb-2 font-medium">
                    Property Images
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {propertyVerificationDetail!.images.map((img, i) => (
                      <img
                        key={i}
                        src={buildImageUrl(img)}
                        alt={`Property image ${i + 1}`}
                        className="w-full rounded-xl border border-[#3A6EA5]/20 object-cover h-24"
                      />
                    ))}
                  </div>
                </div>
              )}

            <div className="flex gap-3">
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl"
                disabled={
                  approvePropertyVerification.isPending ||
                  propertyVerificationDetailLoading
                }
                onClick={() => handleApproveProperty(selectedPropertyId)}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-xl"
                disabled={
                  declinePropertyVerification.isPending ||
                  propertyVerificationDetailLoading
                }
                onClick={() => {
                  handleDeclineProperty(selectedPropertyId)
                  setSelectedPropertyId(null)
                }}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Decline
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Property Decline Reason Modal */}
      {showPropertyRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-[#1a1a1a] mb-2">
              Decline Property Verification
            </h3>
            <p className="text-[#4a5565] mb-5">
              Please provide a reason for declining this property verification
              request.
            </p>
            <textarea
              className="w-full rounded-xl border border-[#3A6EA5]/30 bg-[#F2F4F6] p-3 text-sm text-[#1a1a1a] resize-none focus:outline-none focus:ring-2 focus:ring-[#3A6EA5]/40"
              rows={4}
              placeholder="Enter decline reason…"
              value={propertyRejectReason}
              onChange={(e) => setPropertyRejectReason(e.target.value)}
            />
            <div className="flex gap-4 mt-5">
              <Button
                variant="outline"
                className="flex-1 rounded-xl border-[#3A6EA5]/20"
                onClick={() => {
                  setShowPropertyRejectModal(false)
                  setPendingRejectPropertyId(null)
                  setPropertyRejectReason('')
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl"
                disabled={
                  declinePropertyVerification.isPending ||
                  !propertyRejectReason.trim()
                }
                onClick={confirmPropertyDecline}
              >
                {declinePropertyVerification.isPending
                  ? 'Declining…'
                  : 'Confirm Decline'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}
