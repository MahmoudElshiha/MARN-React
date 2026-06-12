import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ShieldAlert,
  Loader2,
  Eye,
  Filter,
  Search,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { Skeleton } from '../../../components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../components/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../../components/ui/dialog'
import { Textarea } from '../../../components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select'
import { Checkbox } from '../../../components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu'
import {
  useAdminModerationReports,
  useReviewModerationReport,
} from '@/hooks/useAdminStats'
import { adminService, type AdminModerationReport } from '@/services/adminService'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDebounce } from '@/hooks/useDebounce'

export function ModerationReportsTab() {
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 500)
  const [pageSize, setPageSize] = useState(20)

  const { data: reportsData, isLoading, isFetching } = useAdminModerationReports(1, pageSize, debouncedSearch)
  const reviewReport = useReviewModerationReport()
  const queryClient = useQueryClient()

  const [bannedUserIds, setBannedUserIds] = useState<Set<string>>(new Set())

  const banUserMutation = useMutation({
    mutationFn: (userId: string) => adminService.banUser(userId),
    onSuccess: (_, userId) => {
      toast.success('User banned successfully')
      setBannedUserIds((prev) => {
        const newSet = new Set(prev)
        newSet.add(userId)
        return newSet
      })
      queryClient.invalidateQueries({ queryKey: ['adminModerationReports'] })
    },
    onError: () => toast.error('Failed to ban user')
  })

  const deletePropertyMutation = useMutation({
    mutationFn: (propertyId: number) => adminService.deleteProperty(propertyId),
    onSuccess: () => {
      toast.success('Property deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['adminModerationReports'] })
    },
    onError: () => toast.error('Failed to delete property')
  })

  const deleteCommentMutation = useMutation({
    mutationFn: ({ propertyId, commentId }: { propertyId: number, commentId: number }) => adminService.deleteComment(propertyId, commentId),
    onSuccess: () => {
      toast.success('Comment deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['adminModerationReports'] })
    },
    onError: () => toast.error('Failed to delete comment')
  })

  const responseData: any = (reportsData?.data as any)?.reports ?? reportsData?.data
  const reports: any[] = responseData?.items ?? responseData?.data ?? (Array.isArray(responseData) ? responseData : [])
  const totalCount = responseData?.totalCount ?? responseData?.total ?? reports.length

  const [searchParams, setSearchParams] = useSearchParams()
  const filterStatus = searchParams.get('reportStatus') || 'InReview'
  const setFilterStatus = (val: string) => {
    setSearchParams((prev) => {
      prev.set('reportStatus', val)
      return prev
    })
  }

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [appliedReportTypes, setAppliedReportTypes] = useState({
    user: true,
    message: true,
    property: true,
    comment: true
  })
  const [stagedReportTypes, setStagedReportTypes] = useState({
    user: true,
    message: true,
    property: true,
    comment: true
  })

  const handleDropdownOpenChange = (open: boolean) => {
    setIsDropdownOpen(open)
    if (!open) {
      setAppliedReportTypes(stagedReportTypes)
    } else {
      setStagedReportTypes(appliedReportTypes)
    }
  }

  const filteredReports = (reports || []).filter((r) => {
    if (!r) return false
    if (filterStatus !== 'All' && r.status !== filterStatus) return false

    const type = r.reportableType ? String(r.reportableType).toLowerCase() : ''
    if (type === 'user' && !appliedReportTypes.user) return false
    if (type === 'message' && !appliedReportTypes.message) return false
    if (type === 'property' && !appliedReportTypes.property) return false
    if (type === 'propertycomment' && !appliedReportTypes.comment) return false

    return true
  })

  const [selectedReport, setSelectedReport] = useState<AdminModerationReport | null>(null)
  const [reviewStatus, setReviewStatus] = useState<string>('Resolved')
  const [adminNote, setAdminNote] = useState<string>('')

  const openReviewModal = (report: AdminModerationReport) => {
    setSelectedReport(report)
    setReviewStatus(report.status === 'InReview' ? 'Resolved' : report.status)
    setAdminNote(report.internalNotes || '')
  }

  const handleReviewSubmit = () => {
    if (!selectedReport) return

    reviewReport.mutate(
      {
        reportId: selectedReport.reportId,
        payload: {
          status: reviewStatus as any,
          note: adminNote,
        },
      },
      {
        onSuccess: () => {
          setSelectedReport(null)
        },
      }
    )
  }

  const getStatusIcon = (status?: string) => {
    const s = status?.toLowerCase() || ''
    if (s === 'resolved' || s === 'approved') return <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
    if (s === 'rejected' || s === 'dismissed') return <XCircle className="w-5 h-5 text-red-500 shrink-0" />
    return <ShieldAlert className="w-5 h-5 text-yellow-500 shrink-0" />
  }

  const getTargetLink = (type?: string, targetId?: string) => {
    if (!type || !targetId) return '#'
    switch (String(type).toLowerCase()) {
      case 'user':
        return `/user/${targetId}`
      case 'property':
      case 'propertycomment':
        return `/property/${targetId}`
      case 'message':
        return `/messages`
      default:
        return '#'
    }
  }

  return (
    <>
      <Card className="bg-[#F2F4F6] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-2xl text-[#1a1a1a]">
            Moderation Reports
          </CardTitle>
          <div className="flex w-full sm:max-w-md gap-2">
            <Input
              placeholder="Search by report text..."
              className="w-full bg-white border-none rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button size="icon" className="rounded-xl bg-[#3A6EA5] hover:bg-[#2a5a8a] text-white shrink-0">
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-white rounded-2xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex flex-wrap items-center gap-2">
                {['InReview', 'Resolved', 'Rejected', 'All'].map((statusOption) => (
                  <Button
                    key={statusOption}
                    variant={filterStatus === statusOption ? 'default' : 'outline'}
                    size="sm"
                    className={`rounded-xl px-4 py-1.5 h-auto text-sm font-medium transition-colors ${
                      filterStatus === statusOption
                        ? 'bg-[#3A6EA5] hover:bg-[#2a5a8a] text-white border-transparent'
                        : 'text-[#4a5565] border-[#3A6EA5]/20 hover:bg-[#F2F4F6]'
                    }`}
                    onClick={() => setFilterStatus(statusOption)}
                  >
                    {statusOption === 'InReview' ? 'In Review' : statusOption === 'Rejected' ? 'Dismissed' : statusOption}
                  </Button>
                ))}
              </div>

              <DropdownMenu open={isDropdownOpen} onOpenChange={handleDropdownOpenChange}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="group rounded-xl px-3 border-[#3A6EA5]/20 text-[#4a5565] hover:bg-[#3A6EA5] hover:text-white">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter Types
                    <span className="ml-2 bg-[#3A6EA5]/10 text-[#3A6EA5] group-hover:bg-white group-hover:text-[#3A6EA5] px-1.5 py-0.5 rounded-md text-xs font-semibold">
                      {Object.values(appliedReportTypes).filter(Boolean).length === 4 ? 'All' : Object.values(appliedReportTypes).filter(Boolean).length}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl p-2">
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    onClick={() => setStagedReportTypes(prev => ({ ...prev, user: !prev.user }))}
                    className="flex items-center gap-3 rounded-lg cursor-pointer p-2 focus:bg-[#F2F4F6]"
                  >
                    <Checkbox 
                      checked={stagedReportTypes.user} 
                      className="data-[state=checked]:bg-white data-[state=checked]:text-[#3A6EA5] border-gray-300 data-[state=checked]:border-[#3A6EA5]" 
                    />
                    <span>User Reports</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    onClick={() => setStagedReportTypes(prev => ({ ...prev, message: !prev.message }))}
                    className="flex items-center gap-3 rounded-lg cursor-pointer p-2 focus:bg-[#F2F4F6]"
                  >
                    <Checkbox 
                      checked={stagedReportTypes.message} 
                      className="data-[state=checked]:bg-white data-[state=checked]:text-[#3A6EA5] border-gray-300 data-[state=checked]:border-[#3A6EA5]" 
                    />
                    <span>Message Reports</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    onClick={() => setStagedReportTypes(prev => ({ ...prev, property: !prev.property }))}
                    className="flex items-center gap-3 rounded-lg cursor-pointer p-2 focus:bg-[#F2F4F6]"
                  >
                    <Checkbox 
                      checked={stagedReportTypes.property} 
                      className="data-[state=checked]:bg-white data-[state=checked]:text-[#3A6EA5] border-gray-300 data-[state=checked]:border-[#3A6EA5]" 
                    />
                    <span>Property Reports</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    onClick={() => setStagedReportTypes(prev => ({ ...prev, comment: !prev.comment }))}
                    className="flex items-center gap-3 rounded-lg cursor-pointer p-2 focus:bg-[#F2F4F6]"
                  >
                    <Checkbox 
                      checked={stagedReportTypes.comment} 
                      className="data-[state=checked]:bg-white data-[state=checked]:text-[#3A6EA5] border-gray-300 data-[state=checked]:border-[#3A6EA5]" 
                    />
                    <span>Comment Reports</span>
                  </DropdownMenuItem>
                  <div className="mt-2 pt-2 border-t flex justify-end">
                    <Button 
                      size="sm" 
                      className="bg-[#3A6EA5] hover:bg-[#2a5a8a] text-white rounded-lg w-full"
                      onClick={() => handleDropdownOpenChange(false)}
                    >
                      Apply Filters
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-20 w-full rounded-xl"
                  />
                ))}
              </div>
            ) : filteredReports.length === 0 ? (
              <p className="text-center text-[#4a5565] py-6">
                No moderation reports found for the selected filter.
              </p>
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-[600px] pr-2">
                {filteredReports.map((report) => {
                  let listReason = report?.reason ? String(report.reason) : ''
                  if (listReason.includes('REPORTMETAUSER')) {
                    listReason = listReason.split('REPORTMETAUSER')[0].trim()
                  }
                  if (listReason.includes('REPORTMETAPROPERTY')) {
                    listReason = listReason.split('REPORTMETAPROPERTY')[0].trim()
                  }
                  if (listReason.includes('REPORTMETAID')) {
                    listReason = listReason.split('REPORTMETAID')[0].trim()
                  }
                  if (listReason.includes('REPORTMETAMESSAGE')) {
                    listReason = listReason.split('REPORTMETAMESSAGE')[0].trim()
                  } else if (listReason.includes('REPORTMETACOMMENT')) {
                    listReason = listReason.split('REPORTMETACOMMENT')[0].trim()
                  }

                  return (
                  <div
                    key={report?.reportId || Math.random()}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[#F2F4F6] rounded-xl gap-4"
                  >
                    <div className="flex items-start gap-3">
                      {getStatusIcon(report.status)}
                      <div>
                        <p className="font-medium text-[#1a1a1a] flex items-center flex-wrap gap-2">
                          <span>{report?.reportableTypeDisplayName || report?.reportableType || 'Unknown'} Report</span>
                          {report?.reportableTargetId ? (
                            <Link 
                              to={getTargetLink(report.reportableType, report.reportableTargetId)}
                              className="text-sm font-medium text-[#3A6EA5] hover:underline bg-[#3A6EA5]/10 px-2 py-0.5 rounded-md"
                            >
                              View Target (ID: {report.reportableTargetId})
                            </Link>
                          ) : (
                            <span className="text-sm font-medium text-[#4a5565] bg-gray-200 px-2 py-0.5 rounded-md">
                              Target: {(report as any)?.targetLabel || 'Unknown'}
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-[#1a1a1a] mt-1 line-clamp-2">
                          <strong>Report Text:</strong> "{listReason}"
                        </p>
                        <p className="text-xs text-[#4a5565] mt-1">
                          Submitted by {report?.reporterName || report?.reporterFullName || report?.reporterUserId || 'Unknown'} on {report?.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'Unknown date'}
                          {' • '}
                          Status: {report?.statusDisplayName || report?.status || 'Unknown'}
                        </p>
                      </div>
                    </div>
                    <TooltipProvider delayDuration={200}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="outline"
                            className="rounded-xl border-[#3A6EA5]/20 shrink-0 text-[#3A6EA5] hover:bg-[#3A6EA5] hover:text-white w-8 h-8"
                            onClick={() => openReviewModal(report)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Review Report</p></TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )})}
              </div>
            )}
            
            {totalCount > reports.length && (
              <div className="mt-4 flex justify-center items-center min-h-[40px]">
                {isFetching ? (
                  <Loader2 className="w-6 h-6 animate-spin text-[#3A6EA5]" />
                ) : (
                  <Button
                    variant="outline"
                    className="rounded-xl border-[#3A6EA5]/20 text-[#3A6EA5] hover:bg-[#3A6EA5] hover:text-white"
                    onClick={() => setPageSize((p) => p + 20)}
                  >
                    Load More Pages
                  </Button>
                )}
              </div>
            )}
            {totalCount > reports.length && filterStatus !== 'All' && (
              <p className="text-center text-xs text-[#4a5565] mt-4">
                Note: Load more items under the 'All' tab to discover older reports.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedReport} onOpenChange={(open) => !open && setSelectedReport(null)}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Review Moderation Report</DialogTitle>
          </DialogHeader>
          {selectedReport && (() => {
            let displayReason = selectedReport.reason || ''
            let reportedMessageContent = ''
            let extractedPropertyId = ''
            let extractedUserId = ''
            let reportedCommentContent = ''
            let extractedMetaId = ''

            if (displayReason.includes('REPORTMETAUSER')) {
              const parts = displayReason.split('REPORTMETAUSER')
              extractedUserId = parts[1]?.trim() || ''
              displayReason = parts[0].trim()
            }
            if (displayReason.includes('REPORTMETAPROPERTY')) {
              const parts = displayReason.split('REPORTMETAPROPERTY')
              extractedPropertyId = parts[1]?.trim() || ''
              displayReason = parts[0].trim()
            }
            if (displayReason.includes('REPORTMETAID')) {
              const parts = displayReason.split('REPORTMETAID')
              extractedMetaId = parts[1]?.trim() || ''
              displayReason = parts[0].trim()
            }

            if (displayReason.includes('REPORTMETAMESSAGE')) {
              const parts = displayReason.split('REPORTMETAMESSAGE')
              displayReason = parts[0].trim()
              reportedMessageContent = parts[1]?.trim() || ''
            } else if (displayReason.includes('REPORTMETACOMMENT')) {
              const parts = displayReason.split('REPORTMETACOMMENT')
              displayReason = parts[0].trim()
              reportedCommentContent = parts[1]?.trim() || ''
            }

            const backendTargetId = selectedReport.reportableTargetId || (selectedReport as any).targetId || ''
            const finalTargetId = backendTargetId || extractedPropertyId || extractedUserId

            return (
            <div className="space-y-4 py-4">
              <div className="bg-[#F2F4F6] p-4 rounded-xl text-sm">
                <p><strong>Type:</strong> {selectedReport.reportableTypeDisplayName || selectedReport.reportableType}</p>
                <div className="flex items-center gap-2 mt-1">
                  <strong>Target:</strong> 
                  {finalTargetId ? (
                    <Link 
                      to={getTargetLink(selectedReport.reportableType, finalTargetId)}
                      className="text-[#3A6EA5] hover:underline font-medium"
                      target="_blank"
                    >
                      {(selectedReport as any).targetLabel || finalTargetId} (Click to view)
                    </Link>
                  ) : (
                    <span>{(selectedReport as any).targetLabel || 'Unknown'}</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Submitted Report Text</p>
                <Textarea 
                  readOnly 
                  disabled
                  value={displayReason} 
                  className="min-h-[80px] bg-white border border-gray-200 resize-none text-[#6B7280] shadow-sm cursor-not-allowed opacity-100" 
                />
              </div>

              {reportedMessageContent && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Reported Message Content</p>
                  <div className="bg-red-50 p-3 rounded-xl border border-red-200 text-sm text-[#1a1a1a]">
                    {reportedMessageContent}
                  </div>
                </div>
              )}

              {reportedCommentContent && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Reported Review Content</p>
                  <div className="bg-red-50 p-3 rounded-xl border border-red-200 text-sm text-[#1a1a1a]">
                    {reportedCommentContent}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-sm font-medium">Review Status</p>
                <Select value={reviewStatus} onValueChange={setReviewStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="InReview">In Review</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Rejected">Dismissed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Internal Notes (Optional)</p>
                <Textarea 
                  placeholder="Add an internal note..."
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className="min-h-[80px] bg-white border border-gray-200 resize-none text-[#1a1a1a] shadow-sm rounded-xl" 
                />
              </div>

              <DialogFooter className="pt-4 border-t border-[#3A6EA5]/10 mt-6 flex-col sm:flex-col items-stretch space-y-4 sm:space-x-0">
                {['property', 'user', 'propertycomment', 'message'].includes(selectedReport.reportableType?.toLowerCase() || '') ? (
                  <div className="flex gap-2 w-full justify-start flex-wrap">
                    {selectedReport.reportableType?.toLowerCase() === 'property' && (
                      <TooltipProvider delayDuration={200}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              <Button variant="destructive" onClick={() => deletePropertyMutation.mutate(Number(finalTargetId))} disabled={!finalTargetId || deletePropertyMutation.isPending} className="rounded-xl flex-1 sm:flex-none">
                                {deletePropertyMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                Delete Property
                              </Button>
                            </span>
                          </TooltipTrigger>
                          {!finalTargetId && <TooltipContent><p>Target ID missing for this legacy report</p></TooltipContent>}
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    {selectedReport.reportableType?.toLowerCase() === 'user' && (
                      <TooltipProvider delayDuration={200}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              <Button variant="destructive" onClick={() => banUserMutation.mutate(finalTargetId)} disabled={!finalTargetId || bannedUserIds.has(finalTargetId) || banUserMutation.isPending} className="rounded-xl flex-1 sm:flex-none">
                                {banUserMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                Ban User
                              </Button>
                            </span>
                          </TooltipTrigger>
                          {bannedUserIds.has(finalTargetId) ? <TooltipContent><p>User already banned</p></TooltipContent> : (!finalTargetId && <TooltipContent><p>Target ID missing for this legacy report</p></TooltipContent>)}
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    {selectedReport.reportableType?.toLowerCase() === 'message' && (
                      <TooltipProvider delayDuration={200}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              <Button variant="destructive" onClick={() => banUserMutation.mutate(extractedUserId)} disabled={!extractedUserId || bannedUserIds.has(extractedUserId) || banUserMutation.isPending} className="rounded-xl flex-1 sm:flex-none">
                                {banUserMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                Ban User
                              </Button>
                            </span>
                          </TooltipTrigger>
                          {bannedUserIds.has(extractedUserId) ? <TooltipContent><p>User already banned</p></TooltipContent> : (!extractedUserId && <TooltipContent><p>Cannot extract User ID from legacy report</p></TooltipContent>)}
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    {selectedReport.reportableType?.toLowerCase() === 'propertycomment' && (
                      <>
                        {extractedUserId && (
                          <TooltipProvider delayDuration={200}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span>
                                  <Button variant="destructive" onClick={() => banUserMutation.mutate(extractedUserId)} disabled={bannedUserIds.has(extractedUserId) || banUserMutation.isPending} className="rounded-xl flex-1 sm:flex-none">
                                    {banUserMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                    Ban User
                                  </Button>
                                </span>
                              </TooltipTrigger>
                              {bannedUserIds.has(extractedUserId) && <TooltipContent><p>User already banned</p></TooltipContent>}
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span>
                                <Button variant="destructive" onClick={() => deleteCommentMutation.mutate({ propertyId: Number(extractedPropertyId), commentId: Number(extractedMetaId) })} disabled={deleteCommentMutation.isPending || !extractedPropertyId || !extractedMetaId} className="rounded-xl flex-1 sm:flex-none">
                                  {deleteCommentMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                  Delete Comment
                                </Button>
                              </span>
                            </TooltipTrigger>
                            {(!extractedPropertyId || !extractedMetaId) && <TooltipContent><p>Missing IDs in legacy report</p></TooltipContent>}
                          </Tooltip>
                        </TooltipProvider>
                      </>
                    )}
                  </div>
                ) : null}
                <div className="flex gap-2 w-full justify-end">
                  <Button variant="outline" onClick={() => setSelectedReport(null)} className="rounded-xl">
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleReviewSubmit}
                    disabled={reviewReport.isPending}
                    className="bg-[#3A6EA5] hover:bg-[#2a5a8a] text-white rounded-xl"
                  >
                    {reviewReport.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit Review
                  </Button>
                </div>
              </DialogFooter>
            </div>
            )
          })()}
        </DialogContent>
      </Dialog>
    </>
  )
}
