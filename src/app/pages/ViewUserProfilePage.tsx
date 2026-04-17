import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  Briefcase,
  GraduationCap,
  Home,
  Volume2,
  Flag,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import { useNavigate } from 'react-router'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { toast } from 'sonner'

const USER_PROFILE = {
  name: 'Layla Hassan',
  avatar: 'https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?w=400',
  email: 'layla.hassan@example.com',
  phone: '+20 1234 567 890',
  location: 'Alexandria, Egypt',
  joinDate: 'January 2024',
  bio: 'Friendly and respectful tenant looking for a comfortable living space. I work remotely as a software engineer and enjoy a quiet environment. Non-smoker, no pets, and very clean.',
  acceptsRoommates: true,
  verified: true,
  lifestyle: {
    smoking: false,
    pets: false,
    sleepSchedule: 'Night owl',
    noiseTolerance: 'Medium',
    guestsFrequency: 'Occasionally',
    workSchedule: 'Remote',
    sharingLevel: 'Okay with Sharing',
  },
  education: {
    level: "Bachelor's",
    field: 'Computer Science',
  },
}

export function ViewUserProfilePage() {
  const navigate = useNavigate()
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [reportReason, setReportReason] = useState('')

  const handleReport = () => {
    if (reportReason.trim()) {
      toast.success('Report submitted successfully. We will review it shortly.')
      setShowReportDialog(false)
      setReportReason('')
    } else {
      toast.error('Please provide a reason for reporting')
    }
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-[1200px] mx-auto px-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 rounded-xl hover:bg-[#E5EBF0]/50"
        >
          ← Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="bg-[#E5EBF0] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10">
              <CardContent className="pt-6 text-center">
                <div className="relative w-40 h-40 mx-auto mb-6">
                  <Avatar className="w-full h-full">
                    <AvatarImage src={USER_PROFILE.avatar} />
                    <AvatarFallback className="text-4xl">
                      {USER_PROFILE.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  {USER_PROFILE.verified && (
                    <div className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">
                  {USER_PROFILE.name}
                </h2>
                {USER_PROFILE.verified && (
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 rounded-full text-green-700 text-sm font-medium mb-4">
                    <CheckCircle className="w-4 h-4" />
                    Verified User
                  </div>
                )}

                <div className="space-y-3 mt-6 text-left">
                  <div className="flex items-center gap-3 text-sm text-[#1a1a1a]">
                    <Mail className="w-4 h-4 text-[#3A6EA5]" />
                    <span>{USER_PROFILE.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#1a1a1a]">
                    <Phone className="w-4 h-4 text-[#3A6EA5]" />
                    <span>{USER_PROFILE.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#1a1a1a]">
                    <MapPin className="w-4 h-4 text-[#3A6EA5]" />
                    <span>{USER_PROFILE.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#1a1a1a]">
                    <Calendar className="w-4 h-4 text-[#3A6EA5]" />
                    <span>Member since {USER_PROFILE.joinDate}</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[#3A6EA5]/20">
                  <Button
                    variant="destructive"
                    className="w-full rounded-xl bg-red-500 hover:bg-red-600"
                    onClick={() => setShowReportDialog(true)}
                  >
                    <Flag className="w-4 h-4 mr-2" />
                    Report User
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <Card className="bg-[#E5EBF0] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10">
              <CardHeader>
                <CardTitle className="text-2xl text-[#1a1a1a]">About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#1a1a1a] leading-relaxed">
                  {USER_PROFILE.bio}
                </p>
              </CardContent>
            </Card>

            {/* Roommate Status */}
            <Card className="bg-[#E5EBF0] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-[#3A6EA5]" />
                  <CardTitle className="text-2xl text-[#1a1a1a]">
                    Roommate Status
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 p-4 bg-white rounded-2xl">
                  {USER_PROFILE.acceptsRoommates ? (
                    <>
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      <div>
                        <p className="font-semibold text-[#1a1a1a]">
                          Accepts Roommates
                        </p>
                        <p className="text-sm text-[#6B7280]">
                          This user is open to sharing accommodation
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-6 h-6 text-red-500" />
                      <div>
                        <p className="font-semibold text-[#1a1a1a]">
                          Does Not Accept Roommates
                        </p>
                        <p className="text-sm text-[#6B7280]">
                          This user prefers to live alone
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Lifestyle & Preferences */}
            <Card className="bg-[#E5EBF0] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Home className="w-6 h-6 text-[#3A6EA5]" />
                  <CardTitle className="text-2xl text-[#1a1a1a]">
                    Lifestyle & Preferences
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-2xl">
                    <p className="text-sm text-[#6B7280] mb-1">Smoking</p>
                    <p className="font-semibold text-[#1a1a1a]">
                      {USER_PROFILE.lifestyle.smoking ? 'Yes' : 'No'}
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-2xl">
                    <p className="text-sm text-[#6B7280] mb-1">Pets</p>
                    <p className="font-semibold text-[#1a1a1a]">
                      {USER_PROFILE.lifestyle.pets ? 'Yes' : 'No'}
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-2xl">
                    <p className="text-sm text-[#6B7280] mb-1">
                      Sleep Schedule
                    </p>
                    <p className="font-semibold text-[#1a1a1a]">
                      {USER_PROFILE.lifestyle.sleepSchedule}
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-2xl">
                    <div className="flex items-center gap-2 mb-1">
                      <Volume2 className="w-4 h-4 text-[#6B7280]" />
                      <p className="text-sm text-[#6B7280]">Noise Tolerance</p>
                    </div>
                    <p className="font-semibold text-[#1a1a1a]">
                      {USER_PROFILE.lifestyle.noiseTolerance}
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-2xl">
                    <p className="text-sm text-[#6B7280] mb-1">
                      Guests Frequency
                    </p>
                    <p className="font-semibold text-[#1a1a1a]">
                      {USER_PROFILE.lifestyle.guestsFrequency}
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-2xl">
                    <div className="flex items-center gap-2 mb-1">
                      <Briefcase className="w-4 h-4 text-[#6B7280]" />
                      <p className="text-sm text-[#6B7280]">Work Schedule</p>
                    </div>
                    <p className="font-semibold text-[#1a1a1a]">
                      {USER_PROFILE.lifestyle.workSchedule}
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-2xl md:col-span-2">
                    <p className="text-sm text-[#6B7280] mb-1">Sharing Level</p>
                    <p className="font-semibold text-[#1a1a1a]">
                      {USER_PROFILE.lifestyle.sharingLevel}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card className="bg-[#E5EBF0] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-6 h-6 text-[#3A6EA5]" />
                  <CardTitle className="text-2xl text-[#1a1a1a]">
                    Education
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-2xl">
                    <p className="text-sm text-[#6B7280] mb-1">
                      Education Level
                    </p>
                    <p className="font-semibold text-[#1a1a1a]">
                      {USER_PROFILE.education.level}
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-2xl">
                    <p className="text-sm text-[#6B7280] mb-1">
                      Field of Study
                    </p>
                    <p className="font-semibold text-[#1a1a1a]">
                      {USER_PROFILE.education.field}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Report Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="bg-white rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#1a1a1a]">
              Report User
            </DialogTitle>
            <DialogDescription className="text-[#6B7280]">
              Please provide details about why you're reporting this user. Our
              team will review your report.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label
                htmlFor="report-reason"
                className="text-[#1a1a1a] mb-2 block"
              >
                Reason for Reporting
              </Label>
              <Textarea
                id="report-reason"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Describe the issue..."
                className="bg-[#F2F4F6] rounded-xl border-[#3A6EA5]/20 min-h-[120px]"
              />
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowReportDialog(false)
                setReportReason('')
              }}
              className="rounded-xl border-[#3A6EA5]/20"
            >
              Cancel
            </Button>
            <Button
              onClick={handleReport}
              className="bg-red-500 hover:bg-red-600 text-white rounded-xl"
            >
              Submit Report
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
