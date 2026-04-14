import { motion } from 'motion/react'
import {
  User,
  Mail,
  Phone,
  Lock,
  Bell,
  Shield,
  Camera,
  Users,
  Briefcase,
  Volume2,
  Coffee,
  GraduationCap,
  UserPlus,
  Upload,
  IdCard,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Switch } from '../components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import { Slider } from '../components/ui/slider'
import { ToggleGroup, ToggleGroupItem } from '../components/ui/toggle-group'
import { Separator } from '../components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog'
import { useState } from 'react'
import { toast } from 'sonner'

export function ProfileSettingsPage() {
  const [profileData, setProfileData] = useState({
    firstName: 'Ahmed',
    lastName: 'Hassan',
    email: 'ahmed@example.com',
    phone: '+20 10 1234 5678',
    country: 'Egypt',
    dateOfBirth: '1995-05-15',
    bio: 'Looking for a quiet, clean roommate who respects personal space.',
  })

  const [identityVerification, setIdentityVerification] = useState({
    frontIdCard: null as File | null,
    backIdCard: null as File | null,
    nameArabic: '',
    addressArabic: '',
    nationalIdNumber: '',
  })

  const [show2FAModal, setShow2FAModal] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')

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

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const bioMaxLength = 300

  const countries = [
    'United States',
    'Canada',
    'United Kingdom',
    'Australia',
    'Germany',
    'France',
    'Spain',
    'Italy',
    'Netherlands',
    'Belgium',
    'Sweden',
    'Norway',
    'Denmark',
    'Finland',
    'Switzerland',
    'Austria',
    'Ireland',
    'New Zealand',
    'Japan',
    'Singapore',
    'United Arab Emirates',
    'Saudi Arabia',
    'Qatar',
    'Kuwait',
    'Bahrain',
    'Oman',
  ]

  const fieldOfStudyOptions = [
    'Computer Science',
    'Engineering',
    'Business Administration',
    'Medicine',
    'Law',
    'Arts & Humanities',
    'Natural Sciences',
    'Social Sciences',
    'Education',
    'Architecture',
    'Other',
  ]

  const handle2FAToggle = () => {
    if (!twoFactorEnabled) {
      setShow2FAModal(true)
    } else {
      setTwoFactorEnabled(false)
      toast.success('Two-factor authentication disabled')
    }
  }

  const handleVerify2FA = () => {
    if (verificationCode.length === 6) {
      setTwoFactorEnabled(true)
      setShow2FAModal(false)
      setVerificationCode('')
      toast.success('Two-factor authentication enabled successfully!')
    } else {
      toast.error('Please enter a valid 6-digit code')
    }
  }

  const handleFileUpload = (
    field: 'frontIdCard' | 'backIdCard',
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      setIdentityVerification({ ...identityVerification, [field]: file })
      toast.success(
        `${field === 'frontIdCard' ? 'Front' : 'Back'} side of ID uploaded`,
      )
    }
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-[1440px] mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-[#1a1a1a] mb-2">
            Account Settings
          </h1>
          <p className="text-lg text-[#4a5565] mb-8">
            Manage your account settings and preferences
          </p>

          <Tabs defaultValue="profile" className="space-y-8">
            <TabsList className="bg-[#F2F4F6] p-2 rounded-2xl">
              <TabsTrigger
                value="profile"
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-[#3A6EA5]"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-[#3A6EA5]"
              >
                Security
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-[#3A6EA5]"
              >
                Documents
              </TabsTrigger>
              <TabsTrigger
                value="roommate"
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-[#3A6EA5]"
              >
                Roommate Settings
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Profile Photo */}
                <Card className="bg-[#F2F4F6] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10 lg:col-span-1">
                  <CardContent className="pt-6 text-center">
                    <div className="relative w-40 h-40 mx-auto mb-6">
                      <img
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover shadow-lg"
                      />
                      <button className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-gradient-to-br from-[#3A6EA5] to-[#9CBBDC] flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                        <Camera className="w-5 h-5 text-white" />
                      </button>
                    </div>
                    <h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">
                      {profileData.firstName} {profileData.lastName}
                    </h3>
                    <p className="text-[#4a5565] mb-6">{profileData.email}</p>
                    <Button
                      variant="outline"
                      className="w-full rounded-xl border-[#3A6EA5]/20 hover:bg-white"
                    >
                      Upload New Photo
                    </Button>
                  </CardContent>
                </Card>

                {/* Profile Information */}
                <Card className="bg-[#F2F4F6] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10 lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-2xl text-[#1a1a1a]">
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* First Name */}
                      <div>
                        <Label
                          htmlFor="firstName"
                          className="text-[#1a1a1a] mb-2 block"
                        >
                          First Name
                        </Label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4a5565]" />
                          <Input
                            id="firstName"
                            value={profileData.firstName}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                firstName: e.target.value,
                              })
                            }
                            className="pl-12 bg-white rounded-xl border-[#3A6EA5]/20"
                          />
                        </div>
                      </div>

                      {/* Last Name */}
                      <div>
                        <Label
                          htmlFor="lastName"
                          className="text-[#1a1a1a] mb-2 block"
                        >
                          Last Name
                        </Label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4a5565]" />
                          <Input
                            id="lastName"
                            value={profileData.lastName}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                lastName: e.target.value,
                              })
                            }
                            className="pl-12 bg-white rounded-xl border-[#3A6EA5]/20"
                          />
                        </div>
                      </div>

                      {/* Email (Non-editable) */}
                      <div>
                        <Label
                          htmlFor="email"
                          className="text-[#1a1a1a] mb-2 block"
                        >
                          Email Address
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4a5565]" />
                          <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            disabled
                            className="pl-12 bg-[#9CBBDC]/20 rounded-xl border-[#3A6EA5]/20 cursor-not-allowed"
                          />
                        </div>
                        <p className="text-xs text-[#4a5565] mt-1">
                          Email cannot be changed
                        </p>
                      </div>

                      {/* Phone */}
                      <div>
                        <Label
                          htmlFor="phone"
                          className="text-[#1a1a1a] mb-2 block"
                        >
                          Phone Number
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4a5565]" />
                          <Input
                            id="phone"
                            value={profileData.phone}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                phone: e.target.value,
                              })
                            }
                            className="pl-12 bg-white rounded-xl border-[#3A6EA5]/20"
                          />
                        </div>
                      </div>

                      {/* Date of Birth */}
                      <div>
                        <Label
                          htmlFor="dateOfBirth"
                          className="text-[#1a1a1a] mb-2 block"
                        >
                          Date of Birth
                        </Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={profileData.dateOfBirth}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              dateOfBirth: e.target.value,
                            })
                          }
                          className="bg-white rounded-xl border-[#3A6EA5]/20"
                        />
                      </div>

                      {/* Country Dropdown */}
                      <div>
                        <Label
                          htmlFor="country"
                          className="text-[#1a1a1a] mb-2 block"
                        >
                          Country
                        </Label>
                        <Select
                          value={profileData.country}
                          onValueChange={(value) =>
                            setProfileData({ ...profileData, country: value })
                          }
                        >
                          <SelectTrigger
                            id="country"
                            className="bg-white rounded-xl border-[#3A6EA5]/20"
                          >
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px]">
                            {countries.map((country) => (
                              <SelectItem key={country} value={country}>
                                {country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="bio"
                        className="text-[#1a1a1a] mb-2 block"
                      >
                        Bio
                      </Label>
                      <Textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            bio: e.target.value,
                          })
                        }
                        className="bg-white rounded-xl border-[#3A6EA5]/20 min-h-[120px]"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div className="flex gap-4 justify-end">
                      <Button
                        variant="outline"
                        className="rounded-xl border-[#3A6EA5]/20"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() =>
                          toast.success('Profile updated successfully!')
                        }
                        className="bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-xl"
                      >
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card className="bg-[#F2F4F6] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-[#3A6EA5]" />
                    <CardTitle className="text-2xl text-[#1a1a1a]">
                      Security Settings
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Change Password */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#1a1a1a] mb-4">
                      Change Password
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label
                          htmlFor="current-password"
                          className="text-[#1a1a1a] mb-2 block"
                        >
                          Current Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4a5565]" />
                          <Input
                            id="current-password"
                            type="password"
                            className="pl-12 bg-white rounded-xl border-[#3A6EA5]/20"
                          />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="new-password"
                            className="text-[#1a1a1a] mb-2 block"
                          >
                            New Password
                          </Label>
                          <Input
                            id="new-password"
                            type="password"
                            className="bg-white rounded-xl border-[#3A6EA5]/20"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="confirm-password"
                            className="text-[#1a1a1a] mb-2 block"
                          >
                            Confirm Password
                          </Label>
                          <Input
                            id="confirm-password"
                            type="password"
                            className="bg-white rounded-xl border-[#3A6EA5]/20"
                          />
                        </div>
                      </div>
                      <Button
                        onClick={() =>
                          toast.success('Password updated successfully!')
                        }
                        className="bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-xl"
                      >
                        Update Password
                      </Button>
                    </div>
                  </div>

                  <div className="border-t border-[#3A6EA5]/20 pt-8">
                    <h3 className="text-lg font-semibold text-[#1a1a1a] mb-4">
                      Two-Factor Authentication
                    </h3>
                    <div className="flex items-center justify-between p-6 bg-white rounded-2xl">
                      <div>
                        <p className="font-medium text-[#1a1a1a]">Enable 2FA</p>
                        <p className="text-sm text-[#4a5565] mt-1">
                          {twoFactorEnabled
                            ? 'Your account is protected with 2FA'
                            : 'Add an extra layer of security to your account'}
                        </p>
                      </div>
                      <Switch
                        checked={twoFactorEnabled}
                        onCheckedChange={handle2FAToggle}
                        className="data-[state=checked]:bg-[#3A6EA5]"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents Tab (Identity Verification) */}
            <TabsContent value="documents">
              <Card className="bg-[#F2F4F6] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <IdCard className="w-6 h-6 text-[#3A6EA5]" />
                    <div>
                      <CardTitle className="text-2xl text-[#1a1a1a]">
                        Identity Verification
                      </CardTitle>
                      <p className="text-sm text-[#4a5565] mt-1">
                        Upload your identification documents for account
                        verification
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Front ID Card */}
                    <div>
                      <Label className="text-[#1a1a1a] mb-2 block">
                        Front Side of ID Card
                      </Label>
                      <div className="relative">
                        <input
                          type="file"
                          id="frontIdCard"
                          accept="image/*"
                          onChange={(e) => handleFileUpload('frontIdCard', e)}
                          className="hidden"
                        />
                        <label
                          htmlFor="frontIdCard"
                          className="flex flex-col items-center justify-center w-full h-40 bg-white rounded-xl border-2 border-dashed border-[#3A6EA5]/20 hover:border-[#3A6EA5]/40 cursor-pointer transition-colors"
                        >
                          <Upload className="w-8 h-8 text-[#4a5565] mb-2" />
                          <span className="text-sm text-[#4a5565]">
                            {identityVerification.frontIdCard
                              ? identityVerification.frontIdCard.name
                              : 'Click to upload'}
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Back ID Card */}
                    <div>
                      <Label className="text-[#1a1a1a] mb-2 block">
                        Back Side of ID Card
                      </Label>
                      <div className="relative">
                        <input
                          type="file"
                          id="backIdCard"
                          accept="image/*"
                          onChange={(e) => handleFileUpload('backIdCard', e)}
                          className="hidden"
                        />
                        <label
                          htmlFor="backIdCard"
                          className="flex flex-col items-center justify-center w-full h-40 bg-white rounded-xl border-2 border-dashed border-[#3A6EA5]/20 hover:border-[#3A6EA5]/40 cursor-pointer transition-colors"
                        >
                          <Upload className="w-8 h-8 text-[#4a5565] mb-2" />
                          <span className="text-sm text-[#4a5565]">
                            {identityVerification.backIdCard
                              ? identityVerification.backIdCard.name
                              : 'Click to upload'}
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Name in Arabic */}
                    <div>
                      <Label
                        htmlFor="nameArabic"
                        className="text-[#1a1a1a] mb-2 block"
                      >
                        Name in Arabic
                      </Label>
                      <Input
                        id="nameArabic"
                        value={identityVerification.nameArabic}
                        onChange={(e) =>
                          setIdentityVerification({
                            ...identityVerification,
                            nameArabic: e.target.value,
                          })
                        }
                        className="bg-white rounded-xl border-[#3A6EA5]/20"
                        placeholder="أدخل اسمك بالعربية"
                        dir="rtl"
                      />
                    </div>

                    {/* Address in Arabic */}
                    <div>
                      <Label
                        htmlFor="addressArabic"
                        className="text-[#1a1a1a] mb-2 block"
                      >
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

                    {/* National ID Number */}
                    <div className="md:col-span-2">
                      <Label
                        htmlFor="nationalIdNumber"
                        className="text-[#1a1a1a] mb-2 block"
                      >
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
                    <Button
                      variant="outline"
                      className="rounded-xl border-[#3A6EA5]/20"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() =>
                        toast.success('Identity documents submitted for review')
                      }
                      className="bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-xl"
                    >
                      Submit for Verification
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Roommate Settings Tab */}
            <TabsContent value="roommate">
              <Card className="bg-[#F2F4F6] border-none rounded-3xl shadow-lg shadow-[#3A6EA5]/10">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-[#3A6EA5]" />
                    <div>
                      <CardTitle className="text-2xl text-[#1a1a1a]">
                        Roommate Preferences & Lifestyle
                      </CardTitle>
                      <p className="text-sm text-[#4a5565] mt-1">
                        Help potential roommates understand your lifestyle and
                        compatibility.
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Lifestyle & Preferences Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <Coffee className="w-5 h-5 text-[#3A6EA5]" />
                      <h3 className="text-lg font-semibold text-[#1a1a1a]">
                        Lifestyle & Preferences
                      </h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Smoking - Boolean Toggle */}
                      <div>
                        <Label className="text-[#1a1a1a] mb-3 block">
                          Smoking
                        </Label>
                        <div className="flex items-center justify-between p-6 bg-white rounded-2xl">
                          <span className="text-[#1a1a1a]">
                            {roommateSettings.smoking ? 'Yes' : 'No'}
                          </span>
                          <Switch
                            checked={roommateSettings.smoking}
                            onCheckedChange={(checked) => {
                              setRoommateSettings({
                                ...roommateSettings,
                                smoking: checked,
                              })
                              setHasUnsavedChanges(true)
                            }}
                            className="data-[state=checked]:bg-[#3A6EA5]"
                          />
                        </div>
                      </div>

                      {/* Pets - Boolean Toggle */}
                      <div>
                        <Label className="text-[#1a1a1a] mb-3 block">
                          Pets
                        </Label>
                        <div className="flex items-center justify-between p-6 bg-white rounded-2xl">
                          <span className="text-[#1a1a1a]">
                            {roommateSettings.pets ? 'Yes' : 'No'}
                          </span>
                          <Switch
                            checked={roommateSettings.pets}
                            onCheckedChange={(checked) => {
                              setRoommateSettings({
                                ...roommateSettings,
                                pets: checked,
                              })
                              setHasUnsavedChanges(true)
                            }}
                            className="data-[state=checked]:bg-[#3A6EA5]"
                          />
                        </div>
                      </div>

                      {/* Conditional Pet Type */}
                      {roommateSettings.pets && (
                        <div>
                          <Label
                            htmlFor="pet-type"
                            className="text-[#1a1a1a] mb-2 block"
                          >
                            Type of Pet
                          </Label>
                          <Input
                            id="pet-type"
                            value={roommateSettings.petType}
                            onChange={(e) => {
                              setRoommateSettings({
                                ...roommateSettings,
                                petType: e.target.value,
                              })
                              setHasUnsavedChanges(true)
                            }}
                            placeholder="e.g., Dog, Cat, Bird"
                            className="bg-white rounded-xl border-[#3A6EA5]/20"
                          />
                        </div>
                      )}

                      {/* Sleep Schedule */}
                      <div>
                        <Label
                          htmlFor="sleep-schedule"
                          className="text-[#1a1a1a] mb-2 block"
                        >
                          Sleep Schedule
                        </Label>
                        <Select
                          value={roommateSettings.sleepSchedule}
                          onValueChange={(value) => {
                            setRoommateSettings({
                              ...roommateSettings,
                              sleepSchedule: value,
                            })
                            setHasUnsavedChanges(true)
                          }}
                        >
                          <SelectTrigger
                            id="sleep-schedule"
                            className="bg-white rounded-xl border-[#3A6EA5]/20"
                          >
                            <SelectValue placeholder="Select sleep schedule" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="early-sleeper">
                              Early sleeper
                            </SelectItem>
                            <SelectItem value="night-owl">Night owl</SelectItem>
                            <SelectItem value="flexible">Flexible</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-[#3A6EA5]/20" />

                  {/* Education Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <GraduationCap className="w-5 h-5 text-[#3A6EA5]" />
                      <h3 className="text-lg font-semibold text-[#1a1a1a]">
                        Education
                      </h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Education Level */}
                      <div>
                        <Label
                          htmlFor="education-level"
                          className="text-[#1a1a1a] mb-2 block"
                        >
                          Education Level
                        </Label>
                        <Select
                          value={roommateSettings.educationLevel}
                          onValueChange={(value) => {
                            setRoommateSettings({
                              ...roommateSettings,
                              educationLevel: value,
                            })
                            setHasUnsavedChanges(true)
                          }}
                        >
                          <SelectTrigger
                            id="education-level"
                            className="bg-white rounded-xl border-[#3A6EA5]/20"
                          >
                            <SelectValue placeholder="Select education level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high-school">
                              High School
                            </SelectItem>
                            <SelectItem value="bachelor">Bachelor's</SelectItem>
                            <SelectItem value="master">Master's</SelectItem>
                            <SelectItem value="phd">PhD</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Field of Study - Dropdown */}
                      <div>
                        <Label
                          htmlFor="field-of-study"
                          className="text-[#1a1a1a] mb-2 block"
                        >
                          Field of Study{' '}
                          <span className="text-[#4a5565] text-sm font-normal">
                            (Optional)
                          </span>
                        </Label>
                        <Select
                          value={roommateSettings.fieldOfStudy}
                          onValueChange={(value) => {
                            setRoommateSettings({
                              ...roommateSettings,
                              fieldOfStudy: value,
                            })
                            setHasUnsavedChanges(true)
                          }}
                        >
                          <SelectTrigger
                            id="field-of-study"
                            className="bg-white rounded-xl border-[#3A6EA5]/20"
                          >
                            <SelectValue placeholder="Select field of study" />
                          </SelectTrigger>
                          <SelectContent>
                            {fieldOfStudyOptions.map((field) => (
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

                  {/* Social & Work Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <Briefcase className="w-5 h-5 text-[#3A6EA5]" />
                      <h3 className="text-lg font-semibold text-[#1a1a1a]">
                        Social & Work
                      </h3>
                    </div>

                    <div className="space-y-6">
                      {/* Noise Tolerance */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <Label className="text-[#1a1a1a]">
                            Noise Tolerance
                          </Label>
                          <div className="flex items-center gap-2 text-sm text-[#4a5565]">
                            <Volume2 className="w-4 h-4" />
                            <span>
                              {roommateSettings.noiseTolerance[0] <= 33 &&
                                'Low'}
                              {roommateSettings.noiseTolerance[0] > 33 &&
                                roommateSettings.noiseTolerance[0] <= 66 &&
                                'Medium'}
                              {roommateSettings.noiseTolerance[0] > 66 &&
                                'High'}
                            </span>
                          </div>
                        </div>
                        <Slider
                          value={roommateSettings.noiseTolerance}
                          onValueChange={(value) => {
                            setRoommateSettings({
                              ...roommateSettings,
                              noiseTolerance: value,
                            })
                            setHasUnsavedChanges(true)
                          }}
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
                        {/* Guests Frequency */}
                        <div>
                          <Label
                            htmlFor="guests-frequency"
                            className="text-[#1a1a1a] mb-2 block"
                          >
                            Guests Frequency
                          </Label>
                          <Select
                            value={roommateSettings.guestsFrequency}
                            onValueChange={(value) => {
                              setRoommateSettings({
                                ...roommateSettings,
                                guestsFrequency: value,
                              })
                              setHasUnsavedChanges(true)
                            }}
                          >
                            <SelectTrigger
                              id="guests-frequency"
                              className="bg-white rounded-xl border-[#3A6EA5]/20"
                            >
                              <SelectValue placeholder="How often do you have guests?" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="rarely">Rarely</SelectItem>
                              <SelectItem value="occasionally">
                                Occasionally
                              </SelectItem>
                              <SelectItem value="frequently">
                                Frequently
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Work Schedule */}
                        <div>
                          <Label
                            htmlFor="work-schedule"
                            className="text-[#1a1a1a] mb-2 block"
                          >
                            Work Schedule
                          </Label>
                          <Select
                            value={roommateSettings.workSchedule}
                            onValueChange={(value) => {
                              setRoommateSettings({
                                ...roommateSettings,
                                workSchedule: value,
                              })
                              setHasUnsavedChanges(true)
                            }}
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
                              <SelectItem value="shift-based">
                                Shift-based
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Sharing Level */}
                      <div>
                        <Label className="text-[#1a1a1a] mb-3 block">
                          Sharing Level
                        </Label>
                        <ToggleGroup
                          type="single"
                          value={roommateSettings.sharingLevel}
                          onValueChange={(value) => {
                            if (value) {
                              setRoommateSettings({
                                ...roommateSettings,
                                sharingLevel: value,
                              })
                              setHasUnsavedChanges(true)
                            }
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

                  {/* Bio Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <UserPlus className="w-5 h-5 text-[#3A6EA5]" />
                      <h3 className="text-lg font-semibold text-[#1a1a1a]">
                        About You
                      </h3>
                    </div>

                    <div>
                      <Label
                        htmlFor="roommate-bio"
                        className="text-[#1a1a1a] mb-2 block"
                      >
                        Bio
                      </Label>
                      <Textarea
                        id="roommate-bio"
                        value={roommateSettings.bio}
                        onChange={(e) => {
                          if (e.target.value.length <= bioMaxLength) {
                            setRoommateSettings({
                              ...roommateSettings,
                              bio: e.target.value,
                            })
                            setHasUnsavedChanges(true)
                          }
                        }}
                        className="bg-white rounded-xl border-[#3A6EA5]/20 min-h-[120px]"
                        placeholder="Tell potential roommates about yourself, habits, and expectations."
                        maxLength={bioMaxLength}
                      />
                      <div className="flex justify-end mt-2">
                        <span
                          className={`text-sm ${roommateSettings.bio.length >= bioMaxLength
                              ? 'text-[#3A6EA5] font-semibold'
                              : 'text-[#4a5565]'
                            }`}
                        >
                          {roommateSettings.bio.length}/{bioMaxLength}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-[#3A6EA5]/20" />

                  {/* Privacy Controls */}
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <Shield className="w-5 h-5 text-[#3A6EA5]" />
                      <h3 className="text-lg font-semibold text-[#1a1a1a]">
                        Visibility Settings
                      </h3>
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
                          onCheckedChange={(checked) => {
                            setRoommateSettings({
                              ...roommateSettings,
                              profileVisible: checked,
                            })
                            setHasUnsavedChanges(true)
                          }}
                          className="data-[state=checked]:bg-[#3A6EA5]"
                        />
                      </div>

                      {!roommateSettings.profileVisible && (
                        <div className="mt-4 p-4 bg-[#F2F4F6] rounded-xl flex items-start gap-3">
                          <Shield className="w-5 h-5 text-[#3A6EA5] mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-[#1a1a1a]">
                            Your roommate preferences are stored but hidden from
                            other users. Enable visibility to help potential
                            roommates find you.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Unsaved Changes Warning */}
                  {hasUnsavedChanges && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#F2F4F6] border border-[#3A6EA5]/30 rounded-xl p-4 flex items-center gap-3"
                    >
                      <Bell className="w-5 h-5 text-[#3A6EA5]" />
                      <p className="text-sm text-[#1a1a1a]">
                        You have unsaved changes. Don't forget to save your
                        preferences!
                      </p>
                    </motion.div>
                  )}

                  {/* Action Buttons */}
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
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* 2FA Verification Modal */}
      <Dialog open={show2FAModal} onOpenChange={setShow2FAModal}>
        <DialogContent className="bg-white rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#1a1a1a]">
              Enable Two-Factor Authentication
            </DialogTitle>
            <DialogDescription className="text-[#4a5565]">
              We'll send a verification code to your email to confirm
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label
                htmlFor="verification-code"
                className="text-[#1a1a1a] mb-2 block"
              >
                Verification Code
              </Label>
              <Input
                id="verification-code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="bg-[#F2F4F6] rounded-xl border-[#3A6EA5]/20"
              />
            </div>
            <p className="text-sm text-[#4a5565]">
              A verification code has been sent to{' '}
              <strong>{profileData.email}</strong>
            </p>
          </div>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShow2FAModal(false)
                setVerificationCode('')
              }}
              className="rounded-xl border-[#3A6EA5]/20"
            >
              Cancel
            </Button>
            <Button
              onClick={handleVerify2FA}
              className="bg-gradient-to-r from-[#3A6EA5] to-[#9CBBDC] hover:from-[#2a5a8a] hover:to-[#3A6EA5] text-white rounded-xl"
            >
              Verify & Enable
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
