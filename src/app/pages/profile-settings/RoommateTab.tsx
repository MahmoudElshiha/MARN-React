import { useState } from 'react'
import { motion } from 'motion/react'
import {
  Users,
  Bell,
  Briefcase,
  Volume2,
  Coffee,
  GraduationCap,
  UserPlus,
  Shield,
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Switch } from '../../components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import { Slider } from '../../components/ui/slider'
import { ToggleGroup, ToggleGroupItem } from '../../components/ui/toggle-group'
import { Separator } from '../../components/ui/separator'
import { toast } from 'sonner'
import { FIELD_OF_STUDY_OPTIONS } from '@/constants/options'

const BIO_MAX_LENGTH = 300

export function RoommateTab() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [roommateSettings, setRoommateSettings] = useState({
    smoking: false,
    pets: false,
    petType: '',
    sleepSchedule: '',
    educationLevel: '',
    fieldOfStudy: '',
    noiseTolerance: [50],
    guestsFrequency: '',
    workSchedule: '',
    sharingLevel: '',
    bio: '',
    profileVisible: false,
  })

  const update = (patch: Partial<typeof roommateSettings>) => {
    setRoommateSettings((prev) => ({ ...prev, ...patch }))
    setHasUnsavedChanges(true)
  }

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
        {/* Lifestyle & Preferences */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Coffee className="w-5 h-5 text-[#3A6EA5]" />
            <h3 className="text-lg font-semibold text-[#1a1a1a]">Lifestyle & Preferences</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label className="text-[#1a1a1a] mb-3 block">Smoking</Label>
              <div className="flex items-center justify-between p-6 bg-white rounded-2xl">
                <span className="text-[#1a1a1a]">{roommateSettings.smoking ? 'Yes' : 'No'}</span>
                <Switch
                  checked={roommateSettings.smoking}
                  onCheckedChange={(checked) => update({ smoking: checked })}
                  className="data-[state=checked]:bg-[#3A6EA5]"
                />
              </div>
            </div>

            <div>
              <Label className="text-[#1a1a1a] mb-3 block">Pets</Label>
              <div className="flex items-center justify-between p-6 bg-white rounded-2xl">
                <span className="text-[#1a1a1a]">{roommateSettings.pets ? 'Yes' : 'No'}</span>
                <Switch
                  checked={roommateSettings.pets}
                  onCheckedChange={(checked) => update({ pets: checked })}
                  className="data-[state=checked]:bg-[#3A6EA5]"
                />
              </div>
            </div>

            {roommateSettings.pets && (
              <div>
                <Label htmlFor="pet-type" className="text-[#1a1a1a] mb-2 block">Type of Pet</Label>
                <Input
                  id="pet-type"
                  value={roommateSettings.petType}
                  onChange={(e) => update({ petType: e.target.value })}
                  placeholder="e.g., Dog, Cat, Bird"
                  className="bg-white rounded-xl border-[#3A6EA5]/20"
                />
              </div>
            )}

            <div>
              <Label htmlFor="sleep-schedule" className="text-[#1a1a1a] mb-2 block">
                Sleep Schedule
              </Label>
              <Select
                value={roommateSettings.sleepSchedule}
                onValueChange={(value) => update({ sleepSchedule: value })}
              >
                <SelectTrigger id="sleep-schedule" className="bg-white rounded-xl border-[#3A6EA5]/20">
                  <SelectValue placeholder="Select sleep schedule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="early-sleeper">Early sleeper</SelectItem>
                  <SelectItem value="night-owl">Night owl</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator className="bg-[#3A6EA5]/20" />

        {/* Education */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <GraduationCap className="w-5 h-5 text-[#3A6EA5]" />
            <h3 className="text-lg font-semibold text-[#1a1a1a]">Education</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="education-level" className="text-[#1a1a1a] mb-2 block">
                Education Level
              </Label>
              <Select
                value={roommateSettings.educationLevel}
                onValueChange={(value) => update({ educationLevel: value })}
              >
                <SelectTrigger id="education-level" className="bg-white rounded-xl border-[#3A6EA5]/20">
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high-school">High School</SelectItem>
                  <SelectItem value="bachelor">Bachelor's</SelectItem>
                  <SelectItem value="master">Master's</SelectItem>
                  <SelectItem value="phd">PhD</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="field-of-study" className="text-[#1a1a1a] mb-2 block">
                Field of Study{' '}
                <span className="text-[#4a5565] text-sm font-normal">(Optional)</span>
              </Label>
              <Select
                value={roommateSettings.fieldOfStudy}
                onValueChange={(value) => update({ fieldOfStudy: value })}
              >
                <SelectTrigger id="field-of-study" className="bg-white rounded-xl border-[#3A6EA5]/20">
                  <SelectValue placeholder="Select field of study" />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_OF_STUDY_OPTIONS.map((field) => (
                    <SelectItem key={field} value={field}>
                      {field}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator className="bg-[#3A6EA5]/20" />

        {/* Social & Work */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Briefcase className="w-5 h-5 text-[#3A6EA5]" />
            <h3 className="text-lg font-semibold text-[#1a1a1a]">Social & Work</h3>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-[#1a1a1a]">Noise Tolerance</Label>
                <div className="flex items-center gap-2 text-sm text-[#4a5565]">
                  <Volume2 className="w-4 h-4" />
                  <span>
                    {roommateSettings.noiseTolerance[0] <= 33 && 'Low'}
                    {roommateSettings.noiseTolerance[0] > 33 &&
                      roommateSettings.noiseTolerance[0] <= 66 &&
                      'Medium'}
                    {roommateSettings.noiseTolerance[0] > 66 && 'High'}
                  </span>
                </div>
              </div>
              <Slider
                value={roommateSettings.noiseTolerance}
                onValueChange={(value) => update({ noiseTolerance: value })}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-xs text-[#4a5565]">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="guests-frequency" className="text-[#1a1a1a] mb-2 block">
                  Guests Frequency
                </Label>
                <Select
                  value={roommateSettings.guestsFrequency}
                  onValueChange={(value) => update({ guestsFrequency: value })}
                >
                  <SelectTrigger
                    id="guests-frequency"
                    className="bg-white rounded-xl border-[#3A6EA5]/20"
                  >
                    <SelectValue placeholder="How often do you have guests?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rarely">Rarely</SelectItem>
                    <SelectItem value="occasionally">Occasionally</SelectItem>
                    <SelectItem value="frequently">Frequently</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="work-schedule" className="text-[#1a1a1a] mb-2 block">
                  Work Schedule
                </Label>
                <Select
                  value={roommateSettings.workSchedule}
                  onValueChange={(value) => update({ workSchedule: value })}
                >
                  <SelectTrigger
                    id="work-schedule"
                    className="bg-white rounded-xl border-[#3A6EA5]/20"
                  >
                    <SelectValue placeholder="Select work schedule" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="on-site">On-site</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="shift-based">Shift-based</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-[#1a1a1a] mb-3 block">Sharing Level</Label>
              <ToggleGroup
                type="single"
                value={roommateSettings.sharingLevel}
                onValueChange={(value) => {
                  if (value) update({ sharingLevel: value })
                }}
                className="grid grid-cols-3 gap-3"
              >
                <ToggleGroupItem
                  value="privacy"
                  className="rounded-xl bg-white border border-[#3A6EA5]/20 data-[state=on]:bg-gradient-to-r data-[state=on]:from-[#3A6EA5] data-[state=on]:to-[#9CBBDC] data-[state=on]:text-white data-[state=on]:border-transparent"
                >
                  Prefer Privacy
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="okay-sharing"
                  className="rounded-xl bg-white border border-[#3A6EA5]/20 data-[state=on]:bg-gradient-to-r data-[state=on]:from-[#3A6EA5] data-[state=on]:to-[#9CBBDC] data-[state=on]:text-white data-[state=on]:border-transparent"
                >
                  Okay with Sharing
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="very-social"
                  className="rounded-xl bg-white border border-[#3A6EA5]/20 data-[state=on]:bg-gradient-to-r data-[state=on]:from-[#3A6EA5] data-[state=on]:to-[#9CBBDC] data-[state=on]:text-white data-[state=on]:border-transparent"
                >
                  Very Social
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </div>

        <Separator className="bg-[#3A6EA5]/20" />

        {/* About You */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <UserPlus className="w-5 h-5 text-[#3A6EA5]" />
            <h3 className="text-lg font-semibold text-[#1a1a1a]">About You</h3>
          </div>
          <div>
            <Label htmlFor="roommate-bio" className="text-[#1a1a1a] mb-2 block">Bio</Label>
            <Textarea
              id="roommate-bio"
              value={roommateSettings.bio}
              onChange={(e) => {
                if (e.target.value.length <= BIO_MAX_LENGTH) {
                  update({ bio: e.target.value })
                }
              }}
              className="bg-white rounded-xl border-[#3A6EA5]/20 min-h-[120px]"
              placeholder="Tell potential roommates about yourself, habits, and expectations."
              maxLength={BIO_MAX_LENGTH}
            />
            <div className="flex justify-end mt-2">
              <span
                className={`text-sm ${
                  roommateSettings.bio.length >= BIO_MAX_LENGTH
                    ? 'text-[#3A6EA5] font-semibold'
                    : 'text-[#4a5565]'
                }`}
              >
                {roommateSettings.bio.length}/{BIO_MAX_LENGTH}
              </span>
            </div>
          </div>
        </div>

        <Separator className="bg-[#3A6EA5]/20" />

        {/* Visibility Settings */}
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
                  {roommateSettings.profileVisible
                    ? 'Visible to users browsing for roommates.'
                    : 'Only you can see this information.'}
                </p>
              </div>
              <Switch
                checked={roommateSettings.profileVisible}
                onCheckedChange={(checked) => update({ profileVisible: checked })}
                className="data-[state=checked]:bg-[#3A6EA5]"
              />
            </div>
            {!roommateSettings.profileVisible && (
              <div className="mt-4 p-4 bg-[#F2F4F6] rounded-xl flex items-start gap-3">
                <Shield className="w-5 h-5 text-[#3A6EA5] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#1a1a1a]">
                  Your roommate preferences are stored but hidden from other users. Enable
                  visibility to help potential roommates find you.
                </p>
              </div>
            )}
          </div>
        </div>

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

        <div className="flex gap-4 justify-end pt-4">
          <Button
            variant="outline"
            className="rounded-xl border-[#3A6EA5]/20"
            onClick={() => setHasUnsavedChanges(false)}
          >
            Cancel
          </Button>
          <Button
            className="bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-xl"
            onClick={() => {
              setHasUnsavedChanges(false)
              toast.success('Preferences saved successfully!')
            }}
          >
            Save Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
