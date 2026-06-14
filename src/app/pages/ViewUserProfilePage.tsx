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
  Wallet,
  Globe,
  Star,
  User as UserIcon,
  CalendarDays,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router'
import { useState } from 'react'
import { useUserProfile } from '@/hooks/useProfile'
import { useSubmitReport } from '@/hooks/useConversations'
import { Skeleton } from '../components/ui/skeleton'
import { Loader2 } from 'lucide-react'
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
import { useTranslation } from 'react-i18next'

export function ViewUserProfilePage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { data: profileData, isLoading, isError } = useUserProfile(id)
  const profile = profileData?.data

  const [showReportDialog, setShowReportDialog] = useState(false)
  const [reportReason, setReportReason] = useState('')

  const submitReport = useSubmitReport()
  const { t, i18n } = useTranslation('pages')

  const handleReport = () => {
    if (!id || reportReason.trim().length < 5) {
      toast.error(t('viewUserProfile.toasts.reportReasonRequired', 'Please provide a reason of at least 5 characters for reporting'))
      return
    }

    submitReport.mutate(
      {
        reportableType: 'User',
        reportableTargetId: id,
        reason: reportReason.trim(),
      },
      {
        onSuccess: () => {
          toast.success(t('viewUserProfile.toasts.reportSubmitted', 'Report submitted successfully. We will review it shortly.'))
          setShowReportDialog(false)
          setReportReason('')
        },
        onError: (error: any) => {
          let msg = 'Failed to submit report. Please try again.';
          if (error?.data?.errors) {
            msg = Object.values(error.data.errors).flat().join(', ');
          } else if (error?.message) {
            msg = error.message;
          }
          toast.error(msg);
        }
      }
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <Skeleton className="w-16 h-16 rounded-full" />
      </div>
    )
  }

  if (isError || !profile) {
    return (
      <div className="min-h-screen py-20 flex flex-col items-center justify-center text-[#1a1a1a]">
        <h2 className="text-2xl font-bold mb-4">User not found</h2>
        <Button onClick={() => navigate(-1)} variant="outline">Go Back</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-[1200px] mx-auto px-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 rounded-xl hover:bg-[#E5EBF0]/50"
        >
          <span className={i18n.language === 'ar' ? 'ml-2' : 'mr-2'}>
            {i18n.language === 'ar' ? '→' : '←'}
          </span>
          {t('viewUserProfile.back')}
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="bg-[#E5EBF0] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10">
              <CardContent className="pt-6 text-center">
                <div className="relative w-40 h-40 mx-auto mb-6">
                  <Avatar className="w-full h-full">
                    {profile.profileImage && <AvatarImage src={profile.profileImage} />}
                    <AvatarFallback className="text-4xl">
                      {profile.fullName?.split(' ').map((n) => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  {profile.accountStatus === 'Active' && (
                    <div className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">
                  {profile.fullName}
                </h2>
                {profile.accountStatus === 'Active' && (
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 rounded-full text-green-700 text-sm font-medium mb-4">
                    <CheckCircle className="w-4 h-4" />
                    {t('viewUserProfile.verifiedUser')}
                  </div>
                )}

                <div className="space-y-3 mt-6 text-left">
                  <div className="flex items-center gap-3 text-sm text-[#1a1a1a]">
                    <Mail className="w-4 h-4 text-[#3A6EA5]" />
                    <span>{profile.email}</span>
                  </div>
                  {profile.gender && (
                    <div className="flex items-center gap-3 text-sm text-[#1a1a1a]">
                      <UserIcon className="w-4 h-4 text-[#3A6EA5]" />
                      <span>{profile.gender}</span>
                    </div>
                  )}
                  {profile.dateOfBirth && (
                    <div className="flex items-center gap-3 text-sm text-[#1a1a1a]">
                      <CalendarDays className="w-4 h-4 text-[#3A6EA5]" />
                      <span>
                        {Math.floor((new Date().getTime() - new Date(profile.dateOfBirth).getTime()) / 3.15576e+10)} years old
                      </span>
                    </div>
                  )}
                  {profile.country && (
                    <div className="flex items-center gap-3 text-sm text-[#1a1a1a]">
                      <Globe className="w-4 h-4 text-[#3A6EA5]" />
                      <span>{profile.country}</span>
                    </div>
                  )}
                  {profile.memberSince && (
                    <div className="flex items-center gap-3 text-sm text-[#1a1a1a]">
                      <Calendar className="w-4 h-4 text-[#3A6EA5]" />
                      <span>Joined {new Date(profile.memberSince).getFullYear()}</span>
                    </div>
                  )}
                </div>

                {profile.isOwner && (
                  <div className="mt-6 pt-6 border-t border-[#3A6EA5]/20 flex justify-around text-[#1a1a1a]">
                    <div className="text-center">
                      <div className="flex justify-center items-center gap-1 font-bold text-lg">
                        <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                        {profile.averageRating ? profile.averageRating.toFixed(1) : 'N/A'}
                      </div>
                      <p className="text-xs text-[#6B7280]">
                        {profile.ratingsCount || 0} Ratings
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="flex justify-center items-center gap-1 font-bold text-lg">
                        <Home className="w-5 h-5 text-[#3A6EA5]" />
                        {profile.ownedPropertiesCount || 0}
                      </div>
                      <p className="text-xs text-[#6B7280]">Properties</p>
                    </div>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-[#3A6EA5]/20">
                  <Button
                    className="w-full rounded-xl bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white shadow-md mb-3"
                    onClick={() => navigate('/messages')}
                  >
                    <MessageSquare className={`w-4 h-4 ${i18n.language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                    Message
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full rounded-xl bg-red-500 hover:bg-red-600"
                    onClick={() => setShowReportDialog(true)}
                  >
                    <Flag className={`w-4 h-4 ${i18n.language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                    {t('viewUserProfile.reportUser')}
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
                <CardTitle className="text-2xl text-[#1a1a1a]">{t('viewUserProfile.about')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#1a1a1a] leading-relaxed">
                  {profile.bio || 'No bio provided.'}
                </p>
              </CardContent>
            </Card>

            {/* Compatibility Analysis (Only shown if we have match data) */}
            {profile.matchingPercentage !== undefined && profile.matchingPercentage !== null && (
              <Card className="bg-[#E5EBF0] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-6">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-400 text-white font-bold text-lg px-4 py-2 rounded-full shadow-md flex items-center gap-1">
                    {profile.matchingPercentage}% Match
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl text-[#1a1a1a]">Compatibility Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {profile.topMatchingTraits && profile.topMatchingTraits.length > 0 && (
                      <div className="bg-white p-4 rounded-2xl">
                        <h4 className="text-sm font-bold text-[#1a1a1a] uppercase tracking-wider mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          Top Matches
                        </h4>
                        <ul className="space-y-2">
                          {profile.topMatchingTraits.map((trait, idx) => {
                            let displayTrait = trait;
                            if (trait === 'Both Non-Smokers') displayTrait = "You're both non-smokers";
                            else if (trait.startsWith('Both prefer')) displayTrait = trait.replace('Both prefer', 'You both prefer');
                            else if (trait.startsWith('Both ')) displayTrait = trait.replace('Both ', 'You both are ');

                            return (
                              <li key={idx} className="text-sm text-[#4a5565] flex items-start gap-2">
                                <span className="text-green-500 mt-1 flex-shrink-0">•</span>
                                <span>{displayTrait}</span>
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    )}

                    {profile.mismatchedTraits && profile.mismatchedTraits.length > 0 && (
                      <div className="bg-white p-4 rounded-2xl">
                        <h4 className="text-sm font-bold text-[#1a1a1a] uppercase tracking-wider mb-3 flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-amber-500" />
                          Differences
                        </h4>
                        <ul className="space-y-2">
                          {profile.mismatchedTraits.map((trait, idx) => (
                            <li key={idx} className="text-sm text-[#4a5565] flex items-start gap-2">
                              <span className="text-amber-500 mt-1 flex-shrink-0">•</span>
                              <span>{trait}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {profile.dealbreakersFound && profile.dealbreakersFound.length > 0 && (
                      <div className="bg-white p-4 rounded-2xl md:col-span-2">
                        <h4 className="text-sm font-bold text-[#1a1a1a] uppercase tracking-wider mb-3 flex items-center gap-2">
                          <XCircle className="w-5 h-5 text-red-500" />
                          Dealbreakers
                        </h4>
                        <ul className="space-y-2">
                          {profile.dealbreakersFound.map((trait, idx) => (
                            <li key={idx} className="text-sm text-red-600 font-medium flex items-start gap-2">
                              <span className="text-red-500 mt-1 flex-shrink-0">•</span>
                              <span>{trait}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Roommate Status */}
            <Card className="bg-[#E5EBF0] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-[#3A6EA5]" />
                  <CardTitle className="text-2xl text-[#1a1a1a]">
                    {t('viewUserProfile.roommateStatus')}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 p-4 bg-white rounded-2xl">
                  {profile.roommatePreferencesEnabled ? (
                    <>
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      <div>
                        <p className="font-semibold text-[#1a1a1a]">
                          {t('viewUserProfile.acceptsRoommates')}
                        </p>
                        <p className="text-sm text-[#6B7280]">
                          {t('viewUserProfile.acceptsRoommatesDesc')}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-6 h-6 text-red-500" />
                      <div>
                        <p className="font-semibold text-[#1a1a1a]">
                          {t('viewUserProfile.doesNotAcceptRoommates')}
                        </p>
                        <p className="text-sm text-[#6B7280]">
                          {t('viewUserProfile.doesNotAcceptRoommatesDesc')}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Lifestyle & Preferences */}
            {profile.roommatePreferencesEnabled && (
              <Card className="bg-[#E5EBF0] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Home className="w-6 h-6 text-[#3A6EA5]" />
                    <CardTitle className="text-2xl text-[#1a1a1a]">
                      {t('viewUserProfile.lifestyle')}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-2xl">
                      <p className="text-sm text-[#6B7280] mb-1">{t('viewUserProfile.lifestyle_fields.smoking', 'Smoking')}</p>
                      <p className="font-semibold text-[#1a1a1a]">
                        {profile.smoking === null ? 'Unspecified' : (profile.smoking ? 'Yes' : 'No')}
                      </p>
                    </div>
                    <div className="p-4 bg-white rounded-2xl">
                      <p className="text-sm text-[#6B7280] mb-1">{t('viewUserProfile.lifestyle_fields.pets', 'Pets')}</p>
                      <p className="font-semibold text-[#1a1a1a]">
                        {profile.pets === null ? 'Unspecified' : (profile.pets ? 'Yes' : 'No')}
                      </p>
                    </div>
                    <div className="p-4 bg-white rounded-2xl">
                      <p className="text-sm text-[#6B7280] mb-1">
                        {t('viewUserProfile.lifestyle_fields.sleepSchedule', 'Sleep Schedule')}
                      </p>
                      <p className="font-semibold text-[#1a1a1a]">
                        {profile.sleepSchedule ? (profile.sleepScheduleDisplayName || profile.sleepSchedule) : 'Unspecified'}
                      </p>
                    </div>
                    <div className="p-4 bg-white rounded-2xl">
                      <div className="flex items-center gap-2 mb-1">
                        <Volume2 className="w-4 h-4 text-[#6B7280]" />
                        <p className="text-sm text-[#6B7280]">{t('viewUserProfile.lifestyle_fields.noiseTolerance', 'Noise Tolerance')}</p>
                      </div>
                      <p className="font-semibold text-[#1a1a1a]">
                        {profile.noiseTolerance !== null ? profile.noiseTolerance + '/5' : 'Unspecified'}
                      </p>
                    </div>
                    <div className="p-4 bg-white rounded-2xl">
                      <p className="text-sm text-[#6B7280] mb-1">
                        {t('viewUserProfile.lifestyle_fields.guestsFrequency', 'Guests Frequency')}
                      </p>
                      <p className="font-semibold text-[#1a1a1a]">
                        {profile.guestsFrequency ? (profile.guestsFrequencyDisplayName || profile.guestsFrequency) : 'Unspecified'}
                      </p>
                    </div>
                    <div className="p-4 bg-white rounded-2xl">
                      <div className="flex items-center gap-2 mb-1">
                        <Briefcase className="w-4 h-4 text-[#6B7280]" />
                        <p className="text-sm text-[#6B7280]">{t('viewUserProfile.lifestyle_fields.workSchedule', 'Work Schedule')}</p>
                      </div>
                      <p className="font-semibold text-[#1a1a1a]">
                        {profile.workSchedule ? (profile.workScheduleDisplayName || profile.workSchedule) : 'Unspecified'}
                      </p>
                    </div>
                    <div className="p-4 bg-white rounded-2xl md:col-span-2">
                      <p className="text-sm text-[#6B7280] mb-1">{t('viewUserProfile.lifestyle_fields.sharingLevel', 'Sharing Level')}</p>
                      <p className="font-semibold text-[#1a1a1a]">
                        {profile.sharingLevel ? (profile.sharingLevelDisplayName || profile.sharingLevel) : 'Unspecified'}
                      </p>
                    </div>
                    <div className="p-4 bg-white rounded-2xl md:col-span-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Wallet className="w-4 h-4 text-[#6B7280]" />
                        <p className="text-sm text-[#6B7280]">Budget Range</p>
                      </div>
                      <p className="font-semibold text-[#1a1a1a]">
                        {(profile.budgetRangeMin !== null && profile.budgetRangeMax !== null)
                          ? `${profile.budgetRangeMin} EGP - ${profile.budgetRangeMax} EGP`
                          : 'Unspecified'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Education */}
            {profile.roommatePreferencesEnabled && (
              <Card className="bg-[#E5EBF0] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-6 h-6 text-[#3A6EA5]" />
                    <CardTitle className="text-2xl text-[#1a1a1a]">
                      {t('viewUserProfile.education')}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-2xl">
                      <p className="text-sm text-[#6B7280] mb-1">
                        {t('viewUserProfile.lifestyle_fields.educationLevel', 'Education Level')}
                      </p>
                      <p className="font-semibold text-[#1a1a1a]">
                        {profile.educationLevel ? (profile.educationLevelDisplayName || profile.educationLevel) : 'Unspecified'}
                      </p>
                    </div>
                    <div className="p-4 bg-white rounded-2xl">
                      <p className="text-sm text-[#6B7280] mb-1">
                        {t('viewUserProfile.lifestyle_fields.fieldOfStudy', 'Field of Study')}
                      </p>
                      <p className="font-semibold text-[#1a1a1a]">
                        {profile.fieldOfStudy ? (profile.fieldOfStudyDisplayName || profile.fieldOfStudy) : 'Unspecified'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Report Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="bg-white rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#1a1a1a]">
              {t('viewUserProfile.report.title', 'Report User')}
            </DialogTitle>
            <DialogDescription className="text-[#6B7280]">
              {t('viewUserProfile.reportDialogDesc')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label
                htmlFor="report-reason"
                className="text-[#1a1a1a] mb-2 block"
              >
                {t('viewUserProfile.reasonForReporting')}
              </Label>
              <Textarea
                id="report-reason"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder={t('viewUserProfile.report.reasonPlaceholder', 'Describe the issue...')}
                className="bg-[#F2F4F6] rounded-xl border-[#3A6EA5]/20 min-h-[120px]"
              />
              {reportReason.trim().length > 0 && reportReason.trim().length < 5 && (
                <p className="text-xs text-red-500 mt-2">
                  {t('viewUserProfile.report.minChars', 'Please enter at least 5 characters.')} ({reportReason.trim().length}/5)
                </p>
              )}
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
              {t('viewUserProfile.report.cancel', 'Cancel')}
            </Button>
            <Button
              onClick={handleReport}
              disabled={reportReason.trim().length < 5 || submitReport.isPending}
              className="bg-red-500 hover:bg-red-600 text-white rounded-xl"
            >
              {submitReport.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {t('viewUserProfile.report.submit', 'Submit Report')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
