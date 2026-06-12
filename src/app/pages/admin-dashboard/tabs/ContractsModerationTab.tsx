import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  FileText,
  Download,
  XCircle,
  Loader2,
  Search,
} from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { Skeleton } from '../../../components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../components/ui/tooltip'
import {
  useAdminContracts,
  useCancelContract,
} from '@/hooks/useAdminStats'
import { adminService } from '@/services/adminService'
import { getStatusBadge } from '../utils'

export function ContractsModerationTab() {
  const [pageSize, setPageSize] = useState(10)
  const [contractSearch, setContractSearch] = useState('')
  const [activeContractSearch, setActiveContractSearch] = useState('')

  const [searchParams, setSearchParams] = useSearchParams()
  const contractStatus = searchParams.get('contractStatus') || 'Pending'
  const setContractStatus = (val: string) => {
    setSearchParams((prev) => {
      prev.set('contractStatus', val)
      return prev
    })
  }

  const {
    data: contractsData,
    isLoading: contractsLoading,
    isFetching: contractsFetching,
  } = useAdminContracts(1, pageSize, activeContractSearch || undefined, contractStatus)

  const cancelContractMutation = useCancelContract()

  const contracts = contractsData?.data?.contracts?.items ?? []
  const totalCount = contractsData?.data?.contracts?.totalCount ?? 0

  const handleDownload = async (contractId: number) => {
    try {
      const response = await adminService.downloadContractPdf(contractId)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `Contract_${contractId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.parentNode?.removeChild(link)
    } catch {
      // toast is already handled globally or silently error
    }
  }

  const [showContractCancelConfirmModal, setShowContractCancelConfirmModal] = useState(false)
  const [pendingCancelContractId, setPendingCancelContractId] = useState<number | null>(null)

  const handleCancelContract = (contractId: number) => {
    setPendingCancelContractId(contractId)
    setShowContractCancelConfirmModal(true)
  }

  const confirmCancelContract = () => {
    if (pendingCancelContractId) {
      cancelContractMutation.mutate(pendingCancelContractId, {
        onSuccess: () => {
          setShowContractCancelConfirmModal(false)
          setPendingCancelContractId(null)
        }
      })
    }
  }

  return (
    <Card className="bg-[#F2F4F6] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle className="text-2xl text-[#1a1a1a]">
            Contracts Moderation
          </CardTitle>
          <div className="flex w-full sm:w-auto items-center gap-2">
            <Input
              placeholder="Search contracts..."
              className="w-full sm:w-64 bg-white rounded-xl border-[#3A6EA5]/20"
              value={contractSearch}
              onChange={(e) => setContractSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setActiveContractSearch(contractSearch)
              }}
            />
            <Button
              size="icon"
              className="bg-[#3A6EA5] hover:bg-[#2A527A] text-white rounded-xl flex-shrink-0"
              onClick={() => setActiveContractSearch(contractSearch)}
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-6">
          {['Pending', 'Active', 'Cancelled', 'Expired', 'All'].map((statusOption) => (
            <Button
              key={statusOption}
              variant={contractStatus === statusOption ? 'default' : 'outline'}
              size="sm"
              className={`rounded-xl px-4 py-1.5 h-auto text-sm font-medium transition-colors ${
                contractStatus === statusOption
                  ? 'bg-[#3A6EA5] hover:bg-[#2a5a8a] text-white border-transparent'
                  : 'text-[#4a5565] border-[#3A6EA5]/20 hover:bg-[#F2F4F6]'
              }`}
              onClick={() => setContractStatus(statusOption)}
            >
              {statusOption}
            </Button>
          ))}
        </div>
        <div className="overflow-x-auto overflow-y-auto max-h-[600px] border-b border-[#3A6EA5]/20">
          <table className="w-full relative">
            <thead className="sticky top-0 bg-[#F2F4F6] z-10">
              <tr className="border-b border-[#3A6EA5]/20">
                <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                  Contract
                </th>
                <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                  Owner
                </th>
                <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                  Renter
                </th>
                <th className="text-left py-4 px-4 text-[#1a1a1a] font-semibold">
                  Value
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
              {contractsLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-[#3A6EA5]/10">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="py-4 px-4">
                        <Skeleton className="h-5 w-full rounded" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : contracts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-[#4a5565]">
                    No contracts found.
                  </td>
                </tr>
              ) : (
                contracts.map((item) => (
                  <tr key={item.contractId} className="border-b border-[#3A6EA5]/10 hover:bg-white/50 transition-colors">
                    <td className="py-4 px-4 text-[#1a1a1a] font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#3A6EA5]/10 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-[#3A6EA5]" />
                        </div>
                        <div>
                          <div className="font-medium">{item.propertyTitle}</div>
                          <div className="text-xs text-[#4a5565]">
                            {new Date(item.leaseStartDate).toLocaleDateString('en-GB')} - {new Date(item.leaseEndDate).toLocaleDateString('en-GB')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-[#1a1a1a]">{item.ownerName}</td>
                    <td className="py-4 px-4 text-[#1a1a1a]">{item.renterName}</td>
                    <td className="py-4 px-4 font-semibold text-[#3A6EA5]">EGP {item.totalContractAmount.toLocaleString()}</td>
                    <td className="py-4 px-4">{getStatusBadge(item.statusDisplayName)}</td>
                    <td className="py-4 px-4">
                      <TooltipProvider delayDuration={200}>
                        <div className="flex gap-2 justify-start">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="icon" variant="outline" className="rounded-xl border-[#3A6EA5]/20 w-8 h-8 shrink-0" onClick={() => handleDownload(item.contractId)}>
                                <Download className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Download PDF</p></TooltipContent>
                          </Tooltip>
                          {item.canCancel && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button size="icon" variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-xl w-8 h-8 shrink-0" disabled={cancelContractMutation.isPending} onClick={() => handleCancelContract(item.contractId)}>
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent><p>Cancel</p></TooltipContent>
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
        {totalCount > contracts.length && (
          <div className="mt-4 flex justify-center items-center min-h-[40px]">
            {contractsFetching ? (
              <Loader2 className="w-6 h-6 animate-spin text-[#3A6EA5]" />
            ) : (
              <Button variant="outline" className="rounded-xl border-[#3A6EA5]/20 text-[#3A6EA5] hover:bg-[#3A6EA5] hover:text-white" onClick={() => setPageSize((p) => p + 20)}>
                Show More
              </Button>
            )}
          </div>
        )}
      </CardContent>

      {/* Confirmation Modal */}
      {showContractCancelConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-[#1a1a1a] mb-4">
              Confirm Action
            </h3>
            <p className="text-[#4a5565] mb-6">
              Are you sure you want to cancel this contract? 
              This action cannot be reversed.
            </p>
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1 rounded-xl border-[#3A6EA5]/20"
                onClick={() => {
                  setShowContractCancelConfirmModal(false)
                  setPendingCancelContractId(null)
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl"
                disabled={cancelContractMutation.isPending}
                onClick={confirmCancelContract}
              >
                {cancelContractMutation.isPending ? 'Processing…' : 'Confirm'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </Card>
  )
}
