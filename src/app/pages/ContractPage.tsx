import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Download, Upload, FileText, CheckCircle, Calendar, Home, User } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { toast } from 'sonner';
import { Label } from '../components/ui/label';

const CONTRACT_INFO = {
  contractId: 'MARN-2026-001234',
  property: {
    name: 'Modern Downtown Apartment',
    address: '123 Market Street, Cairo, Egypt',
    price: 28000,
  },
  tenant: {
    name: 'Fatima Al-Masri',
    email: 'fatima.almasri@example.com',
  },
  owner: {
    name: 'Ahmed El-Sayed',
    email: 'ahmed.elsayed@example.com',
  },
  startDate: '2026-04-01',
  endDate: '2026-10-01',
  duration: '6 months',
  totalAmount: 168000,
  status: 'pending', // pending, owner-signed, completed
};

export function ContractPage() {
  const navigate = useNavigate();
  const [uploadedContract, setUploadedContract] = useState<File | null>(null);

  const handleDownload = () => {
    // In a real app, this would generate and download the PDF
    toast.success('Contract downloaded successfully');
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setUploadedContract(file);
        toast.success('Signed contract uploaded successfully');
      } else {
        toast.error('Please upload a PDF file');
      }
    }
  };

  const handleSubmit = () => {
    if (uploadedContract) {
      toast.success('Contract submitted for review. You will be notified once approved.');
      navigate('/tenant-dashboard');
    } else {
      toast.error('Please upload the signed contract first');
    }
  };

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
          <h1 className="text-4xl font-bold text-[#1a1a1a] mb-2">Rental Contract</h1>
          <p className="text-lg text-[#6B7280]">Download, sign, and upload your rental agreement</p>
        </div>

        {/* Contract Status */}
        <Card className="bg-[#E5EBF0] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10 mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  CONTRACT_INFO.status === 'completed' 
                    ? 'bg-green-100' 
                    : 'bg-yellow-100'
                }`}>
                  {CONTRACT_INFO.status === 'completed' ? (
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
                    {CONTRACT_INFO.status === 'pending' && 'Awaiting signatures'}
                    {CONTRACT_INFO.status === 'owner-signed' && 'Awaiting tenant signature'}
                    {CONTRACT_INFO.status === 'completed' && 'Fully executed'}
                  </p>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                CONTRACT_INFO.status === 'completed'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {CONTRACT_INFO.status === 'completed' ? 'Completed' : 'Pending'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contract Details */}
        <Card className="bg-[#E5EBF0] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10 mb-6">
          <CardHeader>
            <CardTitle className="text-2xl text-[#1a1a1a]">Contract Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Contract ID</p>
                <p className="font-semibold text-[#1a1a1a]">{CONTRACT_INFO.contractId}</p>
              </div>
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Duration</p>
                <p className="font-semibold text-[#1a1a1a]">{CONTRACT_INFO.duration}</p>
              </div>
            </div>

            {/* Property Info */}
            <div className="p-4 bg-white rounded-2xl">
              <div className="flex items-center gap-2 mb-3">
                <Home className="w-5 h-5 text-[#3A6EA5]" />
                <h4 className="font-semibold text-[#1a1a1a]">Property</h4>
              </div>
              <p className="font-medium text-[#1a1a1a] mb-1">{CONTRACT_INFO.property.name}</p>
              <p className="text-sm text-[#6B7280] mb-2">{CONTRACT_INFO.property.address}</p>
              <p className="text-lg font-bold text-[#3A6EA5]">
                EGP {CONTRACT_INFO.property.price.toLocaleString()}/month
              </p>
            </div>

            {/* Parties */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-5 h-5 text-[#3A6EA5]" />
                  <h4 className="font-semibold text-[#1a1a1a]">Tenant</h4>
                </div>
                <p className="font-medium text-[#1a1a1a] mb-1">{CONTRACT_INFO.tenant.name}</p>
                <p className="text-sm text-[#6B7280]">{CONTRACT_INFO.tenant.email}</p>
              </div>
              <div className="p-4 bg-white rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-5 h-5 text-[#3A6EA5]" />
                  <h4 className="font-semibold text-[#1a1a1a]">Owner</h4>
                </div>
                <p className="font-medium text-[#1a1a1a] mb-1">{CONTRACT_INFO.owner.name}</p>
                <p className="text-sm text-[#6B7280]">{CONTRACT_INFO.owner.email}</p>
              </div>
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
                    {new Date(CONTRACT_INFO.startDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#6B7280] mb-1">End Date</p>
                  <p className="font-medium text-[#1a1a1a]">
                    {new Date(CONTRACT_INFO.endDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Total Amount */}
            <div className="p-4 bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] rounded-2xl text-white">
              <p className="text-sm mb-1 opacity-90">Total Contract Value</p>
              <p className="text-3xl font-bold">EGP {CONTRACT_INFO.totalAmount.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        {/* Download Contract */}
        <Card className="bg-[#E5EBF0] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10 mb-6">
          <CardHeader>
            <CardTitle className="text-2xl text-[#1a1a1a]">Download Contract</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-6 bg-white rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#E5EBF0] flex items-center justify-center flex-shrink-0">
                  <FileText className="w-8 h-8 text-[#3A6EA5]" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[#1a1a1a] mb-1">Rental Agreement PDF</h4>
                  <p className="text-sm text-[#6B7280] mb-4">
                    Download the rental contract, review all terms carefully, sign it, and upload the signed copy below.
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
            <CardTitle className="text-2xl text-[#1a1a1a]">Upload Signed Contract</CardTitle>
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
                      {uploadedContract ? uploadedContract.name : 'Click to upload signed contract'}
                    </span>
                    <span className="text-xs text-[#6B7280]">PDF format only</span>
                  </label>
                </div>
              </div>

              {uploadedContract && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div className="flex-1">
                    <p className="font-medium text-green-900">Contract uploaded successfully</p>
                    <p className="text-sm text-green-700">{uploadedContract.name}</p>
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
            <CardTitle className="text-xl text-yellow-900">Important Notes</CardTitle>
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
  );
}