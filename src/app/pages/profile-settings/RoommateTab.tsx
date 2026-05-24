import { useState, useEffect, startTransition } from 'react'
import { motion } from 'motion/react'
import {
  Users,
  Bell,
  Briefcase,
  Volume2,
  Coffee,
  GraduationCap,
  MapPin,
  Shield,
  Wallet,
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { EnumSelect } from '../../components/EnumSelect'
import { Switch } from '../../components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Skeleton } from '../../components/ui/skeleton'
import { Slider } from '../../components/ui/slider'
import { Separator } from '../../components/ui/separator'
import { toast } from 'sonner'
import { useProfile } from '@/hooks/useProfile'
import { HttpError } from '@/services/httpErrors'

// ─── Importance Rating ─────────────────────────────────────────────────────────
function ImportanceRating({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center gap-1 mt-2.5">
      <span className="text-xs text-[#4a5565] shrink-0 mr-1">Importance:</span>
      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`w-6 h-6 rounded-full text-xs font-medium transition-colors focus:outline-none ${
            n <= value
              ? 'bg-[#3A6EA5] text-white'
              : 'bg-white border border-[#3A6EA5]/20 text-[#4a5565] hover:bg-[#3A6EA5]/10'
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  )
}

// ─── Default state ─────────────────────────────────────────────────────────────
const DEFAULT_SETTINGS = {
  governorate: '',
  searchStatus: '',
  smoking: false,
  smokingImportance: 5,
  pets: false,
  petsImportance: 5,
  petType: '',
  sleepSchedule: '',
  sleepImportance: 5,
  educationLevel: '',
  educationImportance: 5,
  fieldOfStudy: '',
  fieldOfStudyImportance: 5,
  noiseTolerance: [5] as number[],
  noiseToleranceImportance: 5,
  guestsFrequency: '',
  guestsFrequencyImportance: 5,
  workSchedule: '',
  workScheduleImportance: 5,
  sharingLevel: '',
  sharingLevelImportance: 5,
  budgetRangeMin: '',
  budgetRangeMax: '',
  budgetImportance: 5,
  profileVisible: false,
}

type RoommateSettings = typeof DEFAULT_SETTINGS

// ─── Component ────────────────────────────────────────────────────────────────
export function RoommateTab() {
  const { data: profileResponse, isLoading, updateRoommate } = useProfile()
  const apiProfile = profileResponse?.data

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [settings, setSettings] = useState<RoommateSettings>(DEFAULT_SETTINGS)

  // Populate from API
  useEffect(() => {
    if (apiProfile) {
      startTransition(() => {
        setSettings({
          ...DEFAULT_SETTINGS,
          smoking: apiProfile.smoking ?? false,
          pets: apiProfile.pets ?? false,
          sleepSchedule: apiProfile.sleepSchedule ?? '',
          educationLevel: apiProfile.educationLevel ?? '',
          fieldOfStudy: apiProfile.fieldOfStudy ?? '',
          noiseTolerance: [apiProfile.noiseTolerance ?? 5],
          guestsFrequency: apiProfile.guestsFrequency ?? '',
          workSchedule: apiProfile.workSchedule ?? '',
          sharingLevel: apiProfile.sharingLevel ?? '',
          budgetRangeMin: apiProfile.budgetRangeMin?.toString() ?? '',
          budgetRangeMax: apiProfile.budgetRangeMax?.toString() ?? '',
          profileVisible: apiProfile.roommatePreferencesEnabled ?? false,
        })
      })
    }
  }, [apiProfile])

  const patch = (p: Partial<RoommateSettings>) => {
    setSettings((prev) => ({ ...prev, ...p }))
    setHasUnsavedChanges(true)
  }

  const handleCancel = () => {
    if (apiProfile) {
      startTransition(() => {
        setSettings({
          ...DEFAULT_SETTINGS,
          smoking: apiProfile.smoking ?? false,
          pets: apiProfile.pets ?? false,
          sleepSchedule: apiProfile.sleepSchedule ?? '',
          educationLevel: apiProfile.educationLevel ?? '',
          fieldOfStudy: apiProfile.fieldOfStudy ?? '',
          noiseTolerance: [apiProfile.noiseTolerance ?? 5],
          guestsFrequency: apiProfile.guestsFrequency ?? '',
          workSchedule: apiProfile.workSchedule ?? '',
          sharingLevel: apiProfile.sharingLevel ?? '',
          budgetRangeMin: apiProfile.budgetRangeMin?.toString() ?? '',
          budgetRangeMax: apiProfile.budgetRangeMax?.toString() ?? '',
          profileVisible: apiProfile.roommatePreferencesEnabled ?? false,
        })
      })
    }
    setHasUnsavedChanges(false)
  }

  const handleSave = () => {
    if (!apiProfile) return
    updateRoommate.mutate(
      {
        userId: apiProfile.id,
        roommatePreferencesEnabled: settings.profileVisible,
        governorate: settings.governorate || null,
        searchStatus: settings.searchStatus || null,
        smoking: settings.smoking,
        smokingImportance: settings.smokingImportance,
        pets: settings.pets,
        petsImportance: settings.petsImportance,
        sleepSchedule: settings.sleepSchedule || null,
        sleepImportance: settings.sleepImportance,
        educationLevel: settings.educationLevel || null,
        educationImportance: settings.educationImportance,
        fieldOfStudy: settings.fieldOfStudy || null,
        fieldOfStudyImportance: settings.fieldOfStudyImportance,
        noiseTolerance: settings.noiseTolerance[0],
        noiseToleranceImportance: settings.noiseToleranceImportance,
        guestsFrequency: settings.guestsFrequency || null,
        guestsFrequencyImportance: settings.guestsFrequencyImportance,
        workSchedule: settings.workSchedule || null,
        workScheduleImportance: settings.workScheduleImportance,
        sharingLevel: settings.sharingLevel || null,
        sharingLevelImportance: settings.sharingLevelImportance,
        budgetRangeMin: settings.budgetRangeMin ? Number(settings.budgetRangeMin) : null,
        budgetRangeMax: settings.budgetRangeMax ? Number(settings.budgetRangeMax) : null,
        budgetImportance: settings.budgetImportance,
      },
      {
        onSuccess: () => {
          setHasUnsavedChanges(false)
          toast.success('Preferences saved successfully!')
        },
        onError: (err) => {
          if (err instanceof HttpError) {
            toast.error(err.message ?? 'Failed to save preferences.')
          } else {
            toast.error('Failed to save preferences.')
          }
        },
      },
    )
  }

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <Card className="bg-[#F2F4F6] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10">
        <CardContent className="pt-8 space-y-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-5 w-36" />
              <div className="grid md:grid-cols-2 gap-4">
                <Skeleton className="h-14 rounded-2xl" />
                <Skeleton className="h-14 rounded-2xl" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <Card className="bg-[#F2F4F6] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-[#3A6EA5]" />
          <div>
            <CardTitle className="text-2xl text-[#1a1a1a]">
              Roommate Preferences & Lifestyle
            </CardTitle>
            <p className="text-sm text-[#4a5565] mt-1">
              Help potential roommates understand your lifestyle and compatibility.
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* ── Location & Search ───────────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-5 h-5 text-[#3A6EA5]" />
            <h3 className="text-lg font-semibold text-[#1a1a1a]">Location & Search</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <EnumSelect
                id="governorate"
                label="Governorate"
                endpoint="governorates"
                value={settings.governorate}
                onChange={(v) => patch({ governorate: v })}
              />
            </div>

            <div>
              <EnumSelect
                id="search-status"
                label="Search Status"
                endpoint="roommate-search-statuses"
                value={settings.searchStatus}
                onChange={(v) => patch({ searchStatus: v })}
                placeholder="Are you actively searching?"
              />
            </div>
          </div>
        </div>

        <Separator className="bg-[#3A6EA5]/20" />

        {/* ── Lifestyle & Preferences ──────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Coffee className="w-5 h-5 text-[#3A6EA5]" />
            <h3 className="text-lg font-semibold text-[#1a1a1a]">Lifestyle & Preferences</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Smoking */}
            <div>
              <Label className="text-[#1a1a1a] mb-3 block">Smoking</Label>
              <div className="flex items-center justify-between p-4 bg-white rounded-2xl">
                <span className="text-[#1a1a1a]">{settings.smoking ? 'Yes' : 'No'}</span>
                <Switch
                  checked={settings.smoking}
                  onCheckedChange={(v) => patch({ smoking: v })}
                  className="data-[state=checked]:bg-[#3A6EA5]"
                />
              </div>
              <ImportanceRating
                value={settings.smokingImportance}
                onChange={(v) => patch({ smokingImportance: v })}
              />
            </div>

            {/* Pets */}
            <div>
              <Label className="text-[#1a1a1a] mb-3 block">Pets</Label>
              <div className="flex items-center justify-between p-4 bg-white rounded-2xl">
                <span className="text-[#1a1a1a]">{settings.pets ? 'Yes' : 'No'}</span>
                <Switch
                  checked={settings.pets}
                  onCheckedChange={(v) => patch({ pets: v })}
                  className="data-[state=checked]:bg-[#3A6EA5]"
                />
              </div>
              <ImportanceRating
                value={settings.petsImportance}
                onChange={(v) => patch({ petsImportance: v })}
              />
            </div>

            {/* Pet type — conditional */}
            {settings.pets && (
              <div>
                <Label htmlFor="pet-type" className="text-[#1a1a1a] mb-2 block">
                  Type of Pet
                </Label>
                <Input
                  id="pet-type"
                  value={settings.petType}
                  onChange={(e) => patch({ petType: e.target.value })}
                  placeholder="e.g., Dog, Cat, Bird"
                  className="bg-white rounded-xl border-[#3A6EA5]/20"
                />
              </div>
            )}

            {/* Sleep Schedule */}
            <div>
              <EnumSelect
                id="sleep-schedule"
                label="Sleep Schedule"
                endpoint="sleep-schedules"
                value={settings.sleepSchedule}
                onChange={(v) => patch({ sleepSchedule: v })}
              />
              <ImportanceRating
                value={settings.sleepImportance}
                onChange={(v) => patch({ sleepImportance: v })}
              />
            </div>
          </div>
        </div>

        <Separator className="bg-[#3A6EA5]/20" />

        {/* ── Education ────────────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <GraduationCap className="w-5 h-5 text-[#3A6EA5]" />
            <h3 className="text-lg font-semibold text-[#1a1a1a]">Education</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <EnumSelect
                id="education-level"
                label="Education Level"
                endpoint="education-levels"
                value={settings.educationLevel}
                onChange={(v) => patch({ educationLevel: v })}
              />
              <ImportanceRating
                value={settings.educationImportance}
                onChange={(v) => patch({ educationImportance: v })}
              />
            </div>

            <div>
              <EnumSelect
                id="field-of-study"
                label="Field of Study (Optional)"
                endpoint="fields-of-study"
                value={settings.fieldOfStudy}
                onChange={(v) => patch({ fieldOfStudy: v })}
              />
              <ImportanceRating
                value={settings.fieldOfStudyImportance}
                onChange={(v) => patch({ fieldOfStudyImportance: v })}
              />
            </div>
          </div>
        </div>

        <Separator className="bg-[#3A6EA5]/20" />

        {/* ── Social & Work ────────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Briefcase className="w-5 h-5 text-[#3A6EA5]" />
            <h3 className="text-lg font-semibold text-[#1a1a1a]">Social & Work</h3>
          </div>
          <div className="space-y-6">
            {/* Noise Tolerance */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-[#1a1a1a]">Noise Tolerance</Label>
                <div className="flex items-center gap-2 text-sm text-[#4a5565]">
                  <Volume2 className="w-4 h-4" />
                  <span>
                    {settings.noiseTolerance[0] <= 3 && 'Low'}
                    {settings.noiseTolerance[0] > 3 && settings.noiseTolerance[0] <= 7 && 'Medium'}
                    {settings.noiseTolerance[0] > 7 && 'High'}
                    {' '}({settings.noiseTolerance[0]}/10)
                  </span>
                </div>
              </div>
              <Slider
                value={settings.noiseTolerance}
                onValueChange={(v) => patch({ noiseTolerance: v })}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-xs text-[#4a5565]">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
              <ImportanceRating
                value={settings.noiseToleranceImportance}
                onChange={(v) => patch({ noiseToleranceImportance: v })}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Guests Frequency */}
              <div>
                <EnumSelect
                  id="guests-frequency"
                  label="Guests Frequency"
                  endpoint="guests-frequencies"
                  value={settings.guestsFrequency}
                  onChange={(v) => patch({ guestsFrequency: v })}
                  placeholder="How often do you have guests?"
                />
                <ImportanceRating
                  value={settings.guestsFrequencyImportance}
                  onChange={(v) => patch({ guestsFrequencyImportance: v })}
                />
              </div>

              {/* Work Schedule */}
              <div>
                <EnumSelect
                  id="work-schedule"
                  label="Work Schedule"
                  endpoint="work-schedules"
                  value={settings.workSchedule}
                  onChange={(v) => patch({ workSchedule: v })}
                />
                <ImportanceRating
                  value={settings.workScheduleImportance}
                  onChange={(v) => patch({ workScheduleImportance: v })}
                />
              </div>
            </div>

            {/* Sharing Level */}
            <div>
              <EnumSelect
                id="sharing-level"
                label="Sharing Level"
                endpoint="sharing-levels"
                value={settings.sharingLevel}
                onChange={(v) => patch({ sharingLevel: v })}
              />
              <ImportanceRating
                value={settings.sharingLevelImportance}
                onChange={(v) => patch({ sharingLevelImportance: v })}
              />
            </div>
          </div>
        </div>

        <Separator className="bg-[#3A6EA5]/20" />

        {/* ── Budget Range ─────────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Wallet className="w-5 h-5 text-[#3A6EA5]" />
            <h3 className="text-lg font-semibold text-[#1a1a1a]">Budget Range</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="budget-min" className="text-[#1a1a1a] mb-2 block">
                Minimum{' '}
                <span className="text-[#4a5565] text-sm font-normal">(per month)</span>
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a5565] text-sm font-medium">
                  $
                </span>
                <Input
                  id="budget-min"
                  type="number"
                  min={0}
                  value={settings.budgetRangeMin}
                  onChange={(e) => patch({ budgetRangeMin: e.target.value })}
                  placeholder="500"
                  className="pl-8 bg-white rounded-xl border-[#3A6EA5]/20"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="budget-max" className="text-[#1a1a1a] mb-2 block">
                Maximum{' '}
                <span className="text-[#4a5565] text-sm font-normal">(per month)</span>
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a5565] text-sm font-medium">
                  $
                </span>
                <Input
                  id="budget-max"
                  type="number"
                  min={0}
                  value={settings.budgetRangeMax}
                  onChange={(e) => patch({ budgetRangeMax: e.target.value })}
                  placeholder="1500"
                  className="pl-8 bg-white rounded-xl border-[#3A6EA5]/20"
                />
              </div>
            </div>
          </div>
          <ImportanceRating
            value={settings.budgetImportance}
            onChange={(v) => patch({ budgetImportance: v })}
          />
        </div>

        <Separator className="bg-[#3A6EA5]/20" />

        {/* ── Visibility ───────────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-[#3A6EA5]" />
            <h3 className="text-lg font-semibold text-[#1a1a1a]">Visibility Settings</h3>
          </div>
          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-[#1a1a1a] mb-1">
                  Profile Visibility for Roommates
                </p>
                <p className="text-sm text-[#4a5565]">
                  {settings.profileVisible
                    ? 'Visible to users browsing for roommates.'
                    : 'Only you can see this information.'}
                </p>
              </div>
              <Switch
                checked={settings.profileVisible}
                onCheckedChange={(v) => patch({ profileVisible: v })}
                className="data-[state=checked]:bg-[#3A6EA5]"
              />
            </div>
            {!settings.profileVisible && (
              <div className="mt-4 p-4 bg-[#F2F4F6] rounded-xl flex items-start gap-3">
                <Shield className="w-5 h-5 text-[#3A6EA5] mt-0.5 shrink-0" />
                <p className="text-sm text-[#1a1a1a]">
                  Your roommate preferences are stored but hidden from other users. Enable
                  visibility to help potential roommates find you.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Unsaved banner ────────────────────────────────────────────────── */}
        {hasUnsavedChanges && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#F2F4F6] border border-[#3A6EA5]/30 rounded-xl p-4 flex items-center gap-3"
          >
            <Bell className="w-5 h-5 text-[#3A6EA5]" />
            <p className="text-sm text-[#1a1a1a]">
              You have unsaved changes. Don't forget to save your preferences!
            </p>
          </motion.div>
        )}

        {/* ── Actions ──────────────────────────────────────────────────────── */}
        <div className="flex gap-4 justify-end pt-4">
          <Button
            variant="outline"
            className="rounded-xl border-[#3A6EA5]/20"
            onClick={handleCancel}
            disabled={updateRoommate.isPending}
          >
            Cancel
          </Button>
          <Button
            disabled={updateRoommate.isPending}
            className="bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-xl"
            onClick={handleSave}
          >
            {updateRoommate.isPending ? 'Saving…' : 'Save Preferences'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
