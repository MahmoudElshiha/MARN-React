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
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Label } from '../components/ui/label'
import { Skeleton } from '../components/ui/skeleton'
import { useContract } from '@/hooks/useBookingRequests'

export function ContractPage() {
  const { t } = useTranslation('contracts')
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
      toast.success(t('toasts.downloaded'))
    }
  }

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type === 'application/pdf') {
        setUploadedContract(file)
        toast.success(t('toasts.uploaded'))
      } else {
        toast.error(t('toasts.pdfOnly'))
      }
    }
  }

  const handleSubmit = () => {
    if (uploadedContract) {
      toast.success(t('toasts.submitted'))
      navigate('/tenant-dashboard')
    } else {
      toast.error(t('toasts.uploadFirst'))
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
        {t('notFound')}
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
          ← {t('back')}
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1a1a1a] mb-2">
            {t('title')}
          </h1>
          <p className="text-lg text-[#6B7280]">
            {t('subtitle')}
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
                    {t('contractStatus')}
                  </h3>
                  <p className="text-sm text-[#6B7280]">
                    {contract.status === 'Pending' && t('statusText.awaitingSignatures')}
                    {contract.status === 'Active' && t('statusText.fullyExecuted')}
                    {contract.status === 'Expired' && t('statusText.expired')}
                    {contract.status === 'Terminated' && t('statusText.terminated')}
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
              {t('contractDetails')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-[#6B7280] mb-1">{t('contractId')}</p>
                <p className="font-semibold text-[#1a1a1a]">{contract.id}</p>
              </div>
              <div>
                <p className="text-sm text-[#6B7280] mb-1">{t('monthlyRent')}</p>
                <p className="font-semibold text-[#1a1a1a]">
                  EGP {contract.monthlyRent.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Property Info */}
            <div className="p-4 bg-white rounded-2xl">
              <div className="flex items-center gap-2 mb-3">
                <Home className="w-5 h-5 text-[#3A6EA5]" />
                <h4 className="font-semibold text-[#1a1a1a]">{t('property')}</h4>
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
                  <h4 className="font-semibold text-[#1a1a1a]">{t('tenant')}</h4>
                </div>
                <p className="font-medium text-[#1a1a1a]">
                  {contract.tenantName}
                </p>
              </div>
              {contract.ownerName && (
                <div className="p-4 bg-white rounded-2xl">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-5 h-5 text-[#3A6EA5]" />
                    <h4 className="font-semibold text-[#1a1a1a]">{t('owner')}</h4>
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
                <h4 className="font-semibold text-[#1a1a1a]">{t('rentalPeriod')}</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#6B7280] mb-1">{t('startDate')}</p>
                  <p className="font-medium text-[#1a1a1a]">
                    {new Date(contract.startDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#6B7280] mb-1">{t('endDate')}</p>
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
              <p className="text-sm mb-1 opacity-90">{t('monthlyRent')}</p>
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
              {t('download')}
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
                    {t('rentalAgreementPdf')}
                  </h4>
                  <p className="text-sm text-[#6B7280] mb-4">
                    {t('rentalAgreementDesc')}
                  </p>
                  <Button
                    onClick={handleDownload}
                    className="bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2C5580] hover:to-[#3A6EA5] text-white rounded-xl"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {t('download')}
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
              {t('upload')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="text-[#1a1a1a] mb-2 block">
                  {t('uploadSignedDoc')}
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
                        : t('clickToUpload')}
                    </span>
                    <span className="text-xs text-[#6B7280]">
                      {t('pdfFormatOnly')}
                    </span>
                  </label>
                </div>
              </div>

              {uploadedContract && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div className="flex-1">
                    <p className="font-medium text-green-900">
                      {t('contractUploadedSuccess')}
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
                  {t('cancel')}
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!uploadedContract}
                  className="bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2C5580] hover:to-[#3A6EA5] text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('submit')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card className="bg-yellow-50 border-2 border-yellow-200 rounded-3xl">
          <CardHeader>
            <CardTitle className="text-xl text-yellow-900">
              {t('importantNotes.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-yellow-800 space-y-2">
            <p>• {t('importantNotes.readCarefully')}</p>
            <p>• {t('importantNotes.bothParties')}</p>
            <p>• {t('importantNotes.keepCopy')}</p>
            <p>• {t('importantNotes.contactSupport')}</p>
            <p>• {t('importantNotes.effectiveDate')}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
