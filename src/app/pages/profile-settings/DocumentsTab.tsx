import { useState } from 'react'
import { IdCard } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { FileUpload } from '../../components/ui/file-upload'
import { toast } from 'sonner'

export function DocumentsTab() {
  const [identityVerification, setIdentityVerification] = useState({
    frontIdCard: null as File | null,
    backIdCard: null as File | null,
    nameArabic: '',
    addressArabic: '',
    nationalIdNumber: '',
  })

  return (
    <Card className="bg-[#F2F4F6] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10">
      <CardHeader>
        <div className="flex items-center gap-3">
          <IdCard className="w-6 h-6 text-[#3A6EA5]" />
          <div>
            <CardTitle className="text-2xl text-[#1a1a1a]">Identity Verification</CardTitle>
            <p className="text-sm text-[#4a5565] mt-1">
              Upload your identification documents for account verification
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label className="text-[#1a1a1a] mb-2 block">Front Side of ID Card</Label>
            <FileUpload
              id="frontIdCard"
              value={identityVerification.frontIdCard}
              onChange={(file) => {
                setIdentityVerification({ ...identityVerification, frontIdCard: file })
                toast.success('Front side of ID uploaded')
              }}
              onClear={() =>
                setIdentityVerification({ ...identityVerification, frontIdCard: null })
              }
            />
          </div>

          <div>
            <Label className="text-[#1a1a1a] mb-2 block">Back Side of ID Card</Label>
            <FileUpload
              id="backIdCard"
              value={identityVerification.backIdCard}
              onChange={(file) => {
                setIdentityVerification({ ...identityVerification, backIdCard: file })
                toast.success('Back side of ID uploaded')
              }}
              onClear={() =>
                setIdentityVerification({ ...identityVerification, backIdCard: null })
              }
            />
          </div>

          <div>
            <Label htmlFor="nameArabic" className="text-[#1a1a1a] mb-2 block">Name in Arabic</Label>
            <Input
              id="nameArabic"
              value={identityVerification.nameArabic}
              onChange={(e) =>
                setIdentityVerification({ ...identityVerification, nameArabic: e.target.value })
              }
              className="bg-white rounded-xl border-[#3A6EA5]/20"
              placeholder="أدخل اسمك بالعربية"
              dir="rtl"
            />
          </div>

          <div>
            <Label htmlFor="addressArabic" className="text-[#1a1a1a] mb-2 block">
              Address in Arabic
            </Label>
            <Input
              id="addressArabic"
              value={identityVerification.addressArabic}
              onChange={(e) =>
                setIdentityVerification({
                  ...identityVerification,
                  addressArabic: e.target.value,
                })
              }
              className="bg-white rounded-xl border-[#3A6EA5]/20"
              placeholder="أدخل عنوانك بالعربية"
              dir="rtl"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="nationalIdNumber" className="text-[#1a1a1a] mb-2 block">
              National ID Number
            </Label>
            <Input
              id="nationalIdNumber"
              value={identityVerification.nationalIdNumber}
              onChange={(e) =>
                setIdentityVerification({
                  ...identityVerification,
                  nationalIdNumber: e.target.value,
                })
              }
              className="bg-white rounded-xl border-[#3A6EA5]/20"
              placeholder="Enter your national ID number"
            />
          </div>
        </div>

        <div className="flex gap-4 justify-end pt-4">
          <Button variant="outline" className="rounded-xl border-[#3A6EA5]/20">
            Cancel
          </Button>
          <Button
            onClick={() => toast.success('Identity documents submitted for review')}
            className="bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-xl"
          >
            Submit for Verification
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
