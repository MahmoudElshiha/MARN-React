import { useState } from 'react'
import { motion } from 'motion/react'
import {
  Eye,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Skeleton } from '../../../components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../components/ui/tooltip'
import {
  useAdminVerifications,
  useAdminUserVerification,
} from '@/hooks/useAdminStats'
import { adminService } from '@/services/adminService'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { buildImageUrl, getStatusBadge } from '../utils'

export function VerificationsTab() {
  const [selectedVerificationId, setSelectedVerificationId] = useState<
    string | null
  >(null)
  const [pageSize, setPageSize] = useState(10)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [pendingRejectUserId, setPendingRejectUserId] = useState<string | null>(
    null,
  )
  const [rejectReason, setRejectReason] = useState('')

  const queryClient = useQueryClient()

  const { data: verificationsData, isLoading: verificationsLoading, isFetching: verificationsFetching } =
    useAdminVerifications(1, pageSize)
  const { data: verificationDetailData, isLoading: verificationDetailLoading } =
    useAdminUserVerification(selectedVerificationId)

  const verificationDetail = verificationDetailData?.data
  const pendingVerifications = verificationsData?.data?.items ?? []
  const totalCount = verificationsData?.data?.totalCount ?? 0

  const approveVerification = useMutation({
    mutationFn: (userId: string) => adminService.approveVerification(userId),
    onSuccess: () => {
      toast.success('Verification approved')
      queryClient.invalidateQueries({ queryKey: ['adminVerifications'] })
      queryClient.invalidateQueries({ queryKey: ['adminStats'] })
    },
    onError: () => toast.error('Failed to approve'),
  })

  const rejectVerification = useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason: string }) =>
      adminService.rejectVerification(userId, reason),
    onSuccess: () => {
      toast.success('Verification rejected')
      queryClient.invalidateQueries({ queryKey: ['adminVerifications'] })
      queryClient.invalidateQueries({ queryKey: ['adminStats'] })
      setShowRejectModal(false)
      setPendingRejectUserId(null)
      setRejectReason('')
    },
    onError: () => toast.error('Failed to reject'),
  })

  const handleApprove = (userId: string) => approveVerification.mutate(userId)
  const handleReject = (userId: string) => {
    setPendingRejectUserId(userId)
    setRejectReason('')
    setSelectedVerificationId(null)
    setShowRejectModal(true)
  }
  const confirmReject = () => {
    if (pendingRejectUserId && rejectReason.trim()) {
      rejectVerification.mutate({
        userId: pendingRejectUserId,
        reason: rejectReason.trim(),
      })
    }
  }

  return (
    <>
      <Card className="bg-[#F2F4F6] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl text-[#1a1a1a]">
              Pending Verifications
            </CardTitle>
            <span className="text-sm text-[#4a5565]">
              {pendingVerifications.length} pending
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto overflow-y-auto max-h-[600px] border-b border-[#3A6EA5]/20">
            <table className="w-full relative">
              <thead className="sticky top-0 bg-[#F2F4F6] z-10">
                <tr className="border-b border-[#3A6EA5]/20">
                  <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                    Full Name
                  </th>
                  <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                    Email
                  </th>
                  <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                    National ID
                  </th>
                  <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                    Submitted
                  </th>
                  <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                    Status
                  </th>
                  <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {verificationsLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr
                      key={i}
                      className="border-b border-[#3A6EA5]/10"
                    >
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="py-4 px-4">
                          <Skeleton className="h-5 w-full rounded" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : pendingVerifications.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-10 text-center text-[#4a5565]"
                    >
                      No pending verifications.
                    </td>
                  </tr>
                ) : (
                  pendingVerifications.map((item) => (
                    <tr
                      key={item.userId}
                      className="border-b border-[#3A6EA5]/10 hover:bg-white/50 transition-colors"
                    >
                      <td className="py-4 px-4 text-[#1a1a1a] font-medium">
                        <div>{item.fullName}</div>
                        {item.arabicFullName && (
                          <div
                            className="text-xs text-[#4a5565] mt-0.5"
                            dir="rtl"
                          >
                            {item.arabicFullName}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-[#4a5565]">
                        {item.email}
                      </td>
                      <td className="py-4 px-4 text-[#4a5565] font-mono text-sm">
                        {item.nationalIDNumber ?? '—'}
                      </td>
                      <td className="py-4 px-4 text-[#4a5565]">
                        {new Date(item.createdAt).toLocaleDateString(
                          'en-GB',
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {getStatusBadge(item.accountStatusDisplayName)}
                      </td>
                      <td className="py-4 px-4">
                        <TooltipProvider delayDuration={200}>
                          <div className="flex gap-2 justify-start">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="rounded-xl border-[#3A6EA5]/20 w-8 h-8 shrink-0"
                                  onClick={() =>
                                    setSelectedVerificationId(item.userId)
                                  }
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent><p>View Details</p></TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon"
                                  className="bg-green-600 hover:bg-green-700 text-white rounded-xl w-8 h-8 shrink-0"
                                  disabled={approveVerification.isPending}
                                  onClick={() => handleApprove(item.userId)}
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent><p>Approve</p></TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-xl w-8 h-8 shrink-0"
                                  disabled={rejectVerification.isPending}
                                  onClick={() => handleReject(item.userId)}
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent><p>Reject</p></TooltipContent>
                            </Tooltip>
                          </div>
                        </TooltipProvider>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {totalCount > pendingVerifications.length && (
            <div className="mt-4 flex justify-center items-center min-h-[40px]">
              {verificationsFetching ? (
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

      {/* ID-Card View Modal */}
      {selectedVerificationId && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedVerificationId(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                {verificationDetailLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-7 w-48 rounded" />
                    <Skeleton className="h-4 w-36 rounded" />
                    <Skeleton className="h-4 w-40 rounded" />
                  </div>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-[#1a1a1a]">
                      {verificationDetail?.fullName}
                    </h3>
                    {verificationDetail?.arabicFullName && (
                      <p className="text-[#4a5565] mt-0.5" dir="rtl">
                        {verificationDetail.arabicFullName}
                      </p>
                    )}
                    <p className="text-sm text-[#4a5565] mt-1">
                      {verificationDetail?.email}
                    </p>
                  </>
                )}
              </div>
              <Button
                size="sm"
                variant="outline"
                className="rounded-xl border-[#3A6EA5]/20"
                onClick={() => setSelectedVerificationId(null)}
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </div>

            {/* Detail fields */}
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              {verificationDetailLoading ? (
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
                    <p className="text-[#4a5565] mb-1">National ID</p>
                    <p className="font-mono font-semibold text-[#1a1a1a]">
                      {verificationDetail?.nationalIDNumber ?? '—'}
                    </p>
                  </div>
                  <div className="bg-[#F2F4F6] rounded-2xl p-4">
                    <p className="text-[#4a5565] mb-1">Arabic Address</p>
                    <p className="font-semibold text-[#1a1a1a]" dir="rtl">
                      {verificationDetail?.arabicAddress ?? '—'}
                    </p>
                  </div>
                  <div className="bg-[#F2F4F6] rounded-2xl p-4">
                    <p className="text-[#4a5565] mb-1">Phone</p>
                    <p className="font-semibold text-[#1a1a1a]">
                      {verificationDetail?.phoneNumber ?? '—'}
                    </p>
                  </div>
                  <div className="bg-[#F2F4F6] rounded-2xl p-4">
                    <p className="text-[#4a5565] mb-1">Submitted</p>
                    <p className="font-semibold text-[#1a1a1a]">
                      {verificationDetail?.createdAt
                        ? new Date(
                            verificationDetail.createdAt,
                          ).toLocaleDateString('en-GB')
                        : '—'}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* ID card photos */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {verificationDetailLoading
                ? Array.from({ length: 2 }).map((_, i) => (
                    <div key={i}>
                      <Skeleton className="h-4 w-16 rounded mb-2" />
                      <Skeleton className="h-32 w-full rounded-2xl" />
                    </div>
                  ))
                : [
                    {
                      label: 'Front ID',
                      src: buildImageUrl(
                        verificationDetail?.frontIdPhoto ?? null,
                      ),
                    },
                    {
                      label: 'Back ID',
                      src: buildImageUrl(
                        verificationDetail?.backIdPhoto ?? null,
                      ),
                    },
                  ].map(({ label, src }) => (
                    <div key={label}>
                      <p className="text-sm text-[#4a5565] mb-2 font-medium">
                        {label}
                      </p>
                      {src ? (
                        <img
                          src={src}
                          alt={label}
                          className="w-full rounded-2xl border border-[#3A6EA5]/20 object-cover max-h-48"
                        />
                      ) : (
                        <div className="w-full rounded-2xl border border-dashed border-[#3A6EA5]/30 bg-[#F2F4F6] flex items-center justify-center h-32 text-[#4a5565] text-sm">
                          No image
                        </div>
                      )}
                    </div>
                  ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl"
                disabled={
                  approveVerification.isPending || verificationDetailLoading
                }
                onClick={() => {
                  handleApprove(selectedVerificationId)
                  setSelectedVerificationId(null)
                }}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-xl"
                disabled={
                  rejectVerification.isPending || verificationDetailLoading
                }
                onClick={() => {
                  handleReject(selectedVerificationId)
                  setSelectedVerificationId(null)
                }}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-[#1a1a1a] mb-2">
              Reject Verification
            </h3>
            <p className="text-[#4a5565] mb-5">
              Please provide a reason for rejecting this verification request.
            </p>
            <textarea
              className="w-full rounded-xl border border-[#3A6EA5]/30 bg-[#F2F4F6] p-3 text-sm text-[#1a1a1a] resize-none focus:outline-none focus:ring-2 focus:ring-[#3A6EA5]/40"
              rows={4}
              placeholder="Enter rejection reason…"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex gap-4 mt-5">
              <Button
                variant="outline"
                className="flex-1 rounded-xl border-[#3A6EA5]/20"
                onClick={() => {
                  setShowRejectModal(false)
                  setPendingRejectUserId(null)
                  setRejectReason('')
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl"
                disabled={rejectVerification.isPending || !rejectReason.trim()}
                onClick={confirmReject}
              >
                {rejectVerification.isPending ? 'Rejecting…' : 'Confirm Reject'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}
