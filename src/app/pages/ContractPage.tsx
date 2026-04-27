import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import {
  Download,
  Upload,
  FileText,
  CheckCircle,
  Calendar,
  Home,
  User,
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { Label } from '../components/ui/label'
import { Skeleton } from '../components/ui/skeleton'
import { useContract } from '@/hooks/useBookingRequests'

export function ContractPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [uploadedContract, setUploadedContract] = useState<File | null>(null)

  const { data: contractData, isLoading } = useContract(id)
  const contract = contractData?.data ?? null

  const isCompleted = contract?.status === 'Active'

  const handleDownload = () => {
    if (contract?.documentUrl) {
      window.open(contract.documentUrl, '_blank')
    } else {
      toast.success('Contract downloaded successfully')
    }
  }

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type === 'application/pdf') {
        setUploadedContract(file)
        toast.success('Signed contract uploaded successfully')
      } else {
        toast.error('Please upload a PDF file')
      }
    }
  }

  const handleSubmit = () => {
    if (uploadedContract) {
      toast.success(
        'Contract submitted for review. You will be notified once approved.',
      )
      navigate('/tenant-dashboard')
    } else {
      toast.error('Please upload the signed contract first')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen py-20">
        <div className="max-w-[900px] mx-auto px-8 space-y-6">
          <Skeleton className="h-10 w-32 rounded" />
          <Skeleton className="h-24 w-full rounded-3xl" />
          <Skeleton className="h-64 w-full rounded-3xl" />
          <Skeleton className="h-48 w-full rounded-3xl" />
        </div>
      </div>
    )
  }

  if (!contract) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center text-[#4a5565]">
        Contract not found.
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-[900px] mx-auto px-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 rounded-xl hover:bg-[#E5EBF0]/50"
        >
          ← Back
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1a1a1a] mb-2">
            Rental Contract
          </h1>
          <p className="text-lg text-[#6B7280]">
            Download, sign, and upload your rental agreement
          </p>
        </div>

        {/* Contract Status */}
        <Card className="bg-[#E5EBF0] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10 mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-green-100' : 'bg-yellow-100'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <FileText className="w-6 h-6 text-yellow-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-[#1a1a1a]">
                    Contract Status
                  </h3>
                  <p className="text-sm text-[#6B7280]">
                    {contract.status === 'Pending' && 'Awaiting signatures'}
                    {contract.status === 'Active' && 'Fully executed'}
                    {contract.status === 'Expired' && 'Contract expired'}
                    {contract.status === 'Terminated' && 'Contract terminated'}
                  </p>
                </div>
              </div>
              <div
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  isCompleted
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {contract.status}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contract Details */}
        <Card className="bg-[#E5EBF0] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10 mb-6">
          <CardHeader>
            <CardTitle className="text-2xl text-[#1a1a1a]">
              Contract Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Contract ID</p>
                <p className="font-semibold text-[#1a1a1a]">{contract.id}</p>
              </div>
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Monthly Rent</p>
                <p className="font-semibold text-[#1a1a1a]">
                  EGP {contract.monthlyRent.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Property Info */}
            <div className="p-4 bg-white rounded-2xl">
              <div className="flex items-center gap-2 mb-3">
                <Home className="w-5 h-5 text-[#3A6EA5]" />
                <h4 className="font-semibold text-[#1a1a1a]">Property</h4>
              </div>
              <p className="font-medium text-[#1a1a1a] mb-2">
                {contract.propertyName}
              </p>
              <p className="text-lg font-bold text-[#3A6EA5]">
                EGP {contract.monthlyRent.toLocaleString()}/month
              </p>
            </div>

            {/* Parties */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-5 h-5 text-[#3A6EA5]" />
                  <h4 className="font-semibold text-[#1a1a1a]">Tenant</h4>
                </div>
                <p className="font-medium text-[#1a1a1a]">
                  {contract.tenantName}
                </p>
              </div>
              {contract.ownerName && (
                <div className="p-4 bg-white rounded-2xl">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-5 h-5 text-[#3A6EA5]" />
                    <h4 className="font-semibold text-[#1a1a1a]">Owner</h4>
                  </div>
                  <p className="font-medium text-[#1a1a1a]">
                    {contract.ownerName}
                  </p>
                </div>
              )}
            </div>

            {/* Rental Period */}
            <div className="p-4 bg-white rounded-2xl">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5 text-[#3A6EA5]" />
                <h4 className="font-semibold text-[#1a1a1a]">Rental Period</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#6B7280] mb-1">Start Date</p>
                  <p className="font-medium text-[#1a1a1a]">
                    {new Date(contract.startDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#6B7280] mb-1">End Date</p>
                  <p className="font-medium text-[#1a1a1a]">
                    {new Date(contract.expiryDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Monthly Rent highlight */}
            <div className="p-4 bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] rounded-2xl text-white">
              <p className="text-sm mb-1 opacity-90">Monthly Rent</p>
              <p className="text-3xl font-bold">
                EGP {contract.monthlyRent.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Download Contract */}
        <Card className="bg-[#E5EBF0] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10 mb-6">
          <CardHeader>
            <CardTitle className="text-2xl text-[#1a1a1a]">
              Download Contract
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-6 bg-white rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#E5EBF0] flex items-center justify-center flex-shrink-0">
                  <FileText className="w-8 h-8 text-[#3A6EA5]" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[#1a1a1a] mb-1">
                    Rental Agreement PDF
                  </h4>
                  <p className="text-sm text-[#6B7280] mb-4">
                    Download the rental contract, review all terms carefully,
                    sign it, and upload the signed copy below.
                  </p>
                  <Button
                    onClick={handleDownload}
                    className="bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2C5580] hover:to-[#3A6EA5] text-white rounded-xl"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Contract
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Signed Contract */}
        <Card className="bg-[#E5EBF0] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10 mb-6">
          <CardHeader>
            <CardTitle className="text-2xl text-[#1a1a1a]">
              Upload Signed Contract
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="text-[#1a1a1a] mb-2 block">
                  Upload Signed Document (PDF only)
                </Label>
                <div className="relative">
                  <input
                    type="file"
                    id="contract-upload"
                    accept=".pdf"
                    onChange={handleUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="contract-upload"
                    className="flex flex-col items-center justify-center w-full h-40 bg-white rounded-xl border-2 border-dashed border-[#3A6EA5]/20 hover:border-[#3A6EA5]/40 cursor-pointer transition-colors"
                  >
                    <Upload className="w-12 h-12 text-[#6B7280] mb-3" />
                    <span className="text-sm text-[#6B7280] mb-1">
                      {uploadedContract
                        ? uploadedContract.name
                        : 'Click to upload signed contract'}
                    </span>
                    <span className="text-xs text-[#6B7280]">
                      PDF format only
                    </span>
                  </label>
                </div>
              </div>

              {uploadedContract && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div className="flex-1">
                    <p className="font-medium text-green-900">
                      Contract uploaded successfully
                    </p>
                    <p className="text-sm text-green-700">
                      {uploadedContract.name}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="rounded-xl border-[#3A6EA5]/20"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!uploadedContract}
                  className="bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2C5580] hover:to-[#3A6EA5] text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Contract
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card className="bg-yellow-50 border-2 border-yellow-200 rounded-3xl">
          <CardHeader>
            <CardTitle className="text-xl text-yellow-900">
              Important Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-yellow-800 space-y-2">
            <p>• Please read the entire contract carefully before signing</p>
            <p>• Both parties must sign the contract for it to be valid</p>
            <p>• Keep a copy of the signed contract for your records</p>
            <p>• Contact support if you have any questions or concerns</p>
            <p>• The contract becomes effective on the start date specified</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
